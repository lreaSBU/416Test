const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const ConvoSchema = new Schema(
    {
        user1: {type: ObjectId, ref: 'User'},
        user2: {type: ObjectId, ref: 'User'},
        unread1: {type: Number, required: true},
        unread2: {type: Number, required: true},
        block1: {type: Boolean, required: true},
        block2: {type: Boolean, required: true},
        msgs: [{type: ObjectId, ref: 'Message'}],
    }
)

module.exports = mongoose.model('Convo', ConvoSchema)