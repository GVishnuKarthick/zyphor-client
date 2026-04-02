import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoFocus = false,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[10px] tracking-[0.12em] text-zinc-500">{label}</label>}
      <div className="flex items-center gap-2 rounded-[9px] border border-zinc-800 bg-zinc-900 px-4 py-3 focus-within:border-zinc-700 transition-colors">
        <input
          value={value}
          onChange={onChange}
          type={type === "password" && show ? "text" : type}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="flex-1 bg-transparent outline-none text-sm text-zinc-100"
        />
        {type === "password" && (
          <button type="button" onClick={() => setShow((p) => !p)} className="text-zinc-500 hover:text-zinc-100">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}