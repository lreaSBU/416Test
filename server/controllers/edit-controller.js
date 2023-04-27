const Map = require('../models/map-model');
const User = require('../models/user-model');
const Layer = require('../models/layer-model');
const SubRegion = require('../models/subregion-model');
const Poly = require('../models/poly-model');
const Point = require('../models/point-model');

const EditQueue = [];

async function getLayer(id){
    let ret = [];
    let l = await Layer.findById(id);
    console.log(id);
    console.log(l);
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
    /*let np;
    while(s.polys.length <= i){
        np = new Poly();
        await np.save().then(() => {
            s.polys.push(np);
        });
    }
    return np;*/
    while(s.polys.length < i) s.polys.push(undefined);
    let np = new Poly();
    await np.save();
    s.polys.splice(i, (s.polys[i] == undefined ? 1 : 0), np);
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
            raw: true,
            sesh: map.sesh
        });
        map.sesh++;
        map.markModified('sesh');
        await map.save();
        for(let li = 0; li < 5; li++){
            let lay = await getLayer(map.l[li]);
            ret.l.push(lay);
        }
        ret.transacNum = 1;
        let queue = findQueue(map._id);
        if(queue){
            //ret.transacNum = queue.tn + (queue.editing ? 1 : 0);
            queue.tn = ret.transacNum = 1 + (queue.editing ? 1 : 0); //DONT TRY TO SAVE AN OLD SESSION ANYMORE!!!
            if(queue.editing) queue.reset = true;
        }
        else EditQueue.push({id: map._id, tn: 1, editing: false, q: []});
        console.log('EditQueue:', EditQueue);
        return res.status(200).json({ success: true, ed: ret })
    }).catch(err => console.log(err))
}
function comp(a, b){
    a = JSON.stringify(a);
    b = JSON.stringify(b);
    if(a.length != b.length) return false;
    for(let i = 0; i < a.length; i++) if(a[i] != b[i]) return false;
    return true;
}
function findQueue(id){
    for(let i = 0; i < EditQueue.length; i++)
        if(comp(EditQueue[i].id, id)) return EditQueue[i];
    return null;
}
async function tryEdit(queue){
    if(queue.editing) return;
    for(let i of queue.q) if(i.tid == queue.tn){
        if(queue.editing) return;
        doEdit(queue, i);
        break;
    }
}
async function doEdit(queue, bod){
    if(queue.editing) return;
    queue.editing = true;
    let map = await Map.findById(queue.id);
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
        break; case 2: //delete point
            PO.points.splice(bod.oldData, 1);
        break; case 3: //insert point
            PO.points.splice(bod.oldData, 0, bod.newData);
        break; case 4: //move point
            let temp = PO.points[bod.oldData]; 
            temp.x += bod.newData.x;
            temp.y += bod.newData.y;
            PO.points.splice(bod.oldData, 1, temp);
        break; case 5: //set a property
            if(bod.newData == undefined) delete GN.props[bod.oldData];
            else GN.props[bod.oldData] = bod.newData;
            GN.markModified("props");
        break; case 6: //remove POLY
            console.log(bod.layer, bod.subregion, bod.poly, bod.oldData, bod.newData);
            GN.polys.splice(bod.newData, 1);
        break; case 7: //set CAM
            if(bod.newData[0] != undefined) map.camX = bod.newData[0];
            if(bod.newData[1] != undefined) map.camY = bod.newData[1];
            if(bod.newData[2] != undefined) map.camZ = bod.newData[2];
        break;
    }}catch(err){
        console.error("failed applying:", err);
    }
    if(PO != undefined) await PO.save();
    if(GN != undefined) await GN.save();
    if(FL != undefined) await FL.save();
    await map.save();
    queue.q.splice(queue.q.indexOf(bod), 1);
    queue.tn++;
    queue.editing = false;
    if(queue.reset) queue.q = [];
    tryEdit(queue);
}

edit = async (req, res) => {
    await Map.findById(req.body.mid, (err, map) => {
        if(map.owner._id != req.userId) return res.status(400).json({success: false});
        let queue = findQueue(map._id);
        if(!queue) return res.status(401).json({success: false});
        queue.q.push(req.body);
        tryEdit(queue);
        return res.status(200).json({success: true});
    }).catch(err => console.log(err))
}

async function cleanDB(){
    await User.find({}, async (e, l) => {
        for(let u of l){
            u.maps = [];
            u.markModified('maps');
            await u.save();
        }
    })
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