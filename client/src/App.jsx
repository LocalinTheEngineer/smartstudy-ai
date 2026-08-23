import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import Courses from "./pages/Courses/Courses";
import CourseDetails from "./pages/CourseDetails/CourseDetails";
import Quiz from "./pages/Quiz/Quiz";
import StudyPlanner from "./pages/StudyPlanner/StudyPlanner";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { useAuth } from "./hooks/useAuth";
import "./App.css";

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      <Navbar />
      <nav
        style={{
          display: "flex",
          gap: "1rem",
          padding: "1rem",
          alignItems: "center",
        }}
      >
        <Link to="/">Dashboard</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/quiz">Quiz</Link>
        <Link to="/study-planner">Study Planner</Link>
        <span style={{ marginLeft: "auto" }}>
          {user ? (
            <>
              <span style={{ marginRight: "1rem" }}>Merhaba, {user.name}</span>
              <button onClick={handleLogout}>Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link to="/login">Giriş Yap</Link> | <Link to="/register">Kayıt Ol</Link>
            </>
          )}
        </span>
      </nav>
      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study-planner"
            element={
              <ProtectedRoute>
                <StudyPlanner />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
