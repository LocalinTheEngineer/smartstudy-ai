function QuizQuestion({ question }) {
  return (
    <div className="quiz-question">
      <p>{question?.text ?? "Soru metni"}</p>
    </div>
  );
}

export default QuizQuestion;
