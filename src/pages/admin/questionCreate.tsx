import { useState } from "react";
import { Button, Container, Row, Form, Stack } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { createQuestion } from "../../redux/axios";
import type { CreateQuestionDto } from "../../types/questionType";

export default function QuestionCreate() {
  const { quizId } = useParams<{ quizId: string }>();
  const [questionForm, setQuestionForm] = useState<CreateQuestionDto>({
    text: "",
    options: ["", "", "", ""],
    keywords: [],
    correctAnswerIndex: 0,
  });
  const [keywordInput, setKeywordInput] = useState("");
  const [optionInput, setOptionInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleKeywordChange = (value: string) => {
    setKeywordInput(value);
    // Auto-split keywords on comma, semicolon, or newline
    const keywords = value
      .split(/[,;\n]/)
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0);

    setQuestionForm((prev) => ({
      ...prev,
      keywords: keywords,
    }));
  };

  const handleOptionChange = (value: string) => {
    setOptionInput(value);
    // Auto-split options on comma
    const options = value
      .split(",")
      .map((option) => option.trim())
      .filter((option) => option.length > 0);

    setQuestionForm((prev) => ({
      ...prev,
      options: options,
      correctAnswerIndex: Math.min(
        prev.correctAnswerIndex,
        Math.max(0, options.length - 1),
      ),
    }));
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setLoading(true);
      const questionData = {
        ...questionForm,
        options: validOptions,
      };
      const newQuestion = await createQuestion(quizId!, questionData);
      console.log("Question created successfully:", newQuestion);
      navigate(`/quiz/${quizId}/questions`);
    } catch (err) {
      console.error("Error creating question:", err);
      alert("Failed to create question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row className="justify-content-between mt-5">
        <Stack direction="horizontal" gap={3}>
          <div className="p-2">
            <h1>Create New Question</h1>
          </div>
          <div className="p-2 ms-auto">
            <Button
              variant="secondary"
              onClick={() => navigate(`/quiz/${quizId}/questions`)}
            >
              Back to Question List
            </Button>
          </div>
        </Stack>
      </Row>
      <Row>
        <Form onSubmit={handleCreateQuestion}>
          <Form.Group className="mb-3" controlId="formQuestionText">
            <Form.Label>Question Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your question"
              value={questionForm.text}
              onChange={(e) => {
                setQuestionForm((prev) => ({
                  ...prev,
                  text: e.target.value,
                }));
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
            {questionForm.options.length > 0 && (
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
                      setQuestionForm((prev) => ({
                        ...prev,
                        correctAnswerIndex: value - 1,
                      }));
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
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Question"}
          </Button>
          <Button
            variant="secondary"
            className="m-2"
            onClick={() => navigate(`/quiz/${quizId}/questions`)}
            disabled={loading}
          >
            Cancel
          </Button>
        </Form>
      </Row>
    </Container>
  );
}
