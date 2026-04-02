import { useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { createPost } from "../../api/postApi";

export default function CreatePostModal({
  open,
  onClose,
  onPost,
  username,
  avatar
}) {

  const [caption, setCaption] = useState("");
  const [tag, setTag] = useState("photo");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // handle image selection
  const handleImage = (file) => {

    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // submit post
  const submit = async () => {

    if (!caption.trim()) return;

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("Caption", caption.trim());

      if (imageFile) {
        formData.append("Image", imageFile);
      }

      const post = await createPost(formData);

      // update UI instantly
       onPost({
  id: post.id,
  caption: post.caption,
  image: post.imageUrls?.[0],
  user: username,
  avatar: avatar,
  likes: 0,
  comments: []
});

      setCaption("");
      setTag("photo");
      setImagePreview(null);
      setImageFile(null);

      onClose();

    } catch (err) {

      console.error("Post upload failed", err);

    }

    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose} width={520}>

      <div className="p-5 md:p-8">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">

          <div className="text-[15px] font-bold text-zinc-100">
            create post
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900"
          >
            <X size={15} />
          </button>

        </div>

        {/* IMAGE UPLOAD */}
        <label className="mb-4 flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-zinc-700 bg-[linear-gradient(135deg,#151515,#0d0d0d)] hover:border-zinc-600">

          {imagePreview ? (

            <img
              src={imagePreview}
              alt="preview"
              className="h-full w-full object-cover rounded-xl"
            />

          ) : (

            <>
              <ImageIcon size={32} className="text-zinc-700" />

              <div className="text-center">
                <div className="text-[13px] text-zinc-500">
                  drag & drop or click to upload
                </div>

                <div className="mt-1 text-[11px] text-zinc-700">
                  JPG, PNG • max 50MB
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

        {/* CAPTION */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="write a caption..."
          className="mb-4 min-h-[90px] w-full resize-none rounded-[9px] border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-700"
        />

        {/* BUTTONS */}
        <div className="flex gap-2.5">

          <Button
            onClick={onClose}
            v="outline"
            style={{ flex: 1 }}
          >
            CANCEL
          </Button>

          <Button
            onClick={submit}
            v="primary"
            style={{ flex: 2 }}
            disabled={!caption.trim()}
          >
            {loading ? "sharing..." : "SHARE POST"}
          </Button>

        </div>

      </div>

    </Modal>
  );
}