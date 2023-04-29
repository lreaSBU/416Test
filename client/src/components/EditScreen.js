import { useContext, useState } from 'react'
import React, { useEffect, useRef } from "react";
import AuthContext from '../auth';
import { Link } from 'react-router-dom'

import api from './edit-request-api'
import { GlobalStoreContext } from '../store'
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import SplashScreen from './SplashScreen';
import logo from './Capture.png'
import colors from './colors.png'
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import MouseIcon from '@mui/icons-material/Mouse';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import PanToolIcon from '@mui/icons-material/PanTool';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import HomeIcon from '@mui/icons-material/Home'
import PublicIcon from '@mui/icons-material/Public'

import jsTPS from '../common/jsTPS'
import Typography from '@mui/material/Typography'
import Remove_Transaction from '../transactions/Remove_Transaction';
import Move_Transaction from '../transactions/Move_Transaction';
import Insert_Transaction from '../transactions/Insert_Transaction';
import DeletePoly_Transaction from '../transactions/DeletePoly_Transaction';
import ChangeProperty_Transaction from '../transactions/ChangeProperty_Transaction';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const EditScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [warning, setWarning] = useState(null);
    const myContainer = useRef(null);
    const fileContainer = useRef(null);
    const propContainer = useRef(null);
    const propList = useRef(null);

    const tps = new jsTPS();

    function handleWarning(m){
        m = "(Warning): " + m;
        console.warn(m);
        setWarning(m);
        setTimeout(function(){
            setWarning(null);
        }, 10000);
    }

    useEffect((e) => {if(store.edit && store.edit.raw){
        let VERSION = JSON.stringify(store.edit.sesh);
        
        var canv = myContainer.current;
        //canv.width = canv.height * (canv.clientWidth / canv.clientHeight);
        var ctx = canv.getContext('2d');
        var fileIn = fileContainer.current;
        var propButt = propContainer.current;
        var propHolder = propList.current;

        const CW = canv.width, CH = canv.height, HW = CH/2, HH = CH/2;
        var fi, bytes, camZ = 1, camX = 100, camY = 100;

        var CWS, CHS;

        class Point{
            static Gen = new Point(0, 0);
            constructor(x, y){
                this.x = x; this.y = y;
                this.h = false;
            }
            dist(p){
                return Math.sqrt(Math.pow(p.x-this.x, 2) + Math.pow(p.y-this.y, 2));
            }
            fastDist(p){
                return Math.abs(p.x-this.x)*Math.abs(p.y-this.y);
            }
            eq(p){
                if(p == null) return false;
                return this.x == p.x && this.y == p.y;
            }
            set(p){
                this.x = p.x; this.y = p.y;
            }
            set(x, y){
                this.x = x; this.y = y;
            }
            addLocal(p, n = null){
                if(n){
                    this.x += p; this.y += n;
                    return;
                }
                this.x += p.x; this.y += p.y;
            }
            subtractLocal(p){
                this.x -= p.x; this.y -= p.y;
            }
            divideLocal(n){
                this.x /= n; this.y /= n;
            }
            getLocal(){
                Point.Gen.x = HW + camZ*(this.x+camX-HW);
                Point.Gen.y = HH + camZ*(this.y+camY-HH);
                return Point.Gen;
            }
            makeGlobal(){
                //this.x = this.x/camZ - camX;
                //this.y = this.y/camZ - camY;
                this.x = (this.x-HW)/camZ - camX + HW;
                this.y = (this.y-HH)/camZ - camY + HH;
                return this;
            }
            copy(){
                return new Point(this.x, this.y);
            }
            toString(){
                return "(" + this.x + ", " + this.y + ")";
            }
        }
        const scrIn = (1 - 1/1.1)/2, scrOut = (1 - 1.1)/2;
        canv.addEventListener("wheel", function(e){
            if(VERSION != store.edit.sesh) return;
            let scr = e.deltaY < 0 ? 1 : -1, czo = camZ;
            if(scr == 1) camZ *= 1.1;
            else camZ /= 1.1;
            CWS = CW-camZ;
            CHS = CH-camZ;
            Poly.Draw();
        });

        var mx = 0, my = 0, smx, smy, mcl = false;
        var mel = null;
        const movoff = new Point(0, 0), toolSet = [];

        canv.addEventListener("mousemove", function(e){
            if(VERSION != store.edit.sesh) return;
            smx = e.offsetX;
            smy = e.offsetY;
            if((mcl = e.buttons == 1)){
                switch(tool){
                    case 0: //cam
                        camX += (e.offsetX - mx)/camZ;
                        camY += (e.offsetY - my)/camZ;
                    break; case 1: //move
                        //movoff.addLocal((e.offsetX - mx)/camZ, (e.offsetY - my)/camZ);
                        movoff.x += (e.offsetX - mx)/camZ;
                        movoff.y += (e.offsetY - my)/camZ;
                        for(let m of mels){
                            m.x += (e.offsetX - mx)/camZ;
                            m.y += (e.offsetY - my)/camZ;
                        }
                    break; case 2: //drag boxSelect
                        //movoff.x += (e.offsetX - mx)/camZ;
                        //movoff.y += (e.offsetY - my)/camZ;
                    break;
                }
                mel = null;
                Poly.Draw();
            }else if(e.buttons == 0 && mode){
                var d, md = 100000000000000, mp = null, ref = new Point(e.offsetX, e.offsetY);
                ref.makeGlobal();
                for(var e of mode.elems) for(var p of e.points) if((d = ref.dist(p)) < md){
                    md = d;
                    mp = p;
                }
                Poly.Draw();
                if(mp != null) drawDot(mp, true);
                mel = mp;
            }
            mx = smx; my = smy;
        });
        var keys = {}, mode = false, tool = 0, pmode = false;
        function swapMode(){
            let fm = mode;
            if(mode){
                mode = false;
                mels = [];
            }else mode = sels[sels.length-1];
            if(mode == undefined) mode = false;
            if(fm != mode){
                tps.clearAllTransactions();
                Poly.Draw();
            }
        }
        function swapTool(t){
            tool = t;
            switch(tool){
                case 1: //reset movoff
                    movoff.set(0, 0);
                break; case 2: //init box select
                    movoff.set(mx, my);
                break;
            }
        }
        function insert_tool(){
            if(mode){
                let ps = [];
                for(let m of mels) ps.push(findParent(m, mode));
                for(let i = 0; i < mels.length-1; i++){
                    if(ps[i].p != ps[i+1].p) continue;
                    let adj = store.edit.l[mode.level][mode.group].elems[ps[i].p].isAdj(ps[i].i, ps[i+1].i);
                    if(adj != null){
                        let np = new Point((mels[i].x+mels[i+1].x)/2, (mels[i].y+mels[i+1].y)/2);
                        tps.addTransaction(new Insert_Transaction(store, mode.level, mode.group, ps[i].p, adj, np));
                    }
                }
            }
        }
        function remove_tool(){
            /* //ITERATOR FOR SHARED POINT REMOVAL:::
            for(var l of store.edit.l) for(var g of l) for(var e of g.elems)
                if(e.minX <= mel.x && e.maxX >= mel.x && e.minY <= mel.y && e.maxY >= mel.y)
                    for(var i = 0; i < e.points.length; i++) if(mel.eq(e.points[i])){
                        e.points.splice(i, 1);
                        break;
                    }
            */
            if(mode && mels.length > 0){
                if(keys.Alt){ //delete the entire Poly
                    if(mode.elems.length == 1) return handleWarning('Cannot remove all Polys of a Subregion');
                    let par = findParent(mels[0], mode);
                    for(let m of mels) if(findParent(m, mode).p != par.p) return handleWarning('All selected Points must belong to the same Poly');
                    tps.addTransaction(new DeletePoly_Transaction(store, mode.level, mode.group, par.p, mode.elems[par.p]));
                    return;
                }
                let rpm = undefined;
                while(mels.length){
                    let m = mels.splice(0, 1)[0];
                    let par = findParent(m, mode);
                    if(mode.elems[par.p].points.length < 4){
                        handleWarning('Aborting point removal; Must maintain minimum Point count');
                        break;
                    }
                    if(par.i == 0 || par.i == mode.elems[par.p].points.length-1){
                        handleWarning('Cannot delete Poly origin point');
                        rpm = m;
                        continue;
                    }
                    tps.addTransaction(new Remove_Transaction(store, true, mode.level, mode.group, par.p, par.i, m));
                }
                if(rpm) mels.splice(0, 0, rpm);
            }else if(!mode && sels.length > 0){
                console.log('deleting subregions later...');
            }
        }
        window.addEventListener("keydown", function(e){
            if(VERSION != store.edit.sesh) return;
            if(store.edit.focus) return;
            let changeFlag = !tool;
            if(changeFlag) switch(e.key){
                case ' ': swapMode(); break;
                case 'b': swapTool(2); break;
                case 'g': swapTool(1); break;
                case 'x': remove_tool(); break;
                case 'i': insert_tool(); break;
                case 'p': handleWarning('wahh'); break;
                case 'f': Poly.Draw(true); changeFlag = false; break;
                case 'm': mergeRegions(); break;
                case 'y': if(keys.Control && tps.hasTransactionToRedo()) tps.doMulti(); break;
                case 'z': if(keys.Control && tps.hasTransactionToUndo()) tps.undoMulti(); break;
                case 'Y': if(keys.Control && tps.hasTransactionToRedo()) tps.doTransaction(); break;
                case 'Z': if(keys.Control && tps.hasTransactionToUndo()) tps.undoTransaction(); break;
                case 'ArrowUp': viewChange(true); break;
                case 'ArrowDown': viewChange(false); break;
                default: changeFlag = false; break;
            }
            keys[e.key] = true;
            if(changeFlag) Poly.Draw();
        });
        window.addEventListener("keyup", function(e){
            if(VERSION != store.edit.sesh) return;
            keys[e.key] = false;
        });

        function findParent(point, group){
            let ind = -1;
            for(let po of group.elems){
                if((ind = po.indexOf(point)) != -1){
                    return {i: ind, p: group.elems.indexOf(po)};
                }
            }
            return {i: -1, p: null};
        }
        function viewChange(dir){
            if(mode) return;
            viewLevel += dir ? 1 : -1;
            if(viewLevel < 0) viewLevel = 0;
            else if(viewLevel > 4) viewLevel = 4;
            else{ //viewLevel actually changed
                deSel();
            }
            tps.clearAllTransactions();
            Poly.Draw();
        }

        var px, py, mp = new Point(), sel = null, ser;
        var CLC = CW/10;

        canv.addEventListener("mousedown", function(e){
            if(VERSION != store.edit.sesh) return;
            store.edit.focus = false;
            mp.set(e.offsetX, e.offsetY);
            if(tool == 2){ //init box select FOR REAL
                movoff.set(mp.x, mp.y);
            }
        });
        var sels = [], mels = [];
        function deSel(){
            while(sels.length) (sels.pop()).h = false;
        }
        var saveMel;
        function deMel(ctrl){
            if(ctrl) saveMel = mels[mels.length-1];
            while(mels.length) (mels.pop()).h = false;
            if(ctrl){
                mels.push(saveMel);
                saveMel.h = true;
                saveMel = null;
            }
        }
        canv.addEventListener("mouseup", function(e){
            if(VERSION != store.edit.sesh) return;
            if(tool) switch(tool){
                case 1: //move release
                    tps.bookMark();
                    for(let m of mels){
                        let par = findParent(m, mode);
                        m.subtractLocal(movoff);
                        tps.addTransaction(new Move_Transaction(store, true, mode.level, mode.group, par.p, par.i, movoff.copy()));
                    }
                    tps.unMark();
                break; case 2: //boxSelect release
                    let temp1 = movoff.makeGlobal();
                    let temp2 = (new Point(mx, my)).makeGlobal();
                    let start = new Point(Math.min(temp1.x, temp2.x), Math.min(temp1.y, temp2.y));
                    let end = new Point(Math.max(temp1.x, temp2.x), Math.max(temp1.y, temp2.y));
                    if(mode){
                        for(let p of mode.elems) for(let pp of p.points){
                            if(!pp.h && (pp.x > start.x && pp.x < end.x) && (pp.y > start.y && pp.y < end.y)){
                                pp.h = true;
                                mels.push(pp);
                            }
                        }
                    }else{
                        for(let s of store.edit.l[viewLevel]){
                            //console.log(start, end, s.minX, s.minY, s.maxX, s.maxY)
                            //if(!s.h && ((s.minX > start.x && s.minX < end.x) || (s.maxX > start.x && s.maxX < end.x)) && ((s.minY > start.x && s.minY < end.x) || (s.maxY > start.x && s.maxY < end.x))){
                            if(!s.h && (s.mean.x > start.x && s.mean.x < end.x) && (s.mean.y > start.y && s.mean.y < end.y)){
                                s.h = true;
                                sels.push(s);
                            }
                        }
                        movoff.set(0, 0);
                    }
                    tool = 0;
                    Poly.Draw(); //just do this immediately for boxSelect
                break;
            }else{
                store.sendTransac(7, -1, -1, -1, null, [camX, camY, camZ]);
            }
            tool = 0;
            if(mp.x != e.offsetX || mp.y != e.offsetY) return;
            if(store.edit.l[viewLevel] == undefined) return;
            px = (e.offsetX-HW)/camZ-camX+HW;
            py = (e.offsetY-HH)/camZ-camY+HH;
            mp.set(px, py);
            sel = null;
            ser = 1000000000;
            //console.log("(" + px + ", " + py + ")");
            var gen;
            if(!tool){ //selecting
                for(var g of store.edit.l[viewLevel]) for(var p of g.elems){
                    if((gen = p._mean.dist(mp)) < CLC*camZ && gen < ser && p.minX < px && px < p.maxX && p.minY < py && py < p.maxY){
                        sel = g;
                        ser = gen;
                    }
                }
                if(!mode && sel != null){
                    sel.h = !sel.h;
                    if(!keys.Shift){
                        sel.h = sel.h || (sels.length > 0);
                        deSel();
                    }
                    if(sel.h) sels.push(sel);
                    else sels.splice(sels.indexOf(sel), 1);
                    //SETTING PROP MENU:{
                    let head = sels[sels.length-1];
                    if(head && head.props){
                        //store.edit.pk[0] = Object.keys(head.props)[0];
                        //store.edit.pv[0] = head.props[Object.keys(head.props)[0]];
                    }
                    //}
                    Poly.Draw();
                }else if(mode && mel != null){
                    mel.h = !mel.h;
                    if(!keys.Shift){
                        mel.h = mel.h || (mels.length > 0);
                        deMel(keys.Control);
                    }
                    if(mels.length && keys.Control){ //connect
                        let ind1 = -1, ind2 = -1, p1 = null, p2 = null;
                        for(let i of mode.elems) if((ind1 = i.indexOf(mels[mels.length-1])) != -1){p1 = i; break;}
                        for(let i of mode.elems) if((ind2 = i.indexOf(mel)) != -1){p2 = i; break;}
                        if(p1 == p2 && ind1 != -1 && ind2 != -1){ //belong to the same Poly
                            let dif = ind2-ind1;
                            let dir = (dif > 0) ? 1 : -1;
                            let lim = Math.abs(dif);
                            if(lim > parseInt(p1.points.length/2)){ //flip
                                dif -= dir*parseInt(p1.points.length/2);
                                dir *= -1;
                                lim = p1.points.length-lim;
                            }
                            ind1+=dir;
                            while(--lim){
                                ind2 = ind1;
                                if(ind2 < 0) ind2 += p1.points.length;
                                else if(ind2 >= p1.points.length) ind2 -= p1.points.length;
                                if(mels.indexOf(p1.points[ind2] != -1)) mels.push(p1.points[ind2]);
                                mels[mels.length-1].h = true;
                                ind1 += dir;
                            }
                        }
                    }else if(keys.Alt){ //whole poly
                        let par = findParent(mel, mode);
                        for(let p of mode.elems[par.p].points) if(!p.h){
                            mels.push(p); p.h = true;
                        }
                    }
                    if(mel.h) mels.push(mel);
                    else mels.splice(mels.indexOf(mel), 1);
                    Poly.Draw();
                }
            }
        })

        function read(n, e = false){
            let ret = 0;
            for(var i = 0; i < n; i++){
                ret <<= 8;
                ret += bytes[(wf ? fil : fi)+(e ? i : n-i-1)];
            }
            if(wf) fil += n;
            else fi += n;
            return ret;
        }

        function readString(n){
            var ret = "", c, fis = fi, N = n;
            while(n-- > 0){
                if((c = read(1, true)) == 0) break;
                ret += String.fromCharCode(c);
            }
            fi = fis + N;
            return ret;
        }

        function trim(s){
            var i = 0;
            if(s.charAt(0) == ' ') while(s.charAt(i) == ' ') i++;
            var n = s.length;
            if(s.charAt(s.length-1) == ' ') while(s.charAt(n) == ' ') n--;
            return s.substring(i, n);
        }

        function readField(){
            var ret = [], fis = fi;
            ret[0] = readString(11); //name
            ret[1] = String.fromCharCode(read(1)); //type
            fi += 4;
            ret[2] = read(1);
            fi = fis + 32;
            return ret;
        }

        function doubleRead(){
            var data = [];
            for(var i = 0; i < 8; i++) data[i] = bytes[(wf ? fil : fi)+8-i-1]; //Double is only ever Little
            if(wf) fil += 8;
            else fi += 8;

            var sign = (data[0] & 1<<7)>>7;

            var exponent = (((data[0] & 127) << 4) | (data[1]&(15<<4))>>4);

            if(exponent == 0) return 0;
            if(exponent == 0x7ff) return (sign) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

            var mul = Math.pow(2,exponent - 1023 - 52);
            var mantissa = data[7]+
                data[6]*Math.pow(2,8*1)+
                data[5]*Math.pow(2,8*2)+
                data[4]*Math.pow(2,8*3)+
                data[3]*Math.pow(2,8*4)+
                data[2]*Math.pow(2,8*5)+
                (data[1]&15)*Math.pow(2,8*6)+
                Math.pow(2,52);

            return Math.pow(-1,sign)*mantissa*mul;
        }

        var tx, ty;

        function pointRead(){
            wf = true; //make exception for which index to affect
            //console.log(read(4)); //type == 1 idk why this needs to be here for every point
            tx = doubleRead();
            ty = doubleRead();
            wf = false;
            return new Point(tx, -ty);
        }

        var rs, rn, rb, numParts, numPoints, fiSave, fil, sp, cp, pp, wf = false,
        npc, nppc, finsv, npl, npi;

        var safeCount, fileLevel, viewLevel = 0, transacNum = 0, syncWait = 0;

        /*async function sendTransac(typ, fl, gn, pn, od, nd){
            store.edit.syncWait++;
            const resp = await api.sendEdit(store.currentMap._id, store.edit.transacNum++, typ, fl, gn, pn, od, nd);
            //console.log('EDIT RESP:', resp);
            store.edit.syncWait--;
        }*/

        function recordRead(count){
            var fiBase = fi;
            rn = read(4, true);
            rs = read(4, true);
            console.log(store.edit.l[fileLevel].length + ":: (" + rn + ", " + rs + ")");
            fiSave = fi; //bookmark fi
            //START READING CONTENT
            console.log("check type: " + read(4)); //type == 5
            rb = [];
            for(var i = 0; i < 4; i++){
                rb.push(doubleRead());
                //console.log("bound " + i + ": " + rb[i]);
            }
            //console.log(fi-fiSave);
            numParts = read(4);
            numPoints = read(4);
            //console.log("parts: " + numParts + ", points: " + numPoints);
            nppc = numParts;
            finsv = fi;
            npl = []; npc = 0; npi = 0;
            while(nppc-- > 0) npl.push(read(4)); //these are the starting indices of the next polys
            npl.push(numPoints-1);
            //START READING THE LISTS
            fi = finsv;
            fil = fi + numParts*4;
            while(numParts-- > 0){
                npi++; npc++;
                cp = read(4); //cp = current part
                sp = null; //npc = 0;
                let ret = new Poly(cp, fileLevel, count);
                store.edit.l[fileLevel][count].elems.push(ret);
                //console.log(fileLevel, count);
                /*while(true){
                    if(npc < npl[npi]) ret.add(pointRead());
                    else{
                        console.log("END WITH: ", npc, npl[npi]);
                        break;
                    }
                    npc++;
                }
                ret.add(new Point(ret.points[0].x, ret.points[0].y));*/
                while(true){
                    pp = pointRead(); //pp = current point
                    if(!pp.eq(sp)){
                        ret.add(pp);
                        if(sp == null) sp = pp;
                    }else if(npc >= npl[npi]){
                        //console.log("END WITH: ", npc, npl[npi]);
                        break;
                    }
                    npc++;
                }
                store.edit.l[fileLevel][count].mean.addLocal(ret.mean());
                ret.finalize(fileLevel, count, store.edit.l[fileLevel][count]); //finalize
            }
            //store.edit.l[fileLevel][count].mean.divideLocal(store.edit.l[fileLevel][count].elems.length);
            console.log("DONE!");
            fi = fiSave + rs*2; //position set after this record
        }

        var diagBound, aFrame, bFrame;

        async function readShapeFile(file){
            //var fl = file.name.split(".");
            //if(fl[fl.length-1] != "shp") return console.log("NOT CORRECT TYPE");
            const buf = await file.arrayBuffer();
            bytes = new Uint8Array(buf);
            fi = 0;
            console.log("--> " + read(4, true));
            fi = 24;
            var size = read(4, true)*2-100;
            console.log("==> " + size);
            console.log("~~> " + read(4));
            console.log("::> " + read(4));
            var xl, xr, yl, yr;
            xl = doubleRead();
            yl = doubleRead();
            xr = doubleRead();
            yr = doubleRead();
            //diagBound = Math.abs(xr-xl) * Math.abs(yr-yl);
            diagBound = Math.sqrt(Math.pow(xr-xl, 2) + Math.pow(yr-yl, 2));
            console.log("DIAGBOUND: " + diagBound);
            console.log("xMin: " + xl);
            console.log("yMin: " + yl);
            console.log("xMax: " + xr);
            console.log("yMax: " + yr);
            console.log("zMin: " + doubleRead());
            console.log("zMax: " + doubleRead());
            console.log("mMin: " + doubleRead());
            console.log("mMax: " + doubleRead());
            fi = 100;
            var count = 0;
            while(true){
                store.edit.l[fileLevel].push({
                    level: fileLevel,
                    group: count,
                    mean: new Point(0, 0),
                    h: false,
                    elems: [],
                    props: {}
                });
                recordRead(count++);
                console.log("EP: " + fi + " or " + fil);
                //Poly.Draw();
                if(isNaN(read(4, true))) break;
                fi -= 4;
            }
            Poly.Draw();
            console.log("FINAL COUNT: " + count);
            console.log(store.edit.l[fileLevel]);
            //reconcileData(fileLevel);
        }
        async function readDBaseFile(file){
            console.log("READING DATA BASE FILE!!!");
            const buf = await file.arrayBuffer();
            bytes = new Uint8Array(buf);
            fi = 0;
            console.log(read(1, true));
            console.log(read(3, true));
            var recNum = read(4);
            console.log("# records: " + recNum);
            console.log("# header bytes: " + read(2));
            console.log("# record bytes: " + read(2));
            console.log("space: " + read(2));
            console.log("flag?: " + read(1, true));
            console.log("encrypt?: " + read(1, true));
            //READING FIELD DESCRIPTOR ARRAY
            fi = 32;
            var cols = [], gen;
            while((gen = readField())[0] != "" && gen[0].charAt(0) != "\r"){ //build the column field headers
                cols.push({
                    name: gen[0],
                    type: gen[1],
                    size: gen[2],
                    elems: []
                });
            }
            fi -= 30;
            console.log("INFO??? --> " + cols.length);
            while(recNum-- > 0){
                for(var c of cols){
                    gen = trim(readString(c.size));
                    switch(c.type){
                        case 'N': c.elems.push(parseInt(gen)); break;
                        case 'F': c.elems.push(parseFloat(gen)); break;
                        default: c.elems.push(gen); break; //includes 'C'
                    }
                }
                fi++;
            }
            console.log(cols);
            for(var g = 0; g < store.edit.l[fileLevel].length; g++){
                for(var c of cols) store.edit.l[fileLevel][g].props[c.name] = c.elems[g];
                store.sendTransac(1, fileLevel, g, -1, null, store.edit.l[fileLevel][g].props);
            }
            Poly.Draw();
            //reconcileData(fileLevel);
        }

        function readGeoFile(file){
            var reader = new FileReader();
            var cols = [];
            reader.onload = function(){
                var data = JSON.parse(reader.result);
                //console.log(data);
                //for(var i of data.features) console.log(i);
                var GN = 0;
                /*for(var prop in data.features[0].properties){
                    cols.push({
                        name: prop,
                        type: '?',
                        size: 0,
                        elems: []
                    });
                }*/
                for(var f of data.features){
                    store.edit.l[fileLevel].push({
                        level: fileLevel,
                        group: GN,
                        mean: new Point(0, 0),
                        h: false,
                        elems: [],
                        props: f.properties
                    });
                    store.sendTransac(1, fileLevel, GN, -1, null, f.properties); //send the data entry for this new subregion
                    let cr;
                    for(var c of f.geometry.coordinates){
                        var np = new Poly(-1, fileLevel, GN);
                        cr = (c[0].length == 2 ? c : c[0]);
                        for(let i = 0; i < cr.length-1; i++) np.add(new Point(cr[i][0], -cr[i][1]));
                        console.log(np.points[0], "VS.", np.points[np.points.length-1]);
                        store.edit.l[fileLevel][GN].elems.push(np);
                        store.edit.l[fileLevel][GN].mean.addLocal(np.mean());
                        np.finalize(fileLevel, GN, store.edit.l[fileLevel][GN]);
                    }
                    //store.edit.l[fileLevel][GN].mean.divideLocal(store.edit.l[fileLevel][GN].elems.length);
                    /*var i = 0;
                    for(var a in f.properties){
                        cols[i].elems.push(f.properties[a]);
                        i++;
                    }*/
                    GN++;
                }
                console.log(cols);
                console.log(store.edit.l);
                Poly.Draw();
            };
            reader.readAsText(file); 
        }
        function readFile(f){
            var fl = f.name.split(".");
            viewLevel = fileLevel = parseInt(fl[0].split("_adm")[1]);
            if(isNaN(fileLevel)) viewLevel = fileLevel = 0;
            switch(fl[fl.length-1]){
                case "shp": readShapeFile(f); break;
                case "dbf": readDBaseFile(f); break;
                case "json": readGeoFile(f); break;
            }
        }
        fileIn.onchange = function(){
            for(var f of this.files) readFile(f);
        }
        propHolder.onchange = function(){
            Poly.Draw();
        }
        propButt.onclick = function(){
            store.edit.prop = undefined;
            store.reduceEdit();
            if(sels.length > 0){
                store.edit.prop = sels[sels.length-1];
            }
            store.reduceEdit();
        }
        var hBox;
        function drawBox(p){
            hBox = (camZ**.4);
            ctx.strokeStyle = '#ff00ff';
            ctx.beginPath();
            ctx.rect(HW+camZ*(p.x+camX-HW)-hBox, HH+camZ*(p.y+camY-HH)-hBox, hBox*2, hBox*2);
            ctx.stroke();
        }
        function drawDot(p, h=false){
            if(h) ctx.strokeStyle = '#ff0000';
            else ctx.fillStyle = p.h ? "#fbbd0c" : "#000";
            ctx.beginPath();
            ctx.arc(HW+camZ*(p.x+camX-HW), HH+camZ*(p.y+camY-HH), camZ**.2, 0, 2*Math.PI);
            if(h) ctx.stroke();
            else ctx.fill();
        }
        function bool(x){
            if(x) return true;
            return false;
        }
        var fx, fy, pLast = new Point(0, 0), dx, dy;
        var LOD_SKIP, LOD_STEP, LOD_REF, finSum, li, ni, ci;
        var defCol = "#000", mark, Acc = false;
        var dots = [], remp, remi;
        const subColRefs = ['#aba99f', '#000', '#000'];
        class Poly{
            static l = [[], [], [], [], []]; //poly struct
            static d = [[], [], [], [], []]; //data struct
            static vis = [true, true, true, true, true]; //vis array
            static SubDraw(ind){
                var p = 0, l, g;
                defCol = subColRefs[ind];
                for(p = 0; p < store.edit.l.length; p++){
                    if((!ind) == (viewLevel == p)) continue;
                    if(Poly.vis[p]) for(l of store.edit.l[p]){
                        if(l.props != null && Object.keys(l.props).length){ //has data
                            l.mean.getLocal();
                            ctx.fillStyle = l.h ? "#fbbd0c" : '#000';
                            if(!mode){
                                if(l.props['name'] != undefined)
                                    ctx.fillText(l.props['name'], Point.Gen.x, Point.Gen.y);
                                else if(l.props['NAME_'+p] != undefined)
                                    ctx.fillText(l.props['NAME_'+p], Point.Gen.x, Point.Gen.y);
                            }
                        }
                        for(g of l.elems) if((ind == 2) == l.h){
                            g.draw(l.h && !mode, l.h && (l == mode));
                        }
                    }
                }
            }
            static Draw(af = false){
                ctx.clearRect(0, 0, canv.width, canv.height);
                
                //var p = 0, l, g;
                //if(af) autoFrame();
                if(store.edit.l[viewLevel] == undefined) return;
                Acc = af;
                //Poly.SubDraw(0);
                dots = [];
                Poly.SubDraw(1);
                Poly.SubDraw(2);
                if(tool == 2 && mcl){
                    ctx.strokeStyle = '#fbbd0c';
                    ctx.setLineDash([5, 15]);
                    ctx.beginPath();
                    ctx.rect(movoff.x, movoff.y, mx-movoff.x, my-movoff.y);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            }
            constructor(id, fl, gn){
                if(store.edit.l[fl][gn].elems == undefined) this.id = id;
                else this.id = store.edit.l[fl][gn].elems.length; //this is the id of the poly in its group!!!!
                //this.id = id;
                //this.fl = fl; //file level
                //this.gn = gn; //group number
                this.lodRatio = 0.0005;
                this.lodBound = diagBound;
                this.points = [];
                this.clockWise = true;
                this.minX = this.minY = 100000000;
                this.maxX = this.maxY = -100000000;
            }
            remove(i){
                remp = this.points[i];
                if((remi = mels.indexOf(remp)) != -1) mels.splice(remi, 1);
                this.points.splice(i, 1);
                //this.reCalc(); //MAYBE???
            }
            add(p){
                this.minX = Math.min(p.x, this.minX);
                this.minY = Math.min(p.y, this.minY);
                this.maxX = Math.max(p.x, this.maxX);
                this.maxY = Math.max(p.y, this.maxY);
                this.points.push(p);
            }
            get(i){ //circular treatment!!!
                while(i < 0) i += this.points.length;
                while(i >= this.points.length) i -= this.points.length;
                return this.points[i];
            }
            indexOf(p){
                for(var i = 0; i < this.points.length; i++) if(this.points[i].eq(p)) return i;
                return -1;
            }
            isOverlapping(p){
                return (p.minX >= this.minX && p.minX <= this.maxX && p.minY >= this.minY && p.minY <= this.minY)
                    || (p.maxX >= this.minX && p.maxX <= this.maxX && p.maxY >= this.minY && p.maxY <= this.minY);
            }
            isNeighbor(p){
                if(!this.isOverlapping(p)) return false; //avoid lengthy calls
                for(var i of p.points) if(this.indexOf(i) != -1) return true;
                return false;
            }
            isAdj(a, b){
                let dif = Math.abs(a-b);
                if(dif == 1) return Math.max(a, b);
                if(dif == this.points.length-1) return Math.min(a, b);
                return null;
            }
            [Symbol.iterator](){
                this.i = 0;
                return this;
            }
            next(){
                return{value: this.points[this.i], done: ++this.i >= this.points.length};
            }
            finalize(fl, gn, par){
                //console.log("xBounds: (" + this.minX + " to " + this.maxX + ")");
                //console.log("yBounds: (" + this.minY + " to " + this.maxY + ")");
                finSum = 0;
                for(var i = 0; i < this.points.length-1; i++){
                    finSum += (this.points[i+1].x-this.points[i].x) * (this.points[i].y+this.points[i+1].y);
                }
                this.clockWise = finSum < 0;
                this.reCalc(par);
                if(fl != null){
                    store.sendTransac(0, fl, gn, this.id, null, this.points); //type, fl, gn, pn, od, nd
                }
            }
            reCalc(parent = null){
                this.bound();
                this.mean();
                if(!parent) return;
                parent.minX = parent.minY = 100000000;
                parent.maxX = parent.maxY = -100000000;
                parent.mean.set(0, 0);
                for(let p of parent.elems){
                    parent.minX = Math.min(p.minX, parent.minX);
                    parent.minY = Math.min(p.minY, parent.minY);
                    parent.maxX = Math.max(p.maxX, parent.maxX);
                    parent.maxY = Math.max(p.maxY, parent.maxY);
                    parent.mean.addLocal(p._mean);
                }
                parent.mean.divideLocal(parent.elems.length);
            }
            bound(){
                this.minX = this.minY = 100000000;
                this.maxX = this.maxY = -100000000;
                for(let p of this.points){
                    this.minX = Math.min(p.x, this.minX);
                    this.minY = Math.min(p.y, this.minY);
                    this.maxX = Math.max(p.x, this.maxX);
                    this.maxY = Math.max(p.y, this.maxY);
                }
            }
            mean(){
                let m = new Point(0, 0);
                for(var p of this.points) m.addLocal(p);
                m.x /= this.points.length;
                m.y /= this.points.length;
                return (this._mean = m);
            }
            draw(high, sigh){ //use camZ for zoom
                if(HW + camZ*(this.maxX+camX-HW) < 0) return;
                if(HW + camZ*(this.minX+camX-HW) > CW) return;
                if(HH + camZ*(this.maxY+camY-HH) < 0) return;
                if(HH + camZ*(this.minY+camY-HH) > CH) return;
                //drawDot(this.points[0]);
                ctx.beginPath();
                ctx.strokeStyle = mode && !sigh ? "#aba99f" : (high ? "#fbbd0c" : defCol);
                //accTally = 1;
                LOD_STEP = 100;
                LOD_SKIP = this.lodRatio * this.lodBound / camZ / camZ;
                //if(mode && !sigh) LOD_SKIP = 10000000000 * this.lodBound;
                aFrame = true; bFrame = false;
                var f = this.points[0]; LOD_REF = f;
                fx = HW + camZ*(f.x + camX - HW);
                fy = HH + camZ*(f.y + camY - HH);
                mark = 0;
                dots = [];
                if(sigh) dots.push(f);
                //pLast.set(undefined, undefined); //pLast.set(fx, fy);
                ctx.moveTo(fx, fy);
                for(var i = 1; i < this.points.length; i++){ //need to optimize this
                    //i % LOD_STEP == 0 && 
                    if(!Acc && LOD_REF.fastDist(this.points[i]) < LOD_SKIP) continue;
                    LOD_REF = this.points[i];
                    fx = HW+camZ*(LOD_REF.x+camX-HW);
                    fy = HH+camZ*(LOD_REF.y+camY-HH);
                    if((fx < 0 || fx > CW) && (fy < 0 || fy > CH)) continue;
                    if(sigh) dots.push(this.points[i]);
                    ctx.lineTo(fx, fy);
                }
                fx = HW + camZ*(f.x + camX - HW);
                fy = HH + camZ*(f.y + camY - HH);
                if(fx > 0 && fx < CW && fy > 0 && fy < CH) ctx.lineTo(fx, fy);
                ctx.stroke();
                LOD_REF = null;
                if(dots.length) drawBox(dots[0]);
                for(let d of dots) drawDot(d);
                //console.log(accTally / this.points.length);
            }
        }

        function merge(A, B, level, group){
            //START:::
            var aBeg = 0, aLim = A.points.length, p; //starting info
            while(true){
                if(B.indexOf(A.get(aBeg)) == -1) break;
                else{
                    aBeg--;
                    aLim--;
                }
            }
            //FIND POINTS A AND C:::
            var ln = false, first = null, last = null;
            for(var i = aBeg; i < aLim; i++){
                p = A.get(i);
                if(B.indexOf(p) == -1){if(ln) last = A.get(i-1); ln = false;}
                else{if(first == null) first = p; ln = true;}
            }
            //dots.push(first);
            //dots.push(last);
            /*if(Math.abs(A.indexOf(first) - A.indexOf(last)) >= A.points.length/2){ //swap save~~~
                p = last;
                last = first;
                first = p;
            }*/
            //ACTUALLY BUILD MERGED POLY:::
            var ret = new Poly(parseInt(A.id) + parseInt(B.id) / 1000, level, group);
            var wh = B, ind;
            ret.add(first);
            p = B.get(ind = B.indexOf(first)+1); //joint B1
            while(!p.eq(first)){
                if(p.eq(last)){
                    wh = A;
                    p = A.get(ind = A.indexOf(last)); //include last --> joint A2
                }
                ret.add(p);
                p = wh.get(++ind);
            }
            ret.add(first);
            ret.mean();
            ret.finalize(null, null, store.l[level][group]);
            return ret;
        }

        function mergeRegions(){
            if(sels.length != 2) return;
            console.log(sels[0]);
            console.log(sels[1]);
            var rx = sels[1].level, ry = sels[1].group;
            while(true){
                var pass = true;
                for(var i = 0; i < sels[0].elems.length; i++){
                    for(var n = 0; n < sels[1].elems.length; n++){
                        if(sels[0].elems[i].isNeighbor(sels[1].elems[n])){
                            var m = merge(sels[0].elems[i], sels[1].elems[n], sels[0].level, sels[0].group);
                            console.log(m);
                            sels[0].elems.splice(i, 1);
                            sels[1].elems.splice(n, 1);
                            sels[0].elems.push(m);
                            pass = false; break;
                        }
                    }
                    if(!pass) break;
                }
                if(pass) break;
            }
            for(var e of sels[1].elems) sels[0].elems.push(e); //make sure to save the islands
            store.edit.l[rx].splice(ry, 1);
            //if(store.edit.d[rx][4] != undefined) store.edit.d[rx][4].elems[sels[0].group] += "/" + store.edit.d[rx][4].elems[ry]; //merge names
            for(var i of Object.keys(sels[1].props)){
                if(sels[0].props[i] == undefined){
                    sels[0].props[i] = sels[1].props[i];
                }else{
                    if(isNaN(sels[0].props[i])) sels[0].props[i] += "/" + sels[1].props[i];
                    else sels[0].props[i] += sels[1].props[i];
                }
            }
            sels.splice(1, 1);
            Poly.Draw();
        }

        function autoFrame(){

        }

        function start(){ //translate raw DB data into more robust editing structure
            if(!store.edit.raw) return;
            console.log('RAW:', store.edit.l);
            for(let i = 0; i < store.edit.l.length; i++){
                for(let n = 0; n < store.edit.l[i].length; n++){
                    let temp = {level: i, group: n, h: false, mean: new Point(0, 0), elems: [], props: store.edit.l[i][n].props};
                    for(let m = 0; m < store.edit.l[i][n].elems.length; m++){
                        let np = new Poly(m, i, n);
                        for(let p of store.edit.l[i][n].elems[m]) np.add(new Point(p.x, p.y));
                        temp.mean.addLocal(np.mean());
                        temp.elems.push(np);
                        np.finalize(null, null, temp);
                    }
                    //temp.mean.divideLocal(temp.elems.length);
                    //store.edit.l[i][n] = temp;
                    store.edit.l[i].splice(n, 1, temp);
                }
            }
            store.edit.raw = false;
            //camX = store.camX;
            //camY = store.camY;
            //camZ = store.camZ;
            console.log('CLEANED:', store.edit.l);
            Poly.Draw();
        }

        fileIn.onLoad = start();
    }});
    //if(!auth.loggedIn) return <SplashScreen />;
    //if(store.edit == null) return <></>;
    return (
        <div id='editParent'>
            <div id = "leftPar" className='editShelf'>
                <Box id='toolTray' className='traySect' sx={{bgcolor: '#999', borderRadius: 3}}>
                    <IconButton aria-label='select'>
                        <MouseIcon style={{fontSize:'32pt', color: '#000'}} />
                    </IconButton>
                    <IconButton aria-label='add'>
                        <AddIcon style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='remove'>
                        <ClearIcon style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='move'>
                        <PanToolIcon style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='box select'>
                        <HighlightAltIcon style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='duplicate'>
                        <ContentCopyIcon style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='merge'>
                        <CopyAllIcon  style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='properties'>
                        <MenuIcon ref={propContainer} style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='traverse up layer'>
                        <ArrowUpwardIcon  style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='traverse down layer'>
                        <ArrowDownwardIcon  style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton aria-label='scale'>
                        <ZoomOutMapIcon  style={{fontSize:'32pt'}} />
                    </IconButton>
                    <IconButton variant="contained" component="label" aria-label='upload'>
                        <input ref={fileContainer} type="file" id="fileIn" name="ShapeUpload" hidden></input>
                        <FileUploadIcon  style={{fontSize:'32pt'}} />
                    </IconButton>
                </Box>
                <Box id='displayMenu' ref={propList} className='traySect' sx={{maxHeight: '40%', overflow: 'auto', borderTop: 2, borderBottom: 2, borderColor: '#00ff00'}}>
                    {
                        store.edit && store.edit.prop && store.edit.prop.props ? (<div>
                            <List sx={{width: '100%', left: '0%'}}>
                            {
                                Object.keys(store.edit.prop.props).map((key) => (
                                    <Box sx={{display: 'flex', flexDirection: 'row'}} key={key}>
                                        <TextField sx={{flex: 10, marginTop: 1}} label={key} defaultValue={(store.edit.prop.props[key] ? store.edit.prop.props[key] : '')}
                                            onKeyDown={(e) => {
                                                if((e.ctrlKey || e.metaKey) && (e.key == 'z' || e.key == 'y')){
                                                    e.preventDefault();
                                                    return false;
                                                }
                                                store.edit.focus = true;
                                                if(e.key == 'Enter'){
                                                    store.edit.focus = false;
                                                    //store.edit.prop.props[key] = e.target.value;
                                                    tps.addTransaction(new ChangeProperty_Transaction(store, store.edit.prop.level, store.edit.prop.group, -1, key, e.target.value));
                                                    propList.current.onchange(null); //force recycle
                                                    store.reduceEdit();
                                                }
                                            }}
                                        />
                                        <IconButton sx={{flex: 1, color: 'red'}} aria-label='remove'
                                            onClick={(e) => {
                                                //delete store.edit.prop[key];
                                                tps.addTransaction(new ChangeProperty_Transaction(store, store.edit.prop.level, store.edit.prop.group, -1, key, undefined));
                                                store.reduceEdit();
                                            }}
                                        >
                                            <ClearIcon style={{fontSize:'16pt'}} />
                                        </IconButton>
                                    </Box>
                                ))
                            }
                            </List>
                            <Box sx={{display: 'flex', flexDirection: 'row', color: 'blue'}}>
                                <TextField sx={{flex: 10, marginTop: 2, color: 'blue'}} label={'New Field Name'}
                                    onKeyDown={(e) => {
                                        if((e.ctrlKey || e.metaKey) && (e.key == 'z' || e.key == 'y')){
                                            e.preventDefault();
                                            return false;
                                        }
                                        store.edit.focus = true;
                                        if(e.key == 'Enter'){
                                            if(store.edit.prop.props[e.target.value] != undefined) handleWarning('Property field with that name already exists');
                                            else{
                                                store.edit.focus = false;
                                                //store.edit.prop.props[e.target.value] = '';
                                                tps.addTransaction(new ChangeProperty_Transaction(store, store.edit.prop.level, store.edit.prop.group, -1, e.target.value, ''));
                                                propList.current.onchange(null); //force recycle
                                                store.reduceEdit();
                                            }
                                        }
                                    }}
                                />
                            </Box>
                        </div>) : <></>
                    }
                </Box>
                <Box id='optSliders' className='traySect'>
                    <Box className='sliderLabel'>
                        <Box>LOD Bias:</Box>
                        <Slider
                            aria-label="LOD Bias"
                            defaultValue={0}
                            max={100}
                            min={-100}
                            step={1}
                            valueLabelDisplay="auto"
                            sx={{width: '80%', left: '5%'}}
                        />
                    </Box>
                    <Box className='sliderLabel'>
                        <Box>Text Size:</Box>
                        <Slider
                            aria-label="Text Size"
                            defaultValue={0}
                            max={100}
                            min={-100}
                            step={1}
                            valueLabelDisplay="auto"
                            sx={{width: '80%', left: '5%'}}
                        />
                        
                    </Box>
                    <Box className='sliderLabel'>
                    <Box>Scrub Size:</Box>
                        <Slider
                            aria-label="Scrub Size"
                            defaultValue={1}
                            max={100}
                            min={1}
                            step={1}
                            valueLabelDisplay="auto"
                            sx={{width: '80%', left: '5%'}}
                        />

                    </Box>
                    <Box className='sliderLabel' sx={{left: '5%'}}>
                    <Box>Scroll Speed:</Box>
                        <Slider
                            aria-label="Scroll Speed"
                            defaultValue={1}
                            max={10}
                            min={1}
                            step={1}
                            valueLabelDisplay="auto"
                            sx={{width: '80%', left: '5%'}}
                        />
                        
                    </Box>
                </Box>
            </div>
            <Box id="midPar">
                <canvas ref={myContainer} id="editView" width="1000" height="850" style={{border: "1px solid #5EB120"}}></canvas>
            </Box>
            <div id = "rightPar" className='editShelf'>
                <Box sx={{maxHeight: '10%', overflow: 'auto'}}>
                    <Collapse in={(warning != null)}>
                        <Typography sx={{color: '#fbbd0c', bgcolor: '#997a00'}} variant='h6'>{warning}</Typography>
                    </Collapse>
                </Box>
                <Box id='inspector' className='traySect' sx={{bgcolor: '#999', borderRadius: 1}}>
                    <FormGroup sx={{padding: '5%', width: '80%'}}>
                        <FormControlLabel control={<TextField sx={{width:'60%'}} variant="filled" value="234.65"/>} label="X" />
                        <FormControlLabel control={<TextField sx={{width:'60%'}} variant="filled" value="643.12"/>} label="Y" />
                        <FormControlLabel control={<TextField sx={{width:'60%'}} variant="filled" value="1"/>} label="Scale" />
                    </FormGroup>
                </Box>
                <Box sx={{height:'5%'}}></Box>
                <Box id='inspector2' className='traySect' sx={{bgcolor: '#999', borderRadius: 1}}>
                    <FormGroup sx={{padding: '5%', width: '80%'}}>
                        <FormControlLabel control={<TextField disabled sx={{width:'60%'}} variant="filled" value="Subregion"/>} label="Type" />
                        <FormControlLabel control={<TextField disabled sx={{width:'60%'}} variant="filled" value="1"/>} label="Layer" />
                        <FormControlLabel control={<TextField disabled sx={{width:'60%'}} variant="filled" value="2"/>} label="Group" />
                        <FormControlLabel control={<TextField disabled sx={{width:'60%'}} variant="filled" value="75"/>} label="Children" />
                    </FormGroup>
                </Box>
            </div>
        </div>
    );
}

export default EditScreen;