import { useState } from "react";
import { X, Check } from "lucide-react";
import Modal from "../common/Modal";
import Avatar from "../common/Avatar";
import Button from "../common/Button";

export default function ShareModal({ open, onClose, conversations, onShare }) {
  const [sent, setSent] = useState([]);

  const handle = (id) => {
    if (!sent.includes(id)) {
      setSent((p) => [...p, id]);
      onShare?.(id);
    }
  };

  const close = () => {
    setSent([]);
    onClose();
  };

  return (
    <Modal open={open} onClose={close} width={380}>
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-bold text-zinc-100">share post</div>
          <button onClick={close} className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          {conversations.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 hover:bg-zinc-900">
              <Avatar initials={c.avatar} sz={38} online={c.online} />
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-zinc-100">{c.user}</div>
                <div className="text-[11px] text-zinc-500">{c.online ? "● active now" : "inactive"}</div>
              </div>
              <Button sm onClick={() => handle(c.id)} v={sent.includes(c.id) ? "accent" : "outline"}>
                {sent.includes(c.id) ? (
                  <>
                    <Check size={12} />
                    sent
                  </>
                ) : (
                  "SEND"
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}