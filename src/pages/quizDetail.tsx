import { useState, useEffect } from "react";
import { Button, Container, Row, Spinner, Form, Stack } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { deleteQuiz, getQuizById, updateQuiz } from "../redux/axios";
import type { Quiz } from "../types/quizType";

export default function QuizDetail() {
  const { id } = useParams<{ id: string }>();
  const [quizForm, setQuizForm] = useState<Quiz | null>(null);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [mode, setMode] = useState<"view" | "editQuiz">("view");

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getQuizById(id!);
      setQuizForm({
        _id: data._id,
        title: data.title,
        description: data.description,
      });
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleEditQuiz = async (title: string, description: string) => {
    if (!quizForm) return;
    try {
      const updatedQuiz = await updateQuiz(quizForm._id!, {
        title,
        description,
      });
      console.log("Quiz updated successfully:", updatedQuiz);
      fetchQuizzes();
    } catch (err) {
      console.error("Error updating quiz:", err);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await deleteQuiz(quizId);
        // Navigate back to quiz list after successful deletion
        navigate("/quiz");
      } catch (err) {
        console.error("Error deleting quiz:", err);
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
            <h1>Quiz Details</h1>
          </div>
          <div className="p-2 ms-auto">
            <Button
              variant="primary"
              onClick={() => handleDeleteQuiz(quizForm?._id || "")}
            >
              Delete Quiz
            </Button>
          </div>
        </Stack>
      </Row>
      <Row>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditQuiz(quizForm?.title || "", quizForm?.description || "");
            setMode("view");
          }}
        >
          <Form.Group className="mb-3" controlId="formQuizTitle">
            <Form.Label>Quiz Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter quiz title"
              value={quizForm?.title}
              onChange={(e) => {
                setQuizForm((prev) =>
                  prev ? { ...prev, title: e.target.value } : null,
                );
              }}
              readOnly={!(mode === "editQuiz")}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formQuizDescription">
            <Form.Label>Quiz Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter quiz description"
              value={quizForm?.description}
              onChange={(e) => {
                setQuizForm((prev) =>
                  prev ? { ...prev, description: e.target.value } : null,
                );
              }}
              readOnly={!(mode === "editQuiz")}
            />
          </Form.Group>
          {mode === "view" ? (
            <Button
              variant="primary"
              className="m-2"
              onClick={() => {
                setMode("editQuiz");
              }}
            >
              Edit Quiz
            </Button>
          ) : (
            <>
              <Button variant="primary" className="m-2" type="submit">
                Save Quiz
              </Button>
              <Button className="m-2" onClick={() => setMode("view")}>
                Cancel
              </Button>
            </>
          )}
          <Button className="m-2" onClick={() => navigate(`/quiz/${quizForm?._id}/questions`)}>
            View Questions of Quiz
          </Button>
        </Form>
      </Row>
    </Container>
  );
}
