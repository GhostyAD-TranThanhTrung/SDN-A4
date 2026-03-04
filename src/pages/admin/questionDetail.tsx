import { useState, useEffect } from "react";
import { Button, Container, Row, Spinner, Form, Stack } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { deleteQuestion, getQuestionById } from "../../redux/axios";
import type { Question } from "../../types/questionType";

export default function QuestionDetail() {
  const { quizId, questionId } = useParams<{
    quizId: string;
    questionId: string;
  }>();
  const [questionForm, setQuestionForm] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const data = await getQuestionById(quizId!, questionId!);
      setQuestionForm(data);
    } catch (err) {
      console.error("Error fetching question:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [quizId, questionId]);

  const handleDeleteQuestion = async () => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(quizId!, questionId!);
        navigate(`/quiz/${quizId}/questions`);
      } catch (err) {
        console.error("Error deleting question:", err);
        alert("Failed to delete question. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <Container fluid className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="justify-content-between mt-5">
        <Stack direction="horizontal" gap={3}>
          <div className="p-2">
            <h1>Question Details</h1>
          </div>
          <div className="p-2 ms-auto">
            <Button
              variant="secondary"
              className="me-2"
              onClick={() => navigate(`/quiz/${quizId}/questions`)}
            >
              Back to Questions
            </Button>
            <Button
              variant="primary"
              className="me-2"
              onClick={() =>
                navigate(`/quiz/${quizId}/questions/${questionId}/edit`)
              }
            >
              Edit Question
            </Button>
            <Button variant="danger" onClick={handleDeleteQuestion}>
              Delete Question
            </Button>
          </div>
        </Stack>
      </Row>
      <Row>
        <div>
          <Form.Group className="mb-3" controlId="formQuestionText">
            <Form.Label>Question Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={questionForm?.text || ""}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Answer Options</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={questionForm?.options.join(", ") || ""}
              readOnly
            />
            <Form.Text className="text-muted">
              Options are separated by commas
            </Form.Text>
            {questionForm && questionForm.options.length > 0 && (
              <div className="mt-2">
                <Form.Label>Correct Answer:</Form.Label>
                <div className="ps-3">
                  <span className="text-success fw-bold">
                    {questionForm.correctAnswerIndex + 1}.{" "}
                    {questionForm.options[questionForm.correctAnswerIndex]}
                  </span>
                </div>
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Keywords</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={questionForm?.keywords.join(", ") || ""}
              readOnly
            />
          </Form.Group>
        </div>
      </Row>
    </Container>
  );
}
