import React, { useContext, useEffect, useState, useRef } from 'react'
import AuthContext from '../auth';

import { GlobalStoreContext } from '../store'
import { sendMessage } from '../store/store-request-api'

import ContactCard from './ContactCard.js'
import MessageCard from './MessageCard.js'
//import MUIPublishModal from './MUIPublishModal'
//import MUIDeleteModal from './MUIDeleteModal'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import SendIcon from '@mui/icons-material/Send';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import { IconButton, InputAdornment } from '@mui/material';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const MessageScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [someVar, setSomeVar] = useState(null);
    const [contactID, setContactID] = useState("");
    const messagesEndRef = useRef(null)
    const [contactFail, setContactFail] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        store.loadConvoPairs();
        scrollToBottom();
    }, []);

    let modalJSX = "";
    /*switch(store.modalMode){
        case 1: modalJSX = <MUIDeleteModal />; break;
        case 2: modalJSX = <MUIPublishModal />; break;
    }*/
    function handleSub(e) {
        if (e.key == "Enter") {
            handleChangeContact(e);
            handleNewContact(null);
        }
    }
    function handleChangeContact(e) {
        setContactID(e.target.value);
    }
    async function handleNewContact(e) {
        let worked = await store.createConvo(contactID);
        console.log('-->', worked)
        if(!worked) setContactFail(!worked);
    }

    let convoCards = "";
    if (store) {
        //console.log("!!!!!!!!!!!RENDERING FOR CONVOS NOW -- !!GOOD...");
        //console.log("AMOUNT:: " + store.convoPairs.length);
        //console.log("CURRENT:: " + store.currentConvo);
        convoCards =
            <List sx={{ width: '100%', left: '0%', bgcolor: 'background.paper' }}>
                {
                    store.convoPairs.map((pair) => (
                        <ContactCard
                            sx={{ bgcolor: ((store.currentConvo && (pair._id == store.currentConvo._id)) ? 'yellow' : 'background.paper') }}
                            key={pair._id}
                            idNamePair={pair}
                            selected={false}
                        />
                    ))
                }
            </List>;
    }

    let inspect = '';
    if (store.currentConvo) {
        //inspect = <div>CONVERSATION WITH {store.currentConvo.name}</div>
        inspect =
            <List sx={{ width: '100%', left: '0%', bgcolor: '#fff' }}>
                {
                    store.currentConvo.copy.msgs.map((msg) => (
                        <MessageCard
                            sx={{ bgcolor: 'background.paper' }}
                            text={msg.text}
                            dir={(msg.dir == store.currentConvo.copy.dir)}
                        />
                    ))
                }
            </List>;
    }
    const handleMessageSent = (event) => {
        if (event.key == 'Enter') {
            console.log("ENTER PRESSED");
            console.log(event.target.value);
            console.log(store.currentConvo);
            store.sendMessage(event.target.value);
            store.currentConvo.copy.msgs.push(
                { text: event.target.value, dir: store.currentConvo.copy.dir }
            )
            event.target.value = "";
            inspect =
                <List scrollBottom='100' sx={{ width: '100%', left: '0%', bgcolor: '#fff' }}>
                    {
                        store.currentConvo.copy.msgs.map((msg) => (
                            <MessageCard
                                sx={{ bgcolor: 'background.paper' }}
                                text={msg.text}
                                dir={(msg.dir == store.currentConvo.copy.dir)}
                            />
                        ))
                    }{<div ref={messagesEndRef} />}
                </List>;
            setSomeVar(!someVar);
            // sendMessage(auth, store.currentConvo._id, event.target.value);
            /*
           // need to be able to render the new message
           //need to rerender everytime inspect is updated
           let temp = someVar;
           setSomeVar(!temp);*/
        }

    }
    //console.log(inspect);
    return (
        <div id="playlist-selector">
            <div id="contact-selector-list">
                <div id="messageHeader">
                    <Box sx={{ height: 'fit-content', display: 'flex', justifyContent: 'space-between' }}>
                        <TextField label="Add Contact" sx={{ width: '80%' }} onChange={handleChangeContact} onKeyPress={handleSub}></TextField>
                        <Fab
                            sx={{ alignItems: 'right' }}
                            size='medium'
                            color='primary'
                            aria-label="add"
                            id="addContactButton"
                            onClick={handleNewContact}
                        > <AddIcon /> </Fab>
                    </Box>
                    <Typography variant='h5' hidden={!contactFail} sx={{color: 'red'}}>Invalid New Contact</Typography>
                </div>
                {convoCards}
                {modalJSX}
            </div>
            <div id="contact-inspector">
                <Box id="messageList" sx={{ p: 1, height: '90%', width: '100%', color: 'red', bgColor: 'red' }}>
                    {inspect}
                    
                </Box>
                {store.currentConvo ?
                    <TextField sx={{ width: '100%' }} label="Message" onKeyDown={handleMessageSent} InputProps={{ endAdornment: <InputAdornment position='end'><IconButton onClick={handleMessageSent}><SendIcon color='primary' /></IconButton></InputAdornment> }}></TextField>
                    :
                    <></>}
            </div>
        </div>)
}

export default MessageScreen;