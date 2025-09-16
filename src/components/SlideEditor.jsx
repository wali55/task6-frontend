import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedTextBlock } from "../store/slices/presentationSlice";
import TextBlock from "./TextBlock";

const SlideEditor = ({ addTextBlock, updateTextBlock, moveTextBlock, deleteTextBlock }) => {
  const dispatch = useDispatch();
  const {
    currentPresentation,
    activeUsers,
    selectedSlide: slide,
  } = useSelector((state) => state.presentation);
  const slideRef = useRef(null);

  const { userId: currentUserId } = useSelector((state) => state.user);
  const currentUser = activeUsers.find((user) => user.userId === currentUserId);
  const canEdit =
    currentUser &&
    (currentUser.role === "CREATOR" || currentUser.role === "EDITOR");

  const handleSlideClick = (e) => {
    if (!canEdit) return;

    dispatch(setSelectedTextBlock(null));

    if (e.detail === 2) {
      const rect = slideRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - 100; 
      const y = e.clientY - rect.top - 50;

      const newTextBlock = {
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: 200,
        height: 100,
        content: "New text block",
        style: {},
      };

      if (currentPresentation) {
        addTextBlock(currentPresentation.id, slide?.id, newTextBlock);
      }
    }
  };

  const elements = slide?.content?.elements || [];

  return (
    <div
      ref={slideRef}
      className="relative w-full h-full bg-gray-50 border-2 border-gray-200 rounded-lg overflow-hidden"
      style={{ minHeight: "500px" }}
      onClick={handleSlideClick}
    >
      <div className="absolute top-4 left-4 text-lg font-semibold text-gray-600 pointer-events-none">
        {slide?.content?.title || `Slide ${slide?.order}`}
      </div>

      {elements.map(
        (element) =>
          element.type === "text" && (
            <TextBlock
              key={element.id}
              block={element}
              slideId={slide.id}
              canEdit={canEdit}
              updateTextBlock={updateTextBlock}
              moveTextBlock={moveTextBlock}
              deleteTextBlock={deleteTextBlock}
            />
          )
      )}

      {canEdit && elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
          <div className="text-center">
            <p className="text-xl mb-2">Double-click to add a text block</p>
            <p className="text-sm">Drag blocks to move them around</p>
          </div>
        </div>
      )}

      {!canEdit && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
          View Only
        </div>
      )}
    </div>
  );
};

export default SlideEditor;
