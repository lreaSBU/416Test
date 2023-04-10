import React, { useContext, useEffect} from 'react'
import AuthContext from '../auth';

import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import YouTube from './YouTubePlayerExample.js'
import CommentCard from './CommentCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import SplashScreen from './SplashScreen'
import logo from './Capture.png'
import colors from './colors.png'
import IconButton from '@mui/material/IconButton';
import MouseIcon from '@mui/icons-material/Mouse';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import PanToolIcon from '@mui/icons-material/PanTool';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const EditScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    if(!auth.loggedIn) return <SplashScreen />;
    return (
        <div id='editParent'>
            <div id = "leftPar" className='editShelf'>
                <Box id='toolTray' className='traySect' sx={{bgcolor: '#999', borderRadius: 3}}>
                    <IconButton aria-label='select'>
                        <MouseIcon style={{fontSize:'32pt', color: '#000'}} />
                    </IconButton>
                    <IconButton aria-label='add'>
                        <AddIcon style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='remove'>
                        <ClearIcon style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='move'>
                        <PanToolIcon style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='box select'>
                        <HighlightAltIcon style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='duplicate'>
                        <ContentCopyIcon eIcon style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='merge'>
                        <CopyAllIcon  style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='properties'>
                        <MenuIcon  style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='traverse up layer'>
                        <ArrowUpwardIcon  style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='traverse down layer'>
                        <ArrowDownwardIcon  style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='scale'>
                        <ZoomOutMapIcon  style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='upload'>
                        <FileUploadIcon  style={{fontSize:'32pt'}} />
                    </IconButton>
                </Box>
                <Box id='displayMenu' className='traySect' sx={{borderTop: 2, borderBottom: 2, borderColor: '#00ff00'}}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="Name" />
                        <FormControlLabel control={<Checkbox />} label="Population" />
                        <FormControlLabel control={<Checkbox />} label="Abbreviation" />
                        <FormControlLabel control={<Checkbox />} label="GDP" />
                        <FormControlLabel control={<Checkbox />} label="..." />
                    </FormGroup>
                </Box>
                <Box id='optSliders' className='traySect'>
                    <Box className='sliderLabel'>
                        <Box>LOD Bias:</Box>
                        <Slider
                            aria-label="LOD Bias"
                            defaultValue={0}
                            max={100}
                            min={-100}
                            step={1}
                            valueLabelDisplay="auto"
                            sx={{width: '80%', left: '5%'}}
                        />
                    </Box>
                    <Box className='sliderLabel'>
                        <Box>Text Size:</Box>
                        <Slider
                            aria-label="Text Size"
                            defaultValue={0}
                            max={100}
                            min={-100}
                            step={1}
                            valueLabelDisplay="auto"
                            sx={{width: '80%', left: '5%'}}
                        />
                        
                    </Box>
                    <Box className='sliderLabel'>
                    <Box>Scrub Size:</Box>
                        <Slider
                            aria-label="Scrub Size"
                            defaultValue={1}
                            max={100}
                            min={1}
                            step={1}
                            valueLabelDisplay="auto"
                            sx={{width: '80%', left: '5%'}}
                        />

                    </Box>
                    <Box className='sliderLabel' sx={{left: '5%'}}>
                    <Box>Scroll Speed:</Box>
                        <Slider
                            aria-label="Scroll Speed"
                            defaultValue={1}
                            max={10}
                            min={1}
                            step={1}
                            valueLabelDisplay="auto"
                            sx={{width: '80%', left: '5%'}}
                        />
                        
                    </Box>
                </Box>
            </div>
            <div id = "midPar">
                <img id='exampleView'
                    src={logo}
                />
            </div>
            <div id = "rightPar" className='editShelf'>
                <Box sx={{height:'5%'}}></Box>
                <Box id='inspector' className='traySect' sx={{bgcolor: '#999', borderRadius: 1}}>
                    <FormGroup sx={{padding: '5%', width: '80%'}}>
                        <FormControlLabel control={<TextField sx={{width:'60%'}} variant="filled" value="234.65"/>} label="X" />
                        <FormControlLabel control={<TextField sx={{width:'60%'}} variant="filled" value="643.12"/>} label="Y" />
                        <FormControlLabel control={<TextField sx={{width:'60%'}} variant="filled" value="1"/>} label="Scale" />
                    </FormGroup>
                </Box>
                <Box sx={{height:'5%'}}></Box>
                {store.tabMode == 3 ? <></> :
                    <Box id='inspector2' className='traySect' sx={{bgcolor: '#999', borderRadius: 1}}>
                        <FormGroup sx={{padding: '5%', width: '80%'}}>
                            <FormControlLabel control={<TextField disabled sx={{width:'60%'}} variant="filled" value="Subregion"/>} label="Type" />
                            <FormControlLabel control={<TextField disabled sx={{width:'60%'}} variant="filled" value="1"/>} label="Layer" />
                            <FormControlLabel control={<TextField disabled sx={{width:'60%'}} variant="filled" value="2"/>} label="Group" />
                            <FormControlLabel control={<TextField disabled sx={{width:'60%'}} variant="filled" value="75"/>} label="Children" />
                        </FormGroup>
                    </Box>
                }
                {store.tabMode == 2 ? <></> : 
                    <Box id='inspector3' className='traySect' sx={{bgcolor: '#999', borderRadius: 1}}>
                        <img id='exampleCols'
                            src={colors}
                        />
                    </Box>
                }
            </div>
        </div>
    );
}

export default EditScreen;