import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/Menu';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function Sortbar() {
    const { store } = useContext(GlobalStoreContext);
    const handleMenuClose = () => {
        //setAnchorEl(null);
    };

    const handleSortMenuOpen = (event) => {
        //setAnchorEl(event.currentTarget);
    };

    

    return (
    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <IconButton
            size="large"
            edge="end"
            aria-label="sort mode"
            aria-controls={'primary-search-account-menu'}
            aria-haspopup="true"
            onClick={handleSortMenuOpen}
            color="inherit"
        ></IconButton>
    </Box>)
}

export default Sortbar;