import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
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
import MenuIcon from '@mui/icons-material/Menu';

import { Container } from '@mui/material';

function MapCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;

    function handleEditor(e, id) {
        store.goToEditor(id);
    }

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentMap(id);
        }
    }

    function handleLike(e) {
        store.changeLikes(idNamePair._id, true);
    }
    function handleDislike(e) {
        store.changeLikes(idNamePair._id, false); //Need to write in this function!!!
    }

    function handleDup(e) {
        store.createNewList(idNamePair.name, idNamePair.copy.songs);
    }

    function handlePub(e) {
        store.publishList(store.currentList);
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
    //let npl = '';
    let npl = <Box sx={{ p: 1, flexGrow: 1, fontSize: '16px' }}>{(store.browseMode ? idNamePair.ownerName : (idNamePair.copy.published ? "*Published" : ""))}</Box>
    if (store.browseMode) {
        ldl = (<div>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={handleLike} aria-label='like'>
                    <Box sx={{ p: 1, flexGrow: 1, color: 'black' }}>{idNamePair.likes}</Box>
                    <LikeIcon style={{ fontSize: '32pt' }} />
                </IconButton>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={handleDislike} aria-label='dislike'>
                    <Box sx={{ p: 1, flexGrow: 1, color: 'black' }}>{idNamePair.dislikes}</Box>
                    <DislikeIcon style={{ fontSize: '32pt' }} />
                </IconButton>
            </Box>
        </div>);
        //npl = <Box sx={{ p: 1, flexGrow: 1, fontSize: '16px'}}>{idNamePair.ownerName}</Box>
    } else {
        ldl =
            <Container maxWidth='md' sx={{ display: 'flex', alignItems: 'center' }}>
                <Link onClick={(event) => { handleEditor(event, idNamePair._id) }} to="/edit/"><EditIcon sx={{ color: 'primary.main' }}></EditIcon></Link>

                <IconButton onClick={(event) => { handleDeleteList(event, idNamePair._id) }} aria-label='delete'>
                    <DeleteIcon></DeleteIcon>
                </IconButton>
                {(idNamePair.copy.published ? '' : (<IconButton onClick={(event) => {handleLoadList(event, idNamePair._id)}} aria-label='edit'>
                    <MenuIcon style={{fontSize:'32pt'}} />
                </IconButton>))}

            </Container>
    }
    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', p: 1 }}
            style={{ width: '98%', height: '100%', fontSize: 'x-large', outline: 'solid', borderRadius: '5px', marginLeft: 'auto', marginRight: 'auto' }}
            button
        >

            <Container maxWidth='md' sx={{ display: 'flex', alignItems: 'center' }}>
                <Box>{idNamePair.name}</Box>
                {/* <Box>
                    {(idNamePair.copy.published ? '' : (<IconButton onClick={handleToggleEdit} aria-label='edit'>
                        <EditIcon style={{ fontSize: '32pt' }} />
                    </IconButton>))}
                </Box> */}
                {/* {npl} */}
                {/* <Box sx={{ flexGrow: 1 }}></Box> */}
                {ldl}
            </Container>
            {/* <div display='flex' alignItems='center'>
                

                <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}</Box>
                <Box>
                    {(idNamePair.copy.published ? '' : (<IconButton onClick={handleToggleEdit} aria-label='edit'>
                        <EditIcon style={{ fontSize: '32pt' }} />
                    </IconButton>))}
                </Box>

                {npl}
                <Box sx={{ flexGrow: 1 }}></Box>
                {ldl}
            </div> */}
            {/* <Box sx={{ flexGrow: 1 }}></Box>
            {ldl} */}
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

export default MapCard;