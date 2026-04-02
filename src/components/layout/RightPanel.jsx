import { useEffect } from "react";
import Avatar from "../common/Avatar";
import Divider from "../common/Divider";
import Button from "../common/Button";
import { TAGS } from "../../data/mockData";
import { followUser, unfollowUser } from "../../api/followApi";
import { getSuggestions } from "../../api/userApi";   // ⭐ new API

export default function RightPanel({ suggested, setSuggested, messages, setActive, currentUser, onlineUsers = [], onViewProfile }) {

  // ⭐ Load suggested users from backend
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const users = await getSuggestions();
        setSuggested(users);
      } catch (err) {
        console.error("Failed to load suggestions:", err);
      }
    };

    loadSuggestions();
  }, [setSuggested]);

  return (
    <div className="hidden sticky top-0 md:flex h-screen w-[320px] shrink-0 flex-col gap-7 overflow-y-auto border-l border-zinc-900 bg-black/20 px-5 py-8 no-scrollbar">

      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[9px] font-black tracking-[0.2em] text-zinc-600 uppercase">
            Suggested for you
          </div>
          <button className="text-[10px] font-bold text-zinc-400 hover:text-white transition-colors">see all</button>
        </div>

        <div className="flex flex-col gap-4">
          {suggested.filter((s) => s.id !== currentUser?.id).map((s) => (
            <div key={s.id} className="flex items-center gap-3">

              <div className="cursor-pointer transition-transform active:scale-95" onClick={() => onViewProfile(s.username)}>
                <Avatar 
                  src={s.profileImageUrl}
                  initials={s.username?.slice(0, 2).toUpperCase()} 
                  sz={40} 
                  online={onlineUsers.includes(s.id)} 
                />
              </div>

              <div className="min-w-0 flex-1 cursor-pointer group" onClick={() => onViewProfile(s.username)}>
                <div className="text-[13px] font-bold text-zinc-100 group-hover:text-white transition-colors">
                  {s.username}
                </div>
                <div className="truncate text-[10px] text-zinc-500 font-medium">
                  {s.bio || "No bio yet"}
                </div>
              </div>

              <Button
                sm
                v={s.following ? "outline" : "primary"}
                className="rounded-full px-4 h-8 text-[10px] font-black uppercase tracking-wider"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    if (s.following) {
                      await unfollowUser(s.id);
                    } else {
                      await followUser(s.id);
                    }

                    setSuggested((prev) =>
                      prev.map((x) =>
                        x.id === s.id ? { ...x, following: !x.following } : x
                      )
                    );
                  } catch (err) {
                    console.error("Follow error:", err);
                  }
                }}
              >
                {s.following ? "Following" : "Follow"}
              </Button>

            </div>
          ))}
        </div>
      </div>

      <Divider />

      <div>
        <div className="mb-4 text-[9px] font-black tracking-[0.2em] text-zinc-600 uppercase">
          Active now
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {messages
            .filter((m) => onlineUsers.includes(m.userId))
            .slice(0, 8)
            .map((m) => (
              <div
                key={m.id}
                className="cursor-pointer transition-transform hover:scale-110 active:scale-90"
                onClick={() => setActive("messages")}
              >
                <Avatar 
                  src={m.profileImageUrl}
                  initials={m.username?.slice(0,2).toUpperCase()} 
                  sz={36} 
                  ring 
                  active 
                  online 
                />
              </div>
            ))}
        </div>

        <button
          onClick={() => setActive("messages")}
          className="text-[11px] font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group"
        >
          Open messages
          <div className="w-4 h-[1px] bg-zinc-700 transition-all group-hover:w-8 group-hover:bg-white" />
        </button>
      </div>

      <Divider />

      <div>
        <div className="mb-4 text-[9px] font-black tracking-[0.2em] text-zinc-600 uppercase">
          Trending topics
        </div>

        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <span
              key={tag}
              onClick={() => setActive("search")}
              className="cursor-pointer rounded-full border border-zinc-800 bg-zinc-900/30 px-3.5 py-1.5 text-[10px] font-bold text-zinc-500 hover:border-zinc-500 hover:text-white transition-all transform hover:-translate-y-1"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-zinc-900/50 pt-6 flex flex-col gap-1">
        <div className="text-[10px] font-medium text-zinc-700 flex gap-2">
          <span>About</span>
          <span>Help</span>
          <span>Terms</span>
          <span>Privacy</span>
        </div>
        <div className="text-[10px] font-black text-zinc-800 uppercase tracking-widest mt-1">
          © 2026 Zyphor Inc.
        </div>
      </div>

    </div>
  );
}