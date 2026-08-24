import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getQuizStats } from "../../services/quizAttemptService";

function barColor(accuracy) {
  if (accuracy < 60) return "var(--color-danger)";
  if (accuracy < 80) return "var(--color-warning)";
  return "var(--color-success)";
}

function Stats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getQuizStats()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || "İstatistikler yüklenemedi"));
  }, []);

  return (
    <div className="page-container">
      <h2>📊 İstatistiklerim</h2>
      <p className="page-intro">
        Çözdüğün quizlere göre hangi konularda güçlü, hangilerinde zayıf olduğunu
        burada görebilirsin. Zayıf konularını Study Planner'da önceliklendirebilirsin.
      </p>

      {error && <p className="error-text">{error}</p>}

      {!stats && !error && <p className="muted-text">Yükleniyor...</p>}

      {stats && stats.totalAttempts === 0 && (
        <p className="muted-text">
          Henüz hiç quiz çözmedin. Quiz sayfasından bir quiz çözünce burada
          istatistiklerin görünmeye başlayacak.
        </p>
      )}

      {stats && stats.totalAttempts > 0 && (
        <>
          <div className="stat-tiles">
            <div className="card stat-tile">
              <div className="stat-tile-value">{stats.overallAccuracy}%</div>
              <div className="stat-tile-label">Genel doğruluk</div>
            </div>
            <div className="card stat-tile">
              <div className="stat-tile-value">{stats.totalAttempts}</div>
              <div className="stat-tile-label">Çözülen quiz</div>
            </div>
            <div className="card stat-tile">
              <div className="stat-tile-value">
                {stats.totalCorrect}/{stats.totalQuestions}
              </div>
              <div className="stat-tile-label">Doğru cevap</div>
            </div>
          </div>

          {stats.dueForReview && stats.dueForReview.length > 0 && (
            <div className="card due-review-card">
              <h3>🔁 Tekrar Zamanı</h3>
              <p className="muted-text">
                Aralıklı tekrar prensibine göre bu konuları tekrar etme zamanın geldi —
                ne kadar geç kalırsan bilgi o kadar unutulur.
              </p>
              {stats.dueForReview.map((t) => (
                <div className="due-review-row" key={t.topic}>
                  <div>
                    <span className="topic-name">{t.topic}</span>
                    <span className="muted-text due-review-meta">
                      {" "}
                      — son çalışma{" "}
                      {t.daysSinceLastAttempt === 0
                        ? "bugün"
                        : `${t.daysSinceLastAttempt} gün önce`}{" "}
                      (%{t.lastAccuracy})
                    </span>
                  </div>
                  <Link to={`/quiz?topic=${encodeURIComponent(t.topic)}`} className="due-review-btn">
                    Tekrar Et
                  </Link>
                </div>
              ))}
            </div>
          )}

          {stats.weakTopics.length > 0 && (
            <div className="weak-topics-banner">
              <strong>Zayıf konuların:</strong> {stats.weakTopics.join(", ")} — bu
              konularda %60'ın altında doğruluk oranın var. Study Planner'da bunlara
              öncelik vermeni öneririz.
            </div>
          )}

          <div className="card">
            <h3>Konu Bazlı Performans</h3>
            {stats.topics.map((t) => (
              <div className="topic-bar-row" key={t.topic} title={`${t.correct}/${t.total} doğru`}>
                <div className="topic-bar-label">
                  <span className="topic-name">
                    {t.topic} {t.accuracy < 60 && <span className="badge-weak">zayıf</span>}
                  </span>
                  <span className="topic-pct">
                    {t.accuracy}% ({t.correct}/{t.total})
                  </span>
                </div>
                <div className="topic-bar-track">
                  <div
                    className="topic-bar-fill"
                    style={{ width: `${t.accuracy}%`, background: barColor(t.accuracy) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Stats;
