import { Link } from 'react-router-dom'
import Box from '@mui/material/Box';

export default function SplashScreen() {
    return (
        <div  id="splash-screen">
            <Box>
                Map Central
            </Box>
            <Box sx={{my: '10%'}}></Box>
            <Box id='splashD'>
                Welcome to Map Central: an online service for creating, editing, and sharing all your favorite maps
            </Box>
            <Box sx={{my: '5%'}}></Box>
            <Link to='/login/'>Get Started</Link>
            <Box sx={{my: '10%'}}></Box>
            <Box id='splashC'>
                Site by Liam Rea
            </Box>
        </div>
    )
}