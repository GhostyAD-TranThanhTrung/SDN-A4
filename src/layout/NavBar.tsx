import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logoutUser } from "../redux/loginSlide";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, user, loading } = useAppSelector(
    (state) => state.login,
  );

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
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
                Quiz List
              </Nav.Link>
              {isAdmin && (
                <>
                  <Nav.Link as={Link} to="/quiz/create">
                    Create Quiz
                  </Nav.Link>
                  <Nav.Link as={Link} to="/admin/users">
                    Manage Users
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
              <Button
                onClick={handleLogin}
                variant="primary"
                disabled={loading}
              >
                {loading ? "Loading..." : "Login"}
              </Button>
              <Button
                onClick={handleRegister}
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
