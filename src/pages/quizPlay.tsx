import { useEffect, useState } from "react";
import { Form, Container, Spinner, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchQuizWithQuestions,
  resetQuiz,
  getFinalScore,
  recordAnswer,
  getNextQuestion,
  getPreviousQuestion,
} from "../redux/quizSlice";

export default function QuizPlay() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const {
    quiz,
    questions,
    currentQuestionIndex,
    loading,
    scoreFinal,
    questionRecord,
  } = useAppSelector((state) => state.quiz);

  useEffect(() => {
    if (id) {
      dispatch(fetchQuizWithQuestions(id));
    }
    return () => {
      dispatch(resetQuiz());
    };
  }, [id, dispatch]);

  // Update selected answer when question changes
  useEffect(() => {
    if (currentQuestionIndex !== null && questionRecord) {
      const currentRecord = questionRecord[currentQuestionIndex];
      setSelectedAnswer(currentRecord?.answeredPickedIndex ?? null);
    }
  }, [currentQuestionIndex, questionRecord]);

  const handleAnswerChange = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (currentQuestionIndex !== null) {
      dispatch(
        recordAnswer({
          questionIndex: currentQuestionIndex,
          pickedIndex: answerIndex,
        }),
      );
    }
  };

  const handlePreviousQuestion = () => {
    if (selectedAnswer !== null && currentQuestionIndex !== null) {
      dispatch(
        recordAnswer({
          questionIndex: currentQuestionIndex,
          pickedIndex: selectedAnswer,
        }),
      );
    }
    dispatch(getPreviousQuestion());
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null && currentQuestionIndex !== null) {
      dispatch(
        recordAnswer({
          questionIndex: currentQuestionIndex,
          pickedIndex: selectedAnswer,
        }),
      );
    }
    dispatch(getNextQuestion());
  };

  const handleSubmitQuiz = () => {
    dispatch(getFinalScore());
    setIsQuizCompleted(true);
  };

  const handleBackToList = () => {
    navigate("/quiz");
  };

  // Check if current question is the last one
  const isLastQuestion =
    currentQuestionIndex !== null &&
    questions &&
    currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading quiz...</span>
        </Spinner>
      </Container>
    );
  }

  if (isQuizCompleted) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="success">
          <Alert.Heading>Quiz Completed!</Alert.Heading>
          <hr />
          <h2>
            Your Final Score: {scoreFinal} / {questions?.length || 0}
          </h2>
          <p className="mb-0">
            You scored {scoreFinal} out of {questions?.length || 0} questions
            correctly!
          </p>
        </Alert>

        <div className="mt-4">
          <Button variant="primary" size="lg" onClick={handleBackToList}>
            Back to Quiz List
          </Button>
        </div>
      </Container>
    );
  }

  if (!quiz || !questions || questions.length === 0) {
    return (
      <Container className="text-center mt-5">
        <h2>Quiz not found or empty</h2>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Form>
        <h1>Quiz Play: {quiz.title}</h1>
        <p className="lead">{quiz.description}</p>

        {currentQuestionIndex !== null && questions[currentQuestionIndex] && (
          <div className="mt-4">
            <h3>
              Question {currentQuestionIndex + 1} of {questions.length}
            </h3>
            <p className="fs-5">{questions[currentQuestionIndex].text}</p>

            {/* Question options and answer handling */}
            <div className="mt-3">
              {questions[currentQuestionIndex].options?.map((option, index) => (
                <div key={index} className="mb-2">
                  <Form.Check
                    type="radio"
                    id={`option-${index}`}
                    label={option}
                    name="quizOption"
                    value={index}
                    checked={selectedAnswer === index}
                    onChange={() => handleAnswerChange(index)}
                  />
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="mt-4">
              <Button
                variant="secondary"
                className="me-2"
                onClick={handlePreviousQuestion}
                disabled={isFirstQuestion}
              >
                Previous
              </Button>
              {isLastQuestion ? (
                <Button variant="success" onClick={handleSubmitQuiz}>
                  Submit Quiz
                </Button>
              ) : (
                <Button variant="primary" onClick={handleNextQuestion}>
                  Next
                </Button>
              )}
            </div>
          </div>
        )}
      </Form>
    </Container>
  );
}
