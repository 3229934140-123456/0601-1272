import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Lobby from "@/pages/Lobby";
import Preparation from "@/pages/Preparation";
import CompetitionArena from "@/pages/CompetitionArena";
import JudgePanel from "@/pages/JudgePanel";
import ReviewRoom from "@/pages/ReviewRoom";
import Growth from "@/pages/Growth";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/lobby" replace />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/preparation" element={<Preparation />} />
        <Route path="/competition" element={<CompetitionArena />} />
        <Route path="/judge" element={<JudgePanel />} />
        <Route path="/review" element={<ReviewRoom />} />
        <Route path="/growth" element={<Growth />} />
      </Routes>
    </Router>
  );
}
