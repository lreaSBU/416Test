import jsTPS_Transaction from "../common/jsTPS.js"

export default class Remove_Transaction extends jsTPS_Transaction {
    constructor(store, fl, gn, po, d1, d2) {
        super();
        this.store = store;
        this.fl = fl;
        this.gn = gn;
        this.po = po; //array for the poly indices for points to be removed
        this.d1 = d1; //array for the point indices in their respective polys
        this.d2 = d2; //array of point values in case of restoration
    }

    doTransaction() {
        this.store.edit.l[this.fl][this.gn].elems[this.po].remove(this.d1, 1);
        this.store.edit.l[this.fl][this.gn].elems[this.po].reCalc(this.store.edit.l[this.fl][this.gn]);
        this.d2.h = false;
        this.store.sendTransac(2, this.fl, this.gn, this.po, this.d1, null);
    }
    
    undoTransaction() {
        this.store.edit.l[this.fl][this.gn].elems[this.po].points.splice(this.d1, 0, this.d2);
        this.store.edit.l[this.fl][this.gn].elems[this.po].reCalc(this.store.edit.l[this.fl][this.gn]);
        this.store.sendTransac(3, this.fl, this.gn, this.po, this.d1, this.d2.copy());
    }
}