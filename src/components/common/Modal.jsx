export default function Modal({ open, onClose, children, width = 500 }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-[4px] p-5"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-in w-full max-h-[92vh] overflow-y-auto rounded-[18px] border border-zinc-800 bg-zinc-950"
        style={{ maxWidth: width }}
      >
        {children}
      </div>
    </div>
  );
}