const Map = require('../models/map-model');
const User = require('../models/user-model');
const Convo = require('../models/convo-model');
const Message = require('../models/message-model');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/

getConvoPairs = async (req, res) => {
    console.log("calling getConvoPairs!");
    await User.findOne({_id : req.userId}, (err, user) => {
        console.log("found user!");
        const convos = user.convos;
        let pairs = [];
        let recents = [];
        for(let key in convos){
            let list = convos[key];
            for(var i = 1; i < 11; i++){
                if(list.msgs.length-i < 0) break;
                recents.push(list.msgs[list.msgs.length-i]);
            }
            var dir = list.user1._id == req.userId;
            var buddy = dir ? list.user2.name : list.user1.name;
            var unr = dir ? list.unread1 : list.unread2;
            let pair = {
                _id: list._id,
                name: buddy,
                copy: {
                    dir: dir,
                    msgs: recents,
                    unread: unr
                }
            }
            pairs.push(pair);
        }
        console.log(JSON.stringify(pairs));
        return res.status(200).json({ success: true, convoPairs: pairs })
    }).catch(err => console.log(err))
}

// Blocks the conversation with another user in the chat
blockConvo = async (req, res) => {
    console.log("calling getConvoPairs!");
    await User.findOne({_id : req.userId}, (err, user) => {
        console.log("found user!");
        const convos = user.convos;
        let pairs = [];
        let recents = [];
        for(let key in convos){
            let list = convos[key];
            for(var i = 1; i < 11; i++){
                if(list.msgs.length-i < 0) break;
                recents.push(list.msgs[list.msgs.length-i]);
            }
            var dir = list.user1._id == req.userId;
            var buddy = dir ? list.user2.name : list.user1.name;
            var unr = dir ? list.unread1 : list.unread2;
            let pair = {
                _id: list._id,
                name: buddy,
                copy: {
                    dir: dir,
                    msgs: recents,
                    unread: unr
                }
            }
            pairs.push(pair);
        }
        console.log(JSON.stringify(pairs));
        return res.status(200).json({ success: true, convoPairs: pairs })
    }).catch(err => console.log(err))
}


submitMessage = async (req, res) => {
    console.log("calling getConvoPairs!");
    await User.findOne({_id : req.userId}, (err, user) => {
        console.log("found user!");
        const convos = user.convos;
        let pairs = [];
        let recents = [];
        for(let key in convos){
            let list = convos[key];
            for(var i = 1; i < 11; i++){
                if(list.msgs.length-i < 0) break;
                recents.push(list.msgs[list.msgs.length-i]);
            }
            var dir = list.user1._id == req.userId;
            var buddy = dir ? list.user2.name : list.user1.name;
            var unr = dir ? list.unread1 : list.unread2;
            let pair = {
                _id: list._id,
                name: buddy,
                copy: {
                    dir: dir,
                    msgs: recents,
                    unread: unr
                }
            }
            pairs.push(pair);
        }
        console.log(JSON.stringify(pairs));
        return res.status(200).json({ success: true, convoPairs: pairs })
    }).catch(err => console.log(err))
}

module.exports = {
    getConvoPairs
    blockConvo
    submitMessage
}