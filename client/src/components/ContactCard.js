import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import LikeIcon from '@mui/icons-material/ThumbUp';
import DislikeIcon from '@mui/icons-material/ThumbDown';
import LikeIconOff from '@mui/icons-material/ThumbUpOffAlt';
import DislikeIconOff from '@mui/icons-material/ThumbDownOffAlt';
//import { Container } from '@mui/material';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ContactCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;

    function handleLoadConvo(event, id){
        event.stopPropagation();
        store.setCurrentConv(id);
    }

    function handleToggleEdit(event) {    
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setEditingMapName(true);
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeMapName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }
    let ldl = '';
    let cardElement =
        <ListItem
        id={idNamePair._id}
        key={idNamePair._id}
        sx={{ marginTop: '15px', p: 1 }}
        style={{ width: '98%', height: '100%', fontSize: 'x-large', outline: 'solid', borderRadius: '5px', marginLeft: 'auto', marginRight: 'auto' }}
        onClick={(e) => {handleLoadConvo(e, idNamePair._id)}}
        button>
            <Box>{idNamePair.name}</Box>
            <Box sx={{flexGrow: 1}}></Box>
            <Box>{idNamePair.copy.unread ? <Fab
                                            size='small'
                                            color='primary'
                                            aria-label="unread"
                                            float="left"
                                            > {idNamePair.copy.unread}</Fab>
                : ''}
            </Box>
            {ldl}
        </ListItem>

if (editActive) {
    cardElement =
        <TextField
            margin="normal"
            required
            fullWidth
            id={"list-" + idNamePair._id}
            label=""
            name="name"
            autoComplete=""
            className='list-card'
            onKeyPress={handleKeyPress}
            onChange={handleUpdateText}
            defaultValue={idNamePair.name}
            inputProps={{ style: { fontSize: 48 } }}
            InputLabelProps={{ style: { fontSize: 24 } }}
            autoFocus
        />
}
return (
    <div>
        {cardElement}
    </div>
);
}

export default ContactCard;