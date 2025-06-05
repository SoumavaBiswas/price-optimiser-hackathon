import React from 'react';
import { Typography, Container } from '@mui/material';

const HeroSection = () => {
  return (
    <Container maxWidth="md" sx={{ color: 'white', py: 10 }}>
      <Typography variant="h2" component="h1" align="center" gutterBottom>
        Price Optimization Tool
      </Typography>
      <Typography variant="body1" align="center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Typography>
    </Container>
  );
};

export default HeroSection;