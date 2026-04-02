import { useRef, useState } from "react";
import { X, Send } from "lucide-react";
import Modal from "../common/Modal";
import Avatar from "../common/Avatar";

export default function CommentsModal({ open, onClose, post, onAddComment, currentUser }) {
  const [text, setText] = useState("");
  const listRef = useRef(null);

  if (!post) return null;

  const submit = () => {
    if (!text.trim()) return;
    onAddComment(post.id, text.trim());
    setText("");
    setTimeout(() => {
      listRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
    }, 100);
  };

  return (
    <Modal open={open} onClose={onClose} width={480}>
      <div className="flex max-h-[80vh] flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-5 py-5">
          <div className="text-sm font-bold text-zinc-100">comments ({post.comments.length})</div>
          <button onClick={onClose} className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
            <X size={14} />
          </button>
        </div>

        <div className="flex shrink-0 gap-3 border-b border-zinc-800 px-5 py-4">
          <Avatar src={post.profileImageUrl} initials={post.avatar} sz={36} ring />
          <div className="flex-1">
            <span className="text-[13px] font-semibold text-zinc-100">{post.user} </span>
            <span className="font-serif italic text-[13px] text-zinc-400">{post.caption}</span>
          </div>
        </div>

        <div ref={listRef} className="flex min-h-[120px] max-h-[320px] flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
          {post.comments.length === 0 && (
            <div className="py-8 text-center font-serif italic text-[13px] text-zinc-500">
              no comments yet. start the conversation.
            </div>
          )}

          {post.comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar src={c.profileImageUrl} initials={c.avatar} sz={32} />
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[12px] font-semibold text-zinc-100">{c.user}</span>
                  <span className="text-[10px] text-zinc-500">{c.time}</span>
                </div>
                <div className="mt-1 font-serif text-[13px] leading-6 text-zinc-400">{c.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 gap-3 border-t border-zinc-800 px-5 py-3.5">
          <Avatar src={currentUser.profileImageUrl} initials={currentUser.avatar} sz={32} />
          <div className="flex flex-1 items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2.5">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="add a comment..."
              className="flex-1 bg-transparent outline-none text-sm text-zinc-100"
            />
            <button onClick={submit} className={`${text.trim() ? "opacity-100" : "opacity-30"} transition-opacity`}>
              <Send size={17} className="text-zinc-100" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}