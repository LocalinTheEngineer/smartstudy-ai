import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { generateQuiz } from "../../services/aiService";
import { saveQuizAttempt } from "../../services/quizAttemptService";

function Quiz() {
  const [searchParams] = useSearchParams();
  const [topic, setTopic] = useState(searchParams.get("topic") || "");
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState("orta");
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);
    setAnswers({});
    try {
      const res = await generateQuiz(topic, Number(questionCount), difficulty);
      setQuiz(res.data.quiz);
    } catch (err) {
      setError(err.response?.data?.message || "Quiz olusturulamadi");
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(index, option) {
    setAnswers((prev) => ({ ...prev, [index]: option }));
  }

  async function handleSubmitAnswers(e) {
    e.preventDefault();
    let correct = 0;
    const questionResults = quiz.map((q, i) => {
      const isCorrect = answers[i] === q.answer;
      if (isCorrect) correct += 1;
      return {
        question: q.question,
        correctAnswer: q.answer,
        userAnswer: answers[i] || "",
        isCorrect,
      };
    });

    setResult({ correct, total: quiz.length });

    // Sonucu istatistikler icin kaydet (basarisiz olsa da quiz sonucunu gostermeye devam ederiz)
    try {
      await saveQuizAttempt({
        topic,
        difficulty,
        score: correct,
        total: quiz.length,
        questions: questionResults,
      });
    } catch {
      // istatistik kaydi basarisiz olsa bile kullaniciyi engellemeyelim
    }
  }

  function handleReset() {
    setQuiz(null);
    setAnswers({});
    setResult(null);
    setTopic("");
  }

  const unanswered = quiz ? quiz.length - Object.keys(answers).length : 0;

  return (
    <div className="page-container">
      <h2>❓ Quiz</h2>

      {!quiz && (
        <>
          <p className="page-intro">
            Bir konu yaz, AI senin için çoktan seçmeli bir quiz hazırlasın. Cevapladıktan
            sonra kaç doğru yaptığını göreceksin — sonuçların İstatistikler sayfasında da
            konu bazlı olarak birikir.
          </p>
          <form onSubmit={handleGenerate} className="card form-stack">
            <input
              type="text"
              placeholder="Konu (örn. Bağlı Listeler)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
            <div className="form-row">
              <div>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                  style={{ width: 100 }}
                />
                <p className="field-hint">Soru sayısı</p>
              </div>
              <div>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="kolay">Kolay</option>
                  <option value="orta">Orta</option>
                  <option value="zor">Zor</option>
                </select>
                <p className="field-hint">Zorluk</p>
              </div>
            </div>
            {error && <p className="error-text">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Oluşturuluyor... (genelde birkaç saniye, yoğun ağlarda ~1 dk sürebilir)" : "Quiz Oluştur"}
            </button>
          </form>
        </>
      )}

      {quiz && !result && (
        <form onSubmit={handleSubmitAnswers}>
          <p className="page-intro">
            Her soruda bir şık seç, sonra en alttaki "Cevapları Gönder" butonuna bas.
            {unanswered > 0 && ` (${unanswered} soru henüz cevaplanmadı, boş bırakabilirsin.)`}
          </p>
          {quiz.map((q, i) => (
            <div className="card" key={i}>
              <p>
                <strong>
                  {i + 1}. {q.question}
                </strong>
              </p>
              {Object.entries(q.options).map(([key, value]) => (
                <label key={key} className="quiz-option">
                  <input
                    type="radio"
                    name={`q-${i}`}
                    checked={answers[i] === key}
                    onChange={() => selectAnswer(i, key)}
                  />
                  {key}) {value}
                </label>
              ))}
            </div>
          ))}
          <button type="submit" style={{ marginTop: "0.5rem" }}>
            Cevapları Gönder
          </button>
        </form>
      )}

      {result && (
        <div className="card">
          <h3>
            Sonuç: {result.correct} / {result.total}
          </h3>
          <p className="muted-text">
            {result.correct === result.total
              ? "Tebrikler, hepsini doğru yaptın! 🎉"
              : "Yanlış yaptığın soruları aşağıda görebilir, doğru cevaplarını inceleyebilirsin. Sonuç İstatistikler sayfasına da kaydedildi."}
          </p>
          {quiz.map((q, i) => (
            <div key={i} style={{ marginTop: "0.75rem" }}>
              <p>
                <strong>
                  {i + 1}. {q.question}
                </strong>
              </p>
              <p className={answers[i] === q.answer ? "correct-text" : "wrong-text"}>
                Senin cevabın: {answers[i] || "(boş)"}{" "}
                {answers[i] === q.answer ? "✓" : `✗ (Doğrusu: ${q.answer})`}
              </p>
            </div>
          ))}
          <button onClick={handleReset} style={{ marginTop: "0.5rem" }}>
            Yeni Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
