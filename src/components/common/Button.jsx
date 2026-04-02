export default function Button({
  children,
  onClick,
  v = "primary",
  sm = false,
  full = false,
  style = {},
  disabled = false,
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[9px] font-semibold tracking-[0.05em] transition-all border";

  const sizes = sm ? "text-[10px] px-3 py-[5px]" : full ? "text-[13px] py-3 w-full" : "text-[13px] px-5 py-2.5";

  const variants = {
    primary: "bg-zinc-100 text-black border-transparent hover:opacity-85",
    outline: "bg-transparent text-zinc-400 border-zinc-700 hover:bg-zinc-900",
    ghost: "bg-transparent text-zinc-400 border-transparent hover:bg-zinc-900",
    danger: "bg-transparent text-red-400 border-red-950 hover:bg-zinc-900",
    accent: "bg-zinc-800 text-zinc-100 border-zinc-700 hover:bg-zinc-700",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes} ${variants[v]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      style={style}
    >
      {children}
    </button>
  );
}