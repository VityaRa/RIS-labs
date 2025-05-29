import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProjectDetail } from "./pages/ProjectDetail";
import { ProjectsList } from "./pages/ProjectList";
import "./App.css";
import { StatusProvider } from "./contexts/StatusContext";

function App() {
  return (
    <StatusProvider>
      <Router>
        <Routes>
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/" element={<ProjectsList />} />
        </Routes>
      </Router>
    </StatusProvider>
  );
}

export default App;
