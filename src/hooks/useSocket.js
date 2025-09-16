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
  textBlockAdded,
  textBlockUpdated,
  textBlockDeleted,
  textBlockMoved,
  presentationStarted,
  presentationEnded,
  slideNavigated,
  setPresentationState,
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
    const handleTextBlockAdded = (data) => dispatch(textBlockAdded(data));
    const handleTextBlockUpdated = (data) => dispatch(textBlockUpdated(data));
    const handleTextBlockDeleted = (data) => dispatch(textBlockDeleted(data));
    const handleTextBlockMoved = (data) => dispatch(textBlockMoved(data));
    const handlePresentationStarted = (data) =>
      dispatch(presentationStarted(data));
    const handlePresentationEnded = () => dispatch(presentationEnded());
    const handleSlideNavigated = (data) => dispatch(slideNavigated(data));
    const handlePresentationState = (data) =>
      dispatch(setPresentationState(data));

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);
    socket.on("user-left-presentation", handleUserLeftPresentation);
    socket.on("slide-added", handleSlideAdded);
    socket.on("slide-deleted", handleSlideDeleted);
    socket.on("role-changed", handleRoleChanged);
    socket.on("text-block-added", handleTextBlockAdded);
    socket.on("text-block-updated", handleTextBlockUpdated);
    socket.on("text-block-deleted", handleTextBlockDeleted);
    socket.on("text-block-moved", handleTextBlockMoved);
    socket.on("presentation-started", handlePresentationStarted);
    socket.on("presentation-ended", handlePresentationEnded);
    socket.on("slide-navigated", handleSlideNavigated);
    socket.on("presentation-state", handlePresentationState);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
      socket.off("user-left-presentation", handleUserLeftPresentation);
      socket.off("slide-added", handleSlideAdded);
      socket.off("slide-deleted", handleSlideDeleted);
      socket.off("role-changed", handleRoleChanged);
      socket.off("text-block-added", handleTextBlockAdded);
      socket.off("text-block-updated", handleTextBlockUpdated);
      socket.off("text-block-deleted", handleTextBlockDeleted);
      socket.off("text-block-moved", handleTextBlockMoved);
      socket.off("presentation-started", handlePresentationStarted);
      socket.off("presentation-ended", handlePresentationEnded);
      socket.off("slide-navigated", handleSlideNavigated);
      socket.off("presentation-state", handlePresentationState);
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

  const addTextBlock = useCallback(
    (presentationId, slideId, textBlock) => {
      socket?.emit("add-text-block", { presentationId, slideId, textBlock });
    },
    [socket]
  );

  const updateTextBlock = useCallback(
    (presentationId, slideId, blockId, updates) => {
      socket?.emit("update-text-block", {
        presentationId,
        slideId,
        blockId,
        updates,
      });
    },
    [socket]
  );

  const deleteTextBlock = useCallback(
    (presentationId, slideId, blockId) => {
      socket?.emit("delete-text-block", { presentationId, slideId, blockId });
    },
    [socket]
  );

  const moveTextBlock = useCallback(
    (presentationId, slideId, blockId, x, y) => {
      socket?.emit("move-text-block", {
        presentationId,
        slideId,
        blockId,
        x,
        y,
      });
    },
    [socket]
  );

  const startPresentation = useCallback(
    (presentationId, userId) => {
      socket?.emit("start-presentation", { presentationId, userId });
    },
    [socket]
  );

  const endPresentation = useCallback(
    (presentationId, userId) => {
      socket?.emit("end-presentation", { presentationId, userId });
    },
    [socket]
  );

  const navigateSlide = useCallback(
    (presentationId, slideId, userId) => {
      socket?.emit("navigate-slide", { presentationId, slideId, userId });
    },
    [socket]
  );

  return {
    socket,
    joinPresentation,
    leavePresentation,
    addSlideSocket,
    deleteSlideSocket,
    changeUserRoleSocket,
    addTextBlock,
    updateTextBlock,
    deleteTextBlock,
    moveTextBlock,
    startPresentation,
    endPresentation,
    navigateSlide,
  };
};
