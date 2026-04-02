import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { updateProfile } from "../../api/profileApi";
export default function EditProfileModal({ open, onClose, user, onSave }) {

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setBio(user.bio || "");
      setPreview(user.profileImageUrl || "");
      setAvatar(user.profileImageUrl || "");
    }
  }, [user]);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("Username", username);
      formData.append("Bio", bio);
      
      if (avatar instanceof File) {
        formData.append("Image", avatar);
      } else {
        formData.append("ProfileImageUrl", avatar || "");
      }

      const updated = await updateProfile(formData);
      onSave(updated);
      onClose();
    } catch (err) {
      console.error("Update profile failed:", err);
    } finally {
      setLoading(false);
    }
  };
  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} width={420}>
      <div className="flex flex-col gap-4 p-6">

        <h2 className="text-lg font-bold text-zinc-100">
          Edit Profile
        </h2>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="group relative">
            {preview ? (
              <img
                src={preview}
                className="h-24 w-24 rounded-full border-2 border-zinc-700 object-cover transition-all group-hover:opacity-75"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800 border-2 border-zinc-700 text-2xl font-bold text-zinc-500">
                {username ? username[0].toUpperCase() : "U"}
              </div>
            )}
            
            <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-xs font-medium text-white">Change</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-zinc-500">Click avatar to upload photo</p>
        </div>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          className="rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
        />

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="bio"
          className="min-h-[80px] rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
        />

        <div className="flex justify-end gap-2">

          <Button v="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button v="primary" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>

        </div>

      </div>
    </Modal>
  );
}