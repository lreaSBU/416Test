const Map = require('../models/map-model');
const User = require('../models/user-model');
const Convo = require('../models/convo-model');
const Message = require('../models/message-model');

createConvo = async (req, res) => {
    console.log('making new Convo');
    await User.findById(req.userId, async (err, user) => {
        const convos = user.convos;
        for(let c of convos){
            let gc = await Convo.findById(c);
            let user1 = await User.findById(gc.user1);
            let user2 = await User.findById(gc.user2);
            if(user1._id == req.body.contactId || user2._id == req.body.contactId){
                console.log("CONVERSATION FOR THIS CONTACT ALREADY EXISTS");
                return res.status(500).json({ success: false })
            }
        }
        let otherUser = null;
        try{
            otherUser = await User.findById(req.body.contactId);
        }catch(e){
            return res.status(400).json({ success: false });
        }
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
            var dir = user1._id == req.userId;
            var block = dir ? list.block1 : list.block2;
            var buddy = dir ? user2.firstName+" "+user2.lastName : user1.firstName+" "+user1.lastName;
            var unr = dir ? list.unread1 : list.unread2;
            if(!block) recents = list.msgs;
            else recents = [], unr = 0;
            if(req.body.read && !block){
                if(dir) list.unread1 = 0;
                else list.unread2 = 0;
                await list.save();
            }
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
    const bod = req.body;
    let convo = await Convo.findById(bod.id);
    if(!convo) return res.status(400).json({success: false});
    if(convo.user1 == req.userId) convo.block1 = bod.flag;
    else if(convo.user2 == req.userId) convo.block2 = bod.flag;
    else return res.status(401).json({success: false});
    convo.markModified('block1');
    convo.markModified('block2');
    await convo.save();
    return res.status(200).json({success: true});
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