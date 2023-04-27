import jsTPS_Transaction from "../common/jsTPS.js"
import { GlobalStoreContext } from '../store'
const { store } = useContext(GlobalStoreContext);

export default class CreatePoly_Transaction extends jsTPS_Transaction {
    constructor(fl, gn, num, pos) {
        super();
        this.index = initIndex;
        this.song = initSong;
    }

    doTransaction() {
        store.edit.l[this.fl][this.gn].elems.push({})
        //this.
    }
    
    undoTransaction() {
        this.store.removeSong(this.index);
    }
}