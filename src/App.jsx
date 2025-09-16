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
  const { leavePresentation, joinPresentation, addSlideSocket, deleteSlideSocket, changeUserRoleSocket, addTextBlock, updateTextBlock, moveTextBlock, deleteTextBlock } = useSocket();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<NicknameEntry />} />
        <Route path="/presentations" element={<Layout leavePresentation={leavePresentation} />}>
          <Route index element={<PresentationsList />} />
          <Route path=":id" element={<PresentationView joinPresentation={joinPresentation} leavePresentation={leavePresentation} addSlideSocket={addSlideSocket} deleteSlideSocket={deleteSlideSocket} changeUserRoleSocket={changeUserRoleSocket} addTextBlock={addTextBlock} updateTextBlock={updateTextBlock} moveTextBlock={moveTextBlock} deleteTextBlock={deleteTextBlock} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
