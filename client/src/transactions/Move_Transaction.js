import jsTPS_Transaction from "../common/jsTPS.js"

export default class Move_Transaction extends jsTPS_Transaction {
    constructor(store, fl, gn, po, d1, d2) {
        super();
        this.store = store;
        this.fl = fl;
        this.gn = gn;
        this.po = po;
        this.d1 = d1;
        this.d2 = d2;
    }

    doTransaction() {
        this.store.edit.l[this.fl][this.gn].elems[this.po].points[this.d1].addLocal(this.d2);
        this.store.edit.l[this.fl][this.gn].elems[this.po].reCalc(this.store.edit.l[this.fl][this.gn]);
        this.store.sendTransac(4, this.fl, this.gn, this.po, this.d1, this.d2);
    }
    
    undoTransaction() {
        this.store.edit.l[this.fl][this.gn].elems[this.po].points[this.d1].subtractLocal(this.d2);
        this.store.edit.l[this.fl][this.gn].elems[this.po].reCalc(this.store.edit.l[this.fl][this.gn]);
        let neg = {x: -this.d2.x, y: -this.d2.y};
        this.store.sendTransac(4, this.fl, this.gn, this.po, this.d1, neg);
    }
}