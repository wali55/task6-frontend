import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";

const Layout = () => {
  const navigate = useNavigate();
  const { leavePresentation } = useSocket();
  const {userId} = useSelector((state) => state.user);
  const {currentPresentation} = useSelector((state) => state.presentation);

  const handleLogout = () => {
    leavePresentation(currentPresentation?.id, userId);
    navigate("/");
  };
  const { nickname } = useSelector((state) => state.user);
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">Welcome, {nickname}!</h1>
          <button
            onClick={handleLogout}
            className="bg-red-400 hover:bg-red-500 rounded-md text-sm px-2.5 py-0.5 text-white font-semibold"
          >
            Logout
          </button>
        </div>
        <hr className="mt-6" />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
