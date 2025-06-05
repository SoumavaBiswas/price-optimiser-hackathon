import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const instance = axios.create({
    baseURL: "http://localhost:8000"
  })
  
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [error, setError] = useState(null) 

    useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
          // Fetch user data using the stored token
          const fetchData = async () => {
            try {
              const response = await instance.get('/auth/users/me', { 
                headers: {
                  Authorization: `Bearer ${storedToken}`
                }
              });
              setUser({name: response.data.full_name, role: response.data.role}); 
              setIsLoggedIn(true);
              
            } catch (error) {
              console.error('Error fetching user data:', error);
              
              setIsLoggedIn(false); 
            }
          };
          fetchData();
        }
      }, []);
    
      const handleLogin = async (username, password) => {
        try {
          const response = await instance.post('/auth/login', 
            new URLSearchParams({ 
                grant_type: 'password', 
                username: username, 
                password: password,
            }),
            { 
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' } 
            }
        );
          
          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          setIsLoggedIn(true);
          setUser({name: response.data.fullname,role: response.data.role});
          window.location.href = "/";
          
        } catch (error) {
          console.error('Login error:', error);
          let errorMessage = 'Login failed. Please check your credentials.';
      
          if (error.response && error.response.status === 401) {
            // Handle 401 Unauthorized error (likely invalid credentials)
            errorMessage = 'Invalid username or password.';
          } else if (error.response && error.response.status === 403) {
            // Handle 400 Bad Request error (possible email verification issue)
            errorMessage = 'Email not verified. Please check your email for verification link.';
          }
      
          setError(errorMessage)
          
        }
      };
    
      const handleLogout = () => {
        localStorage.removeItem('access_token');
        setIsLoggedIn(false);
      };
    

    const authContextValue = { isLoggedIn, user, handleLogin, handleLogout, error };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider, instance };