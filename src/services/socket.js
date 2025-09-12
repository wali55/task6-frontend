import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL);

export const socketService = {
  socket,

  setNickname: (nickname, callback) => {
    socket.emit("set-nickname", nickname);
    socket.once("nickname-set", callback);
  },

  onConnect: (callback) => {
    socket.on("connect", callback);
  },

  onDisconnect: (callback) => {
    socket.on("disconnect", callback);
  },
};

export default socketService;
