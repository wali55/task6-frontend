import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedSlide,
} from "../store/slices/presentationSlice";

const SlidesPanel = ({addSlideSocket, deleteSlideSocket}) => {
  const dispatch = useDispatch();
  const { slides, selectedSlide, currentPresentation, activeUsers } =
    useSelector((state) => state.presentation);
  const {userId} = useSelector((state) => state.user);

  const currentUser = activeUsers.find((user) => user.userId === userId);
  const isCreator = currentUser?.role === "CREATOR";
  const isEditor = currentUser?.role === "EDITOR";

  const handleAddSlide = () => {
    addSlideSocket(currentPresentation.id, userId);
  };

  const handleDeleteSlide = (slideId) => {
    if (slides.length <= 1) return;
    deleteSlideSocket(currentPresentation.id, slideId, userId);
  };

  const handleSlideSelect = (slide) => {
    dispatch(setSelectedSlide(slide));
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Slides</h3>
        {(isCreator || isEditor) && (
          <button
            onClick={handleAddSlide}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Add
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            onClick={() => handleSlideSelect(slide)}
            className={`p-3 border rounded cursor-pointer group ${
              selectedSlide?.id === slide.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-1">
                  Slide {index + 1}
                </div>
                <div className="bg-gray-100 rounded aspect-video mb-2 flex items-center justify-center">
                  <span className="text-xs text-gray-400">Preview</span>
                </div>
                <div className="text-sm font-medium truncate">
                  {slide.content?.title || `Slide ${index + 1}`}
                </div>
              </div>

              {(isCreator || isEditor) && slides.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSlide(slide.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlidesPanel;
