const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new Schema(
    {
        text: String,
        user: {type: ObjectId, ref: 'User'}
    }
)

module.exports = mongoose.model('Comment', CommentSchema)