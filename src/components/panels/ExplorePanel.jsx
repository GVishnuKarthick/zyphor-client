import { useState, useEffect } from "react";
import Avatar from "../common/Avatar";

export default function ExplorePanel({ posts, onViewProfile }) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  // Fetch users when query changes
  useEffect(() => {
    if (!query.trim() || query.startsWith("#")) {
      setUsers([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`https://zyphor-server-1.onrender.com/api/users/search?q=${query}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("zyphor_token")}`,
          },
        });
        const data = await res.json();
        setUsers(data || []);
      } catch (err) {
        console.error("Explore search error:", err);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  const filteredPosts = posts.filter((p) => {
    const q = query.toLowerCase().replace("#", "");
    return (
      p.caption?.toLowerCase().includes(q) ||
      p.user?.toLowerCase().includes(q)
    );
  });

  const tags = ["minimal", "darkroom", "grain", "texture", "void"];

  return (
    <div className="flex-1 h-full overflow-y-auto px-4 py-4 md:px-9 md:py-8 space-y-6 scrollbar-hide">

      {/* 🔍 SEARCH */}
      <div className="relative group">
        <input
          placeholder="search users, tags, captions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-700 focus:bg-black transition-all"
        />
      </div>

      {/* 🔥 TAGS */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest mr-2 hidden md:block">Trending:</span>
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setQuery("#" + t)}
            className={`px-4 py-1.5 rounded-full border text-xs transition-all ${query === "#" + t ? "border-zinc-100 bg-zinc-100 text-black font-bold" : "border-zinc-800 text-zinc-400 hover:bg-zinc-900"
              }`}
          >
            #{t}
          </button>
        ))}
      </div>

      {/* 👥 USERS SECTION */}
      {users.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="mb-3 px-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">People</div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {users.map((u) => (
              <div
                key={u.id}
                onClick={() => onViewProfile(u.username)}
                className="flex shrink-0 cursor-pointer flex-col items-center gap-2 group p-2 rounded-2xl hover:bg-zinc-900/50 transition-colors"
              >
                <Avatar
                  src={u.profileImageUrl}
                  initials={u.username.slice(0, 2)}
                  sz={56}
                  ring
                />
                <span className="text-[11px] font-bold text-zinc-300 group-hover:text-white transition-colors">{u.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📸 GRID */}
      <div>
        <div className="mb-4 px-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">Discover</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 auto-rows-[160px] md:auto-rows-[180px]">
          {filteredPosts.map((post, i) => (
            <div
              key={post.id}
              onClick={() => onViewProfile(post.user)}
              className={`group relative overflow-hidden rounded-xl bg-zinc-900 cursor-pointer ${i % 4 === 0 ? "row-span-2 col-span-1" : ""
                }`}
            >
              {post.image ? (
                <img
                  src={post.image}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center p-4 text-center text-xs font-serif italic text-zinc-500"
                  style={{ background: post.grad }}
                >
                  {post.caption?.slice(0, 40)}...
                </div>
              )}

              {/* 🔥 HOVER OVERLAY */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                <div className="flex gap-4 text-sm font-bold text-white">
                  <span>♥ {post.likes}</span>
                  <span>💬 {post.comments.length}</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-300 font-black">View Post</div>
              </div>

              {/* User Tag */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/60 px-2 py-1 backdrop-blur-md border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Avatar src={post.profileImageUrl} initials={post.user?.slice(0, 2)} sz={18} />
                <span className="text-[10px] font-bold text-white">{post.user}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}