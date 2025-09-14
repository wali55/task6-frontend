import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSinglePresentation } from "../store/slices/presentationSlice";
import { useSocket } from "../hooks/useSocket";

const PresentationView = () => {
  const { currentPresentation, activeUsers, isConnected } = useSelector(
    (state) => state.presentation
  );
  const { userId } = useSelector(
    (state) => state.user
  );
  const { id } = useParams();
  const dispatch = useDispatch();
  const { socket, leavePresentation } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      return;
    }
    dispatch(fetchSinglePresentation(id));
  }, [id]);

  useEffect(() => {
    return () => {
      leavePresentation(id, userId);
    };
  }, [id, userId]);

  if (!currentPresentation || !socket) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{currentPresentation.title}</h1>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-sm">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
          <button
            className="bg-gray-600 text-white rounded-md px-2.5 py-1 text-sm"
            onClick={() => navigate("/presentations")}
          >
            Back
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-semibold mb-2">
          Active Users ({activeUsers?.length})
        </h2>
        <div className="flex flex-wrap gap-2">
          {activeUsers.map((user, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-sm ${
                user.role === "creator"
                  ? "bg-purple-100 text-purple-800"
                  : user.role === "editor"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {user.nickname} ({user.role})
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow min-h-96 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <h3 className="text-xl font-semibold mb-2">Presentation Content</h3>
          <p>This is where the presentation content will be displayed</p>
        </div>
      </div>
    </div>
  );
};

export default PresentationView;
