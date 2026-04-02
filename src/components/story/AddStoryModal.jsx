import { useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";

export default function AddStoryModal({ open, onClose, onAdd }) {
  const [image, setImage] = useState(null);

  const handleImage = (file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!image) return;

    onAdd(image);
    setImage(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} width={420}>
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-100">Add Story</h2>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900"
          >
            <X size={15} />
          </button>
        </div>

        <label className="flex min-h-[260px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/60 transition-colors hover:border-zinc-600 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt="story preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <ImageIcon size={32} className="text-zinc-600" />
              <div className="text-center">
                <div className="text-sm text-zinc-400">
                  Click to upload story image
                </div>
                <div className="mt-1 text-xs text-zinc-600">
                  JPG, PNG
                </div>
              </div>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleImage(e.target.files?.[0])}
          />
        </label>

        <div className="flex justify-end gap-2">
          <Button v="outline" onClick={onClose}>
            CANCEL
          </Button>

          <Button
            v="primary"
            onClick={handleSubmit}
            disabled={!image}
          >
            POST STORY
          </Button>
        </div>
      </div>
    </Modal>
  );
}