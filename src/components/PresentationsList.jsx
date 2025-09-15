import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import {
  createPresentation,
  fetchPresentations,
  setCurrentPresentation,
  setShowCreateForm,
} from "../store/slices/presentationSlice";

const PresentationsList = () => {
  const [title, setTitle] = useState("");
  const { presentations, loading, showCreateForm } = useSelector(
    (state) => state.presentation
  );

  const dispatch = useDispatch();
  const { nickname, userId } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPresentations());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !nickname || !userId) return;

    try {
      const result = await dispatch(
        createPresentation({ title, creatorId: userId })
      );

      if (result) {
        dispatch(setCurrentPresentation(result.payload));
        dispatch(setShowCreateForm(false));
        dispatch(fetchPresentations());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleJoin = (presentation) => {
    if (!nickname || !userId) return;
    dispatch(setCurrentPresentation(presentation));
    navigate(`/presentations/${presentation?.id}`);
  };

  

  if (loading) return <LoadingSpinner />;

  return (
    <>
        <div className="flex justify-between my-6">
          <p className="text-gray-600 text-lg font-semibold">
            All Presentations
          </p>
          <button
            onClick={() => dispatch(setShowCreateForm(true))}
            className="bg-blue-500 text-white text-sm px-2.5 py-2 rounded hover:bg-blue-600 font-semibold"
          >
            Create Presentation
          </button>
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
              <button
                onClick={() => dispatch(setShowCreateForm(false))}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              <h2 className="text-xl font-semibold mb-4">
                Create New Presentation
              </h2>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Presentation title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border rounded px-3 py-2"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  Create
                </button>
              </form>
            </div>
          </div>
        )}

        {presentations.length < 1 ? (
          <p className="text-gray-500">No presentations yet.</p>
        ) : (
          <div className="space-y-4">
            {presentations.map((presentation) => (
              <div
                key={presentation.id}
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <h3
                    onClick={() => handleJoin(presentation)}
                    className="font-semibold text-blue-400 hover:text-blue-500 underline cursor-pointer"
                  >
                    {presentation.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Created by {presentation.creator.nickname} •{" "}
                    {new Date(presentation.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        </>
  );
};

export default PresentationsList;
