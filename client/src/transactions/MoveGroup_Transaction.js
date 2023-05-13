import jsTPS_Transaction from "../common/jsTPS.js"

export default class MoveGroup_Transaction extends jsTPS_Transaction {
    constructor(store, scope, fl, gn, po, d1) {
        super();
        this.store = store;
        this.scope = scope;
        this.fl = fl;
        this.gn = gn;
        this.po = po;
        this.d1 = d1;
        this.neg = {x: -this.d1.x, y: -this.d1.y};
    }

    movePoly(fl, gn, po, dir){
        for(let p of this.store.edit.l[fl][gn].elems[po].points)
            if(dir) p.addLocal(this.d1);
            else p.subtractLocal(this.d1);
        this.store.edit.l[fl][gn].elems[po].reCalc(this.store.edit.l[fl][gn]);
        this.store.sendTransac(9, fl, gn, po, null, (dir ? this.d1 : this.neg));
    }

    doTransaction() {
        if(this.scope){ //move Poly
            this.movePoly(this.fl, this.gn, this.po, true);
        }else{ //move Subregion
            for(let i = 0; i < this.store.edit.l[this.fl][this.gn].elems.length; i++)
                this.movePoly(this.fl, this.gn, i, true);
        }
    }
    
    undoTransaction() {
        if(this.scope){ //move Poly
            this.movePoly(this.fl, this.gn, this.po, false);
        }else{ //move SubRegion
            for(let i = 0; i < this.store.edit.l[this.fl][this.gn].elems.length; i++)
                this.movePoly(this.fl, this.gn, i, false);
        }
    }
}