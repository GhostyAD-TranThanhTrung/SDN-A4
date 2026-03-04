
import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { registerUser } from "../redux/loginSlide";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        user: "",
        password: "",
        confirmPassword: "",
        admin: false
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, isLoggedIn } = useAppSelector((state) => state.login);

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/quiz");
        }
    }, [isLoggedIn, navigate]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await dispatch(registerUser({
                user: formData.user,
                password: formData.password,
                admin: formData.admin
            })).unwrap();

            navigate("/login");
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return (
        <Form className="w-50 m-5" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
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

            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicAdmin">
                <Form.Check
                    type="checkbox"
                    label="Register as Admin"
                    name="admin"
                    checked={formData.admin}
                    onChange={(e) => setFormData({ ...formData, admin: e.target.checked })}
                />
            </Form.Group>

            <Form.Group className="justify-content-between d-flex mb-2">
                <Form.Text className="mr-3">
                    Already have an account? <a href="/login">Login here</a>
                </Form.Text>
                <Button
                    variant="primary"
                    type="submit"
                    className="ml-3"
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register"}
                </Button>
            </Form.Group>
        </Form>
    )
}