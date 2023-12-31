import Container from "@mui/material/Container"
import { Typography } from "@mui/material"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "../features/auth/authSlice"

export default function Home() {
    const user = useSelector(selectCurrentUser)

    return (
        <Container component="main" maxWidth="xs">
            <Typography>Welcome, {user?.name}!</Typography>
        </Container>
    )
}