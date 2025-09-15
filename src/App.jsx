import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import NicknameEntry from "./components/NicknameEntry";
import PresentationsList from "./components/PresentationsList";
import PresentationView from "./components/PresentationView";
import { useSocket } from "./hooks/useSocket";
import Layout from "./components/Layout";

function App() {
  const { leavePresentation, joinPresentation, addSlideSocket, deleteSlideSocket, changeUserRoleSocket } = useSocket();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<NicknameEntry />} />
        <Route path="/presentations" element={<Layout leavePresentation={leavePresentation} />}>
          <Route index element={<PresentationsList />} />
          <Route path=":id" element={<PresentationView joinPresentation={joinPresentation} leavePresentation={leavePresentation} addSlideSocket={addSlideSocket} deleteSlideSocket={deleteSlideSocket} changeUserRoleSocket={changeUserRoleSocket} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
