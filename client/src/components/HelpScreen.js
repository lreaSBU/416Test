import { Link } from 'react-router-dom'
import Box from '@mui/material/Box';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'

export default function HelpScreen() {
    return (
        <div  id="splash-screen">
            <Box sx={{m: '5%'}}></Box>
            <Box id='helpT'>
                <QuestionMarkIcon sx={{fontSize: '5vw'}}></QuestionMarkIcon>
                Help:
            </Box>
            <Box sx={{my: '5%'}}></Box>
            <Box className='helpD'>
                - In order to create your own maps, edit and comment on others, as well as download map files make sure you are logged in which you can do:
            </Box>
            <Link id='helpL' to='/login/'>here.</Link>
            <Box className='helpD'>
                - You can visit the Browse screen to search for published maps my title or owner username
            </Box>
            <Box className='helpD'>
                - If you are logged in you can also visit the Chat screen to directly message other users
            </Box>
            <Box className='helpD'>
                - From the Home screen you can change the name of your maps, publish them, or make them private and begin editing them
            </Box>
        </div>
    )
}