// import { Container, Typography} from '@mui/material'; 
// import FeatureCard from '../components/FeatureCard';
// import GridViewIcon from '@mui/icons-material/GridView';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp'; 
// import LogoutSection from '../components/Logout';
// import { useContext } from 'react';
// import { AuthContext } from '../components/AuthProvider';

// export default function Home (){
//     const {handleLogout } = useContext(AuthContext);
//     return (
//         <Container maxWidth="md" sx={{ minHeight: '100vh', minWidth:'100vw', display: 'flex', 
//           flexDirection: 'column', 
//           justifyContent: 'center', 
//           }}>     
//               <LogoutSection handleLogout={handleLogout}/>
//               <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ color: 'white' }}> 
//                 Price Optimization Tool 
//               </Typography>
//               <Typography variant="body1" align="center" color="gray">
//                Add, update, or remove products, and instantly analyze demand and optimized pricing to boost profitability.
//               </Typography>
            
//         <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
//             <FeatureCard
//               title="Create and Manage Product"
//               description="Comprehensive Product Management for Seamless Operations"
//               icon={<TrendingUpIcon sx={{ fontSize: '4rem' }} />}
//               to="/product-data"
//             />
//         </Container>


//       </Container>
      
//     )
// }
import { Container, Typography } from '@mui/material'; 
import FeatureCard from '../components/FeatureCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; 
import LogoutSection from '../components/Logout';
import { useContext } from 'react';
import { AuthContext } from '../components/AuthProvider';

export default function Home() {
  const { handleLogout } = useContext(AuthContext);

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'black', // Optional: maintain dark theme
        px: 2,
      }}
    >
      <LogoutSection handleLogout={handleLogout} />

      <Typography
        variant="h2"
        component="h1"
        align="center"
        gutterBottom
        sx={{ color: 'white' }}
      >
        Price Optimization Tool
      </Typography>

      <Typography
        variant="subtitle1"
        align="center"
        sx={{ color: 'gray', maxWidth: 500, mb: 4 }}
      >
        Effortlessly manage products, analyze demand trends, and get smart pricing suggestions to maximize profitability.
      </Typography>

      <FeatureCard
        title="Optimize Product Pricing"
        description="Add or update products and instantly access demand analysis with AI-powered price optimization."
        icon={<TrendingUpIcon sx={{ fontSize: '3rem' }} />}
        to="/product-data"
      />
    </Container>
  );
}
