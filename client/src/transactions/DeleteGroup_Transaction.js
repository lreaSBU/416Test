import jsTPS_Transaction from "../common/jsTPS.js"

export default class DeleteGroup_Transaction extends jsTPS_Transaction {
    constructor(store, scope, fl, gn, po, d1) {
        super();
        this.store = store;
        this.scope = scope;
        this.fl = fl;
        this.gn = gn;
        this.po = po;
        this.d1 = d1;
    }

    clean(){
        if(!this.scope){
            for(let i = 0; i < this.store.edit.l[this.fl].length; i++)
                this.store.edit.l[this.fl][i].group = i;
        }
        else{
            for(let i = 0; i < this.store.edit.l[this.fl][this.gn].elems.length; i++)
                this.store.edit.l[this.fl][this.gn].elems[i].id = i;
        }
    }

    pSan(l){
        let ret = [];
        for(let p of l) ret.push(p.copy());
        return ret;
    }

    doTransaction() {
        if(this.scope){ //delete Poly
            this.store.edit.l[this.fl][this.gn].elems.splice(this.po, 1);
            this.store.sendTransac(6, this.fl, this.gn, -1, null, this.po);
        }else{ //delete Subregion
            this.store.edit.l[this.fl].splice(this.gn, 1);
            this.store.sendTransac(8, this.fl, -1, -1, null, this.gn);
        }
        this.clean();
    }
    
    undoTransaction() {
        if(this.scope){ //restore Poly
            this.store.edit.l[this.fl][this.gn].elems.splice(this.po, 0, this.d1);
            this.store.sendTransac(10, this.fl, this.gn, this.po, null, this.pSan(this.d1.points));
        }else{ //restore SubRegion
            this.store.edit.l[this.fl].splice(this.gn, 0, this.d1);
            this.store.sendTransac(11, this.fl, -1, -1, null, this.gn);
            for(let i = 0; i < this.d1.elems.length; i++)
                this.store.sendTransac(10, this.fl, this.gn, i, null, this.pSan(this.d1.elems[i].points));
            this.store.sendTransac(1, this.fl, this.gn, -1, null, this.d1.props);
        }
        this.clean();
    }
}