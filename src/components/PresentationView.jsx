import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSinglePresentation } from "../store/slices/presentationSlice";
import SlidesPanel from "../components/SlidesPanel";
import UsersPanel from "../components/UsersPanel";
import SlideEditor from "./SlideEditor";
import PresentMode from "./PresentMode";
import { Play, Square } from "lucide-react";

const PresentationView = ({
  joinPresentation,
  leavePresentation,
  addSlideSocket,
  deleteSlideSocket,
  changeUserRoleSocket,
  addTextBlock,
  updateTextBlock,
  moveTextBlock,
  deleteTextBlock,
  startPresentation,
  endPresentation,
  navigateSlide,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentPresentation, loading, error, activeUsers, isPresentMode, slides, currentSlideId } =
    useSelector((state) => state.presentation);
  const { userId, nickname } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const currentUser = activeUsers.find((user) => user.userId === userId);
  const userRole = currentUser?.role;

  useEffect(() => {
    if (id) {
      dispatch(fetchSinglePresentation(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentPresentation?.id && userId && nickname) {
      joinPresentation(currentPresentation.id, userId, nickname);
    }

    return () => {
      if (currentPresentation?.id && userId) {
        leavePresentation(currentPresentation.id, userId);
      }
    };
  }, [currentPresentation?.id, userId, nickname]);

  const handleStartPresentation = () => {
    startPresentation(currentPresentation?.id, userId);
  };

  const handleEndPresentation = () => {
    endPresentation(currentPresentation?.id, userId);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading presentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!currentPresentation) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Presentation not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50">
      <div className="flex justify-between">
        <button
          className="bg-gray-600 text-white rounded-md px-2.5 py-1 text-sm my-4"
          onClick={() => navigate("/presentations")}
        >
          Back
        </button>
        {userRole === "CREATOR" && (
          <button
            onClick={
              isPresentMode ? handleEndPresentation : handleStartPresentation
            }
            className={`px-2.5 py-1 text-sm my-4 rounded-lg font-medium flex items-center gap-2 ${
              isPresentMode
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isPresentMode ? <Square size={16} /> : <Play size={16} />}
            {isPresentMode ? "End Present" : "Present"}
          </button>
        )}
        {isPresentMode && (
          <PresentMode
            slides={slides}
            currentSlideId={currentSlideId}
            userRole={userRole}
            userId={userId}
            presentationId={currentPresentation?.id}
            navigateSlide={navigateSlide}
            endPresentation={endPresentation}
          />
        )}
      </div>
      <div className="flex">
        <SlidesPanel
          addSlideSocket={addSlideSocket}
          deleteSlideSocket={deleteSlideSocket}
        />
        <SlideEditor
          addTextBlock={addTextBlock}
          updateTextBlock={updateTextBlock}
          moveTextBlock={moveTextBlock}
          deleteTextBlock={deleteTextBlock}
        />
        <UsersPanel changeUserRoleSocket={changeUserRoleSocket} />
      </div>
    </div>
  );
};

export default PresentationView;
