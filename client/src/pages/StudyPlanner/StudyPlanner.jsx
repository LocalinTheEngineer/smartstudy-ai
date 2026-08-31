import { useState, useEffect, useRef } from "react";
import { generateStudyPlan } from "../../services/aiService";
import { getQuizStats } from "../../services/quizAttemptService";
import MarkdownText from "../../components/MarkdownText/MarkdownText";

function StudyPlanner() {
  const [examDate, setExamDate] = useState("");
  const [availableTime, setAvailableTime] = useState("");
  const [subjects, setSubjects] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weakTopics, setWeakTopics] = useState([]);
  const [topicStats, setTopicStats] = useState([]);
  const autoFilledRef = useRef(false);

  useEffect(() => {
    getQuizStats()
      .then((res) => {
        setWeakTopics(res.data.weakTopics || []);
        setTopicStats(res.data.topics || []);
      })
      .catch(() => {
        // istatistik yoksa/erisilemezse sessizce gec
      });
  }, []);

  // Zayif konular yuklendiginde, ders alani hala bossa otomatik olarak
  // oraya eklenir - kullanicinin ayrica bir butona basmasina gerek kalmaz.
  useEffect(() => {
    if (autoFilledRef.current) return;
    if (weakTopics.length === 0) return;
    if (subjects.trim() !== "") return;
    // Zayif konular API'den asenkron geldigi icin (ve sadece bir kez, ref ile
    // korunarak) burada bilerek senkron bir setState yapiyoruz.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubjects(weakTopics.join(", "));
    autoFilledRef.current = true;
  }, [weakTopics, subjects]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setPlan("");
    try {
      const subjectList = subjects
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await generateStudyPlan({
        examDate,
        availableTime,
        subjects: subjectList,
        topicPerformance: topicStats,
      });
      setPlan(res.data.plan);
    } catch (err) {
      setError(err.response?.data?.message || "Plan olusturulamadi");
    } finally {
      setLoading(false);
    }
  }

  const weakTopicDetails = weakTopics.map((topic) => {
    const stat = topicStats.find((t) => t.topic === topic);
    return stat ? `${topic} (%${stat.accuracy})` : topic;
  });

  return (
    <div className="page-container">
      <h2>📅 Study Planner</h2>
      <p className="page-intro">
        Sınav tarihini, müsait olduğun zamanları ve çalışman gereken dersleri gir; AI
        sana gün gün, saat aralıklı bir çalışma planı hazırlasın.
      </p>

      {weakTopics.length > 0 && (
        <div className="weak-topics-banner">
          <strong>Zayıf konuların:</strong> {weakTopicDetails.join(", ")} — quiz sonuçlarına göre
          bu konularda %60'ın altında doğruluk oranın var. Bu konular aşağıdaki derslere otomatik
          olarak eklendi ve oluşturulacak planda bu konulara normalden daha fazla zaman
          ayrılacak.
        </div>
      )}

      <form onSubmit={handleSubmit} className="card form-stack">
        <label>Sınav Tarihi</label>
        <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} required />

        <label>Müsait Zamanların</label>
        <textarea
          placeholder="Örn: Pazartesi 2 saat, Salı 3 saat, Çarşamba 1 saat"
          value={availableTime}
          onChange={(e) => setAvailableTime(e.target.value)}
          rows={3}
          required
        />
        <p className="field-hint">Gün ve süreyi serbest metin olarak yazabilirsin, format önemli değil.</p>

        <label>Çalışılacak Dersler</label>
        <input
          type="text"
          placeholder="Örn: Data Structures, Database, Calculus"
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
          required
        />
        <p className="field-hint">
          Birden fazla dersi virgülle ayırarak yaz. Zayıf konuların varsa otomatik eklenir, istersen
          düzenleyebilirsin.
        </p>

        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Plan oluşturuluyor... (genelde birkaç saniye, yoğun ağlarda ~1 dk sürebilir)" : "Plan Oluştur"}
        </button>
      </form>

      {plan && (
        <div className="card plan-box">
          <MarkdownText>{plan}</MarkdownText>
        </div>
      )}
    </div>
  );
}

export default StudyPlanner;
