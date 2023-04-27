import jsTPS_Transaction from "../common/jsTPS.js"

export default class Move_Transaction extends jsTPS_Transaction {
    constructor(store, scope, fl, gn, po, d1, d2) {
        super();
        this.store = store;
        this.scope = scope;
        this.fl = fl;
        this.gn = gn;
        this.po = po;
        this.d1 = d1;
        this.d2 = d2;
    }

    doTransaction() {
        if(this.scope){
            this.store.edit.l[this.fl][this.gn].elems[this.po].points[this.d1].addLocal(this.d2);
            this.store.edit.l[this.fl][this.gn].elems[this.po].reCalc(this.store.edit.l[this.fl][this.gn]);
            this.store.sendTransac(4, this.fl, this.gn, this.po, this.d1, this.d2);
        }else{
            console.log('not removing subregions just yet...');
        }
    }
    
    undoTransaction() {
        if(this.scope){
            this.store.edit.l[this.fl][this.gn].elems[this.po].points[this.d1].subtractLocal(this.d2);
            this.store.edit.l[this.fl][this.gn].elems[this.po].reCalc(this.store.edit.l[this.fl][this.gn]);
            let neg = {x: -this.d2.x, y: -this.d2.y};
            this.store.sendTransac(4, this.fl, this.gn, this.po, this.d1, neg);
        }else{
            console.log('not UNDOING removing subregions just yet...');
        }
    }
}