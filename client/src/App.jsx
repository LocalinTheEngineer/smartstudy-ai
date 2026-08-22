import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Courses from "./pages/Courses/Courses";
import CourseDetails from "./pages/CourseDetails/CourseDetails";
import Quiz from "./pages/Quiz/Quiz";
import StudyPlanner from "./pages/StudyPlanner/StudyPlanner";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <Link to="/">Dashboard</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/quiz">Quiz</Link>
        <Link to="/study-planner">Study Planner</Link>
      </nav>
      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/study-planner" element={<StudyPlanner />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
