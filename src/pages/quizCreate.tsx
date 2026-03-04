import { useState } from "react";
import { Button, Container, Row, Form, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createQuiz } from "../redux/axios";
import type { CreateQuizDto } from "../types/quizType";

export default function QuizCreate() {
  const [quizForm, setQuizForm] = useState<CreateQuizDto>({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizForm.title.trim() || !quizForm.description.trim()) {
      alert("Please fill in both title and description");
      return;
    }

    try {
      setLoading(true);
      const newQuiz = await createQuiz(quizForm);
      console.log("Quiz created successfully:", newQuiz);
      // Navigate to the new quiz detail page
      navigate(`/quiz`);
    } catch (err) {
      console.error("Error creating quiz:", err);
      alert("Failed to create quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row className="justify-content-between mt-5">
        <Stack direction="horizontal" gap={3}>
          <div className="p-2">
            <h1>Create New Quiz</h1>
          </div>
          <div className="p-2 ms-auto">
            <Button variant="secondary" onClick={() => navigate("/quiz")}>
              Back to Quiz List
            </Button>
          </div>
        </Stack>
      </Row>
      <Row>
        <Form onSubmit={handleCreateQuiz}>
          <Form.Group className="mb-3" controlId="formQuizTitle">
            <Form.Label>Quiz Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter quiz title"
              value={quizForm.title}
              onChange={(e) => {
                setQuizForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }));
              }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formQuizDescription">
            <Form.Label>Quiz Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter quiz description"
              value={quizForm.description}
              onChange={(e) => {
                setQuizForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }));
              }}
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            className="m-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Quiz"}
          </Button>
          <Button
            variant="secondary"
            className="m-2"
            onClick={() => navigate("/quiz")}
            disabled={loading}
          >
            Cancel
          </Button>
        </Form>
      </Row>
    </Container>
  );
}
