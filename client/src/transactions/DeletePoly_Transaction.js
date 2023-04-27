import jsTPS_Transaction from "../common/jsTPS.js"

export default class Insert_Transaction extends jsTPS_Transaction {
    constructor(store, fl, gn, po, d1) {
        super();
        this.store = store;
        this.fl = fl;
        this.gn = gn;
        this.po = po;
        this.d1 = d1;
    }

    doTransaction() {
        this.store.edit.l[this.fl][this.gn].elems.splice(this.po, 1);
        this.store.sendTransac(6, this.fl, this.gn, -1, null, this.po);
    }
    
    undoTransaction() {
        this.store.edit.l[this.fl][this.gn].elems.splice(this.po, 0, this.d1);
        this.store.sendTransac(0, this.fl, this.gn, this.po, null, this.d1.points);
    }
}