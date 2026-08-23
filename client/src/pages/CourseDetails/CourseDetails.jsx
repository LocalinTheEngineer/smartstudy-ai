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
    try {
      await addNoteMaterial(id, { title: noteTitle, content: noteContent });
      setNoteTitle("");
      setNoteContent("");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Not eklenemedi");
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (fileTitle) formData.append("title", fileTitle);
      await uploadMaterialFile(id, formData);
      setFile(null);
      setFileTitle("");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Dosya yuklenemedi");
    }
  }

  async function handleDelete(materialId) {
    try {
      await deleteMaterial(materialId);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Silinemedi");
    }
  }

  async function handleSummarize(materialId) {
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

  if (!course) return <p>Yükleniyor...</p>;

  return (
    <div>
      <p>
        <Link to="/courses">← Derslere dön</Link>
      </p>
      <h2>{course.name}</h2>
      {course.description && <p>{course.description}</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Not Ekle</h3>
      <form
        onSubmit={handleAddNote}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          maxWidth: 480,
          marginBottom: "1.5rem",
        }}
      >
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

      <h3>Dosya Yükle (.pdf / .txt)</h3>
      <form
        onSubmit={handleUpload}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          maxWidth: 480,
          marginBottom: "1.5rem",
        }}
      >
        <input
          type="text"
          placeholder="Başlık (isteğe bağlı)"
          value={fileTitle}
          onChange={(e) => setFileTitle(e.target.value)}
        />
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Dosya Yükle</button>
      </form>

      <h3>Materyaller</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {materials.map((m) => (
          <div
            key={m._id}
            style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "1rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <strong>{m.title}</strong>
              <span style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => handleSummarize(m._id)}
                  disabled={summarizingId === m._id}
                >
                  {summarizingId === m._id ? "Özetleniyor..." : "Özetle"}
                </button>
                <button onClick={() => handleDelete(m._id)}>Sil</button>
              </span>
            </div>
            <p style={{ color: "#666", fontSize: "0.85rem" }}>
              {m.type === "note" ? "Metin notu" : `Dosya: ${m.fileName}`}
            </p>
            {summaries[m._id] && (
              <div
                style={{
                  background: "#f5f5f5",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  marginTop: "0.5rem",
                  whiteSpace: "pre-wrap",
                }}
              >
                {summaries[m._id]}
              </div>
            )}
          </div>
        ))}
        {materials.length === 0 && <p>Henüz materyal eklemedin.</p>}
      </div>
    </div>
  );
}

export default CourseDetails;
