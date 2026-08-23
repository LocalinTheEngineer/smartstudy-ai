import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCourses, createCourse } from "../../services/courseService";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    loadCourses();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createCourse({ name, description });
      setName("");
      setDescription("");
      loadCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Ders eklenemedi");
    }
  }

  return (
    <div>
      <h2>My Courses</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}
      >
        <input
          type="text"
          placeholder="Ders adı (örn. Data Structures)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Açıklama (isteğe bağlı)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Ders Ekle</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Yükleniyor...</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {courses.map((course) => (
          <Link
            key={course._id}
            to={`/courses/${course._id}`}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <h3 style={{ margin: 0 }}>{course.name}</h3>
            {course.description && (
              <p style={{ margin: "0.25rem 0 0" }}>{course.description}</p>
            )}
          </Link>
        ))}
        {!loading && courses.length === 0 && <p>Henüz ders eklemedin.</p>}
      </div>
    </div>
  );
}

export default Courses;
