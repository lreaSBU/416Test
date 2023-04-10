import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import LikeIcon from '@mui/icons-material/ThumbUp';
import DislikeIcon from '@mui/icons-material/ThumbDown';
import LikeIconOff from '@mui/icons-material/ThumbUpOffAlt';
import DislikeIconOff from '@mui/icons-material/ThumbDownOffAlt';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function MessageCard(props) {
    const { text, dir } = props;
    
    let cardElement =
        <ListItem
            sx={{ flexGrow: 1, marginTop: '15px', display: 'flex', p: 0}}
            style={{ fontSize: '32pt', color: '#000'}}
        >
            {dir ? <></> : <Box sx={{flexGrow: 1}}></Box>}
            <Box sx={{ borderRadius: 1, p: 1, flexGrow: 0, bgcolor: (dir ? '#5EB120' : '#D9D9D9')}}>{text}</Box>
        </ListItem>

    return (
        cardElement
    );
}

export default MessageCard;