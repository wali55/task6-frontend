import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import NicknameEntry from "./components/NicknameEntry";
import PresentationsList from "./components/PresentationsList";
import PresentationView from "./components/PresentationView";
import { useSocket } from "./hooks/useSocket";
import Layout from "./components/Layout";

function App() {
  const { socket } = useSocket();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<NicknameEntry />} />
        <Route path="/presentations" element={<Layout />}>
          <Route index element={<PresentationsList />} />
          <Route path=":id" element={<PresentationView />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
