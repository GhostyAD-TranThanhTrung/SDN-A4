import { useState, useEffect } from "react";
import { Button, Container, Row, Table, Spinner, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { getQuizzes, deleteQuiz } from "../redux/axios";
import type { Quiz } from "../types/quizType";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAppSelector((state) => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const data = await getQuizzes();
        setQuizzes(data);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleCreateQuiz = () => {
    navigate("/quiz/create");
  };

  const handleViewDetails = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const handlePlayQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}/play`);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await deleteQuiz(quizId);
        // Refresh the quiz list after successful deletion
        const data = await getQuizzes();
        setQuizzes(data);
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
            <h1>Quiz List</h1>
          </div>
          <div className="p-2 ms-auto">
            {isAdmin && (
              <Button variant="primary" onClick={handleCreateQuiz}>
                Create New Quiz
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
              <th>Quiz title</th>
              <th>Description</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {quizzes.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  No quizzes available
                </td>
              </tr>
            ) : (
              quizzes.map((quiz, index) => (
                <tr
                  key={quiz._id}
                  style={{ cursor: !isAdmin ? "pointer" : "default" }}
                  onClick={
                    !isAdmin ? () => handlePlayQuiz(quiz._id!) : undefined
                  }
                >
                  <td>{index + 1}</td>
                  <td>{quiz.title}</td>
                  <td>{quiz.description}</td>
                  {isAdmin && (
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleViewDetails(quiz._id!)}
                      >
                        View Details
                      </Button>

                      <Button
                        variant="danger"
                        className="ms-2"
                        onClick={() => handleDeleteQuiz(quiz._id!)}
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
