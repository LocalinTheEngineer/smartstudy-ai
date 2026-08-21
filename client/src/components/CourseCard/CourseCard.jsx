function CourseCard({ course }) {
  return (
    <div className="course-card">
      <h3>{course?.name ?? "Ders adı"}</h3>
    </div>
  );
}

export default CourseCard;
