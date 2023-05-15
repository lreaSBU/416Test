import jsTPS_Transaction from "../common/jsTPS.js"

export default class MakeGroup_Transaction extends jsTPS_Transaction {
    constructor(store, scope, fl, d1) {
        super();
        this.store = store;
        this.scope = scope;
        this.fl = fl;
        this.d1 = d1;
        this.d2 = undefined;
    }

    clean(){
        if(!this.scope){
            for(let i = 0; i < this.store.edit.l[this.fl].length; i++)
                this.store.edit.l[this.fl][i].group = i;
        }
        else{
            for(let i = 0; i < this.scope.elems.length; i++)
                this.scope.elems[i].id = i;
        }
    }

    doTransaction() {
        if(this.scope){ //push Poly
            this.store.edit.l[this.fl][this.scope.group].elems.push(this.d1);
            this.d1.finalize(this.fl, this.scope.group, this.scope); //this sends the transac
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
            //console.log("D1 IS THE PROBLEM???", this.d1);
            temp.elems.push(this.d1);
            this.d1.finalize(this.fl, gn, temp); //this sends the transac
            this.d2 = gn;
        }
        this.clean();
    }
    
    undoTransaction() {
        if(this.scope){ //pop Poly
            this.store.edit.l[this.fl][this.scope.group].elems.pop();
            this.store.sendTransac(6, this.fl, this.scope.group, -1, null, this.d1.id);
        }else{ //pop SubRegion
            this.store.edit.l[this.fl].pop();
            this.store.sendTransac(8, this.fl, -1, -1, null, this.d2);
        }
        this.clean();
    }
}