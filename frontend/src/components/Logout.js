import React from 'react';
import { Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

export default function LogoutSection ({handleLogout}) {
    return(
        <AppBar style={{ boxShadow: 'none', position: 'fixed', top: "1%", width:"100vw" }}> 
            <Toolbar style={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" noWrap component="div" sx={{ color: 'white' }}></Typography>
                
                <IconButton onClick={handleLogout} size="large" aria-label="logout" color="inherit">
                    <LogoutIcon />
                </IconButton>
                
            </Toolbar>
      </AppBar>
    )
}