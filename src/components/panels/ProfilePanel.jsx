import { useState, useEffect } from "react";
import { Edit3, Grid2x2, Bookmark, Plus, Image, Settings, MessageSquare, UserPlus, UserMinus } from "lucide-react";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { getFollowCounts, followUser, unfollowUser, checkFollowStatus as isFollowing } from "../../api/followApi";
import { getUserPosts } from "../../api/postApi";

export default function ProfilePanel({ 
  user, 
  isMe, 
  onNewPost, 
  onEditProfile, 
  onSettings,
  onMessage 
}) {
  const [tab, setTab] = useState("posts");
  const [userPosts, setUserPosts] = useState([]);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [following, setFollowing] = useState(false);

  // Load follow counts
  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      try {
        const [countsData, postsData] = await Promise.all([
          getFollowCounts(user.id),
          getUserPosts(user.id)
        ]);
        setCounts(countsData);
        setUserPosts(postsData);

        if (!isMe) {
          const followStatus = await isFollowing(user.id);
          setFollowing(followStatus);
        }
      } catch (err) {
        console.error("Failed to load profile data", err);
      }
    };

    loadData();
  }, [user?.id, isMe]);

  const handleFollow = async () => {
    try {
      if (following) {
        await unfollowUser(user.id);
        setCounts(prev => ({ ...prev, followers: prev.followers - 1 }));
      } else {
        await followUser(user.id);
        setCounts(prev => ({ ...prev, followers: prev.followers + 1 }));
      }
      setFollowing(!following);
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  const savedPosts = userPosts.filter((p) => p.saved);
  const items = tab === "posts" ? userPosts : tab === "saved" ? savedPosts : [];

  return (
    <div className="flex-1 h-full overflow-y-auto px-4 py-4 md:px-9 md:py-8 no-scrollbar">

      {/* Profile header */}
      <div className="mb-6 rounded-2xl border border-zinc-900 bg-zinc-950 p-6 md:p-10 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left relative z-10">

          <div className="relative group">
            <Avatar 
              src={user.profileImageUrl}
              initials={user.username?.slice(0,2).toUpperCase()} 
              sz={100} 
              ring 
              active={following}
              online={isMe} 
            />
          </div>

          {isMe && (
            <button 
              onClick={onSettings}
              className="md:hidden absolute top-0 right-0 p-2 text-zinc-500 hover:text-zinc-100"
            >
              <Settings size={20} />
            </button>
          )}

          <div className="flex-1">
            <div className="mb-4 flex flex-col md:flex-row items-center gap-4">
              <div className="text-3xl font-black tracking-tight text-white uppercase">
                {user.username}
              </div>

              <div className="flex items-center gap-2">
                {isMe ? (
                  <Button sm v="outline" onClick={onEditProfile} className="rounded-full px-5 border-zinc-800 bg-zinc-900/50 hover:bg-white hover:text-black">
                    <Edit3 size={13} />
                    edit profile
                  </Button>
                ) : (
                  <>
                    <Button 
                      sm 
                      v={following ? "outline" : "primary"} 
                      onClick={handleFollow}
                      className="rounded-full px-6 min-w-[100px]"
                    >
                      {following ? <UserMinus size={14} className="mr-1.5" /> : <UserPlus size={14} className="mr-1.5" />}
                      {following ? "Following" : "Follow"}
                    </Button>
                    <Button 
                      sm 
                      v="outline" 
                      onClick={() => onMessage(user)}
                      className="rounded-full p-2.5 border-zinc-800 bg-zinc-900/50"
                    >
                      <MessageSquare size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="mb-8 font-serif italic text-sm text-zinc-500 max-w-md leading-relaxed">
              {user.bio || "No biography provided."}
            </div>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-12 pt-6 border-t border-zinc-900/50">
              {[
                [userPosts.length, "posts"],
                [counts.followers, "followers"],
                [counts.following, "following"]
              ].map(([val, label]) => (
                <div key={label} className="group cursor-pointer">
                  <div className="text-2xl font-black text-white group-hover:scale-110 transition-transform origin-left">{val}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-zinc-800/50 sticky top-0 bg-[#0d0d0d]/80 backdrop-blur-md z-20">
        {["posts", "saved", "stories", "tagged"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`mb-[-1px] flex flex-1 items-center justify-center gap-2 border-b-2 py-4 text-[10px] font-black uppercase tracking-[0.25em] transition-all ${
              tab === t
                ? "border-white text-white"
                : "border-transparent text-zinc-700 hover:text-zinc-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grid Content */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center animate-in fade-in duration-500">
          <div className="p-6 rounded-full bg-zinc-900/30 border border-zinc-800/50">
            <Image size={32} className="text-zinc-800" />
          </div>
          <div className="font-serif italic text-sm text-zinc-600 max-w-xs">
            {tab === "stories"
              ? "No stories to display."
              : tab === "saved"
              ? "You haven't saved any posts yet."
              : tab === "tagged"
              ? `${user.username} hasn't been tagged in any posts.`
              : "No posts shared yet."}
          </div>
          {isMe && tab === "posts" && (
            <Button v="primary" onClick={onNewPost} className="rounded-full px-8 mt-2">
              <Plus size={15} className="mr-2" />
              Create Post
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 md:gap-2 animate-in fade-in duration-700">
          {items.map((p) => (
            <div
              key={p.id}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800/30"
            >
              <img
                src={p.imageUrls?.[0]}
                alt="post"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-all duration-300 group-hover:opacity-100 backdrop-blur-sm">
                <div className="flex gap-4 text-xs font-black text-white">
                  <span>♥ {p.likeCount || 0}</span>
                  <span>💬 {p.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}