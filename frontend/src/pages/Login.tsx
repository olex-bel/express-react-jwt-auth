import Container from "@mui/material/Container";
import LoginForm from "../features/auth/LoginForm";

export default function Login() {
    return (
        <Container component="main" maxWidth="xs">
            <LoginForm />
        </Container>
    )
}