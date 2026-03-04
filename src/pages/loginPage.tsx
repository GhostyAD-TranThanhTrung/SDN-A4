import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginUser } from "../redux/loginSlide";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        user: "",
        password: ""
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, isLoggedIn } = useAppSelector((state) => state.login);

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/quiz");
        }
    }, [isLoggedIn, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    return (
        <Form className="w-50 m-5" onSubmit={handleSubmit}>

            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter username"
                    name="user"
                    value={formData.user}
                    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
            </Form.Group>
            <Form.Group className="justify-content-between d-flex mb-2">
                <Form.Text className="mr-3">
                    Don't have an account? <a href="/register">Register here</a>
                </Form.Text>
                <Button
                    variant="primary"
                    type="submit"
                    className="ml-3"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </Form.Group>
        </Form>
    )
}