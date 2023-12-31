import { Outlet } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Container } from "@mui/material";

export default function MainLayout() {
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography >
                            Walcome to the forum
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
            <Container>
                <Outlet />            
            </Container>
        </>
    )
}
