import { useState, useEffect } from "react";
import { Button, Container, Row, Form, Stack, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestionById, updateQuestion } from "../../redux/axios";
import type { Question, CreateQuestionDto } from "../../types/questionType";

export default function QuestionEdit() {
  const { quizId, questionId } = useParams<{
    quizId: string;
    questionId: string;
  }>();
  const [questionForm, setQuestionForm] = useState<Question | null>(null);
  const [keywordInput, setKeywordInput] = useState("");
  const [optionInput, setOptionInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleKeywordChange = (value: string) => {
    setKeywordInput(value);
    // Auto-split keywords on comma, semicolon, or newline
    const keywords = value
      .split(/[,;\n]/)
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0);

    setQuestionForm((prev) =>
      prev
        ? {
            ...prev,
            keywords: keywords,
          }
        : null,
    );
  };

  const handleOptionChange = (value: string) => {
    setOptionInput(value);
    // Auto-split options on comma
    const options = value
      .split(",")
      .map((option) => option.trim())
      .filter((option) => option.length > 0);

    setQuestionForm((prev) =>
      prev
        ? {
            ...prev,
            options: options,
            correctAnswerIndex: Math.min(
              prev.correctAnswerIndex,
              Math.max(0, options.length - 1),
            ),
          }
        : null,
    );
  };

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const data = await getQuestionById(quizId!, questionId!);
      setQuestionForm(data);
      // Set the keyword input to display existing keywords joined by commas
      setKeywordInput(data.keywords.join(", "));
      // Set the option input to display existing options joined by commas
      setOptionInput(data.options.join(", "));
    } catch (err) {
      console.error("Error fetching question:", err);
      alert("Failed to load question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [quizId, questionId]);

  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionForm) return;

    if (!questionForm.text.trim()) {
      alert("Please enter question text");
      return;
    }

    const validOptions = questionForm.options.filter(
      (opt) => opt.trim() !== "",
    );
    if (validOptions.length < 2) {
      alert("Please provide at least 2 options");
      return;
    }

    if (questionForm.correctAnswerIndex >= validOptions.length) {
      alert("Please select a valid correct answer");
      return;
    }

    try {
      setSubmitting(true);
      const questionData: Partial<CreateQuestionDto> = {
        text: questionForm.text,
        options: validOptions,
        keywords: questionForm.keywords,
        correctAnswerIndex: questionForm.correctAnswerIndex,
      };

      const updatedQuestion = await updateQuestion(
        quizId!,
        questionId!,
        questionData,
      );
      console.log("Question updated successfully:", updatedQuestion);
      navigate(`/quiz/${quizId}/questions/${questionId}`);
    } catch (err) {
      console.error("Error updating question:", err);
      alert("Failed to update question. Please try again.");
    } finally {
      setSubmitting(false);
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

  if (!questionForm) {
    return (
      <Container fluid className="text-center mt-5">
        <h3>Question not found</h3>
        <Button
          variant="secondary"
          onClick={() => navigate(`/quiz/${quizId}/questions`)}
        >
          Back to Questions
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="justify-content-between mt-5">
        <Stack direction="horizontal" gap={3}>
          <div className="p-2">
            <h1>Edit Question</h1>
          </div>
          <div className="p-2 ms-auto">
            <Button
              variant="secondary"
              onClick={() =>
                navigate(`/quiz/${quizId}/questions/${questionId}`)
              }
            >
              Cancel
            </Button>
          </div>
        </Stack>
      </Row>
      <Row>
        <Form onSubmit={handleUpdateQuestion}>
          <Form.Group className="mb-3" controlId="formQuestionText">
            <Form.Label>Question Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your question"
              value={questionForm.text}
              onChange={(e) => {
                setQuestionForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        text: e.target.value,
                      }
                    : null,
                );
              }}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Answer Options</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter options separated by commas (e.g., Option 1, Option 2, Option 3, Option 4)"
              value={optionInput}
              onChange={(e) => handleOptionChange(e.target.value)}
            />
            <Form.Text className="text-muted">
              Separate multiple options with commas
            </Form.Text>
            {questionForm && questionForm.options.length > 0 && (
              <div className="mt-2">
                <Form.Label>
                  Correct Answer Number (1-{questionForm.options.length}):
                </Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={questionForm.options.length}
                  value={questionForm.correctAnswerIndex + 1}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (
                      !isNaN(value) &&
                      value >= 1 &&
                      value <= questionForm.options.length
                    ) {
                      setQuestionForm((prev) =>
                        prev
                          ? { ...prev, correctAnswerIndex: value - 1 }
                          : null,
                      );
                    }
                  }}
                  style={{ width: "100px" }}
                />
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Keywords</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Enter keywords separated by commas (e.g., science, biology, cells)"
              value={keywordInput}
              onChange={(e) => handleKeywordChange(e.target.value)}
            />
            <Form.Text className="text-muted">
              Separate multiple keywords with commas, semicolons, or new lines
            </Form.Text>
          </Form.Group>

          <Button
            variant="primary"
            className="m-2"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Update Question"}
          </Button>
          <Button
            variant="secondary"
            className="m-2"
            onClick={() => navigate(`/quiz/${quizId}/questions/${questionId}`)}
            disabled={submitting}
          >
            Cancel
          </Button>
        </Form>
      </Row>
    </Container>
  );
}
