import { Link } from 'react-router-dom'
import Box from '@mui/material/Box';
import PublicIcon from '@mui/icons-material/Public'

export default function SplashScreen() {
    return (
        <div  id="splash-screen">
            <Box sx={{m: '5%'}}></Box>
            <Box id='splashT'>
                <PublicIcon sx={{fontSize: '5vw'}}></PublicIcon>
                Map Central
            </Box>
            <Box sx={{my: '10%'}}></Box>
            <Box id='splashD'>
                Welcome to Map Central: an online service for creating, editing, and sharing all your favorite maps
            </Box>
            <Link id='splashL' to='/login/'>Get Started</Link>
            <Box id='splashC'>
                Site by Spring 2023 CSE 416 Green Team
            </Box>
        </div>
    )
}