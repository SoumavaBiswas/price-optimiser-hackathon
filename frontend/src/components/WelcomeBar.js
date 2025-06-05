import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

export default function MenuAppBar() {
  const {isLoggedIn, user} = useContext(AuthContext);
 
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: "green" }}>
            Price Optimization Tool
          </Typography>
          {isLoggedIn && (
            <div>
                Welcome,  <span style={{ color: "green", marginRight: "8px" }}>{user['name']}</span>
                <AccountCircle />
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
