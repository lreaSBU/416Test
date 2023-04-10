import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

const tps = new jsTPS(); //TPS stack for options in the browse screen (basic)
const tpsEdit = new jsTPS(); //TPS stack for edit screen (large and complex)

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props){
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        browseMode: 0,
        modalMode: 0,
        tabMode: 0,
        // Each Element Is One Map
        idNamePairs: [],
        currentMap: null,
        sortMode: 0,
        searchMode: 0,
        filter: null,
        page: 0,
        editingName: false,
        currentConvo: null,
        convoPairs: [],
        edit: null
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    const storeReducer = (p) => {
        return setStore({
            browseMode: (p.browseMode === undefined ? store.browseMode : p.browseMode),
            modalMode: (p.modalMode === undefined ? store.modalMode : p.modalMode),
            tabMode: (p.tabMode === undefined ? store.tabMode : p.tabMode),
            idNamePairs: (p.idNamePairs === undefined ? store.idNamePairs : p.idNamePairs),
            currentMap: (p.currentMap === undefined ? store.currentMap : p.currentMap),
            sortMode: (p.sortMode === undefined ? store.sortMode : p.sortMode),
            searchMode: (p.searchMode === undefined ? store.searchMode : p.searchMode),
            filter : (p.filter === undefined ? store.filter : p.filter),
            page : (p.page === undefined ? store.page : p.page),
            editingName : (p.editingName === undefined ? store.editingName : p.editingName),
            currentConvo : (p.currentConvo === undefined ? store.currentConvo : p.currentConvo),
            convoPairs : (p.convoPairs === undefined ? store.convoPairs : p.convoPairs),
            edit : (p.edit === undefined ? store.edit : p.edit)
        });
    }

    store.goToEditor = function(id){
        store.loadEditorData(id);
    }

    store.goMessages = function(){
        store.loadConvoPairs({
            //browseMode: 3,
            currentConvo: null,
            page: 0
        });
    }
    store.goHome = function(){
        console.log("1"); store.loadIdNamePairs({
            currentMap: null,
            browseMode: 0,
            filter: null,
            searchMode: 0,
            sortMode: 0,
            tabMode: 0,
            page: 0
        });
    }
    store.goSearchByUser = function(){
        console.log("2"); store.loadIdNamePairs({
            currentMap: null,
            browseMode: 1,
            filter: "",
            searchMode: 0,
            tabMode: 0,
            page: 0
        });
    }
    store.goSearchByName = function(){
        console.log("3"); store.loadIdNamePairs({
            currentMap: null,
            browseMode: 2,
            filter: "",
            searchMode: 1,
            tabMode: 0,
            page: 0
        });
    }

    store.changeSortMode = function(type){
        console.log("4"); store.loadIdNamePairs({
            sortMode: type,
            page: 0
        });
    }

    store.startSearch = function(nf){
        console.log("5"); store.loadIdNamePairs({
            filter: nf,
            page: 0
        });
    }

    store.switchTab = function(newTab){
        console.log("6"); store.loadIdNamePairs({
            tabMode: newTab
        });
    }

    store.setEditingMapName = function(act){
        console.log("7"); store.loadIdNamePairs({
            editingName: act
        });
    }
    store.changeMapName = function(id, nn){
        store.updateMapById(id, {name: nn});
    }

    store.updateMapById = function(id, p){
        async function asyncUpdate(){
            const response = await api.updateMapById(id, p);
            if(response.data.success){
                console.log("8"); store.loadIdNamePairs();
            }else console.log("FAILED TO UPDATE!?!?!?");
        }
        asyncUpdate();
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function(pr = {}){
        console.log("LOADING!!!!!!!");
        async function asyncLoadIdNamePairs(p){
            try{
                if(p.browseMode === undefined) p.browseMode = store.browseMode;
                if(p.modalMode === undefined) p.modalMode = store.modalMode;
                if(p.tabMode === undefined) p.tabMode = 0; //store.tabMode;
                p.convoPairs = [];
                p.edit = null;
                if(p.currentMap === undefined) p.currentMap = store.currentMap;
                if(p.sortMode === undefined) p.sortMode = store.sortMode;
                if(p.searchMode === undefined) p.searchMode = store.searchMode;
                if(p.filter === undefined) p.filter = store.filter;
                if(p.page === undefined) p.page = store.page;
                if(p.editingName === undefined) p.editingName = store.editingName;
                if(p.currentConvo === undefined) p.currentConvo = store.currentConvo;
                const response = p.filter === "" ? null : await api.getMapPairs(p.filter, p.searchMode, p.sortMode, p.page);
                p.idNamePairs = (p.filter === "" ? [] : response.data.idNamePairs);
                storeReducer(p);
                if(p.filter !== "" && !response.data.success) console.log("API FAILED TO GET THE LIST PAIRS");
            }catch(err){
                console.log("caught logout error");
            }
        }
        asyncLoadIdNamePairs(pr);
    }

    store.loadConvoPairs = function(p = {}){
        async function asyncLoadConvoPairs(){
            try{
                if(p.browseMode === undefined) p.browseMode = store.browseMode;
                if(p.modalMode === undefined) p.modalMode = store.modalMode;
                if(p.tabMode === undefined) p.tabMode = store.tabMode;
                p.idNamePairs = [];
                p.edit = null;
                if(p.currentMap === undefined) p.currentMap = store.currentMap;
                if(p.sortMode === undefined) p.sortMode = store.sortMode;
                if(p.searchMode === undefined) p.searchMode = store.searchMode;
                if(p.filter === undefined) p.filter = store.filter;
                if(p.page === undefined) p.page = store.page;
                if(p.editingName === undefined) p.editingName = store.editingName;
                if(p.currentConvo === undefined) p.currentConvo = store.currentConvo;
                const response = await api.getConvoPairs(p.page);
                console.log("GOT RESPONSE!!! --> " + JSON.stringify(response.data));
                //p.convoPairs = response.data.convoPairs;
                p.convoPairs = ([
                    {
                        _id: 1,
                        name: "Bob",
                        copy: {
                            dir: true,
                            msgs: [
                                {
                                    text: "Hey, how are you?",
                                    dir: true
                                }
                            ]
                        }
                    },
                    {
                        _id: 2,
                        name: "Alice",
                        copy: {
                            dir: false,
                            msgs: [
                                {
                                    text: "What's up?",
                                    dir: false
                                },
                                {
                                    text: "Not much",
                                    dir: true
                                }
                            ]
                        }
                    }
                ]);
                storeReducer(p);
                if(!response.data.success) console.log("API FAILED TO GET THE LIST PAIRS");
            }catch(err){
                console.log("caught logout error for convo");
            }
        }
        asyncLoadConvoPairs();
    }

    store.loadEditorData = function(id){
        /*async function asyncLoadEditorData(){
            //const newEdit = api.getEditorDataById(id);
            const newEdit = ({

            });
            storeReducer({
                browseMode: 0,
                tabMode: 2,
                edit: newEdit
            });
        }
        asyncLoadEditorData();*/
        const newEdit = ({

        });
        storeReducer({
            browseMode: 0,
            tabMode: 2,
            edit: newEdit
        });
    }
    store.editTabSwitch = function(){
        storeReducer({
            tabMode: store.tabMode == 2 ? 3 : 2
        });
    }

    store.setCurrentMap = function (id) {
        async function asyncSetCurrentMap(id) {
            let response = await api.getMapById(id);
            if(response.data.success){
                let map = response.data.map;
                tps.clearAllTransactions();
                console.log("9"); store.loadIdNamePairs({
                    currentMap: map
                });
                //history.push("/playlist/" + playlist._id);
            }
        }
        asyncSetCurrentMap(id);
    }

    store.setCurrentConv = function(id){
        let i;
        for(i = 0; i < store.convoPairs.length; i++) if(store.convoPairs[i]._id == id) break;
        if(i >= store.convoPairs.length) return;
        store.loadConvoPairs({
            currentConvo: store.convoPairs[i]
        });
    }

    store.createNewMap = async function(newName = "Untitled"){
        const response = await api.createMap(newName, auth.user);
        if(response.status === 201){
            tps.clearAllTransactions();
            console.log("10"); store.loadIdNamePairs({
                currentMap: response.data.map
            });
            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            //history.push("/playlist/" + newMap._id);
        }else console.log("API FAILED TO CREATE A NEW LIST");
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