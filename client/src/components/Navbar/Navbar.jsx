import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
      <Link to="/stats">İstatistikler</Link>
      <span className="topnav-right">
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
          aria-label={theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
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
