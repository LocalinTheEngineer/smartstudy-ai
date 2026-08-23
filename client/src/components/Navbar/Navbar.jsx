import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="topnav">
      <span className="brand">📚 SmartStudy AI</span>
      <Link to="/">Dashboard</Link>
      <Link to="/courses">Courses</Link>
      <Link to="/quiz">Quiz</Link>
      <Link to="/study-planner">Study Planner</Link>
      <span className="topnav-right">
        {user ? (
          <>
            <span className="muted-text">Merhaba, {user.name}</span>
            <button onClick={handleLogout}>Çıkış Yap</button>
          </>
        ) : (
          <>
            <Link to="/login">Giriş Yap</Link>
            <Link to="/register">Kayıt Ol</Link>
          </>
        )}
      </span>
    </nav>
  );
}

export default Navbar;
