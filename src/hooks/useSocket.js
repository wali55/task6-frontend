import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  setConnected,
  userJoined,
  userLeft,
  userLeftPresentation,
  slideAdded,
  slideDeleted,
  roleChanged,
} from "../store/slices/presentationSlice";
import { initSocket } from "../utils/socket";

export const useSocket = () => {
  const dispatch = useDispatch();
  const socket = useMemo(() => initSocket(), []);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => dispatch(setConnected(true));
    const handleDisconnect = () => dispatch(setConnected(false));
    const handleUserJoined = (data) => dispatch(userJoined(data));
    const handleUserLeft = (data) => dispatch(userLeft(data));
    const handleUserLeftPresentation = (data) =>
      dispatch(userLeftPresentation(data));
    const handleSlideAdded = (data) => dispatch(slideAdded(data));
    const handleSlideDeleted = (data) => dispatch(slideDeleted(data));
    const handleRoleChanged = (data) => dispatch(roleChanged(data));

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);
    socket.on("user-left-presentation", handleUserLeftPresentation);
    socket.on("slide-added", handleSlideAdded);
    socket.on("slide-deleted", handleSlideDeleted);
    socket.on("role-changed", handleRoleChanged);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
      socket.off("user-left-presentation", handleUserLeftPresentation);
      socket.off("slide-added", handleSlideAdded);
      socket.off("slide-deleted", handleSlideDeleted);
      socket.off("role-changed", handleRoleChanged);
    };
  }, [dispatch]);

  const joinPresentation = useCallback(
    (presentationId, userId, nickname) => {
      socket?.emit("join-presentation", { presentationId, userId, nickname });
    },
    [socket]
  );

  const leavePresentation = useCallback(
    (presentationId, userId) => {
      socket?.emit("leave-presentation", { presentationId, userId });
    },
    [socket]
  );

  const addSlideSocket = useCallback(
    (presentationId, userId) => {
      socket?.emit("add-slide", { presentationId, userId });
    },
    [socket]
  );

  const deleteSlideSocket = useCallback(
    (presentationId, slideId, userId) => {
      socket?.emit("delete-slide", { presentationId, slideId, userId });
    },
    [socket]
  );

  const changeUserRoleSocket = (presentationId, targetUserId, role, userId) => {
    socket?.emit("change-user-role", {
      presentationId,
      targetUserId,
      role,
      userId,
    });
  };

  return {
    socket,
    joinPresentation,
    leavePresentation,
    addSlideSocket,
    deleteSlideSocket,
    changeUserRoleSocket,
  };
};
