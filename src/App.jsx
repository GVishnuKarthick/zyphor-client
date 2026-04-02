import { useContext, useEffect, useState } from "react";
import AuthPage from "./components/auth/AuthPage";
import Sidebar from "./components/layout/Sidebar";
import RightPanel from "./components/layout/RightPanel";
import FeedPanel from "./components/panels/FeedPanel";
import ExplorePanel from "./components/panels/ExplorePanel";
import NotifsPanel from "./components/panels/NotifsPanel";
import MessagesPanel from "./components/panels/MessagesPanel";
import ProfilePanel from "./components/panels/ProfilePanel";
import StoryViewer from "./components/modals/StoryViewer";
import CreatePostModal from "./components/modals/CreatePostModal";
import CommentsModal from "./components/modals/CommentsModal";
import ShareModal from "./components/modals/ShareModal";
import SettingsModal from "./components/modals/SettingsModal";
import Toast from "./components/common/Toast";
import EditProfileModal from "./components/profile/EditProfileModal";
import UserProfileModal from "./components/profile/UserProfileModal";
import AddStoryModal from "./components/story/AddStoryModal";
import { getCurrentUser } from "./api/userApi";
import { AuthContext } from "./context/AuthContext";
import { createConversation } from "./api/conversationApi";
import { getPosts, createPost as createPostApi } from "./api/postApi";
import { addComment as addCommentApi, getComments } from "./api/commentApi";
import { toggleLike, getLikes } from "./api/likeApi";
import { deletePost } from "./api/postApi";
import { mkMsgs, mkNotifs, mkPosts, STORIES, SUGGESTED } from "./data/mockData";
import { GRADS } from "./theme";
import { timeAgo } from "./utils/timeAgo";
import { getStories, createStory, deleteStory } from "./api/storyApi";
import { getNotifications } from "./api/notificationApi";
import { startConnection, getConnection } from "./services/chatService";
import { useRef } from "react";
export default function App() {
  const { user, setUser, login, logout, loading } = useContext(AuthContext);
  const currentUser = user;

  const [active, setActive] = useState("home");
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [suggested, setSuggested] = useState(SUGGESTED);
  const [storyIdx, setStoryIdx] = useState(null);
  const [createPost, setCreatePost] = useState(false);
  const [commentTarget, setCommentTarget] = useState(null);
  const [selChat, setSelChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [shareTarget, setShareTarget] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [viewUserOpen, setViewUserOpen] = useState(false);
  const [viewUsername, setViewUsername] = useState(null);
  const [addStoryOpen, setAddStoryOpen] = useState(false);
  const [targetProfile, setTargetProfile] = useState(null);

  const unreadN = notifs.filter((n) => !n.read).length;
  const unreadM = conversations.reduce((sum, c) => sum + (c.unread || 0), 0);
const loadConversations = async () => {
  try {
    const res = await fetch("https://zyphor-server.onrender.com/api/conversations", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("zyphor_token")}`,
      },
    });

    const data = await res.json();
    console.log("Conversations loaded from API:", data);

    // ✅ CLEAN MAPPING (NO OLD STATE)
    const mapped = data.map((c) => ({
      id: c.id || c._id,
      user: c.username || c.Username || "Unknown",
      userId: c.userId || c.UserId || c.userid || null,
      avatar: (c.username || c.Username || "U").slice(0, 2).toUpperCase(),
      profileImageUrl: c.profileImageUrl,
      msgs: [],
      unread: 0,
    }));

    setConversations(mapped);
    return mapped;

  } catch (err) {
    console.error("❌ failed to load conversations:", err);
  }
};

const loadUnreadCounts = async (convos) => {
  try {
    const res = await fetch("https://zyphor-server.onrender.com/api/messages/unread-count", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("zyphor_token")}`,
      },
    });

    const data = await res.json();

    // Merge unread counts into the freshly-loaded conversations list
    const withUnread = (convos || []).map((c) => {
      const found = data.find((u) => u.conversationId === c.id);
      return { ...c, unread: found ? found.count : 0 };
    });

    setConversations(withUnread);

  } catch (err) {
    console.error("❌ unread load failed:", err);
  }
};
  useEffect(() => {
    document.title = "Zyphor";
  }, []);

useEffect(() => {
  if (!currentUser) return;

  const init = async () => {
    try {
      await loadPostsFromBackend();
      await loadStoriesFromBackend();

      const convos = await loadConversations();
      await loadUnreadCounts(convos);

    } catch (err) {
      console.error("❌ init error:", err);
    }
  };

  init();

}, [currentUser?.id]);

const activeRef = useRef(active);
const selRef = useRef(selChat);
useEffect(() => { activeRef.current = active; }, [active]);
useEffect(() => { selRef.current = selChat; }, [selChat]);

useEffect(() => {
  if (currentUser?.id) {
    startConnection(currentUser.id).then(() => {
      const conn = getConnection();
      if (!conn) return;

      // 🔥 CLEANUP FIRST
      conn.off("ReceiveMessage");
      conn.off("UserOnline");
      conn.off("UserOffline");

      const handler = (msg) => {
        // ... msg handling
        setConversations((prev) => {
          const updated = prev.map((c) => {
            if (c.id !== msg.conversationId) return c;

            const isActive = activeRef.current === "messages" && selRef.current === c.id;

            return {
              ...c,
              msgs: [
                ...(c.msgs || []),
                {
                  from: msg.senderId === currentUser.id ? "me" : "them",
                  text: msg.text,
                  time: "now",
                },
              ],
              unread: msg.senderId !== currentUser.id && !isActive ? (c.unread || 0) + 1 : c.unread,
            };
          });

          return [...updated];
        });
      };

      conn.on("ReceiveMessage", handler);

      conn.on("UserOnline", (uId) => {
        console.log("🟢 UserOnline event received for:", uId);
        setOnlineUsers((prev) => (prev.includes(uId) ? prev : [...prev, uId]));
      });

      conn.on("UserOffline", (uId) => {
        console.log("🔴 UserOffline event received for:", uId);
        setOnlineUsers((prev) => prev.filter((id) => id !== uId));
      });

      conn.invoke("GetOnlineUsers").then((users) => {
        console.log("🟡 Initial GetOnlineUsers fetched:", users);
        if (users) setOnlineUsers(users);
      }).catch(err => console.error("❌ GetOnlineUsers failed:", err));
    });
  }
}, [currentUser?.id]); // Use id to prevent unnecessary re-runs


useEffect(() => {
  if (!selChat || !currentUser) return;

  const loadMessages = async () => {
    try {
      const res = await fetch(`https://zyphor-server.onrender.com/api/messages/${selChat}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("zyphor_token")}`,
        },
      });

      const data = await res.json();
      
      const mapped = data.map((m) => ({
        from: m.senderId === currentUser.id ? "me" : "them",
        text: m.text,
        time: new Date(m.createdAt).toLocaleTimeString(),
      }));

      setConversations((prev) =>
        prev.map((c) => (c.id === selChat ? { ...c, msgs: mapped, unread: 0 } : c))
      );

    } catch (err) {
      console.error("❌ failed to load messages:", err);
    }
  };

  loadMessages();
}, [selChat, currentUser?.id]);

useEffect(() => {
  const loadNotifications = async () => {
    try {
      const data = await getNotifications();

      const mapped = data.map((n) => ({
        id: n.id,
        user: n.username,
        avatar: (n.username || "U").slice(0, 2).toUpperCase(),
        profileImageUrl: n.profileImageUrl,
        msg:
          n.type === "follow"
            ? "started following you"
            : n.type === "like"
            ? "liked your post"
            : "commented on your post",
        time: new Date(n.createdAt).toLocaleTimeString(),
        read: n.isRead,
        senderId: n.senderId,
        type: n.type,
        following: false
      }));

      setNotifs(mapped);

    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  if (currentUser) loadNotifications();

}, [currentUser]);
  const loadPostsFromBackend = async () => {
    try {
      const postsData = await getPosts(1, 20);

      const mappedPosts = await Promise.all(
        postsData.map(async (p) => {
          let comments = [];
          let likesData = { totalLikes: p.likeCount || 0, likedByCurrentUser: false };

          try {
            comments = await getComments(p.id);
          } catch {}

          try {
            likesData = await getLikes(p.id);
          } catch {}

          return {
            id: p.id,
            user: p.username,
            userId: p.userId,
            avatar: p.username.slice(0, 2).toUpperCase(),
            profileImageUrl: p.profileImageUrl,
            time: timeAgo(p.createdAt),
            caption: p.caption,
            grad: GRADS[Math.floor(Math.random() * GRADS.length)],
            likes: likesData.totalLikes ?? p.likeCount ?? 0,
            comments: comments.map((c) => ({
              id: c.id,
              user: c.username,
              avatar: (c.username || "US").slice(0, 2).toUpperCase(),
              profileImageUrl: c.profileImageUrl,
              text: c.content,
              time: timeAgo(c.createdAt),
            })),
            saved: false,
            liked: likesData.likedByCurrentUser ?? false,
            tag: "photo",
            image: p.imageUrl || (p.imageUrls && p.imageUrls[0]) || null,
          };
        })
      );

      setPosts(mappedPosts);
    } catch (error) {
      console.error("failed to load posts", error);
    }
  };
const loadStoriesFromBackend = async () => {
  try {
    const data = await getStories();
    const now = Date.now();
    const grouped = {};

data.forEach((s) => {

  const storyTime = new Date(s.createdAt).getTime();

  // skip stories older than 24 hours
  if (now - storyTime > 86400000) return;

  if (!grouped[s.userId]) {
    grouped[s.userId] = {
      userId: s.userId,
      user: s.username,
      avatar: (s.username || "U").slice(0,2).toUpperCase(),
      profileImageUrl: s.profileImageUrl,
      stories: []
    };
  }

  grouped[s.userId].stories.push({
    id: s.id,
    mediaUrl: s.mediaUrl,
    createdAt: s.createdAt,
    user: s.username,
    avatar: (s.username || "U").slice(0,2).toUpperCase(),
    profileImageUrl: s.profileImageUrl
  });

});

    const groupedArray = Object.values(grouped);

    // ⭐ IMPORTANT FIX — sort stories by time
    groupedArray.forEach((u) => {
      u.stories.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    });

    setStories(groupedArray);

  } catch (err) {
    console.error(err);
  }
};
  const loadCurrentUser = async () => {
  try {
    const userData = await getCurrentUser();
    setUser(userData);
  } catch (error) {
    console.error("failed to load current user", error);
  }
};
  const handleSaveProfile = (data) => {
    setUser((p) => ({
      ...p,
      ...data,
    }));
    setToast("Profile updated");
  };

const handleDeletePost = async (postId) => {
  try {
    await deletePost(postId);
    setPosts((p) => p.filter((post) => post.id !== postId));
    setToast("Post deleted");
  } catch (error) {
    console.error(error);
    setToast("Failed to delete post");
  }
};


const handleDeleteStory = async (storyId) => {
  try {
    await deleteStory(storyId);
    
    // Remove story from local state
    setStories(prev => {
      const updated = prev.map(userStories => {
        if (userStories.stories.some(s => s.id === storyId)) {
          const filteredStories = userStories.stories.filter(s => s.id !== storyId);
          
          // If user has no more stories, remove the entire user entry
          if (filteredStories.length === 0) {
            return null;
          }
          
          return { ...userStories, stories: filteredStories };
        }
        return userStories;
      }).filter(Boolean); // Remove null entries
      
      return updated;
    });
    
    setToast("Story deleted");
    setStoryIdx(null); // Close story viewer
  } catch (error) {
    console.error("Failed to delete story:", error);
    setToast("Failed to delete story");
  }
};

const handleAddStory = async (image) => {
  const story = await createStory(image);

  setStories(prev => {
    const existing = prev.find(s => s.userId === currentUser.id);
    
    // Check if this story already exists to prevent duplicates
    if (existing && existing.stories.some(s => s.id === story.id)) {
      return prev; // Story already exists, don't add again
    }

    if (existing) {
      existing.stories.unshift({
        id: story.id,
        mediaUrl: story.mediaUrl,
        createdAt: story.createdAt,
        user: currentUser.username,
        avatar: currentUser.username.slice(0,2).toUpperCase()
      });
      return [...prev];
    }

    return [
      {
        userId: currentUser.id,
        user: currentUser.username,
        avatar: currentUser.username.slice(0,2).toUpperCase(),
        stories: [{
          id: story.id,
          mediaUrl: story.mediaUrl,
          createdAt: story.createdAt,
          user: currentUser.username,
          avatar: currentUser.username.slice(0,2).toUpperCase()
        }]
      },
      ...prev
    ];
  });
  setToast("Story posted");
};

  const handlePost = (post) => {
  const newPost = {
    ...post,
    user: currentUser.username,
    userId: currentUser.id,
    avatar: currentUser.username.slice(0, 2).toUpperCase(),
    profileImageUrl: currentUser.profileImageUrl,
    time: timeAgo(new Date()),
    grad: GRADS[Math.floor(Math.random() * GRADS.length)],
    likes: post.likeCount ?? 0,
    comments: [],
    saved: false,
    liked: false,
    image: post.imageUrls?.[0] || null,
  };

  setPosts((p) => [newPost, ...p]);
  setToast("Post shared successfully!");
};;

  const handleComment = async (postId, text) => {
    try {
      const created = await addCommentApi(postId, { content: text });

      setPosts((p) =>
        p.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    id: created.id || Date.now(),
                    user: currentUser.username,
                    avatar: currentUser.username.slice(0, 2).toUpperCase(),
                    profileImageUrl: currentUser.profileImageUrl,
                    text: created.content || text,
                    time: "now",
                  },
                ],
              }
            : post
        )
      );
    } catch (error) {
      console.error(error);
      setToast("Failed to add comment");
    }
  };

  const onToggleLike = async (postId) => {
    try {
      await toggleLike(postId);
      const latest = await getLikes(postId);

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: latest.totalLikes,
                liked: latest.likedByCurrentUser,
              }
            : post
        )
      );
    } catch (error) {
      console.error(error);
      setToast("Failed to update like");
    }
  };

  const handleStory = (userStories) => {
    console.log("Story count:", userStories.length);
     setStoryIdx(userStories);
  };

  const handleViewProfile = async (username) => {
    if (currentUser?.username === username) {
      setTargetProfile(null);
      setActive("profile");
      return;
    }

    try {
      const res = await fetch(`https://zyphor-server.onrender.com/api/users/${username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("zyphor_token")}`,
        },
      });
      const userData = await res.json();
      setTargetProfile(userData);
      setActive("profile");
    } catch (err) {
      console.error("Failed to load target profile:", err);
      setToast("User not found!");
    }
  };

  const handleNav = (id) => {
    if (id === "profile") {
      setTargetProfile(null);
    }
    setActive(id);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#070707] text-zinc-400">
        loading...
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage onLogin={login} />;
  }

  return (
    <div className="flex h-screen w-screen flex-col-reverse md:flex-row overflow-hidden bg-[#070707] text-zinc-100">
      <Sidebar 
        active={active} 
        setActive={handleNav} 
        currentUser={currentUser} 
        onNewPost={() => setCreatePost(true)} 
        onSettings={() => setSettingsOpen(true)} 
        unreadN={unreadN} 
        unreadM={unreadM} 
      />

      <div className="flex min-w-0 flex-1 overflow-hidden">
        {active === "home" && (
          <>
            <FeedPanel
              posts={posts}
              stories={stories}
              onStory={handleStory}
              onComment={setCommentTarget}
              onShare={setShareTarget}
              onNewPost={() => setCreatePost(true)}
              onStoryCreate={() => setAddStoryOpen(true)}
              onViewProfile={handleViewProfile}
              currentUser={currentUser}
              onDelete={handleDeletePost}
              onToggleLike={onToggleLike}
            />
            <RightPanel suggested={suggested} setSuggested={setSuggested} messages={conversations} setActive={handleNav} currentUser={currentUser} onlineUsers={onlineUsers} onViewProfile={handleViewProfile} />
          </>
        )}

        {active === "search" && (
          <>
            <ExplorePanel posts={posts} onViewProfile={handleViewProfile} />
            <RightPanel suggested={suggested} setSuggested={setSuggested} messages={conversations} setActive={handleNav} currentUser={currentUser} onlineUsers={onlineUsers} onViewProfile={handleViewProfile} />
          </>
        )}

        {active === "notifs" && (
          <>
            <NotifsPanel notifs={notifs} setNotifs={setNotifs} />
            <RightPanel suggested={suggested} setSuggested={setSuggested} messages={conversations} setActive={handleNav} currentUser={currentUser} onlineUsers={onlineUsers} onViewProfile={handleViewProfile} />
          </>
        )}

        {active === "messages" && (
          <MessagesPanel 
            conversations={conversations} 
            setConversations={setConversations} 
            currentUser={currentUser} 
            sel={selChat} 
            setSel={setSelChat} 
            onlineUsers={onlineUsers}
            onViewProfile={handleViewProfile}
          />
        )}

        {active === "profile" && (
          <>
            <ProfilePanel
              user={targetProfile || currentUser}
              isMe={!targetProfile || targetProfile.id === currentUser.id}
              posts={posts}
              onNewPost={() => setCreatePost(true)}
              onEditProfile={() => setEditProfileOpen(true)}
              onSettings={() => setSettingsOpen(true)}
              onMessage={async (u) => {
                try {
                  const convo = await createConversation([currentUser.id, u.id]);
                  await loadConversations();
                  setSelChat(convo.id);
                  setActive("messages");
                } catch (err) {
                  console.error("Failed to start chat:", err);
                  setToast("Could not start conversation!");
                }
              }}
            />
            <RightPanel suggested={suggested} setSuggested={setSuggested} messages={conversations} setActive={handleNav} currentUser={currentUser} onlineUsers={onlineUsers} onViewProfile={handleViewProfile} />
          </>
        )}
      </div>

      {storyIdx != null&&( <StoryViewer stories={storyIdx}
    startIdx={0}
    onClose={() => setStoryIdx(null)}
    onDelete={handleDeleteStory}
    currentUser={currentUser} />)}

      <CreatePostModal
        open={createPost}
        onClose={() => setCreatePost(false)}
        onPost={handlePost}
        username={currentUser.username}
        avatar={currentUser.avatar}
      />

      <CommentsModal
        open={!!commentTarget}
        onClose={() => setCommentTarget(null)}
        post={commentTarget}
        onAddComment={handleComment}
        currentUser={currentUser}
      />

      <ShareModal
        open={!!shareTarget}
        onClose={() => setShareTarget(null)}
        conversations={conversations}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentUser={currentUser}
        onLogout={logout}
        onSave={() => setToast("Settings saved!")}
      />

      <EditProfileModal
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        user={currentUser}
        onSave={handleSaveProfile}
      />

      <UserProfileModal
        open={viewUserOpen}
        onClose={() => setViewUserOpen(false)}
        username={viewUsername}
        posts={posts}
      />

      <AddStoryModal
        open={addStoryOpen}
        onClose={() => setAddStoryOpen(false)}
        onAdd={handleAddStory}
      />

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}