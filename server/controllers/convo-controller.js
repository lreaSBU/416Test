const Map = require('../models/map-model');
const User = require('../models/user-model');
const Convo = require('../models/convo-model');
const Message = require('../models/message-model');

createConvo = async (req, res) => {
    console.log('making new Convo');
    await User.findOne({_id : req.userId}, (err, user) => {
        
    }).catch(err => console.log(err))
}

getConvoPairs = async (req, res) => {
    console.log("calling getConvoPairs!");
    await User.findOne({_id : req.userId}, (err, user) => {
        console.log("found user!");
        const convos = user.convos;
        let pairs = [];
        let recents = [];
        for(let key in convos){
            let list = convos[key];
            if(!(list.user1._id == req.userId ? block1 : block2))
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
    console.log("block Convo!");
    await User.findOne({_id : req.userId}, (err, user) => {
        console.log("found user!");
        const convos = user.convos;
        for(let key in convos) if(convos[key]._id == req.body.id){
            const dir = req.userId == convos[key].user1._id;
            if(dir) convos[key].block1 = req.body.flag;
            else convos[key].block2 = req.body.flag;
            convos[key].save().then(() => {
                console.log("success!");
                return res.status(200).json({success: true})
            }).catch(error => {
                console.log("failure!", error);
                return res.status(401).json({success: false})
            });
        }
        console.log("couldnt find convo with id");
        return res.status(400).json({ success: false })
    }).catch(err => console.log(err))
}

// Sends a message to another user in the chat
submitMessage = async (req, res) => {
    console.log("messaging convo!");
    await User.findOne({_id : req.userId}, (err, user) => {
        console.log("found user!");
        const convos = user.convos;
        for(let key in convos) if(convos[key]._id == req.body.id){
            const dir = req.userId == convos[key].user1._id;
            convos[key].msgs.push(new Message({text: req.body.txt, dir: dir}));
            convos[key].save().then(() => {
                console.log("success!");
                return res.status(200).json({success: true})
            }).catch(error => {
                console.log("failure!", error);
                return res.status(401).json({success: false})
            });
        }
        console.log("couldnt find convo with id");
        return res.status(400).json({ success: false })
    }).catch(err => console.log(err))
}

module.exports = {
    getConvoPairs,
    blockConvo,
    submitMessage
}