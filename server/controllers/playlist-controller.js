const Playlist = require('../models/playlist-model')
const User = require('../models/user-model');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));

    if (!body) {
        console.log("FAIL 10");
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    console.log("???playlist: " + playlist.toString());
    if (!playlist) {
        console.log("FAIL 11");
        return res.status(400).json({ success: false, error: err })
    }

    //fill in the age of the playlist creation:::
    playlist.age = Date.now(); //(should be done by server to avoid conflict)
    playlist.published = false;

    User.findOne({ _id: req.userId }, (err, user) => {
        console.log("user found: " + JSON.stringify(user));
        user.playlists.push(playlist._id);
        user
            .save()
            .then(() => {
                playlist
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            playlist: playlist
                        })
                    })
                    .catch(error => {
                        console.log("FAIL 12");
                        return res.status(400).json({
                            errorMessage: 'Playlist Not Created!'
                        })
                    })
            });
    })
}
deletePlaylist = async (req, res) => {
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    Playlist.findById({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    Playlist.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({});
                    }).catch(err => console.log(err))
                }
                else {
                    console.log("DELETING WITH incorrect user!");
                    return res.status(400).json({ 
                        errorMessage: "authentication error" 
                    });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
getPlaylistById = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    await Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            console.log("FAIL 13");
            return res.status(400).json({ success: false, error: err });
        }
        console.log("Found list: " + JSON.stringify(list));

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                //if (user._id == req.userId) {
                    if(list.published && user._id != req.userId) list.listens++;
                    list
                    .save()
                    .then(() => {
                        console.log("correct user!");
                        return res.status(200).json({ success: true, playlist: list })
                    })
                    .catch(error => {
                        console.log("FAILURE: " + JSON.stringify(error));
                        return res.status(404).json({
                            error,
                            message: 'Listen count not increased!',
                        })
                    })
                //}
                //else {
                //    console.log("incorrect user!");
                //    return res.status(400).json({ success: false, description: "authentication error" });
                //}
            });
        }
        asyncFindUser(list);
    }).catch(err => console.log(err))
}
getSearchPairs = async (req, res) => {
    const body = req.body
    console.log("SEARCHING TYPE: " + body.type);
    console.log("SEARCHING TERM:" + body.term);
    await Playlist.find((body.type == 2 ? { published: true, name: {"$regex": body.term, "$options": "i"} } : { published: true, ownerName: {"$regex": body.term, "$options": "i"} }), (err, playlists) => { 
        if (err) {
            console.log("FAIL 14");
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists) {
            console.log("!playlists.length");
            return res
                .status(404)
                .json({ success: false, error: 'Playlists not found' })
        }else{
            let pairs = [];
            for (let key in playlists) {
                let list = playlists[key];
                let pair = {
                    _id: list._id,
                    name: list.name,
                    likes: list.likes,
                    dislikes: list.dislikes,
                    ownerName: list.ownerName,
                    copy: list
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        }
    }).catch(err => console.log(err));
}
getPlaylistPairs = async (req, res) => {
    console.log("getPlaylistPairs OF TYPE::::: " + JSON.stringify(req.params.type));
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList(email) {
            console.log("find all Playlists owned by " + email);
            await Playlist.find({ ownerEmail: email }, (err, playlists) => {
                console.log("found Playlists: " + JSON.stringify(playlists));
                if (err) {
                    console.log("FAIL 15");
                    return res.status(400).json({ success: false, error: err })
                }
                if (!playlists) {
                    console.log("!playlists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {
                    console.log("Send the Playlist pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in playlists) {
                        let list = playlists[key];
                        let pair = {
                            _id: list._id,
                            name: list.name,
                            copy: list
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}
getPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            console.log("FAIL 16");
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
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
        
        list.comments.push({name: body.name, msg: body.msg});

        list
        .save()
        .then(() => {
            console.log("SUCCESS!!!");
            return res.status(200).json({
                success: true,
                cDat: {name: body.name, msg: body.msg},
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
        if(body.email != list.ownerEmail){
            for(var i = 0; i < list.likers.length; i++){
                if(list.likers[i] === body.email){
                    p = false;
                    break;
                }
            }
            if(p){
                list.likers.push(body.email);
                if(body.lt) list.likes++;
                else list.dislikes++;
            }
        }else p = false;

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
    })
}

updatePlaylist = async (req, res) => {
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    //console.log("req.body.name: " + req.body.name);

    if (!body) {
        console.log("FAIL 9");
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    console.log("req.body.name: " + req.body.name);

                    list.name = body.playlist.name;
                    list.songs = body.playlist.songs;
                    list.published = body.playlist.published;
                    list.comments = body.playlist.comments;
                    list
                        .save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
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
                }
                else {
                    console.log(JSON.stringify(body.playlist));
                    console.log("UPDATING WITH incorrect user!");
                    return res.status(200).json({ success: true, description: "authentication error", recovery: list });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist,
    getSearchPairs,
    likePlaylist,
    commentPlaylist
}