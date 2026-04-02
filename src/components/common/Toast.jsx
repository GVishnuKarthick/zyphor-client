import { useEffect } from "react";
import { Check } from "lucide-react";

export default function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="toast-up fixed bottom-8 left-1/2 z-[9999] -translate-x-1/2 rounded-[10px] bg-zinc-100 px-5 py-3 text-xs font-bold text-black shadow-2xl flex items-center gap-2 whitespace-nowrap">
      <Check size={14} />
      {msg}
    </div>
  );
}