import React, { useContext, useEffect } from 'react'
import AuthContext from '../auth';

import { GlobalStoreContext } from '../store'
import MapCard from './MapCard.js'
//import MUIPublishModal from './MUIPublishModal'
//import MUIDeleteModal from './MUIDeleteModal'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const BrowseScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    useEffect(() => {        
        store.loadIdNamePairs();
    }, []);

    function handlePreviewTab(e){
        store.switchTab(0);
    }
    function handleCommentTab(e){
        store.switchTab(1);
    }

    let modalJSX = "";
    /*switch(store.modalMode){
        case 1: modalJSX = <MUIDeleteModal />; break;
        case 2: modalJSX = <MUIPublishModal />; break;
    }*/

    let mapCards = "";
    if(store){
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!RENDERING FOR CURRENTVIEW: " + store.browseMode);
        console.log("AMOUNT::: " + store.idNamePairs.length);
        console.log("FILTER::: " + store.filter);
        mapCards = 
        <List sx={{ width: '100%', left: '0%', bgcolor: '#ff0000' }}>
        {
            store.idNamePairs.map((pair) => (
                <MapCard
                    sx={{bgcolor: ((store.currentMap && (pair._id == store.currentMap._id)) ? 'red' : 'background.paper')}}
                    key={pair._id}
                    idNamePair={pair}
                    selected={false}
                />
            ))
        }
        </List>;
    }

    let inspect = '';
    if(store.currentMap){
        if(store.tabMode){ //comments
            /*var index = 0;
            inspect = 
            <div>
                <List sx={{ width: '100%', height: '90%', left: '0%', bgcolor: 'background.paper', overflow: 'auto' }}>
                {
                    store.currentMap.comments.map((pair) => (
                        <CommentCard
                            id={'playlist-comment-' + (index)}
                            key={'playlist-comment-' + (index++)}
                            cDat={pair}
                        />
                    ))
                }
                </List>
                <input id="cText" type="text" onKeyPress={handleCommentSub} />
            </div>;*/
            if(store.currentMap.published){
                inspect = <div>COMMENTS!!!</div>;
            }else{
                inspect = <div><Box sx={{borderRadius: 2, bgColor: '#aaa'}}>Unpublished Maps will not have a comments section.</Box></div>;
            }
        }else{ //player
            inspect = <div>PREVIEW!!!</div>
        }
    }

    return (
        <div id="playlist-selector">
            <div id="list-selector-heading">
            </div>
            <div id="list-selector-list">
                {mapCards}
                {modalJSX}
            </div>
            <div id="list-inspector">
                <Box sx={{p : 1, width: "100%", height: "10%", bgColor: '111111'}}>
                    <Button sx={{bgcolor: ((!store.currentMap || store.tabMode == 1) ? '#e1e4cb' : 'yellow'), fontSize: '16px', textAlign: "center", m: 1}} onClick={handlePreviewTab}>Preview</Button>
                    <Button sx={{bgcolor: ((!store.currentMap || store.tabMode == 0) ? '#e1e4cb' : 'yellow'), fontSize: '16px', textAlign: "center", m: 1}} onClick={handleCommentTab}>Comments</Button>
                </Box>
                <Box sx={{p : 1, height: '90%', width: '100%', color: 'red', bgColor: 'red'}}>
                    {inspect}
                </Box>
            </div>
        </div>)
}

export default BrowseScreen;