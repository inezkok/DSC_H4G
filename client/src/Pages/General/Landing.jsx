import React from 'react';
import '../../Styles/Landing.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';      
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";

const Landing = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    const handleSignUp = () => {
        navigate("/signup");
    };

    return (
        <div className = "landingbg">
            <AppBar position="static"  style={{ background: 'transparent', boxShadow: 'none' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    href="/"
                    sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    flexGrow: 1,
                    fontFamily: 'roboto',
                    fontWeight: 800,
                    letterSpacing: '.2rem',
                    color: 'black',
                    textDecoration: 'none',
                    }}
                >
                    GUI
                </Typography>

                <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
                    <Button
                        sx={{ border: 1, my: 2, color: 'black', display: 'block', fontWeight: 700, margin: 1.5 }}
                        onClick={handleLogin}
                    >
                        Login
                    </Button>

                    <Button
                        sx={{ border: 1, my: 2, color: 'black', display: 'block', fontWeight: 700, margin: 1.5 }}
                        onClick={handleSignUp}
                    >
                        Sign Up
                    </Button>
                </Box>
                </Toolbar>
            </Container>
            </AppBar>

            <h1>Ground-Up Intiative</h1>
            <h2>Explore and volunteer at GUI</h2>
        </div>
    );
};

export default Landing;