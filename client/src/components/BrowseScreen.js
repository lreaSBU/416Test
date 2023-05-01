import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import MapCard from './MapCard.js'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SortIcon from '@mui/icons-material/Menu';
import { Avatar, InputBase, ListItem, ListItemText, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PublicIcon from '@mui/icons-material/Public';
import PublicOffIcon from '@mui/icons-material/PublicOff';
import placeholderimg from './Capture.png';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';


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

    function handleChangeSearchMode(b){
        store.changeSearchMode(b);
    }

    function handleSearchKey(e){
        if(e.key == 'Enter'){
            store.startSearch(e.target.value);
        }
    }

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


    function handleDialogClose() {
        setOpenEmail(false);
        setOpenPassword(false);
        setOpenFriend(false);
    }

    let mapCards = "";
    if (store) {
        mapCards =
            <List sx={{ width: '100%', left: '0%' }}>
                {
                    store.idNamePairs.map((pair) => (
                        <MapCard
                            sx={{ color: 'black' }}
                            key={pair._id}
                            idNamePair={pair}
                            selected={false}
                            owned={false}
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

            // let publish = '';
            // if (store.currentMap.published) {
            //     publish = <PublicIcon color='primary'></PublicIcon>
            // }
            // else {
            //     publish = <PublicOffIcon></PublicOffIcon>
            // }

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
                        {/* {publish} */}
                    </Typography>
                    <Box component='img' sx={{ height: '80%', width: '80%' }} src={placeholderimg}></Box>
                </Box>
        }
    } else {
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
                <div id='profileScreenSortHeader'>
                    <Box sx={{ display: { xs: 'none', md: 'flex', width: '80%'} }}>
                        <IconButton
                            size="large"
                            // edge="end"
                            aria-label="sort mode"
                            aria-controls={'primary-search-account-menu'}
                            aria-haspopup="true"
                            onClick={handleSortMenuOpen}
                            // color="inherit"
                            sx={{p: '10x'}}
                        ><SortIcon /></IconButton>
                        <TextField sx={{marginTop: 1}} variant='outlined' fullWidth onKeyDown={handleSearchKey} label={store.searchMode ? 'Search By User Name' : 'Search By Map Name'}></TextField>
                        {
                            (store.searchMode ?
                            <IconButton size='small' onClick={(event) => { handleChangeSearchMode(0) }}><PersonIcon/></IconButton>
                            : <IconButton size='small' onClick={(event) => { handleChangeSearchMode(1) }}><PeopleIcon/></IconButton>)
                        }
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