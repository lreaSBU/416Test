const Map = require('../models/map-model');
const User = require('../models/user-model');
const Convo = require('../models/convo-model');
const Message = require('../models/message-model');

createConvo = async (req, res) => {
    console.log('making new Convo');
    await User.findById(req.userId, async (err, user) => {
        const convos = user.convos;
        for(let c of convos){
            let user1 = await User.findById(c.user1);
            let user2 = await User.findById(c.user2);
            if(user1._id == req.body.contactId || user2._id == req.body.contactId){
                console.log("CONVERSATION FOR THIS CONTACT ALREADY EXISTS");
                return res.status(500).json({ success: false })
            }
        }
        let otherUser = await User.findById(req.body.contactId);
        if(!otherUser) return res.status(400).json({ success: false });
        const newConvo = new Convo();
        newConvo.user1 = req.userId;
        newConvo.user2 = req.body.contactId;
        newConvo.msgs = [];
        newConvo.save().then(async () => {
            user.convos.push(newConvo);
            otherUser.convos.push(newConvo);
            await user.save();
            await otherUser.save();
            return res.status(200).json({ success: true });
        }).catch(err => {console.log(err)});
    }).catch(err => console.log(err))
}

getConvoPairs = async (req, res) => {
    console.log("calling getConvoPairs!");
    await User.findOne({_id : req.userId}, async (err, user) => {
        console.log("found user!");
        const convos = user.convos;
        let pairs = [];
        let recents = [];
        for(let list of convos){
            list = await Convo.findById(list);
            let user1 = await User.findById(list.user1);
            let user2 = await User.findById(list.user2);
            if(!(user1._id == req.userId ? list.block1 : list.block2)) recents = list.msgs;
            else recents = [];
            var dir = user1._id == req.userId;
            if(req.body.read){
                if(dir) list.unread1 = 0;
                else list.unread2 = 0;
                await list.save();
            }
            var buddy = dir ? user2.firstName+" "+user2.lastName : user1.firstName+" "+user1.lastName;
            var unr = dir ? list.unread1 : list.unread2;
            var block = dir ? list.block1 : list.block2;
            let pair = {
                _id: list._id,
                name: buddy,
                copy: {
                    dir: dir,
                    block: block,
                    msgs: recents,
                    unread: unr
                }
            }
            pairs.push(pair);
        }
        //console.log("???: " + JSON.stringify(pairs));
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
    await Convo.findById(req.body.id, (err, convo) => {
        let dir = convo.user1 == req.userId;
        convo.msgs.push({text: req.body.txt, dir: dir});
        if(dir) convo.unread2++;
        else convo.unread1++;
        convo.save().then(() => {
            return res.status(200).json({success: true})
        });
    });
}
async function clearConvos(){
    await Convo.deleteMany({});
    await Message.deleteMany({});
    let users = await User.find({});
    for(let u of users){
        u.convos.splice(0, 100);
        await u.save();
    }
}
//clearConvos();

module.exports = {
    createConvo,
    getConvoPairs,
    blockConvo,
    submitMessage
}