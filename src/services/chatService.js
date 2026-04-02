
import * as signalR from "@microsoft/signalr";

let connection = null;
let startPromise = null;
let requestedUserId = null;

export const startConnection = async (userId) => {
  if (connection && startPromise && connection.state !== "Disconnected") {
    if (requestedUserId === userId) {
      return startPromise;
    } else {
      await connection.stop();
      connection = null;
      startPromise = null;
    }
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`https://zyphor-server-1.onrender.com/chathub?userId=${userId}`)
    .withAutomaticReconnect()
    .build();

  requestedUserId = userId;

  startPromise = connection.start().then(() => {
    console.log("✅ Connected to SignalR as user:", userId);
  }).catch((err) => {
    console.error("❌ SignalR error:", err);
  });

  return startPromise;
};

export const getConnection = () => connection;