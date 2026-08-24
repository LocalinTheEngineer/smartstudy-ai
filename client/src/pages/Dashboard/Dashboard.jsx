import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getQuizStats } from "../../services/quizAttemptService";

function Dashboard() {
  const { user } = useAuth();
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    getQuizStats()
      .then((res) => setDueCount((res.data.dueForReview || []).length))
      .catch(() => {
        // istatistik yoksa/erisilemezse sessizce gec
      });
  }, []);

  return (
    <div className="page-container">
      <h2>Merhaba, {user?.name} 👋</h2>
      <p className="muted-text">SmartStudy AI'a hoş geldin. Ne yapmak istersin?</p>

      {dueCount > 0 && (
        <Link to="/stats" className="due-review-alert">
          🔁 {dueCount} konunun tekrar zamanı geldi — İstatistiklerim sayfasında gör
        </Link>
      )}

      <div className="dashboard-grid">
        <Link to="/courses" className="card card-link dashboard-tile">
          <h3>📚 Derslerim</h3>
          <p className="muted-text">Ders ekle, materyal yükle, AI ile özetle</p>
        </Link>
        <Link to="/quiz" className="card card-link dashboard-tile">
          <h3>❓ Quiz</h3>
          <p className="muted-text">Herhangi bir konudan quiz üret</p>
        </Link>
        <Link to="/study-planner" className="card card-link dashboard-tile">
          <h3>📅 Study Planner</h3>
          <p className="muted-text">Sınav tarihine göre çalışma planı oluştur</p>
        </Link>
        <Link to="/stats" className="card card-link dashboard-tile">
          <h3>📊 İstatistiklerim</h3>
          <p className="muted-text">Konu bazlı performansını ve zayıf konularını gör</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
