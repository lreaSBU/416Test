const Map = require('../models/map-model');
const User = require('../models/user-model');
const Layer = require('../models/layer-model');
const SubRegion = require('../models/subregion-model');
const Poly = require('../models/poly-model');
const Point = require('../models/point-model');

async function getLayer(id){
    let ret = [];
    let l = await Layer.findById(id);
    for(let i = 0; i < l.groups.length; i++){
        let v = await getSubRegion(l.groups[i]);
        ret.push(v);
    }
    return ret;
}
async function getSubRegion(id){
    let ret = {elems: [], props: null};
    let l = await SubRegion.findById(id);
    ret.props = l.props;
    for(let i = 0; i < l.polys.length; i++){
        let v = await getPoly(l.polys[i]);
        ret.elems.push(v);
    }
    return ret;
}
async function getPoly(id){
    let ret = await Poly.findById(id);
    return ret.points;
}

async function makeSubRegion(l, i){
    let ns;
    while(l.groups.length <= i){
        ns = new SubRegion();
        await ns.save().then(() => {
            l.groups.push(ns);
        });
    }
    return ns;
}
async function makePoly(s, i){
    let np;
    while(s.polys.length <= i){
        np = new Poly();
        await np.save().then(() => {
            s.polys.push(np);
        });
    }
    return np;
}
startData = async (req, res) => {
    await Map.findById(req.body.id, async (err, map) => {
        if(map.owner != req.userId) return res.status(400).json({success: false});
        let ret = ({
            gd: null,
            l: [],
            camX: map.camX,
            camY: map.camY,
            camZ: map.camZ,
            raw: true
        });
        for(let li = 0; li < 5; li++){
            let lay = await getLayer(map.l[li]);
            ret.l.push(lay);
        }
        return res.status(200).json({ success: true, ed: ret })
    }).catch(err => console.log(err))
}

const editStack = [];
async function doEdit(){
    let map = editStack[0].map;
    let bod = editStack[0].bod;
    let FL, GN, PO;
    if(bod.layer != -1){
        FL = await Layer.findById(map.l[bod.layer]);
    }
    if(bod.subregion != -1){
        GN = await SubRegion.findById(FL.groups[bod.subregion]);
        if(GN == null || GN == undefined || FL.groups[bod.subregion] == undefined){
            GN = await makeSubRegion(FL, bod.subregion);
        }
    }
    if(bod.poly != -1){
        PO = await Poly.findById(GN.polys[bod.poly]);
        if(PO == null || PO == undefined || GN.polys[bod.poly] == undefined){
            PO = await makePoly(GN, bod.poly);
        }
    }
    try{ switch(bod.type){
        case 0: //insert new Poly
            if(PO.points.length > 0) throw 'cannot insert poly where one exists already';
            PO.points = bod.newData;
        break; case 1: //insert new data!!!
            GN.props = bod.newData;
        break;
    }}catch(err){
        console.error("failed applying:", err);
        //return res.status(500).json({success: false});
    }
    if(PO != undefined) await PO.save();
    if(GN != undefined) await GN.save();
    if(FL != undefined) await FL.save();
    await map.save();
    editStack.splice(0, 1);
    if(editStack.length != 0) doEdit();
}

edit = async (req, res) => {
    await Map.findById(req.body.mid, (err, map) => {
        if(map.owner._id != req.userId) return res.status(400).json({success: false});
        let editFlag = editStack.length == 0;
        editStack.push({map: map, bod: req.body});
        if(editFlag) doEdit();
        return res.status(200).json({success: true});
    }).catch(err => console.log(err))
}

async function cleanDB(){
    await Map.deleteMany({});
    await Layer.deleteMany({});
    await SubRegion.deleteMany({});
    await Poly.deleteMany({});
}
//cleanDB();

module.exports = {
    startData,
    edit
}