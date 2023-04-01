import React, { useContext, useEffect } from 'react'
import AuthContext from '../auth';

import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import YouTube from './YouTubePlayerExample.js'
import CommentCard from './CommentCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    useEffect(() => {        
        store.loadIdNamePairs();
    }, []);

    function handleCommentSub(event){
        if(event.key == "Enter"){
            if(auth.loggedIn){
                var newTerm = document.getElementById('cText').value;
                console.log("NEW COMMENT : " + newTerm);
                store.startComment(newTerm);
            }
            document.getElementById('cText').value = '';
        }
    }

    function handlePlayerTab(e){
        store.switchTab(0);
    }

    function handleCommentTab(e){
        store.switchTab(1);
    }

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }

    let listCard = "";
    if (store) {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!RENDERING FOR CURRENTVIEW: " + store.currentView);
        console.log(store.idNamePairs.length);
        console.log(store.searchTerm.length);
        listCard = 
        <List sx={{ width: '100%', left: '0%', bgcolor: 'background.paper' }}>
        {
            (store.currentView > 1 ? store.searchTerm : store.idNamePairs).map((pair) => (
                <ListCard
                    sx={{bgcolor: ((store.currentList && (pair._id == store.currentList._id)) ? 'red' : 'background.paper')}}
                    key={pair._id}
                    idNamePair={pair}
                    selected={false}
                />
            ))
        }
        </List>;
    }

    let inspect = '';
    if(store.currentList) if(store.currentList.published && store.tabMode){ //comments
        var index = 0;
        inspect = 
        <div>
            <List sx={{ width: '100%', height: '90%', left: '0%', bgcolor: 'background.paper', overflow: 'auto' }}>
            {
                store.currentList.comments.map((pair) => (
                    <CommentCard
                        id={'playlist-comment-' + (index)}
                        key={'playlist-comment-' + (index++)}
                        cDat={pair}
                    />
                ))
            }
            </List>
            <input id="cText" type="text" onKeyPress={handleCommentSub} />
        </div>;
        //inspect = <div>COMMENTS!!!</div>
    }else if(!store.tabMode){ //player
        inspect = (<YouTube />); //<div>{YPlayer}</div>
    }

    return (
        <div id="playlist-selector">
            <div id="list-selector-heading">
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
                {modalJSX}
            </div>
            <div id="list-inspector">
                <Box sx={{p : 1, width: "100%", height: "10%", bgColor: '111111'}}>
                    <Button sx={{bgcolor: ((!store.currentList || store.tabMode == 1) ? '#e1e4cb' : 'yellow'), fontSize: '16px', textAlign: "center", m: 1}} onClick={handlePlayerTab}>Player</Button>
                    <Button sx={{bgcolor: ((!store.currentList || store.tabMode == 0) ? '#e1e4cb' : 'yellow'), fontSize: '16px', textAlign: "center", m: 1}} onClick={handleCommentTab}>Comments</Button>
                </Box>
                <Box sx={{p : 1, height: '90%', width: '100%', color: 'red', bgColor: 'red'}}>
                    {inspect}
                </Box>
            </div>
        </div>)
}

export default HomeScreen;