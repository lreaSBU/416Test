const Map = require('../models/map-model');
const User = require('../models/user-model');
const Layer = require('../models/layer-model');
const SubRegion = require('../models/subregion-model');
const Poly = require('../models/poly-model');
createMap = async (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));

    if (!body) {
        console.log("FAIL 10");
        return res.status(400).json({
            success: false,
            error: 'You must provide a Map',
        })
    }

    const map = new Map(body);
    console.log("???map: " + map.toString());
    if (!map) {
        console.log("FAIL 11");
        return res.status(400).json({ success: false, error: err })
    }

    //fill in the age of the map creation:::
    map.age = Date.now();
    map.published = false;
    map.l = []; //[[], [], [], [], []];
    for (var i = 0; i < 5; i++) {
        let nl = new Layer();
        await nl.save().then(() => {
            map.l.push(nl);
        });
    }
    map.camX = 100;
    map.camY = 100;
    map.camZ = 1;

    User.findOne({ _id: req.userId }, (err, user) => {
        console.log("user found: " + JSON.stringify(user));
        user.maps.push(map._id);
        user
            .save()
            .then(() => {
                map.owner = user;
                map
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            map: map
                        })
                    })
                    .catch(error => {
                        console.log("FAIL 12");
                        return res.status(400).json({
                            errorMessage: 'Map Not Created!'
                        })
                    })
            });
    }).catch(err => console.log(err));
}
// Deletes the map that the user selected
deleteMap = async (req, res) => {
    console.log("delete map with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);

    Map.findById(req.params.id, async (e, map) => {
        for(let l of map.l){
            let layer = await Layer.findById(l);
            for(let s of layer.groups){
                let subregion = await SubRegion.findById(s);
                for(let p of subregion.polys) await Poly.findByIdAndDelete(p);
                subregion.remove();
            }
            layer.remove();
        }
        let user = await User.findById(map.owner);
        if(user != null){
            user.maps.splice(user.maps.indexOf(map._id), 1);
            user.markModified('maps');
            await user.save();
        }
        map.remove();
        return res.status(200).json({success: true});
    });
}
getMapById = async (req, res) => {
    let map = await Map.findById(req.params.id);
    if(map == null) return res.status(400).json({success: false});
    console.log('Speicific Map Found:', map);
    let owner = await User.findById(map.owner);
    if(owner == null) return res.status(401).json({success: false});
    let ret = {
        _id: map._id,
        name: map.name,
        createdAt: map.createdAt,
        updatedAt: map.updatedAt,
        published: map.published,
        owner: {
            name: (owner.firstName + ' ' + owner.lastName),
            contactId: owner._id
        }
    }
    return res.status(200).json({ success: true, map: ret });
}
getMapPairs = async (req, res) => {
    let bod = req.body;
    let maps = [];
    if(bod.filter == '') return res.status(200).json({ success: true, idNamePairs: [] });
    if(bod.filter == null){ //getting ones own maps
        maps = await Map.find({owner: req.userId});
    }else if(!bod.searchMode){ //searching by MAP name
        maps = await Map.find({name: {$regex : bod.filter, $options: 'i'}, published: true});
    }else{ //searching by USER name
        if(!bod.filter.includes(' ')) return res.status(501).json({ success: false, idNamePairs: [] });
        let fk = bod.filter.split(' ')[0],
        lk = bod.filter.split(' ')[1];
        let users = await User.find({firstName: {$regex : fk, $options: 'i'}, lastName: {$regex : lk, $options: 'i'}});
        if(users == null) return res.status(502).json({ success: false, idNamePairs: [] });
        for(let user of users) for(let m of user.maps){
            let mg = await Map.findById(m);
            if(!mg || !mg.published) continue;
            maps.push(mg);
        }
    }
    if(maps == null) return res.status(401).json({success: false});
    let ret = [];
    for(let map of maps){
        let _owner = await User.findById(map.owner);
        ret.push({
            _id: map._id,
            name: map.name,
            copy: {
                age: map.age,
                owner: (_owner.firstName + ' ' + _owner.lastName),
                published: map.published
            }
        });
    }
    console.log('RETTING PAIRS:', ret);
    return res.status(200).json({ success: true, idNamePairs: ret });
}
// Displays the maps that the user requested
getMaps = async (req, res) => {
    await Map.find({}, (err, maps) => {
        if (err) {
            console.log("FAIL 16");
            return res.status(400).json({ success: false, error: err })
        }
        if (!maps.length) {
            return res
                .status(404)
                .json({ success: false, error: `Maps not found` })
        }
        return res.status(200).json({ success: true, data: maps })
    }).catch(err => console.log(err))
}

commentPlaylist = async (req, res) => {
    const body = req.body;
    console.log("COMMENTING NEW: " + JSON.stringify(body));
    if (!body) {
        console.log("FAIL 100");
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    Playlist.findOne({ _id: body.id }, (err, list) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!'
            })
        }

        list.comments.push({ name: body.name, msg: body.msg });

        list
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    cDat: { name: body.name, msg: body.msg },
                    id: list._id,
                    message: 'Playlist updated!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Playlist not updated!',
                })
            })
    })
}

likePlaylist = async (req, res) => {
    const body = req.body;
    if (!body) {
        console.log("FAIL 17");
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    Playlist.findOne({ _id: body.id }, (err, list) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!'
            })
        }
        var p = true;
        if (body.email != list.ownerEmail) {
            for (var i = 0; i < list.likers.length; i++) {
                if (list.likers[i] === body.email) {
                    p = false;
                    break;
                }
            }
            if (p) {
                list.likers.push(body.email);
                if (body.lt) list.likes++;
                else list.dislikes++;
            }
        } else p = false;

        list
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    acStat: p,
                    id: list._id,
                    message: 'Playlist updated!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Playlist not updated!',
                })
            })
    }).catch(err => console.log(err));
}
var _fl = 0, _gn = 0, _po = 0;
async function getLayer(id){
    let ret = [];
    let l = await Layer.findById(id);
    console.log(_fl, '{');
    for(let i = 0; i < l.groups.length; i++){
        let v = await getSubRegion(l.groups[i]);
        _gn++;
        ret.push(v);
    }
    console.log('}');
    return ret;
}
async function getSubRegion(id){
    let ret = {elems: [], props: null};
    let l = await SubRegion.findById(id);
    console.log(" ", _gn, '(');
    ret.props = l.props;
    for(let i = 0; i < l.polys.length; i++){
        let v = await getPoly(l.polys[i]);
        _po++;
        ret.elems.push(v);
    }
    console.log('  ),');
    return ret;
}
async function getPoly(id){
    let ret = await Poly.findById(id);
    console.log("   ", _po);
    return ret.points;
}

function cloneProps(obj){
    let ret = {};
    for(let k of Object.keys(obj)) ret[k] = obj[k];
    return ret;
}
function clonePoints(pl){
    let ret = [];
    for(let p of pl) ret.push({x: p.x, y: p.y});
    return ret;
} 

getMapCopy = async (req, res) => {
    let map = await Map.findById(req.params.id);
    if(!map) return res.status(400).json({success: false});
    if(!map.published) return res.status(401).json({success: false});
    if(map.owner == req.userId) return res.status(402).json({success: false});

    const nm = new Map();
    nm.name = map.name + ' (copy)';
    nm.age = Date.now();
    nm.published = false;
    nm.gd = cloneProps(map.gd);
    nm.l = [];
    for(let lay of map.l){
        let ol = await getLayer(lay);
        let nl = new Layer();
        for(let g of ol){
            let ng = new SubRegion();
            for(let p of g.elems){
                let np = new Poly();
                np.points = clonePoints(p);
                np.markModified('points');
                await np.save().then(() => {ng.polys.push(np)});
            }
            ng.props = cloneProps(g.props);
            ng.markModified('polys');
            ng.markModified('props');
            await ng.save().then(() => {nl.groups.push(ng)});
        }
        nl.markModified('groups');
        await nl.save().then(() => {
            nm.l.push(nl);
        });
    }
    nm.camX = 100;
    nm.camY = 100;
    nm.camZ = 1;

    let user = await User.findById(req.userId);
    user.maps.push(nm._id);
    await user.save();
    nm.owner = user._id;
    await nm.save();
    return res.status(200).json({success: true, map: nm});
}

updateMap = async (req, res) => {
    const body = req.body
    console.log("UPDATING MAP HERE " + JSON.stringify(req.params));
    //console.log("req.body.name: " + req.body.name);

    if (!body) {
        console.log("FAIL 9");
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Map.findOne({ _id: req.params.id }, (err, map) => {
        console.log("map found: " + JSON.stringify(map));
        if (err) {
            return res.status(404).json({
                err,
                message: 'map not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ _id: map.owner._id }, (err, user) => {
                //console.log("user._id: " + user);
                //console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    //console.log("correct user!");
                    //console.log("req.body.name: " + req.body.name);

                    /*list.name = body.playlist.name;
                    list.songs = body.playlist.songs;
                    list.published = body.playlist.published;
                    list.comments = body.playlist.comments;*/
                    if (body.map.name !== undefined) list.name = body.map.name;
                    if (body.map.published !== undefined) list.published = body.map.published;
                    list
                        .save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Map updated!',
                            })
                        })
                        .catch(error => {
                            console.log("FAILURE: " + JSON.stringify(error));
                            return res.status(404).json({
                                error,
                                message: 'Map not updated!',
                            })
                        })
                }
                else {
                    console.log(JSON.stringify(body.playlist));
                    console.log("UPDATING WITH incorrect user!");
                    return res.status(200).json({ success: true, description: "authentication error", recovery: list });
                }
            }).catch(err => console.log(err));
        }
        asyncFindUser(map);
    }).catch(err => console.log(err));
}
module.exports = {
    createMap,
    deleteMap,
    getMapById,
    getMapPairs,
    getMaps,
    updateMap,
    getMapCopy
}