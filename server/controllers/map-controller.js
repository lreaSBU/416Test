const Map = require('../models/map-model');
const User = require('../models/user-model');
const Layer = require('../models/layer-model');
const SubRegion = require('../models/subregion-model');
const Poly = require('../models/poly-model');
const Convo = require('../models/convo-model');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
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
        for (let l of map.l) {
            let layer = await Layer.findById(l);
            for (let s of layer.groups) {
                let subregion = await SubRegion.findById(s);
                for (let p of subregion.polys) await Poly.findByIdAndDelete(p);
                subregion.remove();
            }
            layer.remove();
        }
        let user = await User.findById(map.owner);
        if (user != null) user.maps.splice(user.maps.indexOf(map._id), 1);
        map.remove();
        return res.status(200).json({ success: true });
    });
}
getMapById = async (req, res) => {
    console.log("Find Map with id: " + JSON.stringify(req.params.id));

    await Map.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            console.log("FAIL 13");
            return res.status(400).json({ success: false, error: err });
        }
        console.log("Found list: " + JSON.stringify(list));
        return res.status(200).json({ success: true, map: list });
    }).catch(err => console.log(err))
}

getUserById = async (req, res) => {
    // console.log('Find User: !!!!!!!!!!!!!!!!!!!!!' + JSON.stringify(req.params.id));
    await User.findById({ _id: req.params.id }, (err, user) => {
        if (err) {
            console.log('Find User Failed')
            return res.status(400).json({ success: false, error: err });
        }
        // console.log('USER?????', user)
        return res.status(200).json({ status: true, user: user });
    }).catch(err => console.log(err))
}

copyMap = async (req, res) => {
    console.log('COPY MAP ~~~~~~~~~~~~~~~', req.params)
    Map.findOne({ _id: req.params.id }, (err, map) => {
        console.log("map found: " + JSON.stringify(map));
        if (err) {
            return res.status(404).json({
                err,
                message: 'map not found!',
            })
        }



    }).catch(err => console.log(err));
}

async function namePairs(nm) {
    await Map.find({ name: nm, published: true }, (err, maps) => {
        console.log("found maps by name: " + JSON.stringify(maps));
        if (err) {
            console.log("FAIL 15");
            return res.status(400).json({ success: false, error: err })
        }
        if (!maps) {
            console.log("!maps.length");
            return res
                .status(404)
                .json({ success: false, error: 'maps not found' })
        }
        else {
            console.log("Send the Map pairs");
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in maps) {
                let list = maps[key];
                let pair = {
                    _id: list._id,
                    name: list.name,
                    copy: {
                        age: list.age,
                        owner: list.owner.name,
                        published: list.published
                    }
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        }
    }).catch(err => console.log(err))
}
getMapPairs = async (req, res) => {
    let bod = req.body;
    let maps = [];
    if (bod.filter == '') return res.status(200).json({ success: true, idNamePairs: [] });
    if (bod.filter == null) { //getting ones own maps
        maps = await Map.find({ owner: req.userId });
    } else if (!bod.searchMode) { //searching by MAP name
        maps = await Map.find({ name: { $regex: bod.filter, $options: 'i' }, published: true });
    } else { //searching by USER name
        if (!bod.filter.includes(' ')) return res.status(501).json({ success: false, idNamePairs: [] });
        let fk = bod.filter.split(' ')[0],
            lk = bod.filter.split(' ')[1];
        let users = await User.find({ firstName: { $regex: fk, $options: 'i' }, lastName: { $regex: lk, $options: 'i' } });
        if (users == null) return res.status(502).json({ success: false, idNamePairs: [] });
        for (let user of users) for (let m of user.maps) {
            m = await Map.findById(m);
            if (!m.published) continue;
            maps.push(m);
        }
    }
    if (maps == null) return res.status(401).json({ success: false });
    let ret = [];
    for (let map of maps) {
        ret.push({
            _id: map._id,
            name: map.name,
            copy: {
                age: map.age,
                owner: map.owner.name,
                published: map.published
            }
        });
    }
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
    getUserById,
    copyMap

}