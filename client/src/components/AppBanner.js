import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'

import SearchBar from './Searchbar'

import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SortIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [banchor, setBanchor] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const isSortOpen = Boolean(banchor);

    const handleSortMenuOpen = (event) => {
        setBanchor(event.currentTarget);
    };

    function handleSort(type){
        console.log("MENU_EVENT: " + type);
        handleMenuClose();
        store.changeSortMode(type);
    }

    function handleCreateNewMap() {
        store.createNewMap();
    }
    const handleHome = (e) => {
        store.goHome();
    }

    const handleAll = (e) => {
        store.goSearchByName();
    }

    const handleUser = (e) => {
        store.goSearchByUser();
    }
    
    const handleDM = (e) => {
        store.goMessages();
    }

    const handleHelp = (e) => {
        //store.goHelp(); //probably dont have to to anything
    }

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setBanchor(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
    }

    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem>
        </Menu>
    );
    const loggedInMenu = 
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem href='/' onClick={handleLogout}>Logout</MenuItem>
        </Menu>        

    let menu = loggedOutMenu;
    if (auth.loggedIn) menu = loggedInMenu;
    const sMen = <Menu
        anchorEl={banchor}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        id={'sort-menu'}
        keepMounted
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={isSortOpen}
        onClose={handleMenuClose}
    >
        <MenuItem onClick={(event) => {handleSort(0)}}>By Creation Date (Old-New)</MenuItem>
        <MenuItem onClick={(event) => {handleSort(1)}}>By Creation Date (New-Old)</MenuItem>
        <MenuItem onClick={(event) => {handleSort(2)}}>By Name (A-Z)</MenuItem>
    </Menu>
    let sortMenu =
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
    let addButt = "";
    if(!store.currentMap && auth.loggedIn){
        if((store.browseMode == 0 || store.browseMode == 3) && auth.loggedIn){ //add list button
            addButt = <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewMap}
                > <AddIcon /> </Fab>
        }else if(store.browseMode > 0){ //search bar
            addButt = <SearchBar />
        }
    }
    
    function getAccountMenu(loggedIn) {
        let userInitials = auth.getUserInitials();
        console.log("userInitials: " + userInitials);
        if (loggedIn) 
            return <div>{userInitials}</div>;
        else
            return <AccountCircle />;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography                        
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}                        
                    >
                        <Link style={{ textDecoration: 'none', color: 'white' }} onClick={handleHome} to="/">🏠</Link>
                        <Link style={{ textDecoration: 'none', color: 'white' }} onClick={handleAll} to="/">👥</Link>
                        <Link style={{ textDecoration: 'none', color: 'white' }} onClick={handleUser} to="/">👤</Link>
                        <Link style={{ textDecoration: 'none', color: 'white' }} onClick={handleDM} to="/message/">🗨</Link>
                        <Link style={{ textDecoration: 'none', color: 'white' }} onClick={handleHelp} to="/help/">?</Link>
                    </Typography>
                    <Box sx={{ width: '5%' }}></Box>
                    <Box id='bannerStatus' sx={{ fontSize: '32px' }}>{!auth.loggedIn ? '|' : (store.browseMode == 0 ? 'Home' : (store.browseMode == 2 ? 'Map Name Search: ' : (store.browseMode == 3 ? 'Messages' : 'Username Search: ')))}</Box>
                    <Box sx={{ width: '5%' }}></Box>
                    {addButt}
                    <Box sx={{ flexGrow: 1 }}></Box>
                    {sortMenu}
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            { getAccountMenu(auth.loggedIn) }
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {sMen}
            {menu}
        </Box>
    );
}
