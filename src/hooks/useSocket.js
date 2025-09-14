import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setConnected,
  userJoined,
  userLeft,
  userLeftPresentation,
} from "../store/slices/presentationSlice";
import { getSocket, initSocket } from "../utils/socket";

export const useSocket = () => {
  const dispatch = useDispatch();
  const socket = getSocket() || initSocket();  

  useEffect(() => {
  if (!socket) return;

  const handleConnect = () => dispatch(setConnected(true));
  const handleDisconnect = () => dispatch(setConnected(false));
  const handleUserJoined = (data) => dispatch(userJoined(data));
  const handleUserLeft = (data) => dispatch(userLeft(data));
  const handleUserLeftPresentation = (data) => dispatch(userLeftPresentation(data));

  socket.on("connect", handleConnect);
  socket.on("disconnect", handleDisconnect);
  socket.on("user-joined", handleUserJoined);
  socket.on("user-left", handleUserLeft);
  socket.on("user-left-presentation", handleUserLeftPresentation);

  return () => {
    socket.off("connect", handleConnect);
    socket.off("disconnect", handleDisconnect);
    socket.off("user-joined", handleUserJoined);
    socket.off("user-left", handleUserLeft);
    socket.off("user-left-presentation", handleUserLeftPresentation);
  };
}, [socket, dispatch]);

  const joinPresentation = (presentationId, userId, nickname) => {
    socket?.emit("join-presentation", { presentationId, userId, nickname });
  };

  const leavePresentation = (presentationId, userId) => {
    socket?.emit("leave-presentation", { presentationId, userId });
  };

  return { socket, joinPresentation, leavePresentation };
};

