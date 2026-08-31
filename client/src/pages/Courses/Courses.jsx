import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCourses, createCourse } from "../../services/courseService";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function showSuccess(msg) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  async function loadCourses() {
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Dersler yuklenemedi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Sayfa acildiginda dersleri yukluyoruz - standart "mount'ta veri cek"
    // deseni; loadCourses icindeki setState'ler async oldugu icin bu kural
    // burada yanlis pozitif veriyor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCourses();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await createCourse({ name, description });
      showSuccess(`✓ "${name}" dersi eklendi`);
      setName("");
      setDescription("");
      loadCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Ders eklenemedi");
    }
  }

  return (
    <div className="page-container">
      <h2>📚 My Courses</h2>
      <p className="page-intro">
        Derslerini burada yönetirsin. Aşağıdaki formdan yeni bir ders ekle; sonra
        üzerine tıklayarak içine not veya dosya ekleyip AI ile özetleyebilirsin.
      </p>

      <form onSubmit={handleSubmit} className="card form-row" style={{ marginBottom: "1.25rem" }}>
        <input
          type="text"
          placeholder="Ders adı (örn. Data Structures)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ flex: "2 1 220px" }}
        />
        <input
          type="text"
          placeholder="Açıklama (isteğe bağlı)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ flex: "2 1 220px" }}
        />
        <button type="submit">Ders Ekle</button>
      </form>

      {success && <p className="success-banner">{success}</p>}
      {error && <p className="error-text">{error}</p>}
      {loading && <p className="muted-text">Yükleniyor...</p>}

      {courses.map((course) => (
        <Link key={course._id} to={`/courses/${course._id}`} className="card card-link">
          <h3>{course.name}</h3>
          {course.description && <p className="muted-text">{course.description}</p>}
        </Link>
      ))}
      {!loading && courses.length === 0 && (
        <p className="muted-text">
          Henüz hiç dersin yok. Yukarıdaki formu doldurup "Ders Ekle"ye basarak ilk
          dersini oluşturabilirsin.
        </p>
      )}
    </div>
  );
}

export default Courses;
