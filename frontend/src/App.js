import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import LoginPage from './pages/LoginPage';
import PriceOptimizationPage from './components/PriceOptimizationPage';
import RegisterPage from './pages/RegisterPage';
import ProductDataPage from './components/ProductDataPage';
import EmailVerification from './pages/EmailVerification'; 
import Home from './pages/Home';
import { AuthContext, instance } from './components/AuthProvider';
import { useContext } from 'react';


const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});



const App = () => {
  const { isLoggedIn, user } = useContext(AuthContext);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
          <Routes>
            <Route path="/" element={
              !isLoggedIn ? (
                <LoginPage />
              ) : (
                <Home />
              )
            }/>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pricing" element={
              !isLoggedIn ? (
                <LoginPage />
              ) : (
                <PriceOptimizationPage/>
              )
            }/>
            <Route path="/product-data" element={
              !isLoggedIn && user["role"]!=="buyer"? (
                <LoginPage />
              ) : (
                <ProductDataPage />
              )
            }/>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-email" element={<EmailVerification />} />
          </Routes>
        
      </Router>
    </ThemeProvider>
  );
};
export default App;
export {instance, theme};