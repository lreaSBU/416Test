import { useContext, useState } from 'react'
import React, { useEffect, useRef } from "react";
import AuthContext from '../auth';
import { Link } from 'react-router-dom'
import { HexColorPicker } from "react-colorful";

import api from './edit-request-api'
import { GlobalStoreContext } from '../store'
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import SplashScreen from './SplashScreen';
import logo from './Capture.png'
import colors from './colors.png'
import Hidden from '@mui/material/Hidden';
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip';
import PolylineIcon from '@mui/icons-material/Polyline';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import HubIcon from '@mui/icons-material/Hub';
import DownloadIcon from '@mui/icons-material/Download';
import CameraIndoorIcon from '@mui/icons-material/CameraIndoor';
import TextureIcon from '@mui/icons-material/Texture';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import BorderStyleIcon from '@mui/icons-material/BorderStyle';
import IconButton from '@mui/material/IconButton';
import MouseIcon from '@mui/icons-material/Mouse';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import PanToolIcon from '@mui/icons-material/PanTool';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import CallMergeIcon from '@mui/icons-material/CallMerge';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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
import DeleteGroup_Transaction from '../transactions/DeleteGroup_Transaction';
import MoveGroup_Transaction from '../transactions/MoveGroup_Transaction';
import ChangeProperty_Transaction from '../transactions/ChangeProperty_Transaction';
import MakeGroup_Transaction from '../transactions/MakeGroup_Transaction';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const EditScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [warning, setWarning] = useState(null);
    const [hexCol, setHexCol] = useState("#aabbcc");
    const myContainer = useRef(null);
    const fileContainer = useRef(null);
    const propContainer = useRef(null);
    const propList = useRef(null);
    const camXTxt = useRef(null), camYTxt = useRef(null), camZTxt = useRef(null);
    const layerTxt = useRef(null), groupTxt = useRef(null), modeTxt = useRef(null);
    
    const selectRefer = useRef(null);
    const addRefer = useRef(null);
    const removeRefer = useRef(null);
    const moveRefer = useRef(null);
    const boxRefer = useRef(null);
    const mergeRefer = useRef(null);
    const splitRefer = useRef(null);
    const drawRefer = useRef(null);
    const cutRefer = useRef(null);
    const consRefer = useRef(null);

    const graphicsButt = useRef(null);
    const colTxt = useRef(null);
    const colTyp1 = useRef(null), colTyp2 = useRef(null), colTyp3 = useRef(null);
    const lodSlider = useRef(null), textSlider = useRef(null);
    const centerCamera = useRef(null);
    const downloadButton = useRef(null), downloadMule = useRef(null);
    const centerToggle = useRef(null), shpToggle = useRef(null);

    const tps = new jsTPS();

    function handleWarning(m){
        m = "(Warning): " + m;
        console.warn(m);
        tps.unMark();
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
        var camXText = camXTxt.current.children[1].children[0],
        camYText = camYTxt.current.children[1].children[0],
        camZText = camZTxt.current.children[1].children[0];
        var layerText = layerTxt.current.children[1].children[0],
        groupText = groupTxt.current.children[1].children[0],
        modeText = modeTxt.current.children[1].children[0];
        var toolRefs = [
            selectRefer.current,
            addRefer.current,
            removeRefer.current,
            moveRefer.current,
            boxRefer.current,
            splitRefer.current,
            drawRefer.current,
            cutRefer.current,
            consRefer.current,
            mergeRefer.current
        ];
        var graphButt = graphicsButt.current;
        var colText = colTxt.current;
        var colTypes = [
            colTyp1.current,
            colTyp2.current,
            colTyp3.current
        ];
        var lodSlide = lodSlider.current.children[2].children[0],
        textSlide = textSlider.current.children[2].children[0];
        var centerCam = centerCamera.current;
        var dlButt = downloadButton.current, dlMule = downloadMule.current;
        var centerButt = centerToggle.current, shpButt = shpToggle.current;

        function cleanVal(n, b, i){
            if(!i && !isNaN(n)) n = n.toFixed(5);
            if(b && n >= 0) n = '+' + n;
            return n;
        }
        function setVal(a, v, b = false){
            v = cleanVal(v, b, a > 2);
            switch(a){
                case 0: camXText.value = v; break;
                case 1: camYText.value = v; break;
                case 2: camZText.value = v; break;
                case 3: layerText.value = v; break;
                case 4: groupText.value = v; break;
                case 5: modeText.value = v; break;
            }
        }

        var CW = canv.width, CH = canv.height, HW = CH/2, HH = CH/2;
        var fi, bytes, camZ = 1, camX = 100, camY = 100;
        const eqRound = 0.0000000000001; //play around with this...

        class Point{
            static Gen = new Point(0, 0);
            constructor(x, y){
                this.x = x; this.y = y;
                //this.h = false;
            }
            static cross(a, b){
                return a.x*b.y - a.y*b.x;
            }
            sub(p){
                return new Point(this.x - p.x, this.y - p.y);
            }
            add(p){
                return new Point(this.x + p.x, this.y + p.y);
            }
            strip(){
                return [this.x, -this.y];
            }
            dist(p){
                return Math.sqrt(Math.pow(p.x-this.x, 2) + Math.pow(p.y-this.y, 2));
            }
            fastDist(p){
                return Math.abs(p.x-this.x)*Math.abs(p.y-this.y);
            }
            eq(p){
                if(p == null) return false;
                return Math.abs(this.x - p.x) < eqRound && Math.abs(this.y - p.y) < eqRound;
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
                return this;
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
        function wheel(e){
            if(VERSION != store.edit.sesh) return;
            if(aTime != 0) animCancel();
            let scr = e.deltaY < 0 ? 1 : -1, czo = camZ;
            if(scr == 1) camZ *= 1.1;
            else camZ /= 1.1;
            setVal(2, camZ);
            Poly.Draw();
        }
        canv.addEventListener("wheel", wheel);

        var mx = 0, my = 0, smx, smy, mcl = false;
        var mel = null;
        const movoff = new Point(0, 0), toolSet = [];

        function mousemove(e){
            if(VERSION != store.edit.sesh) return;
            smx = e.offsetX;
            smy = e.offsetY;
            if((mcl = (e.buttons == 1))){
                switch(tool){
                    case 0: //cam
                        if(aTime) animCancel();
                        camX += (e.offsetX - mx)/camZ;
                        camY += (e.offsetY - my)/camZ;
                        //canv.style.cursor = 'grabbing'
                    break; case 1: //move
                        movoff.x += (e.offsetX - mx)/camZ;
                        movoff.y += (e.offsetY - my)/camZ;
                        if(mode) for(let m of mels){
                            m.x += (e.offsetX - mx)/camZ;
                            m.y += (e.offsetY - my)/camZ;
                        }else for(let s of sels){
                            s.offset.x += (e.offsetX - mx)/camZ;
                            s.offset.y += (e.offsetY - my)/camZ;
                        }
                        setVal(0, movoff.x, true);
                        setVal(1, -movoff.y, true);
                    break; case 2: //drag boxSelect
                        setVal(0, Math.abs(movoff.x-mx), true);
                        setVal(1, Math.abs(movoff.y-my), true);
                    break;
                }
                mel = null;
                Poly.Draw();
            }else if(e.buttons == 0 && mode){
                var d, md = 100000000000000, mp = null, ref = new Point(e.offsetX, e.offsetY);
                if(mode){
                    ref.makeGlobal();
                    for(let p of mode.elems) for(let pp of p.points) if((d = ref.dist(pp)) < md){
                        md = d;
                        mp = pp;
                    }
                    Poly.Draw();
                    if(mp != null) drawDot(mp, true);
                    mel = mp;
                }
            }
            if(!e.buttons && tool == 3 && addPoints.length){
                Poly.Draw();
                ctx.strokeStyle = '#fbbd0c';
                ctx.beginPath();
                ctx.moveTo(loc(true, addPoints[addPoints.length-1].x), loc(false, addPoints[addPoints.length-1].y));
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
            }
            mx = smx; my = smy;
        }
        canv.addEventListener("mousemove", mousemove);
        var keys = {}, mode = false, tool = 0, pmode = false;
        function swapMode(){
            let fm = mode;
            if(mode){
                mode = false;
                deMel();
            }else mode = sels[sels.length-1];
            if(mode == undefined) mode = false;
            if(fm != mode){
                tps.clearAllTransactions();
                setVal(5, mode ? 'Edit' : 'Object');
                Poly.Draw();
            }
        }
        const defStyle = 'fontSize:"32pt";color: #444',
        selStyle = 'fontSize:"32pt";color: #fbbd0c';
        function swapTool(t, override = false){
            if(!override && tool == t) return; //avoid overlapping inits
            if(tool > 0 && t > 0) return; //avoid swapping directly between tools
            for(let tool of toolRefs) tool.style = defStyle;
            tool = t;
            switch(tool){
                case 0: //reset inspector
                    if(mode && mels.length > 0){
                        setVal(0, mels[mels.length-1].x);
                        setVal(1, mels[mels.length-1].y);
                    }else if(!mode && sels.length > 0){
                        setVal(0, sels[sels.length-1].mean.x);
                        setVal(1, sels[sels.length-1].mean.y);
                    }
                    toolRefs[0].style = selStyle;
                    canv.style.cursor = 'default'
                break; case 1: //init move
                    movoff.set(0, 0);
                    toolRefs[3].style = selStyle;
                    canv.style.cursor = 'move'
                break; case 2: //init box select
                    movoff.set(mx, my);
                    toolRefs[4].style = selStyle;
                    canv.style.cursor = 'crosshair'
                break; case 3: //init add trace
                    //addPoints.push(new Point(mx, my));
                    movoff.set(mx, my);
                    console.log("ADDSTART");
                    toolRefs[6].style = selStyle;
                    canv.style.cursor = 'copy'
                break; case 4:
                    cutRef = null;
                    console.log('CUTSTART'); //idk if u have to do anything here actually
                    toolRefs[7].style = selStyle;
                    canv.style.cursor = 'crosshair'    
                break;
            }
        }
        function insert_tool(){
            if(!canSel()) return;
            tps.bookMark();
            if(mode && mels.length == 2){
                let ps = [];
                for(let m of mels) ps.push(findParent(m, mode));
                for(let i = 0; i < mels.length-1; i++){
                    if(ps[i].p != ps[i+1].p) continue;
                    let adj = store.edit.l[mode.level][mode.group].elems[ps[i].p].isAdj(ps[i].i, ps[i+1].i);
                    if(adj != null){
                        let np = mels[i].add(mels[i+1]).divideLocal(2);
                        np.p = mels[0].p;
                        tps.addTransaction(new Insert_Transaction(store, mode.level, mode.group, ps[i].p, adj, np));
                        if(effectSHP){
                            let sh1 = shared(mels[0], mode),
                            sh2 = shared(mels[1], mode);
                            for(let s1 of sh1) for(let s2 of sh2) if(s1.p == s2.p){
                                let adj = s1.p.isAdj(findParent(s1).i, findParent(s2).i);
                                if(adj != null){
                                    let snp = np.copy(); //s1.add(s2).divideLocal(2);
                                    snp.p = s1.p;
                                    let fg = findGroup(s1.p, viewLevel);
                                    let spar = findParent(s1, fg, true);
                                    tps.addTransaction(new Insert_Transaction(store, viewLevel, fg.group, spar.p, adj, snp));
                                }
                                break;
                            }
                        }
                    }
                }
            }
            tps.unMark();
        }
        function shared(o, mpar){ 
            let ret = [], own = o.p;
            for(let g of store.edit.l[viewLevel]) for(let p of g.elems) if(p === own || own.isNeighbor(p)){
                for(let pp of p.points) if(pp !== o && o.eq(pp)){
                    if(p === own) console.log(pp, o);
                    ret.push(pp);
                }
            }
            return ret;
        }
        function remove_tool(whole = false){
            if(!canSel()) return;
            tps.bookMark();
            if(mode && mels.length > 0){
                if(whole){ //delete the entire Poly
                    console.log('ATTEMPTING POLY DELETION');
                    if(mode.elems.length == 1) return handleWarning('Cannot remove all Polys of a Subregion');
                    let par = findParent(mels[0], mode);
                    for(let m of mels) if(findParent(m, mode).p != par.p) return handleWarning('All selected Points must belong to the same Poly');
                    tps.addTransaction(new DeleteGroup_Transaction(store, true, mode.level, mode.group, par.p, mode.elems[par.p]));
                    return;
                }
                while(mels.length){
                    let m = mels.splice(0, 1)[0];
                    let par = findParent(m, mode);
                    if(mode.elems[par.p].points.length < 4){
                        handleWarning('Aborting point removal; Must maintain minimum Point count');
                        break;
                    }
                    tps.addTransaction(new Remove_Transaction(store, mode.level, mode.group, par.p, par.i, m));
                    if(effectSHP) for(let sh of shared(m, mode)){
                        let fg = findGroup(sh.p, viewLevel);
                        let spar = findParent(sh, fg, true);
                        tps.addTransaction(new Remove_Transaction(store, viewLevel, fg.group, spar.p, spar.i, sh));
                    }
                }
            }else if(!mode && sels.length > 0){
                for(let s of sels){
                    tps.addTransaction(new DeleteGroup_Transaction(store, false, viewLevel, s.group, -1, s));
                }
            }
            tps.unMark();
        }
        function canSel(tm = 0){
            if(tool != tm) return false;
            return (mode && mels.length > 0) || (!mode && sels.length > 0);
        }
        var aTime = 0, tarX, tarY, tarZ;
        function animCancel(){
            aTime = 0;
            tarX = camX;
            tarZ = camY;
            tarZ = camZ;
        }
        function animCam(b = false){
            if(aTime != 0){
                camX += (tarX-camX)/50;
                camY += (tarY-camY)/50;
                camZ += (tarZ-camZ)/50;
                aTime--;
                Poly.Draw();
                setVal(0, camX);
                setVal(1, camY);
                setVal(2, camZ);
                setTimeout(animCam, 1);
            }else if(b){
                if(aTime != 0) return;
                let res = autoCam(true);
                tarX = res[0];
                tarY = res[1];
                tarZ = res[2];
                aTime = 500;
                setTimeout(animCam, 1);
            }
        }
        function autoCam(b = false){
            if(store.edit.l[viewLevel].length == 0) return [100, 100, 1];
            let minX, minY, maxX, maxY;
            minX = minY = 100000000;
            maxX = maxY = -100000000;
            for(let g of store.edit.l[viewLevel]){
                if(g.minX < minX) minX = g.minX;
                if(g.minY < minY) minY = g.minY;
                if(g.maxX > maxX) maxX = g.maxX;
                if(g.maxY > maxY) maxY = g.maxY;
            }
            if(b) return [HW - (maxX + minX)/2, HH - (maxY + minY)/2, 300/(maxX-minX)];
            camX = HW - (maxX + minX)/2;
            camY = HH - (maxY + minY)/2;
            camZ = 300/(maxX-minX);
        }
        function addWrap(){
            if(addPoints.length < 3){
                addPoints.length = 0;
                return handleWarning("Not enough points to make a closed Poly");
            }
            let np;
            if(mode) np = new Poly(null, mode.level, mode.group);
            else np = new Poly(0, viewLevel, store.edit.l[viewLevel].length);
            for(let p of addPoints) np.add(p);
            tps.bookMark();
            tps.addTransaction(new MakeGroup_Transaction(store, mode, viewLevel, np));
            addPoints.length = 0;
        }
        function keydown(e){
            if(VERSION != store.edit.sesh) return;
            if(store.edit.focus) return;
            let changeFlag = !tool;
            if(changeFlag) switch(e.key){
                case ' ': swapMode(); break;
                case 'p': if(addPoints.length == 0) swapTool(3); break;
                case 'b': swapTool(2); break;
                case 'g': if(canSel()) swapTool(1); break;
                case 'x': if(canSel()) remove_tool(); break;
                case 'X': if(canSel()) remove_tool(true); break;
                case 'i': if(canSel()) insert_tool(); break;
                case 'o':
                    if(mode){
                        console.log('P-PRINT{');
                        for(let m of mode.elems) console.log(m);
                        console.log('}');
                    }else if(sels.length) console.log('G-PRINT', sels[sels.length-1]);
                break;case 'O':
                    for(let g of store.edit.l[viewLevel]) console.log(g);
                break;
                case 'f': Poly.Draw(true); changeFlag = false; break;
                case 'm': if(canSel()) merge_tool(); break;
                case 'l': if(canSel()) lift_tool(); break;
                case 'c': if(canSel()) con_tool(); break;
                case 'k': swapTool(4); break;
                case 'y': if(keys.Control && tps.hasTransactionToRedo()) tps.doMulti(); break;
                case 'z': if(keys.Control && tps.hasTransactionToUndo()) tps.undoMulti(); break;
                //case 'Y': if(mode && keys.Control && tps.hasTransactionToRedo()) tps.doTransaction(); break;
                //case 'Z': if(mode && keys.Control && tps.hasTransactionToUndo()) tps.undoTransaction(); break;
                case 'ArrowUp': viewChange(true); break;
                case 'ArrowDown': viewChange(false); break;
                default: changeFlag = false; break;
            }else if(tool == 3 && (e.key == 'p' || e.key == ' ' || e.key == 'Enter')){
                addWrap();
                swapTool(0);
                changeFlag = true;
            }
            keys[e.key] = true;
            if(changeFlag) Poly.Draw();
        }
        window.addEventListener("keydown", keydown);
        function keyup(e){
            if(VERSION != store.edit.sesh) return;
            keys[e.key] = false;
        }
        window.addEventListener("keyup", keyup);

        function findGroup(poly, lvl){
            for(let g of store.edit.l[lvl]) for(let p of g.elems) if(p == poly) return g;
            return null;
        }
        function findParent(point, group = null, exact = false){
            if(point.p) return {i: point.p.indexOf(point, exact), p: point.p.id};
            //backup search???
            if(group != null){
                let ind = -1;
                for(let po of group.elems){
                    if((ind = po.indexOf(point, exact)) != -1){
                        let ret = {i: ind, p: group.elems.indexOf(po)};
                        console.log("BACKUP FIND:", ret);
                        return ret;
                    }
                }
            }
            //*/
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
            setVal(3, viewLevel+1);
            Poly.Draw();
        }

        var px, py, mp = new Point(), sel = null, ser;
        var CLC = CW/10;
        const addPoints = [];
        var cutRef;

        function mousedown(e){
            if(VERSION != store.edit.sesh) return;
            store.edit.focus = false;
            mp.set(e.offsetX, e.offsetY);
            switch(tool){
                case 2:
                    movoff.set(mp.x, mp.y);
                break; case 3:
                    px = (e.offsetX-HW)/camZ-camX+HW;
                    py = (e.offsetY-HH)/camZ-camY+HH;
                    addPoints.push(new Point(px, py));
                    movoff.set(mp.x, mp.y);
                    Poly.Draw();
                break; case 2:
                    movoff.set(mp.x, mp.y);
                break; case 4:
                    if(mode && mel)
                        if(cutRef == null) cutRef = mel;
                        else{ //Actually do the cut
                            cut_tool(cutRef, mel);
                            cutRef = null;
                            swapTool(0);
                        }
                break;
            }
        }
        canv.addEventListener("mousedown", mousedown);
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
        function selPoint(){
            for(var g of store.edit.l[viewLevel]) for(var p of g.elems)
                if(p.points.length > 2 && checkInside(p.points, mp)) return g;
            return null;
        }
        const specPropRef = ["**colorFill", "**borderFill", "**textFill"];
        function mouseup(e){
            if(VERSION != store.edit.sesh) return;
            if(tool) switch(tool){
                case 1: //move release
                    let MC = movoff.copy();
                    tps.bookMark();
                    if(mode){ //move points and polys
                        let pars = [], pc = [];
                        for(let _ of mode.elems) pc.push(0);
                        for(let m of mels){
                            let par = findParent(m, mode);
                            m.subtractLocal(movoff);
                            pars.push(par);
                            pc[par.p]++;
                        }
                        for(let i = 0; i < pc.length; i++){
                            if(pc[i] == mode.elems[i].points.length){
                                console.log("ATTEMPTING POLY MOVE:", i);
                                tps.addTransaction(new MoveGroup_Transaction(store, true, mode.level, mode.group, i, MC));
                                pc[i] = -1;
                            }
                        }
                        for(let par of pars) if(pc[par.p] != -1){
                            if(effectSHP) for(let sh of shared(mode.elems[par.p].points[par.i], mode)){
                                let fg = findGroup(sh.p, viewLevel);
                                let spar = findParent(sh, fg, true);
                                tps.addTransaction(new Move_Transaction(store, viewLevel, fg.group, spar.p, spar.i, MC));
                            }
                            tps.addTransaction(new Move_Transaction(store, mode.level, mode.group, par.p, par.i, MC));
                        }
                    }else{ //move subregions
                        for(let s of sels){
                            s.offset.set(0, 0);
                            tps.addTransaction(new MoveGroup_Transaction(store, false, viewLevel, s.group, -1, MC));
                        }
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
                                console.log(pp);
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
                    swapTool(0);
                    Poly.Draw(); //just do this immediately for boxSelect
                break;
            }/*else{
                store.sendImmediateTransac(7, -1, -1, -1, null, [camX, camY, camZ]);
            }*/
            if(tool != 3 && tool != 4) swapTool(0);
            if(mp.x != e.offsetX || mp.y != e.offsetY) return;
            if(store.edit.l[viewLevel] == undefined) return;
            px = (e.offsetX-HW)/camZ-camX+HW;
            py = (e.offsetY-HH)/camZ-camY+HH;
            mp.set(px, py);
            sel = null;
            ser = 1000000000;
            //console.log("(" + px + ", " + py + ")");
            if(!tool){ //selecting
                sel = selPoint();
                if(!mode && sel != null){
                    if(store.edit.graphics){
                        //console.log(colText.children[1].children[0].value, store.edit.graphics);
                        tps.bookMark();
                        tps.addTransaction(new ChangeProperty_Transaction(store, sel.level, sel.group, -1, specPropRef[store.edit.graphics-1], colText.children[1].children[0].value));
                    }else{
                        sel.h = !sel.h;
                        if(!keys.Shift){
                            if(!sel.h && sels.length > 1){
                                sels.splice(sels.indexOf(sel), 1);
                                sel.h = true;
                            }
                            deSel();
                        }
                        if(sel.h) sels.push(sel);
                        else sels.splice(sels.indexOf(sel), 1);
                        setVal(0, sel.mean.x);
                        setVal(1, sel.mean.y);
                        setVal(3, sel.level+1);
                        setVal(4, sel.group+1);
                    }
                    if(store.edit.prop){
                        store.edit.prop = undefined;
                        store.reduceEdit();
                    }
                    Poly.Draw();
                }else if(mode && mel != null){
                    mel.h = !mel.h;
                    if(!keys.Shift){
                        if(!mel.h && mels.length > 1){
                            mels.splice(mels.indexOf(mel), 1);
                            mel.h = true;
                        }
                        deMel(keys.Control);
                    }
                    if(mels.length && keys.Control){ //connect
                        if(mel != mels[mels.length-1]){
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
                        }
                    }else if(keys['a'] || keys['A']){ //whole poly
                        let par = findParent(mel, mode);
                        console.log(par, mode.elems.length);
                        for(let p of mode.elems[par.p].points) if(!p.h){
                            p.h = true; if(p != mel) mels.push(p); 
                        }
                    }
                    if(mel.h) mels.push(mel);
                    else mels.splice(mels.indexOf(mel), 1);
                    setVal(0, mel.x);
                    setVal(1, mel.y);
                    setVal(3, mode.level+1);
                    setVal(4, mode.group+1);
                    Poly.Draw();
                }
            }
        }
        canv.addEventListener("mouseup", mouseup);

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
        const colSave = [];

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
                    props: {},
                    offset: new Point(0, 0)
                });
                recordRead(count++);
                console.log("EP: " + fi + " or " + fil);
                //Poly.Draw();
                if(isNaN(read(4, true))) break;
                fi -= 4;
            }
            //check if saved data would apply to this:
            if(colSave[fileLevel]){
                let cols = colSave[fileLevel];
                for(var g = 0; g < store.edit.l[fileLevel].length; g++){
                    for(var c of cols) store.edit.l[fileLevel][g].props[c.name] = c.elems[g];
                    store.sendTransac(1, fileLevel, g, -1, null, store.edit.l[fileLevel][g].props);
                }
                colSave[fileLevel] = undefined;
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
            let clen = store.edit.l[fileLevel].length;
            if(clen == 0){ //save the data for later
                colSave[fileLevel] = cols;
            }else for(var g = 0; g < clen; g++){
                for(var c of cols) store.edit.l[fileLevel][g].props[c.name] = c.elems[g];
                store.sendTransac(1, fileLevel, g, -1, null, store.edit.l[fileLevel][g].props);
            }
            Poly.Draw();
            //reconcileData(fileLevel);
        }

        async function readGeoFile(file){
            var reader = new FileReader();
            reader.onload = function(){
                var data = JSON.parse(reader.result);
                var GN = 0;
                for(var f of data.features){
                    store.edit.l[fileLevel].push({
                        level: fileLevel,
                        group: GN,
                        mean: new Point(0, 0),
                        h: false,
                        elems: [],
                        props: f.properties,
                        offset: new Point(0, 0)
                    });
                    store.sendTransac(1, fileLevel, GN, -1, null, f.properties); //send the data entry for this new subregion
                    let cr;
                    for(var c of f.geometry.coordinates){
                        var np = new Poly(-1, fileLevel, GN);
                        cr = (c[0].length == 2 ? c : c[0]);
                        for(let i = 0; i < cr.length-1; i++) np.add(new Point(cr[i][0], -cr[i][1]));
                        store.edit.l[fileLevel][GN].elems.push(np);
                        store.edit.l[fileLevel][GN].mean.addLocal(np.mean());
                        np.finalize(fileLevel, GN, store.edit.l[fileLevel][GN]);
                    }
                    GN++;
                }
                //console.log(store.edit.l);
                animCam(true);
                Poly.Draw();
            };
            await reader.readAsText(file);
        }
        var geoFlag;
        async function readFile(f){
            var fl = f.name.split(".");
            viewLevel = fileLevel = parseInt(fl[0].split("_adm")[1]);
            if(isNaN(fileLevel)){
                let nm = fl[0].split("_");
                viewLevel = fileLevel = parseInt(nm[nm.length-1]);
                console.log('VIEW:::::', viewLevel)
            }
            if(isNaN(fileLevel)) viewLevel = fileLevel = 0;
            switch(fl[fl.length-1]){
                case "shp": await readShapeFile(f); break;
                case "dbf": await readDBaseFile(f); break;
                case "json":
                    geoFlag = true;
                    await readGeoFile(f);
                break;
            }
        }
        fileIn.onchange = async function(){
            geoFlag = false;
            for(var f of this.files) await readFile(f);
            colSave.length = 0;
            //console.log(viewLevel, store.edit.l[viewLevel].length);
            if(!geoFlag) animCam(true);
        }
        propHolder.onchange = function(){
            Poly.Draw();
        }
        propButt.onclick = function(){
            store.edit.prop = undefined;
            store.reduceEdit();
            if(sels.length > 0){
                store.edit.prop = sels[sels.length-1];
            }else{ //open global prop menu
                store.edit.prop = {
                    level: -1,
                    group: -1,
                    props: store.edit.gd
                }
                console.log(store.edit.prop);
            }
            store.reduceEdit();
        }
        graphButt.onclick = function(){
            if(store.edit.graphics > 0) store.edit.graphics = 0;
            else store.edit.graphics = 1;
            if(mode) swapMode();
            deSel();
            tps.clearAllTransactions();
            store.edit.prop = undefined;
            store.reduceEdit();
            Poly.Draw();
        }
        centerCam.onclick = function(){
            animCam(true);
        }
        centerButt.onclick = function(){
            conType = !conType;
        }
        shpButt.onclick = function(){
            effectSHP = !effectSHP;
            console.log('-->', effectSHP);
        }
        dlButt.onclick = function(){
            let ret = {
                type: 'FeatureCollection',
                features: []
            };
            for(let g of store.edit.l[viewLevel]){
                if(ret.features[g.group] == undefined)
                    ret.features[g.group] = {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'MultiPolygon',
                            coordinates: []
                        }
                    }
                //fill geoms:
                let temp = [];
                for(let p of g.elems) temp.push(p.strip());
                ret.features[g.group].geometry.coordinates = temp;
                //fill props:
                ret.features[g.group].properties = g.props;
            }
            console.log(ret);
            if(!ret.features.length) return;
            dlMule.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(ret)));
            dlMule.setAttribute('download', 'mapSave_'+(viewLevel)+'.geo.json');
            dlMule.style.display = 'none';
            dlMule.click();
        }
        /*
        var toolRefs = [
            selectRefer.current,
            addRefer.current,
            removeRefer.current,
            moveRefer.current,
            boxRefer.current,
            splitRefer.current,
            drawRefer.current,
            cutRefer.current,
            consRefer.current,
            mergeRefer.current
        ];
        */
        toolRefs[0].onclick = function(){
            swapTool(0);
            Poly.Draw();
        }
        toolRefs[1].onclick = function(){
            if(canSel()) insert_tool();
            Poly.Draw();
        }
        toolRefs[2].onclick = function(){
            if(canSel()) remove_tool();
            Poly.Draw();
        }
        toolRefs[3].onclick = function(){
            if(canSel()) swapTool(1);
            Poly.Draw();
        }
        toolRefs[4].onclick = function(){
            swapTool(2);
            Poly.Draw();
        }
        toolRefs[5].onclick = function(){ //split (lift)
            if(canSel()) lift_tool();
            Poly.Draw();
        }
        toolRefs[6].onclick = function(){ //draw
            if(addPoints.length != 0) return;
            swapTool(3);
            Poly.Draw();
        }
        toolRefs[7].onclick = function(){ //cut
            swapTool(4);
            Poly.Draw();
        }
        toolRefs[8].onclick = function(){ //consolidate
            if(canSel()) con_tool();
            Poly.Draw();
        }
        toolRefs[9].onclick = function(){ //merge
            if(canSel()) merge_tool();
            Poly.Draw();
        }
        colTypes[0].onclick = function(){
            store.edit.graphics = 1;
        }
        colTypes[1].onclick = function(){
            store.edit.graphics = 2;
        }
        colTypes[2].onclick = function(){
            store.edit.graphics = 3;
        }
        var hBox;
        function drawBox(p){
            hBox = 2*(camZ**.2);
            ctx.strokeStyle = '#ff00ff';
            ctx.beginPath();
            ctx.rect(HW+camZ*(p.x+camX-HW)-hBox, HH+camZ*(p.y+camY-HH)-hBox, hBox*2, hBox*2);
            ctx.stroke();
        }
        function drawDot(p, h=false){
            if(h) ctx.strokeStyle = '#ff0000';
            else ctx.fillStyle = p.h ? "#fbbd0c" : "#000";
            ctx.beginPath();
            ctx.arc(HW+camZ*(p.x+camX-HW), HH+camZ*(p.y+camY-HH), (h ? 2 : 1) * camZ**.2, 0, 2*Math.PI);
            if(h) ctx.stroke();
            else ctx.fill();
        }
        function bool(x){
            if(x) return true;
            return false;
        }
        const OFF = new Point(0, 0);
        function setOff(o = null){
            if(o != null) OFF.set(o.x, o.y);
            else OFF.set(0, 0);
        }
        function loc(b, v){
            return (b ? HW : HH) + camZ*(v+(b ? OFF.x : OFF.y)+(b ? camX-HW : camY-HH));
        }
        function sizeCanv(){
            const { width, height } = canv.getBoundingClientRect();
            if(canv.width !== width || canv.height !== height){
                const { devicePixelRatio:ratio=1 } = window;
                CW = canv.width = width*ratio;
                CH = canv.height = height*ratio;
                HW = CW/2;
                HH = CH/2;
                ctx.scale(ratio, ratio);
                return true;
            }
            return false;
        }
        function pSan(l){
            let ret = [];
            for(let p of l) ret.push(p.copy());
            return ret;
        }
        var fx, fy, pLast = new Point(0, 0), dx, dy;
        var LOD_RATIO = 3, LOD_SKIP, LOD_STEP, LOD_REF, finSum, li, ni, ci;
        var defCol, fillCol, mark, Acc = false;
        var dots = [], remp, remi, gi, mri;
        const subColRefs = ['#aba99f', '#000', '#000', ''];
        class Poly{
            static l = [[], [], [], [], []]; //poly struct
            static d = [[], [], [], [], []]; //data struct
            static vis = [true, true, true, true, true]; //vis array
            static SubDraw(ind){
                var p = 0, l, g;
                defCol = subColRefs[ind];
                fillCol = subColRefs[ind+3];
                for(p = 0; p < store.edit.l.length; p++){
                    //if((!ind) == (viewLevel == p)) continue;
                    if(viewLevel != p) continue;
                    if(Poly.vis[p]) for(l of store.edit.l[p]){
                        for(g of l.elems) if((ind == 2) == l.h){
                            if(store.edit.graphics) g.draw(l.h && !mode, l.h && (l == mode), l.offset, l.props['**colorFill'], l.props['**borderFill']);
                            else g.draw(l.h && !mode, l.h && (l == mode), l.offset, null, null);
                        }
                        if(l.props != null && Object.keys(l.props).length){ //has data
                            l.mean.getLocal();
                            if(store.edit.graphics && l.props['**textFill'] != null) ctx.fillStyle = l.props['**textFill'];
                            else ctx.fillStyle = l.h ? "#fbbd0c" : '#000';
                            if(!mode){
                                if(l.props['NAME_'+p] != undefined)
                                    ctx.fillText(l.props['NAME_'+p], Point.Gen.x, Point.Gen.y);
                                else if(l.props['name'] != undefined)
                                    ctx.fillText(l.props['name'], Point.Gen.x, Point.Gen.y);
                            }
                        }
                    }
                }
            }
            static Draw(af = false){
                sizeCanv();
                LOD_RATIO = lodSlide.value;
                ctx.font = (9 + parseInt(textSlide.value)) + "px Verdana";
                ctx.clearRect(0, 0, canv.width, canv.height);
                ctx.fillStyle = '#99b3ff';
                ctx.fillRect(0, 0, canv.width, canv.height);
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
                }else if(tool == 3 && addPoints.length){
                    if(addPoints.length > 1){
                        ctx.strokeStyle = '#fbbd0c';
                        ctx.beginPath();
                        ctx.moveTo(loc(true, addPoints[0].x), loc(false, addPoints[0].y));
                        for(let p of addPoints) ctx.lineTo(loc(true, p.x), loc(false, p.y));
                        ctx.stroke();
                        for(let p of addPoints) drawDot(p);
                    }
                }else if(tool == 4 && mel){
                    drawBox(mel);
                    if(cutRef != null){
                        ctx.strokeStyle = '#ff00ff';
                        ctx.setLineDash([5, 15]);
                        ctx.beginPath();
                        ctx.moveTo(loc(true, cutRef.x), loc(false, cutRef.y));
                        ctx.lineTo(loc(true, mel.x), loc(false, mel.y));
                        ctx.stroke();
                        ctx.setLineDash([]);
                    }
                }
            }
            constructor(id, fl, gn, copy = false){
                if(copy || store.edit.l[fl][gn] == undefined || store.edit.l[fl][gn].elems == undefined) this.id = id;
                else this.id = store.edit.l[fl][gn].elems.length; //this is the id of the poly in its group!!!!
                //this.id = id;
                //this.fl = fl; //file level
                //this.gn = gn; //group number
                this.lodBound = diagBound;
                this.points = [];
                this.clockWise = true;
                this.minX = this.minY = 100000000;
                this.maxX = this.maxY = -100000000;
            }
            copy(){
                let ret = new Poly(this.id, -1, -1, true);
                ret.id = this.id; //just in case
                ret.lodBound = this.lodBound;
                ret.clockWise = this.clockWise;
                ret.minX = this.minX;
                ret.maxX = this.maxX;
                ret.minY = this.minY;
                ret.maxY = this.maxY;
                ret._mean = this._mean;
                for(let p of this.points){
                    let np = p.copy();
                    np.p = ret;
                    ret.points.push(np);
                }
                return ret;
            }
            strip(){
                let ret = [];
                for(let p of this.points) ret.push(p.strip());
                if(this.points.length > 0) ret.push(this.points[0].strip());
                return [ret];
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
                p.p = this;
                this.points.push(p);
            }
            get(i){ //circular treatment!!!
                while(i < 0) i += this.points.length;
                while(i >= this.points.length) i -= this.points.length;
                return this.points[i];
            }
            indexOf(p, e = false){
                for(var i = 0; i < this.points.length; i++) if((e ? (this.points[i] === p) : (this.points[i].eq(p)))) return i;
                return -1;
            }
            static interval(min1, max1, min2, max2){
                return max1 >= min2 && max2 >= min1;
            }
            isOverlapping(p){
                return Poly.interval(p.minX, p.maxX, this.minX, this.maxX) && Poly.interval(p.minY, p.maxY, this.minY, this.maxY);
            }
            isNeighbor(p, l = 1, b = false){
                let last = null;
                if(!this.isOverlapping(p)) return false; //avoid lengthy calls
                for(var i of p.points) if(this.indexOf(i) != -1){
                    l--;
                    if(b){
                        if(last == null) last = i;
                        else if(!i.eq(last) && l <= 0) return i;
                    }else if(l <= 0) return i;
                }
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
                for(var i = 0; i < this.points.length-1; i++)
                    finSum += (this.points[i+1].x-this.points[i].x) * (this.points[i].y+this.points[i+1].y);
                this.clockWise = finSum < 0;
                this.reCalc(par);
                if(fl != null){
                    store.sendTransac(0, fl, gn, this.id, null, pSan(this.points)); //type, fl, gn, pn, od, nd
                }
            }
            reCalc(parent = null){
                this.bound();
                this.mean();
                if(!parent) return;
                parent.minX = parent.minY = 100000000;
                parent.maxX = parent.maxY = -100000000;
                if(parent.mean == undefined) parent.mean = new Point(0, 0);
                if(parent.offset == undefined) parent.offset = new Point(0, 0);
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
                this.lodBound = Math.sqrt(Math.pow(this.maxX-this.minX, 2) + Math.pow(this.maxY-this.minY, 2));
            }
            mean(){
                let m = new Point(0, 0);
                for(var p of this.points) m.addLocal(p);
                m.x /= this.points.length;
                m.y /= this.points.length;
                return (this._mean = m);
            }
            draw(high, sigh, off, fillCol, bordCol){ //use camZ for zoom
                setOff(off);
                if(loc(true, this.maxX) < 0) return;
                if(loc(true, this.minX) > CW) return;
                if(loc(false, this.maxY) < 0) return;
                if(loc(false, this.minY) > CH) return;
                //drawDot(this.points[0]);
                ctx.beginPath();
                if(bordCol != null) ctx.strokeStyle = bordCol;
                else ctx.strokeStyle = mode && !sigh ? "#aba99f" : (high ? "#fbbd0c" : defCol);
                //accTally = 1;
                LOD_STEP = 100;
                if(camZ > 10000) LOD_SKIP = 0;
                else LOD_SKIP = LOD_RATIO * this.lodBound / camZ / camZ;
                //if(mode && !sigh) LOD_SKIP = 10000000000 * this.lodBound;
                aFrame = true; bFrame = false;
                LOD_REF = this.points[0];
                fx = loc(true, LOD_REF.x); //HW + camZ*(LOD_REF.x + camX - HW);
                fy = loc(false, LOD_REF.y); //HH + camZ*(LOD_REF.y + camY - HH);
                mark = 0;
                dots = [];
                if(sigh) dots.push(LOD_REF);
                //pLast.set(undefined, undefined); //pLast.set(fx, fy);
                ctx.moveTo(fx, fy);
                for(gi = 1; gi < this.points.length; gi++){
                    //i % LOD_STEP == 0 && 
                    if(!Acc && !this.points[gi].h && LOD_REF.fastDist(this.points[gi]) < LOD_SKIP) continue;
                    LOD_REF = this.points[gi];
                    fx = loc(true, LOD_REF.x); //HW+camZ*(LOD_REF.x+camX-HW);
                    fy = loc(false, LOD_REF.y); //HH+camZ*(LOD_REF.y+camY-HH);
                    if((fx < 0 || fx > CW) && (fy < 0 || fy > CH)) continue;
                    if(sigh) dots.push(this.points[gi]);
                    mri = gi;
                    ctx.lineTo(fx, fy);
                }
                fx = loc(true, this.points[0].x); //HW + camZ*(this.points[0].x + camX - HW);
                fy = loc(false, this.points[0].y); //HH + camZ*(this.points[0].y + camY - HH);
                if(mri == this.points.length-1 || (fx > 0 && fx < CW && fy > 0 && fy < CH)) ctx.lineTo(fx, fy);
                ctx.stroke();
                if(fillCol != null) ctx.fillStyle = fillCol;
                else ctx.fillStyle = mode && !sigh ? "#dcdcdc" : (high ? "#666600" : '#99ff66');
                ctx.fill();
                LOD_REF = null;
                //if(dots.length) drawBox(dots[0]);
                for(let d of dots) if(!d.h) drawDot(d);
                for(let d of dots) if(d.h) drawDot(d);
                setOff();
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
            var ret = new Poly(A.id, level, group);
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
            //ret.add(first);
            ret.mean();
            ret.finalize(null, null, store.edit.l[level][group]);
            return ret;
        }
        function cleanString(s){
            if(s == null || s == undefined) return '';
            if(!s.length) return '';
            while(s[0] == ' ') s = s.slice(1);
            while(s[s.length-1] == ' ') s = s.slice(0, s.length-1);
            return s;
        }
        function copyRegion(reg){
            let ret = {
                level: reg.level,
                group: reg.group,
                h: false,
                mean: reg.mean.copy(),
                elems: [],
                props: structuredClone(reg.props),
                offset: new Point(0, 0)
            };
            for(let p of reg.elems) ret.elems.push(p.copy());
            return ret;
        }
        function merge_tool(){
            if(!canSel()) return;
            if(mode) return;
            if(sels.length != 2) return handleWarning('Must be selecting only two SubRegions at a time');
            console.log(sels[0]);
            console.log(sels[1]);
            let save1 = copyRegion(sels[0]);
            let save2 = copyRegion(sels[1]);
            //var rx = sels[1].level, ry = sels[1].group;
            while(true){
                var pass = true;
                for(var i = 0; i < sels[0].elems.length; i++){
                    for(var n = 0; n < sels[1].elems.length; n++){
                        if(sels[0].elems[i].isNeighbor(sels[1].elems[n], 2, true)){
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
            for(var i of Object.keys(sels[1].props)){
                if(sels[0].props[i] == undefined){
                    sels[0].props[i] = sels[1].props[i];
                }else{
                    if(isNaN(sels[0].props[i])) sels[0].props[i] = cleanString(sels[0].props[i]) + "/" + cleanString(sels[1].props[i]);
                    else sels[0].props[i] += sels[1].props[i];
                }
            }
            let ret = copyRegion(sels[0]);
            //SANITIZE THE INDICES{{{
            for(let i = 0; i < ret.elems.length; i++) ret.elems[i].id = i;
            //}}}
            console.log('RET:', ret);
            tps.bookMark();
            tps.addTransaction(new DeleteGroup_Transaction(store, false, sels[0].level, sels[0].group, -1, save1));
            tps.addTransaction(new DeleteGroup_Transaction(store, false, sels[1].level, sels[1].group, -1, save2));
            tps.addTransaction(new MakeGroup_Transaction(store, false, ret.level, ret.elems[0]));
            for(let i = 1; i < ret.elems.length; i++){
                //console.log("EXTRA???");
                tps.addTransaction(new MakeGroup_Transaction(store, store.edit.l[ret.level][store.edit.l[ret.level].length-1], ret.level, ret.elems[i]));
            }
            for(let p of store.edit.l[ret.level][store.edit.l[ret.level].length-1].elems)
                console.log(p.id);
            sels.length = 0;
            Poly.Draw();
            //return ret;
        }
        function onSegment(p, q, r){
            if(q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
                return true;
            return false;
        }
        function orientation(p, q, r){
            let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
            if (val == 0) return 0;
            return (val > 0) ? 1 : 2;
        }
        function doIntersect(p1, q1, p2, q2){
            let o1 = orientation(p1, q1, p2);
            let o2 = orientation(p1, q1, q2);
            let o3 = orientation(p2, q2, p1);
            let o4 = orientation(p2, q2, q1);
            if (o1 != o2 && o3 != o4) return true;
            if (o1 == 0 && onSegment(p1, p2, q1)) return true;
            if (o2 == 0 && onSegment(p1, q2, q1)) return true;
            if (o3 == 0 && onSegment(p2, p1, q2)) return true;
            if (o4 == 0 && onSegment(p2, q1, q2)) return true;
            return false;
        }
        class line{
            constructor(p1,p2){
                this.p1=p1;
                this.p2=p2;
            }
        };
        function onLine(l1, p){
            if(p.x <= Math.max(l1.p1.x, l1.p2.x) && p.x <= Math.min(l1.p1.x, l1.p2.x)
            && (p.y <= Math.max(l1.p1.y, l1.p2.y) && p.y <= Math.min(l1.p1.y, l1.p2.y)))
                return true;
            return false;
        }
        function isIntersect(l1, l2){
            let dir1 = orientation(l1.p1, l1.p2, l2.p1);
            let dir2 = orientation(l1.p1, l1.p2, l2.p2);
            let dir3 = orientation(l2.p1, l2.p2, l1.p1);
            let dir4 = orientation(l2.p1, l2.p2, l1.p2);
            if (dir1 != dir2 && dir3 != dir4) return true;
            if (dir1 == 0 && onLine(l1, l2.p1)) return true;
            if (dir2 == 0 && onLine(l1, l2.p2)) return true;
            if (dir3 == 0 && onLine(l2, l1.p1)) return true;
            if (dir4 == 0 && onLine(l2, l1.p2)) return true;
            return false;
        }
        function checkInside(poly, p){
            let n = poly.length;
            let tmp=new Point(Number.MAX_SAFE_INTEGER, p.y);
            let exline = new line(p, tmp );
            let count = 0;
            let i = 0;
            do{
                let side = new line( poly[i], poly[(i + 1) % n] );
                if(isIntersect(side, exline)){
                    if(orientation(side.p1, p, side.p2) == 0)
                        return onLine(side, p);
                    count++;
                }
                i = (i + 1) % n;
            }while(i != 0);
            return count & 1;
        }
        function cut_tool(a, b){
            if(tool != 4 || !mode) return;
            console.log('ATTEMPT CUT BETWEEN:', a, b);
            let aPar = findParent(a, mode),
            bPar = findParent(b, mode);
            console.log(aPar, bPar);
            if(aPar.p != bPar.p) return handleWarning('Cut endpoints must belong to the same Poly');
            let dif = Math.abs(aPar.i - bPar.i),
            par = mode.elems[aPar.p],
            len = par.points.length; 
            if(dif == 1 || dif == len-1) return handleWarning('Cut enpoints cannot be neighboring');
            //deMel();
            for(let i = 0; i < len-1; i++){
                if(doIntersect(a, b, par.points[i], par.points[i+1])){
                    console.log(a, b, par.points[i], par.points[i+1]);
                    let dif1 = Math.abs(i - aPar.i),
                    dif2 = Math.abs(i - bPar.i);
                    console.log('else', i, aPar.i, bPar.i, '->', dif1, dif2);
                    if(dif1 < 2 || dif1 == len || dif2 < 2 || dif2 == len) continue;
                    return handleWarning('Cut overlaps with Poly border');
                }
            }
            let avg = a.add(b).divideLocal(2);
            if(!checkInside(par.points, avg)) return handleWarning("Cut leaves Poly border");
            let save = par.copy(),
            np1 = new Poly(null, mode.level, mode.group),
            np2 = new Poly(null, mode.level, mode.group),
            i = aPar.i-1;
            while((i = ++i%len) != bPar.i) np1.add(par.points[i].copy());
            np1.add(par.points[bPar.i].copy());
            i = bPar.i-1;
            while((i = ++i%len) != aPar.i) np2.add(par.points[i].copy());
            np2.add(par.points[aPar.i].copy());
            tps.bookMark();
            tps.addTransaction(new DeleteGroup_Transaction(store, true, mode.level, mode.group, aPar.p, save));
            np1.id = mode.elems.length;
            tps.addTransaction(new MakeGroup_Transaction(store, mode, mode.level, np1));
            np2.id = mode.elems.length;
            tps.addTransaction(new MakeGroup_Transaction(store, mode, mode.level, np2));
            for(let i = 0; i < mode.elems.length; i++) mode.elems[i].id = i; //sanitize
        }
        function lift_tool(){
            if(!canSel()) return;
            if(!mode || !mels.length) return;
            let pc = [];
            for(let _ of mode.elems) pc.push(0);
            for(let m of mels) pc[findParent(m, mode).p]++;
            let lc = false;
            for(let i = 0; i < pc.length; i++) if((lc = (pc[i] != mode.elems[i].points.length))) break;
            if(!lc) return handleWarning('Cannot split all Polys from a SubRegion');
            lc = 0;
            tps.bookMark();
            console.log(pc.length, 'vs', mode.elems.length, ':', pc);
            for(let i = 0; i < pc.length; i++){
                console.log(i, mode.elems[i-lc]);
                if(pc[i] == mode.elems[i-lc].points.length){
                    console.log("ATTEMPTING POLY LIFT:", i);
                    let lift = mode.elems[i-lc];
                    tps.addTransaction(new DeleteGroup_Transaction(store, true, mode.level, mode.group, i-lc, lift.copy()));
                    for(let i = 0; i < mode.elems.length; i++) mode.elems[i].id = i; //sanitize
                    lift.id = 0;
                    tps.addTransaction(new MakeGroup_Transaction(store, false, mode.level, lift));
                    pc[i] = -1; lc++;
                }
            }
            tps.unMark();
            if(lc == 0) return handleWarning('Must select entire Polys to split from current SubRegion');
        }
        var conType = true, effectSHP = true;
        function con_tool(){
            if(!canSel()) return;
            if(!mode || !mels.length) return;
            let ref = new Point(0, 0), save;
            if(!conType){
                ref = mels[mels.length-1];
                save = mels.pop();
            }else{
                for(let m of mels) ref.addLocal(m);
                ref.divideLocal(mels.length);
            }
            tps.bookMark();
            let par;
            for(let m of mels){
                par = findParent(m, mode);
                if(effectSHP) for(let sh of shared(m, mode)){
                    let fg = findGroup(sh.p, viewLevel);
                    let spar = findParent(sh, fg, true);
                    tps.addTransaction(new Move_Transaction(store, viewLevel, fg.group, spar.p, spar.i, ref.sub(sh)));
                }
                tps.addTransaction(new Move_Transaction(store, mode.level, mode.group, par.p, par.i, ref.sub(m)));
            }
            tps.unMark();
            if(!conType) mels.push(save);
        }
        function start(){ //translate raw DB data into more robust editing structure
            //ctx.lineWidth = 2;
            if(!store.edit.raw) return;
            //console.log('RAW:', store.edit.l);
            for(let i = 0; i < store.edit.l.length; i++){
                for(let n = 0; n < store.edit.l[i].length; n++){
                    let temp = {
                        level: i,
                        group: n,
                        h: false,
                        mean: new Point(0, 0),
                        elems: [],
                        props: store.edit.l[i][n].props,
                        offset: new Point(0, 0)
                    };
                    if(temp.props == undefined) temp.props = {};
                    for(let m = 0; m < store.edit.l[i][n].elems.length; m++){
                        let np = new Poly(m, i, n);
                        for(let p of store.edit.l[i][n].elems[m]) np.add(new Point(p.x, p.y));
                        //console.log(m, 'PAR??:', np.points[0].p);
                        np.id = m;
                        temp.mean.addLocal(np.mean());
                        temp.elems.push(np);
                        np.finalize(null, null, temp);
                        np.id = m;
                    }
                    //temp.mean.divideLocal(temp.elems.length);
                    //store.edit.l[i][n] = temp;
                    store.edit.l[i].splice(n, 1, temp);
                }
            }
            store.edit.raw = false;
            store.edit.graphics = 0;
            camX = store.edit.camX;
            camY = store.edit.camY;
            camZ = store.edit.camZ;
            viewLevel = store.edit.viewLevel;
            lodSlide.value = LOD_RATIO = store.edit.LOD_RATIO;
            setVal(3, viewLevel+1);
            swapTool(0, true);
            //console.log('CLEANED:', store.edit.l);
            Poly.Draw();
        }

        fileIn.onLoad = start();

        return () => { //cleanup the event listeners!!!
            console.warn('cleaning!!!!!!!!!!!!!!!!!!!!!!!');
            store.sendImmediateTransac(7, -1, -1, -1, null, [camX, camY, camZ, viewLevel, LOD_RATIO]);
            window.removeEventListener("keydown", keydown);
            window.removeEventListener("keyup", keyup);
            canv.removeEventListener("mousedown", mousedown);
            canv.removeEventListener("mouseup", mouseup);
            canv.removeEventListener("wheel", wheel);
            canv.removeEventListener("mousemove", mousemove);
        }
    }}, [store.tabMode]);
    //if(!auth.loggedIn) return <SplashScreen />;
    //if(store.edit == null) return <></>;
    return (
        <div id='editParent'>
            <div id = "leftPar" className='editShelf'>
                <Box id='toolTray' className='traySect' sx={{bgcolor: '#999', borderRadius: 3, maxHeight: '30%', overflow: 'auto'}}>
                    <Tooltip title='Select (left click)'>
                        <IconButton size='medium' ref={selectRefer} aria-label='select'>
                            <MouseIcon style={{fontSize:32}} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Insert Point (i)'>
                        <IconButton size='medium' ref={addRefer} aria-label='add'>
                            <AddIcon style={{fontSize:32}} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Remove (x)'>
                        <IconButton size='medium' ref={removeRefer} aria-label='remove'>
                            <ClearIcon style={{fontSize:32}} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Drag (g)'>
                        <IconButton size='medium' ref={moveRefer} aria-label='move'>
                            <PanToolIcon style={{fontSize:32}} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Box Select (b)'>
                        <IconButton size='medium' ref={boxRefer} aria-label='box select'>
                            <HighlightAltIcon style={{fontSize:32}} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Merge (m)'>
                        <IconButton size='medium' ref={mergeRefer} aria-label='merge'>
                            <CallMergeIcon style={{fontSize:32}} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Split (l)'>
                        <IconButton size='medium' ref={splitRefer} aria-label='split'>
                            <CallSplitIcon style={{fontSize:32}} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Properties Menu'>
                        <IconButton size='medium' aria-label='properties'>
                            <MenuIcon ref={propContainer} style={{fontSize:32}} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Poly Draw (p)'>
                        <IconButton size='medium' ref={drawRefer} aria-label='draw'> 
                            <PolylineIcon style={{fontSize:32}} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Cut (k)'>
                        <IconButton size='medium' ref={cutRefer} aria-label='cut'>
                            <ContentCutIcon style={{fontSize:32}} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Consolidate (c)'>
                        <IconButton size='medium' ref={consRefer} aria-label='equate'>
                            <HubIcon style={{fontSize:32}} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='File Upload'>
                        <IconButton size='medium' variant="contained" component="label" aria-label='upload'>
                            <input ref={fileContainer} type="file" id="fileIn" name="ShapeUpload" multiple hidden></input>
                            <FileUploadIcon  style={{fontSize:32}} />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box id='displayMenu' ref={propList} className='traySect' sx={{maxHeight: '40%', overflow: 'auto', borderTop: 2, borderBottom: 2, borderColor: '#00ff00'}}>
                    {
                        store.edit && store.edit.prop && store.edit.prop.props ? (<div>
                            {store.edit.prop.level == -1 ? 'GLOBAL:' : ''}
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
                                                    let nt = new ChangeProperty_Transaction(store, store.edit.prop.level, store.edit.prop.group, -1, key, e.target.value);
                                                    nt.doTransaction();
                                                    propList.current.onchange(null); //force recycle
                                                    store.reduceEdit();
                                                }
                                            }}
                                        />
                                        <IconButton sx={{flex: 1, color: 'red'}} aria-label='remove'
                                            onClick={(e) => {
                                                let nt = new ChangeProperty_Transaction(store, store.edit.prop.level, store.edit.prop.group, -1, key, undefined);
                                                nt.doTransaction();
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
                                                let nt = new ChangeProperty_Transaction(store, store.edit.prop.level, store.edit.prop.group, -1, e.target.value, '');
                                                nt.doTransaction();
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
                        <Box sx={{paddingLeft: '5%', marginLeft: '5%'}}>LOD Bias:</Box>
                        <Slider
                            aria-label="LOD Bias"
                            defaultValue={3}
                            max={10}
                            min={0}
                            step={.01}
                            valueLabelDisplay="auto"
                            sx={{width: '80%', paddingLeft: '5%', marginLeft: '5%'}}
                            ref={lodSlider}
                        />
                    </Box>
                    <Box className='sliderLabel'>
                        <Box sx={{paddingLeft: '5%', marginLeft: '5%'}}>Text Size:</Box>
                        <Slider
                            aria-label="Text Size"
                            defaultValue={1}
                            max={20}
                            min={1}
                            step={1}
                            valueLabelDisplay="auto"
                            sx={{width: '80%', paddingLeft: '5%', marginLeft: '5%'}}
                            ref={textSlider}
                        />
                        
                    </Box>
                </Box>
                <Box id='miscTools' className='traySect'>
                    <IconButton ref={centerCamera} aria-label='Center Camera'>
                        <CameraIndoorIcon sx={{color: '#5EB120'}} style={{fontSize:32}} />
                    </IconButton>
                    <a id="dlMule" ref={downloadMule} download='testFile'></a>
                    <IconButton ref={downloadButton} aria-label='Export Map'>
                        <DownloadIcon sx={{color: '#5EB120'}} style={{fontSize:32}} />
                    </IconButton>
                </Box>
                <Box id='miscSwitches' className='traySect' sx={{width: '100%', overflow: 'auto'}}>
                    <FormGroup>
                        <FormControlLabel control={<Switch ref={shpToggle} defaultChecked />} label="Effect Shared Points" />
                        <FormControlLabel control={<Switch ref={centerToggle} defaultChecked />} label="Center Consolidation" />
                    </FormGroup>
                </Box>
            </div>
            <Box id="midPar">
                <canvas ref={myContainer} id="editView"></canvas>
            </Box>
            <div id = "rightPar" className='editShelf'>
                <Box sx={{maxHeight: '5%', display: 'flex'}}>
                    <FormGroup sx={{paddingLeft: '5%', justifyContent: 'center'}}>
                        <FormControlLabel control={<Switch ref={graphicsButt} />} label={store.edit && store.edit.graphics ? "Graphics Mode" : "Edit Mode"} />
                    </FormGroup>
                </Box>
                <Box sx={{maxHeight: '10%', overflow: 'auto'}}>
                    <Collapse in={(warning != null)}>
                        <Typography sx={{color: '#fbbd0c', bgcolor: '#997a00'}} variant='h6'>{warning}</Typography>
                    </Collapse>
                </Box>
                <Box id='inspector' className='traySect' sx={{bgcolor: '#999', borderRadius: 1, maxHeight:'30%', overflow: 'auto'}}>
                    <TextField ref={camXTxt} variant="filled" disabled size="small" maxHeight='33%' value="0" label="X"/>
                    <TextField ref={camYTxt} variant="filled" disabled size="small" maxHeight='33%' value="0" label="Y"/>
                    <TextField ref={camZTxt} variant="filled" disabled size="small" maxHeight='33%' value="1" label="Scale"/>
                </Box>
                <Box id='inspector2' className='traySect' sx={{bgcolor: '#999', borderRadius: 1, maxHeight:'30%', overflow: 'auto'}}>
                    <TextField ref={modeTxt} variant="filled" disabled size="small" maxHeight='33%' label="Mode" value="Object"/>
                    <TextField ref={layerTxt} variant="filled" disabled size="small" maxHeight='33%' label="Layer #" value="1"/>
                    <TextField ref={groupTxt} variant="filled" disabled size="small" maxHeight='33%' label="Subregion #" value="-"/>
                </Box>
                <Box sx={{maxHeight:'40%', maxWidth: '100%', overflow: 'auto', paddingTop: '10%'}}>
                    <Collapse in={(store.edit && store.edit.graphics)} sx={{display: 'flex', flexDirection: 'column'}}>
                        <HexColorPicker color={hexCol} onChange={setHexCol} />
                        <TextField sx={{bgcolor: '#999', width: '100%', borderRadius: 1}} ref={colTxt} variant="filled" label="Color" onChange={(e) => {setHexCol(e.target.value)}} value={hexCol}/>
                        <IconButton ref={colTyp1} aria-label='FillColor'>
                            <TextureIcon style={{fontSize:32}} />
                        </IconButton>
                        <IconButton ref={colTyp2} aria-label='BorderColor'>
                            <BorderStyleIcon style={{fontSize:32}} />
                        </IconButton>
                        <IconButton ref={colTyp3} aria-label='TextColor'>
                            <FormatColorTextIcon style={{fontSize:32}} />
                        </IconButton>
                    </Collapse>
                </Box>
            </div>
        </div>
    );
}

export default EditScreen;