import jsTPS_Transaction from "../common/jsTPS.js"

export default class ChangeProperty_Transaction extends jsTPS_Transaction {
    constructor(store, fl, gn, po, d1, d3) {
        super();
        this.store = store;
        this.fl = fl;
        this.gn = gn;
        this.po = po;
        this.d1 = d1;
        this.d2 = this.store.edit.l[this.fl][this.gn].props[this.d1];
        this.d3 = d3;
    }

    doTransaction() {
        if(this.d3 == undefined) delete this.store.edit.l[this.fl][this.gn].props[this.d1];
        else this.store.edit.l[this.fl][this.gn].props[this.d1] = this.d3;
        this.store.sendTransac(5, this.fl, this.gn, this.po, this.d1, this.d3);
    }
    
    undoTransaction() {
        console.log("UNDONING"); //this never runs
        if(this.d2 == undefined) delete this.store.edit.l[this.fl][this.gn].props[this.d1];
        else this.store.edit.l[this.fl][this.gn].props[this.d1] = this.d2;
        this.store.sendTransac(5, this.fl, this.gn, this.po, this.d1, this.d2);
    }
}