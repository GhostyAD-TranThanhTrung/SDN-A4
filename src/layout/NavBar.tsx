import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logoutUser } from "../redux/loginSlide";
import { Link } from "react-router-dom";

export default function NavBar() {
  const dispatch = useAppDispatch();
  const { isLoggedIn, isAdmin, user, loading } = useAppSelector(
    (state) => state.login,
  );

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={Link} to="/quiz">
            Dashboard
          </Navbar.Brand>

          {isLoggedIn && (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/quiz">
                Quiz list
              </Nav.Link>
              {isAdmin && (
                <>
                  <Nav.Link as={Link} to="/admin/quiz/create">
                    Create Quiz
                  </Nav.Link>
                </>
              )}
            </Nav>
          )}

          {isLoggedIn && user && (
            <Navbar.Collapse className="justify-content-end me-3">
              <Navbar.Text>
                Signed in as: <span className="fw-bold">{user.user}</span>
              </Navbar.Text>
            </Navbar.Collapse>
          )}

          {!isLoggedIn ? (
            <div className="d-flex gap-2">
              <Button href="/login" variant="primary" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </Button>
              <Button
                href="/register"
                variant="outline-light"
                disabled={loading}
              >
                Register
              </Button>
            </div>
          ) : (
            <Button
              variant="outline-light"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
            </Button>
          )}
        </Container>
      </Navbar>
    </>
  );
}
