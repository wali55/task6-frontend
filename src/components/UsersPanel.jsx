import { useSelector, useDispatch } from "react-redux";
import { changeUserRole } from "../store/slices/presentationSlice";

const UsersPanel = ({changeUserRoleSocket}) => {
  const dispatch = useDispatch();
  const { activeUsers, currentPresentation } = useSelector(
    (state) => state.presentation
  );
  const {userId} = useSelector(
    (state) => state.user
  );

  const currentUser = activeUsers.find((user) => user.userId === userId);
  const isCreator = currentUser?.role === "CREATOR";

  const handleRoleChange = (targetUserId, newRole) => {
    if (!isCreator || targetUserId === userId) return;
    changeUserRoleSocket(currentPresentation.id, targetUserId, newRole, userId);
    dispatch(
      changeUserRole({
        presentationId: currentPresentation.id,
        targetUserId,
        role: newRole,
        userId,
      })
    );
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "CREATOR":
        return "bg-purple-100 text-purple-800";
      case "EDITOR":
        return "bg-blue-100 text-blue-800";
      case "VIEWER":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-64 bg-white border-l border-gray-200 p-4">
      <h3 className="font-semibold mb-4">Users ({activeUsers.length})</h3>
      <div className="space-y-2">
        {activeUsers.map((user) => (
          <div
            key={user.userId}
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.nickname[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium">{user.nickname}</span>
            </div>

            <div className="flex items-center space-x-1">
              <span
                className={`px-2 py-1 rounded-full text-xs ${getRoleColor(
                  user.role
                )}`}
              >
                {user.role}
              </span>

              {isCreator && user.userId !== userId && (
                <select
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(user.userId, e.target.value)
                  }
                  className="text-xs border border-gray-300 rounded px-1 py-0.5 ml-1"
                >
                  <option value="EDITOR">Editor</option>
                  <option value="VIEWER">Viewer</option>
                </select>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPanel;
