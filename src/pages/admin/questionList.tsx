import { useState, useEffect } from "react";
import { Button, Container, Row, Table, Spinner, Stack } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { getAllQuestionsOfQuiz, deleteQuestion } from "../../redux/axios";
import type { Question } from "../../types/questionType";

export default function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAppSelector((state) => state.login);
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!quizId) return;
      try {
        setLoading(true);
        const data = await getAllQuestionsOfQuiz(quizId);
        setQuestions(data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId]);

  const handleCreateQuestion = () => {
    navigate(`/quiz/${quizId}/questions/create`);
  };

  const handleViewDetails = (questionId: string) => {
    navigate(`/quiz/${quizId}/questions/${questionId}`);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(quizId!, questionId);
        // Refresh the question list after successful deletion
        const data = await getAllQuestionsOfQuiz(quizId!);
        setQuestions(data);
      } catch (err) {
        console.error("Error deleting question:", err);
      }
    }
  };

  const handleBackToQuiz = () => {
    navigate(`/quiz/${quizId}`);
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
            <h1>Question List</h1>
          </div>
          <div className="p-2 ms-auto">
            <Button variant="secondary" className="me-2" onClick={handleBackToQuiz}>
              Back to Quiz
            </Button>
            {isAdmin && (
              <Button variant="primary" onClick={handleCreateQuestion}>
                Create New Question
              </Button>
            )}
          </div>
        </Stack>
      </Row>
      <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Question Text</th>
              <th>Options Count</th>
              <th>Keywords</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  No questions available
                </td>
              </tr>
            ) : (
              questions.map((question, index) => (
                <tr key={question._id}>
                  <td>{index + 1}</td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {question.text}
                  </td>
                  <td>{question.options.length}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {question.keywords.join(', ')}
                  </td>
                  {isAdmin && (
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleViewDetails(question._id!)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => handleDeleteQuestion(question._id!)}
                      >
                        Delete
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
}
