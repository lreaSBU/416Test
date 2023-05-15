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
import FileCopyIcon from '@mui/icons-material/FileCopy';
import LikeIcon from '@mui/icons-material/ThumbUp';
import DislikeIcon from '@mui/icons-material/ThumbDown';
import LikeIconOff from '@mui/icons-material/ThumbUpOffAlt';
import DislikeIconOff from '@mui/icons-material/ThumbDownOffAlt';
import MenuIcon from '@mui/icons-material/Menu';

import placeholderimg from './Mappreview.png';

import { Container, Typography, Grid, Card, CardActionArea, CardMedia, CardContent, CardActions } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle'
import SearchIcon from '@mui/icons-material/Search';
import PublicIcon from '@mui/icons-material/Public';
import PublicOffIcon from '@mui/icons-material/PublicOff';

function MapCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected, owned } = props;
    const [open, setOpen] = useState(false);
    const [dupe, setDupe] = useState(false);
    const [wait, setWait] = useState(false);

    function handleEditor(e, id) {
        store.goToEditor(id);
        e.stopPropagation();
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
        if(!owned) return;
        if(idNamePair.copy.published) return console.warn('cannot changed name of a public map');
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setEditingMapName(true);
        }
        setEditActive(newActive);
    }

    async function handleDuplicateMap(e, id){
        setDupe(true);
        console.log('DUPLICATING ID ', id);
        setWait(true);
        await store.duplicateMapById(id);
        setWait(false);
        setDupe(false);
    }

    async function handleDeleteList(event, id) {
        setOpen(true);
        console.log('DELETING ID ', id);
        store.deleteMapById(id);
        setOpen(false);
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

    function handleDialogOpen(event) {
        setOpen(true);
    }
    function handleDialogClose() {
        setOpen(false);
    }

    function handleDialog2Open(event) {
        setDupe(true);
    }
    function handleDialog2Close() {
        setDupe(false);
    }

    function handleTogglePublic(event, id, flag) {
        store.changePublished(id, flag);
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let publishButton = '';
    if (idNamePair.copy.published) {
        publishButton = <IconButton size='small' color='primary' onClick={(event) => { handleTogglePublic(event, idNamePair._id, false) }} ><PublicIcon></PublicIcon></IconButton>
    }
    else {
        publishButton = <IconButton size='small' onClick={(event) => { handleTogglePublic(event, idNamePair._id, true) }} ><PublicOffIcon></PublicOffIcon></IconButton>
    }
    let editButton = <></>;
    if(!idNamePair.copy.published) editButton = <Button size='small' color='primary' variant='contained'><Link style={{ textDecoration: 'none' }} onClick={(event) => { handleEditor(event, idNamePair._id) }} to="/edit/">Edit</Link></Button>

    let mapTitleElement = <Box sx={{ width: 'fit-content' }} onClick={handleToggleEdit}>{idNamePair.name}</Box>;
    if (editActive) {
        mapTitleElement =
            <TextField
                margin="normal"
                required
                id={"list-" + idNamePair._id}
                label=""
                name="name"
                autoComplete=""
                // className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                // inputProps={{ style: { fontSize: 48 } }}
                // InputLabelProps={{ style: { fontSize: 24 } }}
                autoFocus
            />
    }

    let Sel = store.currentMap && store.currentMap._id == idNamePair._id;

    return (

        <Card className='map-card' onClick={(event) => { handleLoadList(event, idNamePair._id) }} style={{ height: 'fit-content'}} sx={{borderColor: (Sel ? '#5EB120' : '#000'), borderWidth: (Sel ? 3 : 1)}}>
            <CardActionArea >
                <CardMedia
                        component='img'
                        src={placeholderimg}
                        sx={{width: 100, height: 100}}
                    >
                </CardMedia>
            </CardActionArea>
            <CardContent>
                <Box >
                    {mapTitleElement}
                </Box>
            </CardContent>
            {owned ? (
                <CardActions>
                    {editButton}
                    {publishButton}
                    <IconButton size='small' color='primary' onClick={(event) => { handleDialogOpen(event) }} aria-label='delete'><DeleteIcon></DeleteIcon></IconButton>
                    <Dialog
                        open={open}
                        onClose={handleDialogClose}
                    >
                        <DialogTitle>
                            Delete {idNamePair.name}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Do you want to delete the map {idNamePair.name}?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color='error' variant='contained' onClick={(event) => handleDeleteList(event, idNamePair._id)}>Delete</Button>
                            <Button variant='outlined' onClick={handleDialogClose} autoFocus>
                                Cancel
                            </Button>
                        </DialogActions>

                    </Dialog>
                </CardActions>
            ) : <CardActions>
                    <IconButton size='small' color='primary' onClick={(event) => { handleDialog2Open(event) }} aria-label='delete'><FileCopyIcon></FileCopyIcon></IconButton>
                    <Dialog
                        open={dupe}
                        onClose={handleDialog2Close}
                    >
                        <DialogTitle>
                            Duplicate {idNamePair.name}
                        </DialogTitle>
                        <DialogContent>
                            {wait ? <DialogContentText>
                                        Please wait.
                                    </DialogContentText>
                                :   <DialogContentText>
                                        Make private copy of {idNamePair.name}?
                                    </DialogContentText>}
                        </DialogContent>
                        <DialogActions>
                            {wait ? <></> : <Button color='primary' variant='contained' onClick={(event) => handleDuplicateMap(event, idNamePair._id)}>Duplicate</Button>}
                            <Button variant='outlined' onClick={handleDialog2Close} autoFocus>
                                Cancel
                            </Button>
                        </DialogActions>

                    </Dialog>
                </CardActions>}
        </Card>
    );
}

export default MapCard;