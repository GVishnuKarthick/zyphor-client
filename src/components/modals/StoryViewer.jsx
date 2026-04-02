import { useEffect, useState,useRef } from "react";
import Avatar from "../common/Avatar";
import { X, Trash2 } from "lucide-react";
import { GRADS } from "../../theme";
import { timeAgo } from "../../utils/timeAgo";

export default function StoryViewer({ stories = [], startIdx = 0, onClose, onDelete, currentUser }) {

  const [idx, setIdx] = useState(startIdx);
  const [prog, setProg] = useState(0);
  const timerRef = useRef(null);
  const story = stories[idx];
const pauseStory = () => {
  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
};

const resumeStory = () => {

  if (timerRef.current) return; // prevent multiple timers

  timerRef.current = setInterval(() => {

    setProg((p) => {

      if (p >= 100) {

        if (idx + 1 < stories.length) {
          setIdx((i) => i + 1);
        } else {
          setTimeout(() => onClose(), 0);
        }

        return 0;
      }

      return p + 1.8;

    });

  }, 55);

};
  useEffect(() => {

  if (!stories.length) return;

  setProg(0);

  timerRef.current = setInterval(() => {

    setProg((p) => {

      if (p >= 100) {

        if (idx + 1 < stories.length) {
          setIdx(idx + 1);
        } 
        else {
          setTimeout(() => onClose(), 0);
        }

        return 0;
      }

      return p + 1.8;

    });

  }, 55);

  return () => clearInterval(timerRef.current);

}, [idx, stories.length,onClose]);

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black">

      <div
        className="relative h-screen w-full max-w-[420px]"
        style={{ background: GRADS[idx % GRADS.length] }}
        onMouseDown={pauseStory}
  onMouseUp={resumeStory}
  onTouchStart={pauseStory}
  onTouchEnd={resumeStory}
      >

        {/* Progress Bars */}
        <div className="absolute left-4 right-4 top-4 z-10 flex gap-1">
          {stories.map((s, i) => (
            <div key={s.id} className="h-[3px] flex-1 rounded bg-white/15">
              <div
                className="h-full rounded bg-white/90"
                style={{
                  width:
                    i < idx
                      ? "100%"
                      : i === idx
                      ? `${prog}%`
                      : "0%",
                  transition:
                    i === idx ? "width 0.055s linear" : "none",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute left-4 right-4 top-8 z-10 flex items-center justify-between">

          <div className="flex items-center gap-2.5">
            <Avatar initials={story.avatar || "U"} sz={36} ring active />

            <div>
              <div className="text-[13px] font-semibold text-white">
                {story.user || "User"}
              </div>

              <div className="text-xs text-zinc-400">
                {timeAgo(story.createdAt)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Show delete button only for current user's stories */}
            {currentUser && story.user === currentUser.username && onDelete && (
              <button
                onClick={() => onDelete(story.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40"
              >
                <Trash2 size={16} className="text-white" />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40"
            >
              <X size={16} className="text-white" />
            </button>
          </div>

        </div>

        {/* Story Media */}
        <div className="flex h-full w-full items-center justify-center">
          
          {story.mediaUrl ? (
            <img
              src={story.mediaUrl}
              alt="story"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-white/40">No story media</div>
          )}
        </div>

        {/* Previous */}
        <div
          onClick={() => idx > 0 && setIdx(idx - 1)}
          className="absolute left-0 top-0 h-full w-[40%] cursor-pointer"
        />

        {/* Next */}
        <div
          onClick={() =>
            idx + 1 < stories.length
              ? setIdx(idx + 1)
              : onClose()
          }
          className="absolute right-0 top-0 h-full w-[60%] cursor-pointer"
        />

      </div>
    </div>
  );
}