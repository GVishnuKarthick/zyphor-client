export default function Divider({ text }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-zinc-800" />
      {text && <span className="text-[10px] tracking-[0.1em] text-zinc-500">{text}</span>}
      <div className="flex-1 h-px bg-zinc-800" />
    </div>
  );
}