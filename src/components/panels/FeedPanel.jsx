import { Plus } from "lucide-react";
import Avatar from "../common/Avatar";
import PostCard from "../PostCard";

export default function FeedPanel({
  posts,
  stories,
  onStory,
  onComment,
  onShare,
  onNewPost,
  onStoryCreate,
  onViewProfile,
  currentUser,
  onDelete,
  onToggleLike
}) {
  return (
    <div className="flex-1 h-full overflow-y-auto px-4 py-4 md:px-9 md:py-8 no-scrollbar">
      
      {/* 📱 MOBILE LOGO */}
      <div className="md:hidden flex flex-col items-center justify-center mb-6 mt-2 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="text-2xl font-black tracking-[-0.07em] text-white">ZYPHOR</div>
        <div className="text-[8px] tracking-[0.25em] text-zinc-600 uppercase font-black">social network</div>
      </div>
      
      {/* Stories Section */}
      <div className="mb-6 rounded-2xl border border-zinc-900 bg-zinc-950 px-4 py-5 md:px-6">
        <div className="flex gap-5 overflow-x-auto no-scrollbar">

          {/* Add Story */}
          <div
            className="flex shrink-0 cursor-pointer flex-col items-center gap-2"
            onClick={onStoryCreate}
          >
            <div className="group relative">
              <Avatar 
                src={currentUser.profileImageUrl} 
                initials={currentUser.avatar} 
                sz={54} 
              />
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-black shadow-lg transition-transform group-hover:scale-110">
                <Plus size={12} strokeWidth={3} />
              </div>
            </div>
            <span className="text-[9px] font-medium text-zinc-600">add story</span>
          </div>

          {/* Story List */}
          {stories.map((s, i) => (
            <div
              key={s.userId}
              onClick={() => onStory(s.stories)}
              className="flex shrink-0 cursor-pointer flex-col items-center gap-2"
            >
              <div
                className={`rounded-full p-[2px] ${
                  s.viewed
                    ? "bg-transparent"
                    : s.active
                    ? "bg-[linear-gradient(135deg,#d0d0d0,#666)]"
                    : "bg-[linear-gradient(135deg,#333,#222)]"
                }`}
              >
                <div className="rounded-full bg-zinc-950 p-[2px]">
                  <Avatar 
                    src={s.profileImageUrl} 
                    initials={s.avatar} 
                    sz={50} 
                  />
                </div>
              </div>

              <span
                className={`text-[9px] ${
                  s.viewed ? "text-zinc-800" : "text-zinc-500"
                }`}
              >
                {s.user}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      {posts.map((p) => (
        <PostCard
          key={p.id}
          post={p}
          onComment={onComment}
          onShare={onShare}
          onViewProfile={onViewProfile}
          currentUser={currentUser}
          onDelete={onDelete}
          onToggleLike={onToggleLike}
        />
      ))}
    </div>
  );
}