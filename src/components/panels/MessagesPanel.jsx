import { useEffect, useRef, useState } from "react";
import { Search, Plus, Send, ArrowLeft } from "lucide-react";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { getConnection } from "../../services/chatService";

export default function MessagesPanel({
  conversations,
  setConversations,
  currentUser,
  sel,
  setSel,
  onlineUsers = [],
  onViewProfile,
}) {
  const [text, setText] = useState("");
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [newChatMode, setNewChatMode] = useState(false);

  const bottomRef = useRef(null);

  const activeConvo = conversations.find((c) => c.id === sel);

  // =========================
  // USER SEARCH
  // =========================
  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:5142/api/users/search?q=${q}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("zyphor_token")}`,
            },
          }
        );
        const data = await res.json();
        setResults(data || []);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [q]);

  // =========================
  // SEND MESSAGE
  // =========================
  const send = async () => {
    if (!text.trim() || !activeConvo) return;

    const conn = getConnection();
    if (!conn) return;

    try {
      // ensure group join
      await conn.invoke("JoinConversation", activeConvo.id);

      await conn.invoke(
        "SendMessage",
        activeConvo.id,
        currentUser.id,
        text.trim()
      );

      setText("");
    } catch (err) {
      console.error("🔥 Send error:", err);
    }
  };

  // =========================
  // START CONVO
  // =========================
  const startConversation = async (user) => {
    const existing = conversations.find((c) => c.userId === (user.id || user._id));

    if (existing) {
      setSel(existing.id);
      setNewChatMode(false);
      setQ("");
      return;
    }

    try {
      const res = await fetch("http://localhost:5142/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("zyphor_token")}`,
        },
        body: JSON.stringify({ userId: user.id || user._id }),
      });

      const convo = await res.json();
      const id = convo.id || convo._id;

      const newConv = {
        id,
        user: user.username,
        userId: user.id || user._id,
        avatar: user.username.slice(0, 2).toUpperCase(),
        profileImageUrl: user.profileImageUrl,
        msgs: [],
        unread: 0,
      };

      setConversations((prev) => [newConv, ...prev]);
      setSel(id);

      setNewChatMode(false);
      setQ("");
      setResults([]);
    } catch (err) {
      console.error("Conversation error:", err);
    }
  };

  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvo?.msgs]);

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* LEFT PANEL (Conversation List) */}
      <div
        className={`${
          sel ? "hidden" : "flex"
        } md:flex w-full md:w-[360px] flex-col border-r border-zinc-900 bg-black`}
      >
        {/* Header Section */}
        <div className="px-5 py-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-2xl font-black tracking-tight text-white">
              Messages
            </div>
            {!newChatMode ? (
              <button
                onClick={() => setNewChatMode(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-black shadow-lg transition-transform active:scale-95"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            ) : (
              <button
                onClick={() => {
                  setNewChatMode(false);
                  setQ("");
                  setResults([]);
                }}
                className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-100 transition-colors"
              >
                cancel
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-100 transition-colors"
            />
            <input
              type="text"
              placeholder="search chats..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-2.5 pl-11 pr-4 text-[13px] text-white outline-none focus:border-zinc-700 focus:bg-zinc-900 transition-all font-mono"
              value={newChatMode ? q : ""}
              onChange={(e) => (newChatMode ? setQ(e.target.value) : null)}
            />
          </div>
        </div>

        {/* Conversations / Results List */}
        <div className="flex-1 overflow-y-auto px-2 no-scrollbar">
          {newChatMode ? (
            <div className="space-y-1 mt-2">
              <div className="px-3 mb-2 text-[10px] uppercase tracking-widest text-zinc-600 font-black">
                Suggested Users
              </div>
              {results.length === 0 && q.trim() !== "" && (
                <div className="text-zinc-600 text-[11px] px-3 italic">No users found</div>
              )}
              {results.map((u) => (
                <div
                  key={u.id}
                  onClick={() => startConversation(u)}
                  className="mx-1 flex items-center gap-4 rounded-xl p-3 hover:bg-zinc-900/80 cursor-pointer transition-all border border-transparent hover:border-zinc-800"
                >
                  <Avatar
                    src={u.profileImageUrl}
                    initials={u.username.slice(0, 2)}
                    sz={42}
                  />
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-white">
                      {u.username}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      @zyphor_user
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1 pb-10">
              {conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSel(c.id)}
                  className={`relative mx-1 flex items-center gap-4 rounded-xl p-3.5 transition-all text-left ${
                    sel === c.id
                      ? "bg-zinc-800/80 ring-1 ring-zinc-700 shadow-xl"
                      : "hover:bg-zinc-900 group"
                  }`}
                >
                  <div className="relative">
                    <Avatar
                      src={c.profileImageUrl}
                      initials={c.user.slice(0, 2)}
                      sz={44}
                      online={onlineUsers.includes(c.userId)}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className={`truncate text-[14px] font-bold ${
                          sel === c.id
                            ? "text-white"
                            : "text-zinc-200 group-hover:text-white"
                        }`}
                      >
                        {c.user}
                      </span>
                      <span className="text-[10px] text-zinc-600 font-mono">
                        now
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="truncate text-[11px] text-zinc-500 font-mono">
                        tap to view message...
                      </span>
                      {c.unread > 0 && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-black text-black">
                          {c.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL (Chat Window) */}
      {activeConvo ? (
        <div
          className={`${sel ? "flex" : "hidden"} md:flex flex-1 flex-col bg-[#0d0d0d]`}
        >
          <div className="flex items-center gap-3 border-b border-zinc-900 px-4 py-4 md:py-3.5 bg-black/40">
            {/* Back Button for mobile */}
            <button
              onClick={() => setSel(null)}
              className="md:hidden -ml-1 mr-1 p-2 text-zinc-400 hover:text-zinc-100 bg-zinc-900 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>

            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => {
                if (activeConvo.user) {
                  onViewProfile(activeConvo.user);
                }
              }}
            >
              <Avatar
                src={activeConvo.profileImageUrl}
                initials={activeConvo.user.slice(0, 2)}
                sz={44}
                online={onlineUsers.includes(activeConvo.userId)}
              />
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-white group-hover:text-zinc-300 transition-colors tracking-tight">
                  {activeConvo.user}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      onlineUsers.includes(activeConvo.userId)
                        ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                        : "bg-zinc-600"
                    }`}
                  />
                  <span className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">
                    {onlineUsers.includes(activeConvo.userId)
                      ? "Online"
                      : "Offline"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 no-scrollbar">
            {activeConvo.msgs.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.from === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                    m.from === "me"
                      ? "bg-zinc-100 text-black font-medium"
                      : "bg-zinc-900 text-zinc-200 border border-zinc-800"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-zinc-900 p-4 bg-black/20">
            <div className="flex items-center gap-3 rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-2 focus-within:border-zinc-600 transition-colors">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Write a message..."
                className="flex-1 bg-transparent py-2 text-[14px] text-white outline-none"
              />

              <button
                onClick={send}
                disabled={!text.trim()}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                  text.trim()
                    ? "bg-zinc-100 text-black scale-100"
                    : "bg-zinc-800 text-zinc-600 scale-90"
                }`}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-zinc-700 bg-[#0d0d0d] font-black uppercase tracking-[0.2em] text-[10px]">
          select a conversation to start
        </div>
      )}
    </div>
  );
}