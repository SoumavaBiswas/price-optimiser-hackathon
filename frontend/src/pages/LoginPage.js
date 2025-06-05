import React, { useState } from 'react';
import { Alert, Button, Link, TextField, Typography, Box, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { theme } from '../App'; 
import { useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../components/AuthProvider';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {handleLogin, error} = useContext(AuthContext);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'rgba(20, 20, 20, 0.8)',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', 
        }}>
          <Box sx={{
            padding: '40px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            width: '400px',
            backgroundColor: theme.palette.background.paper, 
          }}>
            <Typography variant="h4" align="center" mb={3}>
              Login
            </Typography>
            {error && (
              <Alert severity="error">{error}</Alert>
            )}
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '5px',
                  backgroundColor: '#FF9800', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'gray'
                },
              }}
            />
            <TextField
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: '#FF9800', 
                  borderRadius: '5px',
                },
              }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={()=>handleLogin(username, password)}
              sx={{
                color: 'gray', 
                borderRadius: '5px',
                backgroundColor: '#FFC107', 
                '&:hover': {
                  backgroundColor: '#FF9800',
                  color: 'black'
                },
              }}
            >
              Login
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Typography variant="body2" color="textSecondary" align="center">
                <pre>New User? </pre>
              </Typography>
              <Link href="/register" underline="none">
                <Button variant="text" sx={{ 
                  color: 'gray',
                  borderRadius: '5px',
                  backgroundColor: '#FFC107',
                '&:hover': {
                  backgroundColor: '#FF9800', 
                  color: 'black'
                }, }}>
                  Register
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
    </ThemeProvider>
  );
};

export default LoginPage;