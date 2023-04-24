const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const ConvoSchema = new Schema(
    {
        user1: {type: ObjectId, ref: 'User'},
        user2: {type: ObjectId, ref: 'User'},
        unread1: {type: Number, required: true, default: 0},
        unread2: {type: Number, required: true, default: 0},
        block1: {type: Boolean, required: true, default: false},
        block2: {type: Boolean, required: true, default: false},
        msgs: [{type: Object}],
    }
)

module.exports = mongoose.model('Convo', ConvoSchema)