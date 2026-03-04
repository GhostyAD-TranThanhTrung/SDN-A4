import { Container, Row } from 'react-bootstrap'
import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch } from '../redux/hooks'
import { checkAuthStatus } from '../redux/loginSlide'

export default function Layout() {
    const dispatch = useAppDispatch();

    // Check authentication status on app load
    useEffect(() => {
        dispatch(checkAuthStatus());
    }, [dispatch]);

    return (
        <Container fluid >
            <Row >
                <NavBar />
            </Row>
            <Row className="justify-content-center">
                <Outlet />
            </Row>
        </Container>
    )
}