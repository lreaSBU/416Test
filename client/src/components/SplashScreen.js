import { Link } from 'react-router-dom'
import Box from '@mui/material/Box';

export default function SplashScreen() {
    return (
        <div  id="splash-screen">
            <Box>
                Playlister
            </Box>
            <Box sx={{my: '10%'}}></Box>
            <Box id='splashD'>
                Playlister is an online service for easily building, watching, and sharing your favorite songs and music videos
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