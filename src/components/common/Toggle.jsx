export default function Toggle({ value, onChange, label }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      {label && <span className="text-[13px] text-zinc-400">{label}</span>}
      <div
        onClick={() => onChange(!value)}
        className={`relative h-6 w-[42px] rounded-full cursor-pointer transition-colors ${value ? "bg-zinc-100" : "bg-zinc-800"}`}
      >
        <div
          className={`absolute top-[3px] h-[18px] w-[18px] rounded-full transition-all ${value ? "left-[21px] bg-black" : "left-[3px] bg-zinc-500"}`}
        />
      </div>
    </div>
  );
}