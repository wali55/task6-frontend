import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSinglePresentation } from '../store/slices/presentationSlice';
import SlidesPanel from '../components/SlidesPanel';
import SlideWorkspace from '../components/SlideWorkspace';
import UsersPanel from '../components/UsersPanel';

const PresentationView = ({joinPresentation, leavePresentation, addSlideSocket, deleteSlideSocket, changeUserRoleSocket}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentPresentation, loading, error } = useSelector(state => state.presentation);
  const { userId, nickname } = useSelector(state => state.user);
  const navigate = useNavigate();
  
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
      <button
            className="bg-gray-600 text-white rounded-md px-2.5 py-1 text-sm my-4"
            onClick={() => navigate("/presentations")}
          >
            Back
          </button>
          <div className="flex">
      <SlidesPanel addSlideSocket={addSlideSocket} deleteSlideSocket={deleteSlideSocket} />
      <SlideWorkspace />
      <UsersPanel changeUserRoleSocket={changeUserRoleSocket} />
      </div>
    </div>
  );
};

export default PresentationView;