import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
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

// Error Boundary Component
const ErrorBoundary = ({ error }: { error?: Error }) => (
  <div className="container mt-4">
    <div className="alert alert-danger">
      <h4>Something went wrong!</h4>
      <p>{error?.message || "Page not found or an error occurred."}</p>
      <button
        onClick={() => (window.location.href = "/")}
        className="btn btn-primary"
      >
        Go Home
      </button>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/quiz" replace />,
      },
      // Auth routes - accessible without login
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      // Quiz routes - order matters!
      {
        path: "quiz",
        element: <QuizList />,
      },
      {
        path: "quiz/create",
        element: <QuizCreate />,
      },
      {
        path: "quiz/:id/play",
        element: <QuizPlay />,
      },
      // Question management routes - most specific first
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
        path: "quiz/:quizId/questions",
        element: <QuestionList />,
      },
      // Dynamic quiz detail - must come AFTER all specific quiz routes
      {
        path: "quiz/:id",
        element: <QuizDetail />,
      },
      // Admin routes
      {
        path: "admin",
        element: <Outlet />,
        children: [
          {
            path: "users",
            element: <UserList />,
          },
          {
            path: "quiz/create",
            element: <QuizCreate />,
          },
        ],
      },
      // Legacy users route (redirect to admin)
      {
        path: "users",
        element: <Navigate to="/admin/users" replace />,
      },
      // Catch all - redirect to quiz list
      {
        path: "*",
        element: <Navigate to="/quiz" replace />,
      },
    ],
  },
]);

export default router;
