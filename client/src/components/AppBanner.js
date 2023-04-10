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

import HomeIcon from '@mui/icons-material/Home'
import PublicIcon from '@mui/icons-material/Public'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [banchor, setBanchor] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

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
    let addButt = "";
    if (!store.currentMap && auth.loggedIn) {
        if ((store.browseMode == 0 || store.browseMode == 3) && auth.loggedIn) { //add list button
            addButt = <Fab
                size='medium'
                color='primary'
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewMap}
            > <AddIcon /> </Fab>
        } else if (store.browseMode > 0) {
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
            <AppBar position="static" sx={{ bgcolor: 'primary.complement' }}>

                {(auth.loggedIn) ?
                    <Toolbar>
                        <Box id='appBannerLogo' color={'primary.main'}><PublicIcon></PublicIcon>Map Central</Box>
                        <Box sx={{ width: '2%' }}></Box>
                        <Link onClick={handleHome} to="/" ><HomeIcon className='hvr-grow' sx={{ color: 'primary.main' }}></HomeIcon></Link>
                        <Box sx={{ width: '2%' }}></Box>
                        <Link className='hvr-grow' style={{ textDecoration: 'none', color: 'black' }} onClick={handleAll} to="/">Browse</Link>
                        <Box sx={{ width: '2%' }}></Box>
                        <Link className='hvr-grow' style={{ textDecoration: 'none', color: 'black' }} onClick={handleUser} to="/">Users</Link>
                        <Box sx={{ width: '2%' }}></Box>
                        <Link className='hvr-grow' style={{ textDecoration: 'none', color: 'black' }} onClick={handleDM} to="/message/">Chat</Link>
                        <Box sx={{ width: '2%' }}></Box>
                        <Link className='hvr-grow' style={{ textDecoration: 'none', color: 'black' }} onClick={handleHelp} to="/help/"><QuestionMarkIcon></QuestionMarkIcon></Link>
                        <Box sx={{ width: '5%' }}></Box>
                        <Box id='bannerStatus' sx={{ fontSize: 'x-large' }}>{(store.browseMode == 0) ? <>My Maps</> : <>Search:</>}</Box>
                        <Box sx={{ width: '1%' }}></Box>
                        {addButt}
                        <Box sx={{ flexGrow: 1 }}></Box>

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
                                {getAccountMenu(auth.loggedIn)}
                            </IconButton>
                        </Box>
                    </Toolbar>
                    : <></>}
            </AppBar>
            {menu}
        </Box >
    );
}
