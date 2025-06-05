import React, { useState } from 'react';
import { Button, TextField, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { instance } from '../App';
import { Alert } from '@mui/material';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('buyer'); // Default role
  const [passwordMismatcherror, setPasswordMismatchError] = useState(null)
  const [registrationError, setRegistrationError] = useState(null)
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        setPasswordMismatchError("Passwords do not match.");
        return;
      }

      const newUser = {
        email,
        password,
        full_name: fullName,
        role: role,
      };

      const response = await instance.post('/auth/register', newUser); // Send registration data to the API

      if (response.status === 201) {
        // Registration successful
        alert("Registration successful! Please verify your email address.");
        // Redirect to login page or another appropriate page
        navigate('/login'); 
      } else {
        const errorMessage = response.data
        setRegistrationError(errorMessage);
      }

    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.response.data["detail"][0]["msg"]
      setRegistrationError(errorMessage);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black background
    }}>
      <Box sx={{
        padding: '40px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        width: '400px',
        backgroundColor: '#202020', // Dark gray background for the register box
      }}>
        <Typography variant="h4" align="center" mb={3}>
          Register
        </Typography>
        {registrationError && <Alert severity="error">{registrationError}</Alert>}
        <TextField 
          id="outlined-basic" 
          label="Email" 
          variant="outlined" 
          fullWidth 
          margin="normal"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          sx={{ backgroundColor: '#303030', borderRadius: '5px' }} 
        />
        <TextField 
          id="outlined-basic" 
          label="Full Name" 
          variant="outlined" 
          fullWidth 
          margin="normal"
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)} 
          sx={{ backgroundColor: '#303030', borderRadius: '5px' }} 
        />
        <TextField 
          id="outlined-password-input" 
          label="Password" 
          type="password" 
          autoComplete="current-password" 
          fullWidth 
          margin="normal"
          value={password} 
          onChange={(e) => {
            setPasswordMismatchError(null)
            setPassword(e.target.value)
          }} 
          sx={{ backgroundColor: '#303030', borderRadius: '5px' }} 
        />
        <TextField 
          id="outlined-password-input" 
          label="Confirm Password" 
          type="password" 
          autoComplete="current-password" 
          fullWidth 
          margin="normal"
          value={confirmPassword} 
          onChange={(e) => {
            setPasswordMismatchError(null)
            setConfirmPassword(e.target.value)
          }} 
          sx={{ backgroundColor: '#303030', borderRadius: '5px' }} 
        />
         {passwordMismatcherror && <Alert severity="error">{passwordMismatcherror}</Alert>}
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Role</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value)}
            sx={{ backgroundColor: '#303030', borderRadius: '5px' }} 
          >
            <MenuItem value="buyer">Buyer</MenuItem>
            <MenuItem value="supplier">Supplier</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" fullWidth onClick={handleRegister} sx={{ backgroundColor: '#3399FF', color: 'white', borderRadius: '5px' }}>Register</Button>
             <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button fullWidth variant="contained" sx={{ 
                  color: 'gray',
                  borderRadius: '5px',
                  backgroundColor: '#FFC107', 
                '&:hover': {
                  backgroundColor: '#FF9800', 
                  color: 'black'
                }, }}>
                  SIGN IN
                </Button>
              </Link>
      </Box>
    </Box>
  );
};

export default RegisterPage;