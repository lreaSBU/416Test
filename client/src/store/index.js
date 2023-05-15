import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import epi from '../components/edit-request-api'
import AuthContext from '../auth'

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

const tps = new jsTPS(); //TPS stack for options in the browse screen (basic)

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
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
            browseMode: (p.browseMode == undefined ? store.browseMode : p.browseMode),
            modalMode: (p.modalMode == undefined ? store.modalMode : p.modalMode),
            tabMode: (p.tabMode == undefined ? store.tabMode : p.tabMode),
            idNamePairs: (p.idNamePairs == undefined ? store.idNamePairs : p.idNamePairs),
            currentMap: (p.currentMap == undefined ? store.currentMap : p.currentMap),
            sortMode: (p.sortMode == undefined ? store.sortMode : p.sortMode),
            searchMode: (p.searchMode == undefined ? store.searchMode : p.searchMode),
            filter: (p.filter == undefined ? store.filter : p.filter),
            page: (p.page == undefined ? store.page : p.page),
            editingName: (p.editingName == undefined ? store.editingName : p.editingName),
            currentConvo: (p.currentConvo == undefined ? store.currentConvo : p.currentConvo),
            convoPairs: (p.convoPairs == undefined ? store.convoPairs : p.convoPairs),
            edit: (p.edit == undefined ? store.edit : p.edit)
        });
    }

    store.goToEditor = function (id) {
        store.loadEditorData(id);
    }

    store.goMessages = function () {
        //store.currentConvo = null;
        //store.convoPairs = [];
        store.loadConvoPairs({
            browseMode: 3,
            currentConvo: null,
            page: 0
        });
    }
    store.goHelp = function(){
        store.loadIdNamePairs({
            browseMode: 4,
            currentConvo: null,
            page: 0
        });
    }
    store.goHome = async function () {
        store.currentMap = null;
        await store.loadIdNamePairs({
            idNamePairs: [],
            currentMap: null,
            browseMode: 0,
            filter: null,
            searchMode: 0,
            sortMode: 0,
            tabMode: 0,
            page: 0
        });
    }
    store.goSearchByName = async function () {
        store.currentMap = null;
        await store.loadIdNamePairs({
            idNamePairs: [],
            currentMap: null,
            browseMode: 2,
            filter: "",
            searchMode: 0,
            tabMode: 0,
            page: 0
        });
    }

    store.changeSortMode = async function (type) {
        await store.loadIdNamePairs({
            sortMode: type,
            page: 0
        });
    }

    store.startSearch = async function (nf) {
        await store.loadIdNamePairs({
            filter: nf,
            page: 0
        });
    }
    store.changeSearchMode = async function(sm){
        await store.loadIdNamePairs({
            searchMode: sm,
            page: 0
        });
    }

    store.switchTab = async function (newTab) {
        console.log("6");
        await store.loadIdNamePairs({
            tabMode: newTab
        });
    }

    store.setEditingMapName = async function (act) {
        await store.loadIdNamePairs({
            editingName: act
        });
    }
    store.changeMapName = function (id, nn) {
        store.updateMapById(id, { name: nn });
    }

    store.changePublished = function (id, pb) {
        store.updateMapById(id, {published: pb});
    }

    store.updateMapById = async function (id, p) {
        const response = await api.updateMapById(id, p);
        if(response.data.success) await store.loadIdNamePairs();
        else console.log("FAILED TO UPDATE!?!?!?");
    }

    store.deleteMapById = function (id) {
        async function asyncUpdate() {
            const response = await api.deleteMapById(id);
            if (response.data.success) {
                await store.loadIdNamePairs();
            } else {
                console.log("FAILED TO DELETE");
            }

        }
        asyncUpdate();
    }

    store.duplicateMapById = async function(id){
        const resp = await api.duplicateMapById(id);
        if(resp.data.success) await store.loadIdNamePairs();
        else console.log("FAILED TO DUPLICATE");
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = async function (p = {}) {
        try {
            if (p.browseMode == undefined) p.browseMode = store.browseMode;
            if (p.modalMode == undefined) p.modalMode = store.modalMode;
            if (p.tabMode == undefined) p.tabMode = 0; //store.tabMode;
            p.convoPairs = [];
            p.edit = null;
            if (p.currentMap == undefined) p.currentMap = store.currentMap;
            if (p.sortMode == undefined) p.sortMode = store.sortMode;
            if (p.searchMode == undefined) p.searchMode = store.searchMode;
            if (p.filter == undefined) p.filter = store.filter;
            if (p.page == undefined) p.page = store.page;
            if (p.editingName == undefined) p.editingName = store.editingName;
            if (p.currentConvo == undefined) p.currentConvo = store.currentConvo;
            //console.log(store.filter, '==>', p.filter);
            storeReducer(p);
            const response = await api.getMapPairs(!p.browseMode ? null : p.filter, p.searchMode, p.sortMode, p.page);
            console.log("PAIRS RESP:::", response);
            p.idNamePairs = response.data.idNamePairs;

            switch (p.sortMode) {
                case 0: //sort by date (old - new)
                    p.idNamePairs.sort((a, b) => new Date(a.copy.age) - new Date(b.copy.age))
                    break;
                case 1: //sort by date (new - old)
                    p.idNamePairs.sort((a, b) => new Date(b.copy.age) - new Date(a.copy.age))
                    break;
                case 2: //sort by name
                    p.idNamePairs.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                default:
            }

            storeReducer(p);
            if (!response.data.success) console.log("API FAILED TO GET THE LIST PAIRS");
        } catch (err) {
            console.log("caught logout error: " + err);
        }
    }

    store.createConvo = async function (id) {
        console.log("5");
        const response = await api.makeConvo(id);
        console.log(response);
        if (response.success) store.loadConvoPairs(); //it worked, now get the pairs again
    }

    store.loadConvoPairs = async function (p = {}) {
        try {
            let readFlag = false;
            if (p.browseMode == undefined) p.browseMode = store.browseMode;
            if (p.modalMode == undefined) p.modalMode = store.modalMode;
            if (p.tabMode == undefined) p.tabMode = store.tabMode;
            p.idNamePairs = [];
            p.edit = null;
            if (p.currentMap == undefined) p.currentMap = store.currentMap;
            if (p.sortMode == undefined) p.sortMode = store.sortMode;
            if (p.searchMode == undefined) p.searchMode = store.searchMode;
            if (p.filter == undefined) p.filter = store.filter;
            if (p.page == undefined) p.page = store.page;
            if (p.editingName == undefined) p.editingName = store.editingName;
            if (p.currentConvo == undefined) p.currentConvo = store.currentConvo;
            else readFlag = true;
            storeReducer(p);
            const response = await api.getConvoPairs(p.page, readFlag);
            console.log("GOT RESPONSE!!! --> ", response.data);
            p.convoPairs = response.data.convoPairs;
            store.convoPairs = response.data.convoPairs;
            storeReducer(p);
        } catch (err) {
            console.log("caught logout error for convo");
        }
    }
    store.sendMessage = async function (text) {
        console.log("4");
        const response = await api.sendMessage(store.currentConvo._id, text);
        console.log("send msg resp", response);
        if (response.success) store.loadConvoPairs(); //lets just refresh the entire thing for now
    }

    store.loadEditorData = function (id) {
        async function asyncStartEditing() {
            let response = await api.getStartData(id); //store.currentMap._id
            if (response.data.success) {
                response.data.ed.syncWait = 0;
                storeReducer({
                    browseMode: 0,
                    tabMode: 2,
                    edit: response.data.ed,
                    currentMap: { _id: id }
                });
                console.log("NEW_EDIT:::", response.data.ed);
            } else console.log("EDIT STARTING ERROR: ", response);
        }
        asyncStartEditing();
        /*
        storeReducer({
            browseMode: 0,
            tabMode: 2,
            edit: newEdit
        });
        */
    }
    store.sendTransac = async function(typ, fl, gn, pn, od, nd){
        store.edit.syncWait++;
        const resp = await epi.sendEdit(store.edit.mid, store.edit.transacNum++, typ, fl, gn, pn, od, nd);
        //console.log('EDIT RESP:', resp);
        store.edit.syncWait--;
    }
    store.sendImmediateTransac = async function(typ, fl, gn, pn, od, nd){
        store.edit.syncWait++;
        const resp = await epi.sendEdit(store.edit.mid, -1, typ, fl, gn, pn, od, nd);
        //console.log('EDIT RESP:', resp);
        store.edit.syncWait--;
    }
    store.reduceEdit = function () {
        console.log("1");
        storeReducer({
            edit: store.edit
        });
    }
    store.editTabSwitch = function () {
        console.log("2");
        storeReducer({
            tabMode: store.tabMode == 2 ? 3 : 2
        });
    }

    store.setCurrentMap = function (id) {
        console.log("SETTING NEW MAP!!!!!!");
        async function asyncSetCurrentMap(id) {
            let response = await api.getMapById(id);
            if (response.data.success) {
                let map = response.data.map;
                tps.clearAllTransactions();
                await store.loadIdNamePairs({
                    currentMap: map
                });
                //history.push("/playlist/" + playlist._id);
            }
        }
        asyncSetCurrentMap(id);
    }

    store.setCurrentConv = function (id) {
        let i;
        for (i = 0; i < store.convoPairs.length; i++) if (store.convoPairs[i]._id == id) break;
        if (i >= store.convoPairs.length) return;
        store.loadConvoPairs({
            currentConvo: store.convoPairs[i]
        });
    }

    store.createNewMap = async function (newName = "Untitled") {
        const response = await api.createMap(newName, auth.user);
        if (response.status === 201) {
            tps.clearAllTransactions();
            await store.loadIdNamePairs({
                currentMap: response.data.map
            });
            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            //history.push("/playlist/" + newMap._id);
        } else console.log("API FAILED TO CREATE A NEW LIST");
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