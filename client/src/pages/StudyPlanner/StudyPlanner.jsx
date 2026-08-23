import { useState } from "react";
import { generateStudyPlan } from "../../services/aiService";

function StudyPlanner() {
  const [examDate, setExamDate] = useState("");
  const [availableTime, setAvailableTime] = useState("");
  const [subjects, setSubjects] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const res = await generateStudyPlan({ examDate, availableTime, subjects: subjectList });
      setPlan(res.data.plan);
    } catch (err) {
      setError(err.response?.data?.message || "Plan olusturulamadi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      <h2>📅 Study Planner</h2>
      <p className="page-intro">
        Sınav tarihini, müsait olduğun zamanları ve çalışman gereken dersleri gir; AI
        sana gün gün, saat aralıklı bir çalışma planı hazırlasın.
      </p>

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
        <p className="field-hint">Birden fazla dersi virgülle ayırarak yaz.</p>

        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Plan oluşturuluyor... (genelde birkaç saniye, yoğun ağlarda ~1 dk sürebilir)" : "Plan Oluştur"}
        </button>
      </form>

      {plan && <div className="card plan-box">{plan}</div>}
    </div>
  );
}

export default StudyPlanner;
