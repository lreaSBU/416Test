const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const MessageSchema = new Schema(
    {
        text: String,
        dir: Boolean
    }
)

module.exports = mongoose.model('Message', MessageSchema)