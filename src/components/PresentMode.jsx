import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const PresentMode = ({ 
  slides, 
  currentSlideId, 
  userRole, 
  userId, 
  presentationId,
  navigateSlide,
  endPresentation 
}) => {
  const sortedSlides = [...slides].sort((a, b) => a.order - b.order);

  const currentIndex = sortedSlides.findIndex(slide => slide.id === currentSlideId);
  const currentSlide = sortedSlides[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (userRole !== "CREATOR") return;

      if (e.key === "ArrowLeft") {
        goToPrevSlide();
      } else if (e.key === "ArrowRight") {
        goToNextSlide();
      } else if (e.key === "Escape") {
        endPresentation(presentationId, userId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, sortedSlides, userRole, navigateSlide, endPresentation, presentationId, userId]);

  const goToPrevSlide = () => {
    if (userRole === "CREATOR" && currentIndex > 0) {
      const prevSlide = sortedSlides[currentIndex - 1];
      navigateSlide(presentationId, prevSlide.id, userId);
    }
  };

  const goToNextSlide = () => {
    if (userRole === "CREATOR" && currentIndex < sortedSlides.length - 1) {
      const nextSlide = sortedSlides[currentIndex + 1];
      navigateSlide(presentationId, nextSlide.id, userId);
    }
  };

  const handleEndPresentation = () => {
    if (userRole === "CREATOR") {
      endPresentation(presentationId, userId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {userRole === "CREATOR" && (
        <button
          onClick={handleEndPresentation}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full"
        >
          <X size={24} />
        </button>
      )}

      {userRole === "CREATOR" && (
        <>
          <button
            onClick={goToPrevSlide}
            disabled={currentIndex === 0}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full cursor-pointer"
          >
            <ChevronLeft size={32} />
          </button>
          
          <button
            onClick={goToNextSlide}
            disabled={currentIndex === sortedSlides.length - 1}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full cursor-pointer"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="max-w-6xl w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden">
          {currentSlide && (
            <div className="relative w-full h-full p-8">
              <h1 className="text-4xl font-bold mb-8 text-center">
                {currentSlide.content?.title || "Untitled Slide"}
              </h1>

              {currentSlide.content?.elements?.map((element) => (
                <div
                  key={element.id}
                  className="absolute border border-gray-200 p-2 bg-white"
                  style={{
                    left: element.x,
                    top: element.y + 80, 
                    width: element.width,
                    height: element.height,
                    ...element.style,
                  }}
                >
                  {element.content}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gray-800 text-white rounded-full">
        {currentIndex + 1} / {sortedSlides.length}
      </div>
    </div>
  );
};

export default PresentMode;
