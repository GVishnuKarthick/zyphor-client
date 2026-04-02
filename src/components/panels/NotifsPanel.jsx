import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { useEffect } from "react";
import { getNotifications, markNotificationRead,clearNotifications } from "../../api/notificationApi";
import { followUser, unfollowUser } from "../../api/followApi";

export default function NotifsPanel({ notifs, setNotifs }) {

  // Load notifications


  const unread = notifs.filter((n) => !n.read);
  const read = notifs.filter((n) => n.read);

  // ⭐ Toggle follow / unfollow
  const toggleFollow = async (n) => {
    try {

      if (n.following) {
        await unfollowUser(n.senderId);
      } else {
        await followUser(n.senderId);
      }

      setNotifs((prev) =>
        prev.map((x) =>
          x.id === n.id ? { ...x, following: !x.following } : x
        )
      );

    } catch (err) {
      console.error("Follow toggle failed:", err);
    }
  };

  const markAll = async () => {
  try {
    await Promise.all(notifs.map((n) => markNotificationRead(n.id)));

    setNotifs((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  } catch (err) {
    console.error("Failed to mark all:", err);
  }
};  
   const clearAll = async () => {
  try {
    await clearNotifications();
    setNotifs([]);
  } catch (err) {
    console.error("Failed to clear notifications", err);
  }
};
  const NotifRow = ({ n }) => (
    <div
      onClick={async () => {
        setNotifs((prev) =>
          prev.map((x) => (x.id === n.id ? { ...x, read: true } : x))
        );
        try {
          await markNotificationRead(n.id);
        } catch (err) {
          console.error("Failed to mark notification:", err);
        }
      }}
      className={`mb-1.5 flex cursor-pointer items-center gap-3 rounded-[11px] border px-4 py-3 transition-all ${
        n.read
          ? "border-transparent bg-transparent hover:bg-zinc-900"
          : "border-zinc-800 bg-zinc-900"
      }`}
    >
      <Avatar 
        src={n.profileImageUrl}
        initials={n.avatar} 
        sz={42} 
        ring={!n.read} 
        active={!n.read} 
      />

      <div className="flex-1">
        <span className="text-[13px] font-semibold text-zinc-100">
          {n.user}{" "}
        </span>
        <span className="font-serif italic text-[13px] text-zinc-400">
          {n.msg}
        </span>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">

        {/* Follow Toggle Button */}
        {n.type === "follow" && (
          <Button
            sm
            v="outline"
            onClick={(e) => {
              e.stopPropagation();
              toggleFollow(n);
            }}
          >
            {n.following ? "Following" : "Follow Back"}
          </Button>
        )}

        <span className="text-[10px] text-zinc-500">{n.time}</span>

        {!n.read && (
          <div className="h-[7px] w-[7px] rounded-full bg-zinc-100" />
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 h-full overflow-y-auto px-4 py-4 md:px-9 md:py-8">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-[20px] font-extrabold tracking-[-0.03em] text-zinc-100">
            Notifications
          </div>

          {unread.length > 0 && (
            <div className="mt-1 text-xs text-zinc-400">
              {unread.length} unread
            </div>
          )}
        </div>
          <div className="flex items-center gap-2">
        {unread.length > 0 && (
          <Button sm v="outline" onClick={markAll}>
            mark all read
          </Button>
        )}
        {notifs.length > 0 && (
        <Button sm v="outline" onClick={clearAll}>
         clear all
         </Button>
        )}
      </div>
</div>
      {unread.length > 0 && (
        <>
          <div className="mb-3 text-[10px] tracking-[0.12em] text-zinc-500">
            NEW
          </div>

          {unread.map((n) => (
            <NotifRow key={n.id} n={n} />
          ))}

          <div className="h-4" />
        </>
      )}

      <div className="mb-3 text-[10px] tracking-[0.12em] text-zinc-500">
        EARLIER
      </div>

      {read.map((n) => (
        <NotifRow key={n.id} n={n} />
      ))}

    </div>
  );
}