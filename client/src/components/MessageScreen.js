import React, { useContext, useEffect } from 'react'
import AuthContext from '../auth';

import { GlobalStoreContext } from '../store'
import ContactCard from './ContactCard.js'
import MessageCard from './MessageCard.js'
//import MUIPublishModal from './MUIPublishModal'
//import MUIDeleteModal from './MUIDeleteModal'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const MessageScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    useEffect(() => {        
        store.loadIdNamePairs();
    }, []);

    let modalJSX = "";
    /*switch(store.modalMode){
        case 1: modalJSX = <MUIDeleteModal />; break;
        case 2: modalJSX = <MUIPublishModal />; break;
    }*/

    let convoCards = "";
    if(store){
        console.log("!!!!!!!!!!!RENDERING FOR CONVOS NOW -- !!GOOD...");
        console.log("AMOUNT:: " + store.convoPairs.length);
        console.log("CURRENT:: " + store.currentConvo);
        convoCards = 
        <List sx={{ width: '100%', left: '0%', bgcolor: 'background.paper' }}>
        {
            store.convoPairs.map((pair) => (
                <ContactCard
                    sx={{bgcolor: ((store.currentConvo && (pair._id == store.currentConvo._id)) ? 'yellow' : 'background.paper')}}
                    key={pair._id}
                    idNamePair={pair}
                    selected={false}
                />
            ))
        }
        </List>;
    }

    let inspect = '';
    if(store.currentConvo){
        //inspect = <div>CONVERSATION WITH {store.currentConvo.name}</div>
        inspect =
        <List sx={{ width: '100%', left: '0%', bgcolor: '#fff' }}>
        {
            store.currentConvo.copy.msgs.map((msg) => (
                <MessageCard
                    sx={{bgcolor: 'background.paper'}}
                    text={msg.text}
                    dir={(msg.dir == store.currentConvo.copy.dir)}
                />
            ))
        }
        </List>;
    }

    return (
        <div id="playlist-selector">
            <div id="list-selector-heading">
            </div>
            <div id="contact-selector-list">
                {convoCards}
                {modalJSX}
            </div>
            <div id="contact-inspector">
                <Box sx={{p : 1, height: '90%', width: '100%', color: 'red', bgColor: 'red'}}>
                    {inspect}
                </Box>
                {store.currentConvo ? <TextField sx={{width:'100%'}} label="Message"/> : <></>}
            </div>
        </div>)
}

export default MessageScreen;