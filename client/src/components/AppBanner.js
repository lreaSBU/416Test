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
import Button from '@mui/material/Button';

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

    const handleEditTab = (e) => {
        store.editTabSwitch();
    }

    function handleSort(type) {
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

    const handleAll = async (e) => {
        await store.goSearchByName();
    }

    const handleDM = (e) => {
        store.goMessages();
    }

    const handleHelp = (e) => {
        store.goHelp(); //probably dont have to to anything
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
            // anchorOrigin={{
            //     vertical: 'top',
            //     horizontal: 'right',
            // }}
            // id={menuId}
            // keepMounted
            // transformOrigin={{
            //     vertical: 'top',
            //     horizontal: 'right',
            // }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem to='/' onClick={handleLogout}>Logout</MenuItem>
        </Menu>

    let menu = loggedOutMenu;
    if (auth.loggedIn) menu = loggedInMenu;

    let addButt = "";
    if (store.currentMap && auth.loggedIn) {
        // if ((store.browseMode == 0 || store.browseMode == 3) && store.tabMode < 2 && auth.loggedIn) { //add list button
        if (store.tabMode < 2) {
            addButt = <Fab
                size='medium'
                color='primary'
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewMap}
            > <AddIcon /> </Fab>
        }
        // } else if (store.browseMode > 0) {
        //     addButt = <SearchBar />
        // }
    }
    // let editTab = '';
    /*if (auth.loggedIn && store.tabMode > 1) {
        editTab = <Button sx={{ bgcolor: '#e1e4cb', fontSize: '16px', textAlign: "center", m: 1 }} onClick={handleEditTab}>{(store.tabMode == 2 ? <>Graphics</> : <>Editing</>)}</Button>
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
        (auth.loggedIn) ?
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ bgcolor: 'primary.complement' }}>
                    <Toolbar>
                        <Box id='appBannerLogo' color={'primary.main'}><PublicIcon sx={{fontSize: 'xx-large'}}></PublicIcon>Map Central</Box>
                        <Box sx={{ width: '2%' }}></Box>
                        <Link onClick={handleHome} to="/" ><HomeIcon className='hvr-grow' sx={{ color: 'primary.main' }}></HomeIcon></Link>
                        <Box sx={{ width: '2%' }}></Box>
                        <Link className='hvr-grow' style={{ textDecoration: 'none', color: 'black' }} onClick={handleAll} to="/browse/">Browse</Link>
                        <Box sx={{ width: '2%' }}></Box>
                        <Link className='hvr-grow' style={{ textDecoration: 'none', color: 'black' }} onClick={handleDM} to="/message/">Chat</Link>
                        <Box sx={{ width: '2%' }}></Box>
                        <Link className='hvr-grow' style={{ textDecoration: 'none', color: 'black' }} onClick={handleHelp} to="/help/"><QuestionMarkIcon></QuestionMarkIcon></Link>
                        <Box sx={{ width: '5%' }}></Box>
                        <Box id='bannerStatus' sx={{ fontSize: 'xx-large' }}>{(store.browseMode == 0 && store.tabMode < 2 ? <Link onClick={handleHome} to="/"><Fab
                            size='large'
                            color='primary'
                            aria-label="add"
                            id="add-list-button"
                            variant='extended'
                            onClick={handleCreateNewMap}
                        > <AddIcon /> New Map</Fab></Link> : <></>
                        )
                        }</Box>

                        <Box sx={{ flexGrow: 1 }}></Box>
                        {/* {editTab} */}
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
                    {menu}
                </AppBar >
            </Box>
            : <></>
    );
}
