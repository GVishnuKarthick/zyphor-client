export default function Avatar({ src, initials, sz = 38, ring = false, active = false, online = false }) {
  return (
    <div className="relative shrink-0">
      <div
        className={`flex items-center justify-center overflow-hidden rounded-full border-2 select-none shrink-0 ${
          ring ? (active ? "border-zinc-300" : "border-zinc-800") : "border-zinc-900"
        }`}
        style={{
          width: sz,
          height: sz,
          fontSize: sz * 0.3,
          background: src ? "transparent" : "linear-gradient(135deg,#222,#141414)",
          color: "#888",
          letterSpacing: "-0.02em",
        }}
      >
        {src ? (
          <img src={src} className="h-full w-full object-cover" alt={initials} />
        ) : (
          initials
        )}
      </div>
      {online && (
        <div 
          className="absolute rounded-full bg-green-500 border-2 border-[#070707]" 
          style={{
            bottom: sz * 0.05,
            right: sz * 0.05,
            width: Math.max(9, sz * 0.2),
            height: Math.max(9, sz * 0.2)
          }}
        />
      )}
    </div>
  );
}