import { GRADS } from "../theme";

export const mkPosts = () => [
  {
    id: 1,
    username: "arya.m",
    avatar: "AM",
    time: "2h",
    caption:
      "stillness between the noise — found this in the city today. sometimes all you need is to look up.",
    grad: GRADS[0],
    likes: 847,
    comments: [
      { id: 1, username: "soul.wav", avatar: "SW", text: "this hits different at 2am", time: "1h" },
      { id: 2, username: "kiran_", avatar: "KR", text: "where is this??", time: "45m" },
    ],
    saved: false,
    liked: false,
    tag: "urban",
  },
  {
    id: 2,
    username: "soul.wav",
    avatar: "SW",
    time: "5h",
    caption: "late night sessions. no context, just vibes.",
    grad: GRADS[1],
    likes: 1203,
    comments: [
      { id: 1, username: "kiran_", avatar: "KR", text: "🔥🔥🔥", time: "4h" },
      { id: 2, username: "lumi", avatar: "LU", text: "what track is this", time: "3h" },
    ],
    saved: true,
    liked: true,
    tag: "music",
  },
  {
    id: 3,
    username: "lumi",
    avatar: "LU",
    time: "8h",
    caption: "light always finds a way.",
    grad: GRADS[2],
    likes: 562,
    comments: [{ id: 1, username: "nyx.co", avatar: "NC", text: "incredible shot", time: "7h" }],
    saved: false,
    liked: false,
    tag: "photo",
  },
  {
    id: 4,
    username: "nyx.co",
    avatar: "NC",
    time: "12h",
    caption: "the city never sleeps and neither do i",
    grad: GRADS[3],
    likes: 391,
    comments: [],
    saved: false,
    liked: false,
    tag: "night",
  },
  {
    id: 5,
    username: "kiran_",
    avatar: "KR",
    time: "1d",
    caption: "found an old polaroid. memories hit different.",
    grad: GRADS[4],
    likes: 728,
    comments: [{ id: 1, username: "arya.m", avatar: "AM", text: "nostalgia 💙", time: "20h" }],
    saved: true,
    liked: false,
    tag: "analog",
  },
];

export const mkMsgs = () => [
  {
    id: 1,
    username: "kiran_",
    avatar: "KR",
    unread: 2,
    online: true,
    msgs: [
      { from: "them", text: "yo that last post was 🔥", time: "2m" },
      { from: "them", text: "how'd you get that shot?", time: "2m" },
    ],
  },
  {
    id: 2,
    username: "nyx.co",
    avatar: "NC",
    unread: 1,
    online: true,
    msgs: [
      { from: "them", text: "can we collab on something?", time: "15m" },
      { from: "me", text: "yeah definitely, what you thinking?", time: "14m" },
      { from: "them", text: "dm me the details", time: "13m" },
    ],
  },
  {
    id: 3,
    username: "arya.m",
    avatar: "AM",
    unread: 0,
    online: false,
    msgs: [
      { from: "them", text: "thanks for the save 🖤", time: "1h" },
      { from: "me", text: "always 🤍", time: "1h" },
      { from: "them", text: "means a lot fr", time: "58m" },
    ],
  },
  {
    id: 4,
    username: "fog.era",
    avatar: "FE",
    unread: 0,
    online: false,
    msgs: [{ from: "them", text: "love the vibe here", time: "3h" }],
  },
  {
    id: 5,
    username: "soul.wav",
    avatar: "SW",
    unread: 0,
    online: true,
    msgs: [
      { from: "me", text: "that track from your story?", time: "5h" },
      { from: "them", text: "lofi beats to post at 3am 😅", time: "4h" },
    ],
  },
];

export const mkNotifs = () => [
  { id: 1, type: "like", username: "kiran_", avatar: "KR", msg: "liked your photo", time: "5m", read: false },
  { id: 2, type: "follow", username: "nyx.co", avatar: "NC", msg: "started following you", time: "20m", read: false },
  { id: 3, type: "comment", username: "lumi", avatar: "LU", msg: 'commented: "incredible shot"', time: "1h", read: false },
  { id: 4, type: "like", username: "soul.wav", avatar: "SW", msg: "liked your story", time: "2h", read: true },
  { id: 5, type: "follow", username: "echo.lab", avatar: "EL", msg: "started following you", time: "3h", read: true },
  { id: 6, type: "comment", username: "fog.era", avatar: "FE", msg: 'commented: "love the vibe"', time: "4h", read: true },
  { id: 7, type: "like", username: "drift.jpg", avatar: "DJ", msg: "liked your photo", time: "6h", read: true },
  { id: 8, type: "follow", username: "void.arc", avatar: "VA", msg: "started following you", time: "8h", read: true },
];

export const STORIES = [
  { id: 1, username: "arya.m", avatar: "AM", active: true, viewed: false },
  { id: 2, username: "kiran_", avatar: "KR", active: false, viewed: false },
  { id: 3, username: "soul.wav", avatar: "SW", active: true, viewed: true },
  { id: 4, username: "nyx.co", avatar: "NC", active: false, viewed: false },
  { id: 5, username: "lumi", avatar: "LU", active: true, viewed: false },
  { id: 6, username: "fog.era", avatar: "FE", active: false, viewed: true },
  { id: 7, username: "echo.lab", avatar: "EL", active: true, viewed: false },
  { id: 8, username: "drift.jpg", avatar: "DJ", active: false, viewed: false },
];

export const SUGGESTED = [
  { id: 1, username: "echo.lab", avatar: "EL", mutual: 3, bio: "digital artifacts", following: false },
  { id: 2, username: "drift.jpg", avatar: "DJ", mutual: 7, bio: "motion + still", following: false },
  { id: 3, username: "void.arc", avatar: "VA", mutual: 1, bio: "architecture of silence", following: true },
  { id: 4, username: "film.err", avatar: "FI", mutual: 5, bio: "analog dreams", following: false },
];

export const TAGS = [
  "#minimal",
  "#darkroom",
  "#negative",
  "#stilllife",
  "#grain",
  "#texture",
  "#monochrome",
  "#void",
  "#depth",
  "#analog",
  "#shadow",
  "#35mm",
];