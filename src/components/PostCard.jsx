import { useState } from "react";
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, Trash2 } from "lucide-react";
import Avatar from "./common/Avatar";

export default function PostCard({
  post,
  onComment,
  onShare,
  onViewProfile,
  currentUser,
  onDelete,
  onToggleLike
}) {

  const [saved, setSaved] = useState(post.saved);
  const [anim, setAnim] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

 const handleLike = () => {
  onToggleLike(post.id);
  setAnim(true);
  setTimeout(() => setAnim(false), 320);
};

  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition-colors hover:border-zinc-700">

      {/* HEADER */}

      <div className="flex items-center justify-between px-4 py-3.5">

        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => onViewProfile?.(post.user)}
        >

          <Avatar 
            src={post.profileImageUrl} 
            initials={post.avatar} 
            sz={38} 
          />

          <div>
            <div className="text-[13px] font-semibold text-zinc-100">
              {post.user}
            </div>

            <div className="mt-0.5 text-[10px] text-zinc-500">
              {post.time} 
            </div>
          </div>

        </div>

        <div className="flex items-center gap-2">

          <span className="rounded-full border border-zinc-800 px-2.5 py-[3px] text-[10px] text-zinc-700">
            #{post.tag}
          </span>

          <div className="relative">

            <button
              onClick={() => setShowMenu((p) => !p)}
              className="rounded-md p-1 hover:bg-zinc-900"
            >
              <MoreHorizontal size={17} className="text-zinc-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full z-50 mt-1 w-[140px] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">

                {post.user === currentUser?.username && (
                  <button
                    onClick={() => {
                      onDelete(post.id);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs text-red-400 hover:bg-zinc-800"
                  >
                    <Trash2 size={14} />
                    delete post
                  </button>
                )}

                {["copy link", "not interested", "report"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setShowMenu(false)}
                    className={`block w-full px-4 py-2.5 text-left text-xs hover:bg-zinc-800 ${
                      item === "report"
                        ? "text-red-400"
                        : "text-zinc-400"
                    }`}
                  >
                    {item}
                  </button>
                ))}

              </div>
            )}

          </div>

        </div>

      </div>


      {/* POST IMAGE / GRADIENT */}

      <div className="relative aspect-square w-full overflow-hidden flex items-center justify-center">

        {post.image ? (

          <img
            src={post.image}
            alt="post"
            className="w-full h-full object-cover"
          />

        ) : (

          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: post.grad }}
          >

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_35%,rgba(255,255,255,0.03)_0%,transparent_60%)]" />

            <div className="absolute bottom-4 right-4 h-2 w-2 rounded-full bg-white/10" />

            <div className="absolute left-5 top-5 h-1 w-1 rounded-full bg-white/10" />

            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10">
              <div className="h-9 w-9 rounded-full bg-white/5" />
            </div>

          </div>

        )}

      </div>


      {/* ACTIONS */}

      <div className="px-4 pb-2 pt-3">

        <div className="mb-2.5 flex items-center justify-between">

          <div className="flex gap-4">

            <button
              onClick={handleLike}
              className="transition-transform"
              style={{ transform: anim ? "scale(1.4)" : "scale(1)" }}
            >
              <Heart
                size={22}
                className={
                  post.liked
                    ? "fill-zinc-100 text-zinc-100"
                    : "text-zinc-100"
                }
              />
            </button>

            <button onClick={() => onComment(post)}>
              <MessageSquare size={22} className="text-zinc-100" />
            </button>

            <button onClick={() => onShare(post)}>
              <Share2 size={22} className="text-zinc-100" />
            </button>

          </div>

          <button
            onClick={() => setSaved((p) => !p)}
            className="transition-transform hover:scale-110"
          >
            <Bookmark
              size={22}
              className={
                saved
                  ? "fill-zinc-100 text-zinc-100"
                  : "text-zinc-100"
              }
            />
          </button>

        </div>


        {/* LIKES */}

        <div className="mb-1.5 text-xs font-semibold text-zinc-300">
          {post.likes.toLocaleString()} likes
        </div>


        {/* CAPTION */}

        <div className="mb-2 font-serif italic text-sm leading-6 text-zinc-100">
          {post.caption}
        </div>


        {/* COMMENTS */}

        {post.comments.length > 0 && (
          <button
            onClick={() => onComment(post)}
            className="mb-2 text-xs text-zinc-500 hover:text-zinc-400"
          >
            view all {post.comments.length} comment
            {post.comments.length !== 1 ? "s" : ""}
          </button>
        )}

      </div>

    </div>
  );
}