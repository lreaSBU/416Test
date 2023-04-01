import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'

import EditToolbar from './EditToolbar'
import SearchBar from './Searchbar'
import Sortbar from './Sortbar'

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
        store.changeSort(type);
    }

    function handleCreateNewList() {
        store.createNewList();
    }
    const handleHome = (e) => {
        store.signalView(1);
    }

    const handleAll = (e) => {
        store.signalView(2);
    }

    const handleUser = (e) => {
        store.signalView(3);
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

    let editToolbar = "";
    let menu = loggedOutMenu;
    if (auth.loggedIn) {
        menu = loggedInMenu;
        if (store.currentList) {
            editToolbar = <EditToolbar />;
        }
    }
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
        <MenuItem onClick={(event) => {handleSort(1)}}>By Creation Date (Old-New)</MenuItem>
        <MenuItem onClick={(event) => {handleSort(2)}}>By Last Edit Date (New-Old)</MenuItem>
        <MenuItem onClick={(event) => {handleSort(3)}}>By Name (A-Z)</MenuItem>
    </Menu>
    let sortMenu = '';
    if(store.currentView){
        sortMenu =
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
    }
    let addButt = "";
    if(!store.currentList){
        if(store.currentView == 1 && auth.loggedIn){ //add list button
            addButt = <Fab 
                    color="primary" 
                    aria-label="add"
                    id="add-list-button"
                    onClick={handleCreateNewList}
                    > <AddIcon /> </Fab>
        }else if(store.currentView > 1){ //search bar
            addButt = <SearchBar />
        }
    }

    /*let searchBar = ""
    if(store.currentView > 1){ //on either "playlists" or "users" screens
        searchBar = <Searchbar />;
    }*/

    
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
                    </Typography>
                    <Box sx={{ width: '5%' }}></Box>
                    <Box id='bannerStatus' sx={{ fontSize: '32px' }}>{!auth.loggedIn ? '|' : (store.currentView == 1 ? 'Home' : (store.currentView == 2 ? 'Playlist Search: ' : 'User Search: '))}</Box>
                    <Box sx={{ width: '5%' }}></Box>
                    {addButt}
                    <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box>
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