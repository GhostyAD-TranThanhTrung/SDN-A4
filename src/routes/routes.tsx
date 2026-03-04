import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../layout/layout";
import LoginPage from "../pages/loginPage";
import RegisterPage from "../pages/registerPage";
import QuizList from "../pages/quizList";
import QuizDetail from "../pages/quizDetail";
import QuizPlay from "../pages/quizPlay";
import QuizCreate from "../pages/quizCreate";
import QuestionList from "../pages/admin/questionList";
import QuestionDetail from "../pages/admin/questionDetail";
import QuestionCreate from "../pages/admin/questionCreate";
import QuestionEdit from "../pages/admin/questionEdit";
import UserList from "../pages/admin/userList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/quiz" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "quiz",
        element: <QuizList />,
      },
      {
        path: "quiz/create",
        element: <QuizCreate />,
      },
      {
        path: "quiz/:id",
        element: <QuizDetail />,
      },
      {
        path: "quiz/:id/play",
        element: <QuizPlay />,
      },
      {
        path: "users",
        element: <UserList />,
      },
      {
        path: "quiz/:quizId/questions",
        element: <QuestionList />,
      },
      {
        path: "quiz/:quizId/questions/create",
        element: <QuestionCreate />,
      },
      {
        path: "quiz/:quizId/questions/:questionId/edit",
        element: <QuestionEdit />,
      },
      {
        path: "quiz/:quizId/questions/:questionId",
        element: <QuestionDetail />,
      },
      {
        path: "*",
        element: <Navigate to="/quiz" replace />,
      },
    ],
  },
]);

export default router;
