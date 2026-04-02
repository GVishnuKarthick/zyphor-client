import { Home, Search, Bell, MessageCircle, User, Plus, Settings } from "lucide-react";
import Avatar from "../common/Avatar";

export default function Sidebar({ active, setActive, currentUser, onNewPost, onSettings, unreadN, unreadM }) {
  const nav = [
    { id: "home", Icon: Home, label: "Home" },
    { id: "search", Icon: Search, label: "Explore" },
    { id: "notifs", Icon: Bell, label: "Notifications", badge: unreadN },
    { id: "messages", Icon: MessageCircle, label: "Messages", badge: unreadM },
    { id: "profile", Icon: User, label: "Profile" },
  ];

  return (
    <div className="sticky bottom-0 md:top-0 z-50 flex h-16 w-full shrink-0 flex-row border-t md:h-screen md:w-64 md:flex-col md:border-r border-zinc-900 bg-zinc-950 px-2 md:px-0">
      
      {/* LOGO - Hidden on mobile */}
      <div className="hidden px-6 pb-6 pt-10 md:block">
        <div className="text-2xl font-black tracking-[-0.07em] text-zinc-100">ZYPHOR</div>
        <div className="mt-1 text-[8px] tracking-[0.22em] text-zinc-500 uppercase">social network</div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-1 flex-row items-center justify-around gap-1 md:flex-col md:items-stretch md:justify-start md:px-3">
        {nav.map(({ id, Icon, label, badge }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`relative flex items-center justify-center gap-3 rounded-xl px-4 py-3 transition-all md:justify-start md:px-3 ${
              active === id ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:bg-zinc-900/50"
            }`}
          >
            <div className="relative">
              <Icon size={22} className="md:size-5" />

              {badge > 0 && (
                <span className="absolute -top-2.5 -right-2.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black shadow-sm md:-top-2 md:-right-2">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </div>

            <span className={`hidden text-[13px] md:block ${active === id ? "font-semibold" : ""}`}>
              {label}
            </span>
          </button>
        ))}

        {/* NEW POST - Mobile Action */}
        <button
          onClick={onNewPost}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-black shadow-lg md:hidden"
        >
          <Plus size={24} />
        </button>
      </nav>

      {/* NEW POST - Desktop Action */}
      <div className="hidden px-3 py-6 md:block">
        <button
          onClick={onNewPost}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-zinc-100 px-4 py-3 text-[11px] font-bold tracking-wider text-black transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          NEW POST
        </button>
      </div>

      {/* USER FOOTER - Hidden on mobile */}
      <div className="hidden items-center gap-3 border-t border-zinc-900 px-4 pb-6 pt-5 md:flex">
        <Avatar 
          src={currentUser.profileImageUrl} 
          initials={currentUser.avatar} 
          sz={38} 
          online 
        />

        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-bold text-zinc-100">{currentUser.username}</div>
          <div className="text-[10px] text-zinc-700 font-medium">@active_now</div>
        </div>

        <button onClick={onSettings} className="p-1.5 text-zinc-500 hover:text-zinc-100 transition-colors">
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
}