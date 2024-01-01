import Container from "@mui/material/Container"
import { Typography } from "@mui/material"
import { useGetUserQuery } from "../features/user/userApiSlice"

export default function Home() {
    const { data: user, isFetching, isLoading } = useGetUserQuery()
    console.log(user)

    if (isLoading) return <div>Loading...</div>

    return (
        <Container component="main" maxWidth="xs">
            <Typography>Welcome, {user?.name}! {isFetching ? "...refetching" : ""}</Typography>
        </Container>
    )
}