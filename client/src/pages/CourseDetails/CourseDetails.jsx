import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseById } from "../../services/courseService";
import {
  getMaterials,
  addNoteMaterial,
  uploadMaterialFile,
  deleteMaterial,
} from "../../services/materialService";
import { summarizeMaterial } from "../../services/aiService";

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [file, setFile] = useState(null);
  const [fileTitle, setFileTitle] = useState("");
  const [summaries, setSummaries] = useState({});
  const [summarizingId, setSummarizingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function showSuccess(msg) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  async function loadData() {
    try {
      const [courseRes, materialsRes] = await Promise.all([
        getCourseById(id),
        getMaterials(id),
      ]);
      setCourse(courseRes.data);
      setMaterials(materialsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Veriler yuklenemedi");
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleAddNote(e) {
    e.preventDefault();
    setError("");
    try {
      await addNoteMaterial(id, { title: noteTitle, content: noteContent });
      showSuccess(`✓ "${noteTitle}" notu eklendi`);
      setNoteTitle("");
      setNoteContent("");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Not eklenemedi");
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    setError("");
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (fileTitle) formData.append("title", fileTitle);
      await uploadMaterialFile(id, formData);
      showSuccess(`✓ "${file.name}" yüklendi`);
      setFile(null);
      setFileTitle("");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Dosya yuklenemedi");
    }
  }

  async function handleDelete(materialId, title) {
    setError("");
    try {
      await deleteMaterial(materialId);
      showSuccess(`✓ "${title}" silindi`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Silinemedi");
    }
  }

  async function handleSummarize(materialId) {
    setError("");
    setSummarizingId(materialId);
    try {
      const res = await summarizeMaterial(materialId);
      setSummaries((prev) => ({ ...prev, [materialId]: res.data.summary }));
    } catch (err) {
      setError(err.response?.data?.message || "Ozetlenemedi");
    } finally {
      setSummarizingId(null);
    }
  }

  if (!course) return <p className="page-container muted-text">Yükleniyor...</p>;

  return (
    <div className="page-container">
      <p>
        <Link to="/courses">← Derslere dön</Link>
      </p>
      <h2>{course.name}</h2>
      {course.description && <p className="muted-text">{course.description}</p>}
      <p className="page-intro">
        Buraya ders notu (metin) ya da dosya (.pdf / .txt) ekleyebilirsin. Her
        materyalin yanındaki "Özetle" butonuyla AI'dan kısa bir özet isteyebilirsin —
        bu genelde birkaç saniye sürer, ağın yoğunsa 1 dakikaya kadar çıkabilir.
      </p>

      {success && <p className="success-banner">{success}</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="card">
        <h3>Not Ekle</h3>
        <p className="field-hint">Bir konuyu kendi cümlelerinle veya ders notundan kopyala-yapıştır ile ekle.</p>
        <form onSubmit={handleAddNote} className="form-stack" style={{ marginTop: "0.6rem" }}>
          <input
            type="text"
            placeholder="Başlık"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="İçerik (ders notu metni)"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            rows={4}
            required
          />
          <button type="submit">Not Ekle</button>
        </form>
      </div>

      <div className="card">
        <h3>Dosya Yükle (.pdf / .txt)</h3>
        <p className="field-hint">En fazla 10 MB, sadece .pdf ve .txt uzantılı dosyalar kabul edilir.</p>
        <form onSubmit={handleUpload} className="form-stack" style={{ marginTop: "0.6rem" }}>
          <input
            type="text"
            placeholder="Başlık (isteğe bağlı)"
            value={fileTitle}
            onChange={(e) => setFileTitle(e.target.value)}
          />
          <input type="file" accept=".pdf,.txt" onChange={(e) => setFile(e.target.files[0])} />
          <button type="submit">Dosya Yükle</button>
        </form>
      </div>

      <h3 style={{ marginTop: "1.5rem" }}>Materyaller</h3>
      {materials.map((m) => (
        <div key={m._id} className="card">
          <div className="material-header">
            <strong>{m.title}</strong>
            <span className="material-actions">
              <button onClick={() => handleSummarize(m._id)} disabled={summarizingId === m._id}>
                {summarizingId === m._id ? "Özetleniyor... (~1 dk sürebilir)" : "Özetle"}
              </button>
              <button onClick={() => handleDelete(m._id, m.title)}>Sil</button>
            </span>
          </div>
          <p className="muted-text">{m.type === "note" ? "Metin notu" : `Dosya: ${m.fileName}`}</p>
          {summaries[m._id] && <div className="summary-box">{summaries[m._id]}</div>}
        </div>
      ))}
      {materials.length === 0 && (
        <p className="muted-text">
          Henüz materyal eklemedin. Yukarıdaki formlardan birini kullanarak ilk
          notunu veya dosyanı ekleyebilirsin.
        </p>
      )}
    </div>
  );
}

export default CourseDetails;
