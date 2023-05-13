import jsTPS_Transaction from "../common/jsTPS.js"

export default class ChangeProperty_Transaction extends jsTPS_Transaction {
    constructor(store, fl, gn, po, d1, d3) {
        super();
        this.store = store;
        this.fl = fl;
        this.gn = gn;
        this.po = po;
        this.d1 = d1;
        this.d2 = this.getProps()[this.d1];
        this.d3 = d3;
    }

    getProps(){
        if(this.fl == -1) return this.store.edit.gd;
        else return this.store.edit.l[this.fl][this.gn].props;
    }

    doTransaction() {
        if(this.d3 == undefined) delete this.getProps()[this.d1];
        else this.getProps()[this.d1] = this.d3;
        this.store.sendTransac(5, this.fl, this.gn, this.po, this.d1, this.d3);
    }
    
    undoTransaction() {
        if(this.d2 == undefined) delete this.getProps()[this.d1];
        else this.getProps()[this.d1] = this.d2;
        this.store.sendTransac(5, this.fl, this.gn, this.po, this.d1, this.d2);
    }
}