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


    function handleDialogClose() {
        setOpenEmail(false);
        setOpenPassword(false);
        setOpenFriend(false);
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
        <></>


    )
}

export default BrowseScreen;