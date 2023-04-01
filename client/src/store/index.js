import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers.
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    SIGNAL_VIEW: "SIGNAL_VIEW",
    CHANGE_SEARCH_TERM: "CHANGE_SEARCH_TERM",
    CHANGE_SORT_MODE: "CHANGE_SORT_MODE",
    SWITCH_TAB: "SWITCH_TAB",
    SWAP_COMMENTS: "SWAP_COMMENTS",
    SHIFT_SONG_INDEX: "SHIFT_SONG_INDEX"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        currentView: 0,
        searchTerm: [],
        sortMode : 1,
        tabMode: 0
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    searchTerm: store.searchTerm,
                     sortMode : store.sortMode,
                    tabMode: store.tabMode
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                console.log("CLOSING CURRENT LIST!!!");
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    searchTerm: store.searchTerm,
                     sortMode : store.sortMode,
                     tabMode: store.tabMode
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    searchTerm: store.searchTerm,
                     sortMode : store.sortMode,
                     tabMode: store.tabMode
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    searchTerm: store.searchTerm,
                     sortMode : store.sortMode,
                     tabMode: store.tabMode
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    currentView: store.currentView,
                    searchTerm: store.searchTerm,
                     sortMode : store.sortMode,
                     tabMode: store.tabMode
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: 0,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    searchTerm: store.searchTerm,
                     sortMode : store.sortMode,
                     tabMode: 1 
                }); //store.tabMode
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    searchTerm: store.searchTerm,
                     sortMode : store.sortMode,
                     tabMode: store.tabMode
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    searchTerm: store.searchTerm,
                     sortMode : store.sortMode,
                     tabMode: store.tabMode
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    searchTerm: store.searchTerm,
                     sortMode : store.sortMode,
                     tabMode: store.tabMode
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    searchTerm: store.searchTerm,
                     sortMode : store.sortMode,
                     tabMode: store.tabMode
                });
            }
            case GlobalStoreActionType.SIGNAL_VIEW: {
                console.log("SETTING VIEW: " + payload);
                return setStore({
                    currentModal : store.currentModal,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    currentView: payload,
                    searchTerm: [],
                     sortMode : store.sortMode,
                     tabMode: 0
                });
            }
            case GlobalStoreActionType.CHANGE_SEARCH_TERM: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    searchTerm: payload.data,
                    sortMode : payload.acTerm,
                    tabMode: store.tabMode
                });
            }
            case GlobalStoreActionType.CHANGE_SORT_MODE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    currentView: store.currentView,
                    searchTerm: store.searchTerm,
                    sortMode : payload,
                    tabMode: store.tabMode
                });
            }
            case GlobalStoreActionType.SWITCH_TAB: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    currentView: store.currentView,
                    searchTerm: store.searchTerm,
                    sortMode : store.sortMode,
                    tabMode: payload
                });
            }
            case GlobalStoreActionType.SWAP_COMMENTS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    currentView: store.currentView,
                    searchTerm: store.searchTerm,
                    sortMode : store.sortMode,
                    tabMode: store.tabMode
                });
            }
            case GlobalStoreActionType.SHIFT_SONG_INDEX: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.index,
                    currentSong: payload.song,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    currentView: store.currentView,
                    searchTerm: store.searchTerm,
                    sortMode : store.sortMode,
                    tabMode: store.tabMode
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs(-1);
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    store.shiftSongIndex = function(i, s){
        storeReducer({
            type: GlobalStoreActionType.SHIFT_SONG_INDEX,
            payload: {song: s, index: i}
        });
        console.log(i + "-->" + store.currentSongIndex);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
    }

    store.switchTab = function(tab){
        storeReducer({
            type: GlobalStoreActionType.SWITCH_TAB,
            payload: tab
        });
        //if(store.currentView == 1) store.loadIdNamePairs(store.currentList, type); //refresh
        //else if(store.currentView > 1) store.startSearch(store.sortMode, type); //refresh this too
    }

    store.startComment = function(msg){
        async function asyncComment(){
            const response = await api.addCommentById(msg, auth.user.firstName + " " + auth.user.lastName, store.currentList._id);
            if (response.data.success) {
                console.log("COMMENTCOMMENTCOMMENTCOMMENTCOMMENTCOMMENTCOMMENTCOMMENTCOMMENTCOMMENT");
                //store.loadIdNamePairs(); //refresh the current list to reflect publishing changes
                if(store.currentList._id == response.data.id){
                    console.log("ACTUALLY SETTING COMMENT APPEARANCE: " + JSON.stringify(response.data.cDat));
                    //store.currentList.comments.push(response.data.cDat);
                    var copy = JSON.parse(JSON.stringify(store.currentList));
                    copy.comments.push(response.data.cDat);
                    storeReducer({
                        type: GlobalStoreActionType.SWAP_COMMENTS,
                        payload: copy 
                    });
                }
            }
            else {
                console.log("API FAILED TO COMMENT ON PLAYLIST");
            }
        }
        asyncComment();
    }

    store.startSearch = function(st, sm = 1){
        async function asyncstartSearch() {
            const response = await api.getSearchPairs(st, store.currentView);
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log("SORTING SEARCH BY ::::: " + sm);
                switch(sm){
                    case 1:
                        //console.log(new Date(pairsArray[0].copy.createdAt).getTime());
                        pairsArray.sort(function(a, b){return new Date(a.copy.createdAt).getTime() - new Date(b.copy.createdAt).getTime()});
                    break; case 2:
                        pairsArray.sort(function(b, a){return new Date(a.copy.updatedAt).getTime() - new Date(b.copy.updatedAt).getTime()});
                    break; case 3:
                        pairsArray.sort(function(a, b){return a.copy.name.localeCompare(b.copy.name)});
                    break;
                }
                storeReducer({
                    type: GlobalStoreActionType.CHANGE_SEARCH_TERM,
                    payload: {acTerm: st, data: pairsArray}
                });
            }
            else {
                console.log("API FAILED TO GET THE SEARCH PAIRS");
            }
        }
        asyncstartSearch();
    }

    store.publishList = function(pl){
        async function asyncPublish(){
            pl.published = true;
            console.log("publishPlaylist: " + JSON.stringify(pl));
            const response = await api.updatePlaylistById(pl._id, pl);
            if (response.data.success) {
                console.log("PUBLISHEDPUBLISHEDPUBLISHEDPUBLISHEDPUBLISHEDPUBLISHEDPUBLISHEDPUBLISHED");
                store.loadIdNamePairs(); //refresh the current list to reflect publishing changes
            }
            else {
                console.log("API FAILED TO PUBLISH PLAYLIST");
            }
        }
        asyncPublish();
    }

    store.changeSort = function(type){
        /*storeReducer({
            type: GlobalStoreActionType.CHANGE_SORT_MODE,
            payload: type
        });*/
        async function asyncSort(){
            console.log("SORTEDSORTEDSORTEDSORTEDSORTEDSORTEDSORTEDSORTEDSORTEDSORTEDSORTEDSORTEDSORTEDSORTED");
            if(store.currentView == 1) store.loadIdNamePairs(store.currentList, type); //refresh
            else if(store.currentView > 1) store.startSearch(store.sortMode, type); //refresh this too
        }
        asyncSort();
    }

    store.changeLikes = function(id, lt){
        async function asyncLike(){
            try{
                const response = await api.likePlaylistById(id, lt, auth.user.email);
                if (response.data.success) {
                    console.log("LIKEDLIKEDLIKEDLIKEDLIKEDLIKEDLIKEDLIKEDLIKEDLIKEDLIKEDLIKEDLIKEDLIKED: " + response.data.acStat);
                    if(response.data.acStat) for(var i = 0; i < store.searchTerm.length; i++){
                        if(store.searchTerm[i]._id == id){
                            if(lt) store.searchTerm[i].likes++;
                            else store.searchTerm[i].dislikes++;
                            break;
                        }
                    }
                    store.loadIdNamePairs(); //refresh the current list to reflect publishing changes
                }
                else {
                    console.log("API FAILED TO LIKE PLAYLIST");
                }
            }catch(e){
                console.log('need to be logged in to like/dislike');
            }
        }
        asyncLike();
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function (nln = null, nls = []) {
        let newListName = "Untitled" + store.newListCounter;
        if(nln) newListName = nln;
        const response = await api.createPlaylist(newListName, nls, auth.user.email, auth.user.firstName + " " + auth.user.lastName);
        console.log("createNewList response: " + response);
        if (response.status === 201){
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/playlist/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function (t = -1, sm = 1) {
        async function asyncLoadIdNamePairs() {
            if(t == -1){
                console.log("SETTING T TO ::::: " + store.currentView);
                t = store.currentView;
            }
            try{
                const response = await api.getPlaylistPairs(t);
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    //console.log("SORTING BY ::::: " + sm);
                    switch(sm){
                        case 1:
                            //console.log(new Date(pairsArray[0].copy.createdAt).getTime());
                            pairsArray.sort(function(a, b){return new Date(a.copy.createdAt).getTime() - new Date(b.copy.createdAt).getTime()});
                        break; case 2:
                            pairsArray.sort(function(b, a){return new Date(a.copy.updatedAt).getTime() - new Date(b.copy.updatedAt).getTime()});
                        break; case 3:
                            pairsArray.sort(function(a, b){return a.copy.name.localeCompare(b.copy.name)});
                        break;
                    }
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: pairsArray
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
            }catch(err){
                console.log("caught logout error");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.signalView = (pg) => {
        console.log("OPSAOPOP: " + pg);
        storeReducer({
            type: GlobalStoreActionType.SIGNAL_VIEW,
            payload: pg
        });
        console.log("storeCurrentView: " + store.currentView);
        //store.loadIdNamePairs(pg);
    }
    store.deleteList = async function (id) {
        /*async function processDelete(id) {
            
        }
        processDelete(id);*/
        let response = await api.deletePlaylistById(id);
        if (response.data.success) {
            store.loadIdNamePairs();
            history.push("/");
        }
    }
    store.deleteMarkedList = async function() {
        await store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
        store.loadIdNamePairs();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        if(store.currentList.published) return;
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                tps.clearAllTransactions();
                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    if(response.data.recovery){
                        playlist = response.data.recovery;
                    }
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.justSetCurrentList = function (id) {
        async function asyncJustSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                tps.clearAllTransactions();
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
                history.push("/playlist/" + playlist._id);
            }
        }
        asyncJustSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }

    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        if(store.currentList.published){
            console.log("cannot edit a song in a published list");
            return;
        }
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canEditBar = function(){
        return store.currentModal === "NONE" && (store.currentList !== null) && !store.currentList.published;
    }
    store.canAddNewSong = function() {
        return store.canEditBar();
    }
    store.canUndo = function() {
        return store.canEditBar() && tps.hasTransactionToUndo();
    }
    store.canRedo = function() {
        return store.canEditBar() && tps.hasTransactionToRedo();
    }
    store.canClose = function() {
        return store.currentModal === "NONE" && (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };