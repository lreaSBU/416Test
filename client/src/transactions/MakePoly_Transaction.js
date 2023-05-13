import jsTPS_Transaction from "../common/jsTPS.js"

export default class MakePoly_Transaction extends jsTPS_Transaction {
    constructor(store, scope, fl, d1) {
        super();
        this.store = store;
        this.scope = scope;
        this.fl = fl;
        this.d1 = d1;
        this.d2 = undefined;
    }

    doTransaction() {
        if(this.scope){ //push Poly
            this.store.edit.l[this.fl][this.scope.group].elems.push(this.d1);
            this.d1.finalize(this.fl, this.scope.group, this.scope);
            //this.store.sendTransac(0, this.fl, this.scope.group, this.d1.id, null, this.d1.points);
        }else{ //push SubRegion
            let gn = this.store.edit.l[this.fl].length;
            let temp = {
                level: this.fl,
                group: gn,
                mean: undefined,
                h: false,
                elems: [],
                props: {},
                offset: undefined
            };
            this.store.edit.l[this.fl].push(temp);
            this.store.sendTransac(11, this.fl, -1, -1, null, gn);
            temp.elems.push(this.d1);
            this.d1.finalize(this.fl, gn, temp);
            this.d2 = gn;
            //this.store.sendTransac(0, this.fl, gn, 0, null, this.d1.points);
        }
    }
    
    undoTransaction() {
        if(this.scope){ //pop Poly
            this.store.edit.l[this.fl][this.scope.group].elems.pop();
            this.store.sendTransac(6, this.fl, this.scope.group, -1, null, this.d1.id);
        }else{ //pop SubRegion
            this.store.edit.l[this.fl].pop();
            this.store.sendTransac(8, this.fl, -1, -1, null, this.d2);
        }
    }
}