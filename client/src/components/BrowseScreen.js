import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../auth';

import { GlobalStoreContext } from '../store'
import MapCard from './MapCard.js'
//import MUIPublishModal from './MUIPublishModal'
//import MUIDeleteModal from './MUIDeleteModal'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SortIcon from '@mui/icons-material/Menu';
import { Avatar, ListItem, ListItemText } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PublicIcon from '@mui/icons-material/Public';
import PublicOffIcon from '@mui/icons-material/PublicOff';
import placeholderimg from './Capture.png';

const BrowseScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    const [anchorEl, setAnchorEl] = useState(null);
    const [banchor, setBanchor] = useState(null);
    const [openEmail, setOpenEmail] = useState(false);
    const [openPassword, setOpenPassword] = useState(false);
    const [openFriend, setOpenFriend] = useState(false);
    const isMenuOpen = Boolean(anchorEl);
    const isSortOpen = Boolean(banchor);

    const handleSortMenuOpen = (event) => {
        setBanchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setBanchor(null);
    };

    function handleSort(type) {
        console.log("MENU_EVENT: " + type);
        handleMenuClose();
        store.changeSortMode(type);
    }
    function handlePreviewTab(e) {
        store.switchTab(0);
    }
    function handleCommentTab(e) {
        store.switchTab(1);
    }

    let emailDiag =
        <Dialog
            open={openEmail}
            onClose={handleDialogClose}
        >
            <DialogTitle>
                Change Email
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Change Email?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {/* <Button onClick={(event) => handleDeleteList(event, idNamePair._id)}>Delete</Button> */}
                <Button onClick={handleDialogClose} autoFocus>
                    Cancel
                </Button>
            </DialogActions>

        </Dialog>;

    let passwordDiag =
        <Dialog
            open={openPassword}
            onClose={handleDialogClose}
        >
            <DialogTitle>
                Change Password
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Change password?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {/* <Button onClick={(event) => handleDeleteList(event, idNamePair._id)}>Delete</Button> */}
                <Button onClick={handleDialogClose} autoFocus>
                    Cancel
                </Button>
            </DialogActions>

        </Dialog>;

    function handleDialogOpen(diagType) {
        switch (diagType) {
            case 1:
                setOpenEmail(true);
                break;
            case 2:
                setOpenPassword(true);
                break;
        }
    }

    function handleCopy(code) {
        navigator.clipboard.writeText(code);
    }

    function handleDialogClose() {
        setOpenEmail(false);
        setOpenPassword(false);
        setOpenFriend(false);
    }

    let mapCards = "";
    if (store) {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!RENDERING FOR CURRENTVIEW: " + store.browseMode);
        console.log("AMOUNT::: " + store.idNamePairs.length);
        console.log("FILTER::: " + store.filter);
        mapCards =
            <List sx={{ width: '100%', left: '0%' }}>
                {
                    store.idNamePairs.map((pair) => (
                        <MapCard
                            sx={{ color: 'black' }}
                            key={pair._id}
                            idNamePair={pair}
                            selected={false}
                        />
                    ))
                }
            </List>;
    }

    let inspect = '';
    if (store.currentMap) {
        if (store.currentMap.name) { //After editing store.currentMap is different
            let createdDate = store.currentMap.createdAt
            let sliceDate = createdDate.slice(0, 10)

            let publish = '';
            if (store.currentMap.published) {
                publish = <PublicIcon color='primary'></PublicIcon>
            }
            else {
                publish = <PublicOffIcon></PublicOffIcon>
            }

            inspect =
                <Box>
                    <Typography variant='h3'>
                        {store.currentMap.name}
                    </Typography>
                    <Typography variant='h5'>
                        {'Created by: ' + auth.getAccountDetails().firstName + ' ' + auth.getAccountDetails().lastName}
                        <br></br>
                        {'Created on: ' + sliceDate}
                        <br></br>
                        {publish}
                    </Typography>
                    <Box component='img' sx={{ height: '80%', width: '80%' }} src={placeholderimg}></Box>
                </Box>
        }
    } else {
        console.log('IN EHREHRHEHRHERH')
        inspect =
            <Box>
                <Typography variant='h3' sx={{ textAlign: 'center' }}>
                    Click on map to preview
                </Typography>
            </Box>
    }

    const sMen = <Menu
        anchorEl={banchor}
        // anchorOrigin={{
        //     vertical: 'top',
        //     horizontal: 'right',
        // }}
        id={'sort-menu'}
        // keepMounted
        // transformOrigin={{
        //     vertical: 'top',
        //     horizontal: 'right',
        // }}
        open={isSortOpen}
        onClose={handleMenuClose}
    >
        <MenuItem onClick={(event) => { handleSort(0) }}>By Creation Date (Old-New)</MenuItem>
        <MenuItem onClick={(event) => { handleSort(1) }}>By Creation Date (New-Old)</MenuItem>
        <MenuItem onClick={(event) => { handleSort(2) }}>By Name (A-Z)</MenuItem>
    </Menu>

    return (
        <div>
            <div id="list-selector-list">
                <div id='browseScreenProfileHeader'>
                    <div id='browseScreenAvatar'>
                        <Avatar sx={{ width: 56, height: 56 }}>{auth.getUserInitials()}</Avatar>
                    </div>

                    <Box sx={{ justifyContent: 'center', alignItems: 'center', height: 'fit-content' }}>
                        <Typography variant='h5'>Settings</Typography>
                        <List>
                            <ListItem>
                                <ListItemText>First name: {auth.getAccountDetails().firstName}</ListItemText>
                                <ListItemText>Last name: {auth.getAccountDetails().lastName}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>{'Email: '}{auth.getAccountDetails().email}{' '}
                                    <Button size='small' color='primary' variant='outlined' onClick={(event) => { handleDialogOpen(1) }}>Change</Button>
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>{'Password: placeholder '}
                                    <Button size='small' color='primary' variant='outlined' onClick={(event) => { handleDialogOpen(2) }}>Change</Button>
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>{'ContactID: '}{auth.getAccountDetails().userId}{' '}
                                    <IconButton size='small' color='primary' variant='outlined' aria-label='copy'>
                                        <ContentCopyIcon onClick={(event) => { handleCopy(auth.getAccountDetails().userId) }} />
                                    </IconButton>
                                </ListItemText>
                            </ListItem>
                        </List>
                        {emailDiag}
                        {passwordDiag}
                    </Box>
                </div>
                <div id='browseScreenSortHeader'>
                    Sort
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="sort mode"
                            aria-controls={'primary-search-account-menu'}
                            aria-haspopup="true"
                            onClick={handleSortMenuOpen}
                            color="inherit"
                        ><SortIcon /></IconButton>
                    </Box>
                </div>

                {sMen}
                {mapCards}
            </div>
            <div id="list-inspector">
                <Box >
                    {inspect}
                </Box>
            </div>
        </div>




    )
}

export default BrowseScreen;