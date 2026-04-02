import Modal from "../common/Modal";
import Button from "../common/Button";
import Avatar from "../common/Avatar";

export default function UserProfileModal({ open, onClose, username, posts }) {
  const userPosts = posts.filter((p) => p.user === username);

  return (
    <Modal open={open} onClose={onClose} width={720}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar initials={username?.slice(0, 2).toUpperCase() || "US"} sz={64} ring active />
            <div>
              <h2 className="text-xl font-bold text-zinc-100">{username}</h2>
              <p className="text-sm text-zinc-500">{userPosts.length} posts</p>
            </div>
          </div>

          <Button v="outline" onClick={onClose}>CLOSE</Button>
        </div>

        {userPosts.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 italic">No posts yet</div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {userPosts.map((post) => (
              <div
                key={post.id}
                className="aspect-square rounded-md overflow-hidden bg-zinc-900"
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt="post"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ background: post.grad }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}