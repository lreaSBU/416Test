import jsTPS_Transaction from "../common/jsTPS.js"

export default class Remove_Transaction extends jsTPS_Transaction {
    constructor(store, scope, fl, gn, po, d1, d2) {
        super();
        this.store = store;
        this.scope = scope;
        this.fl = fl;
        this.gn = gn;
        this.po = po; //array for the poly indices for points to be removed
        this.d1 = d1; //array for the point indices in their respective polys
        this.d2 = d2; //array of point values in case of restoration
    }

    doTransaction() {
        if(this.scope){
            /*for(let i = 0; i < this.po.length; i++){
                store.edit.l[this.fl][this.gn].elems[this.po[i]].points[this.d1[i]] = null;
            }*/
            this.store.edit.l[this.fl][this.gn].elems[this.po].remove(this.d1, 1);
            this.store.edit.l[this.fl][this.gn].elems[this.po].reCalc(this.store.edit.l[this.fl][this.gn]);
            this.d2.h = false;
            this.store.sendTransac(2, this.fl, this.gn, this.po, this.d1, this.d2);
        }else{
            console.log('not removing subregions just yet...');
        }
    }
    
    undoTransaction() {
        if(this.scope){
            this.store.edit.l[this.fl][this.gn].elems[this.po].points.splice(this.d1, 0, this.d2);
            this.store.edit.l[this.fl][this.gn].elems[this.po].reCalc(this.store.edit.l[this.fl][this.gn]);
            this.store.sendTransac(3, this.fl, this.gn, this.po, this.d1, this.d2);
        }else{
            console.log('not UNDOING removing subregions just yet...');
        }
    }
}