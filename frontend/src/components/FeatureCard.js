// import React from 'react';
// import { Card, CardContent, Typography, Box } from '@mui/material';
// import { Link } from 'react-router-dom';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// const FeatureCard = ({ title, description, icon, to }) => {
//   return (
//     <Card 
//       sx={{ 
//         backgroundColor: '#fff', 
//         color: '#212121', 
//         margin: '20px', // Reduced margin for better spacing
//         padding: '20px 50px 20px 50px',
//         borderRadius: '5px', 
//         textAlign: 'left', // Align content to the left
//         minHeight: '350px', 
//         display: 'flex', 
//         flexDirection: 'column', 
//         justifyContent: 'center' 
//       }}
//     >
//       <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}> 
//         {icon} 
//       </Box>
//       <Typography variant="h5" component="h2" fontWeight="bold">{title}</Typography>
//       <Typography variant="body2">{description}</Typography>
//       <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}> 
//         <Link to={to} style={{ textDecoration: 'none' }}> 
//           <ArrowForwardIcon sx={{ color: '#212121' }} /> 
//         </Link>
//       </Box>
//     </Card>
//   );
// };

// export default FeatureCard;

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const FeatureCard = ({ title, description, icon, to }) => {
  return (
    <Card 
      sx={{ 
        backgroundColor: '#fff', 
        color: '#212121', 
        margin: '20px', 
        padding: '20px', 
        borderRadius: '5px', 
        textAlign: 'left', 
        minHeight: '350px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center' 
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 4 }}> {/* Increased mb for icon */}
        {icon} 
      </Box>
      <Typography variant="h5" component="h2" fontWeight="bold" mb={4}>{title}</Typography>
      <Typography variant="body2">{description}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4 }}> 
        <Link to={to} style={{ textDecoration: 'none' }}> 
          <ArrowForwardIcon sx={{ color: '#212121', fontSize: '2rem', fontWeight: 'bold' }} /> 
        </Link>
      </Box>
    </Card>
  );
};

export default FeatureCard;