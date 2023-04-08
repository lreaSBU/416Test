const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const MapSchema = new Schema(
    {
        name: { type: String, required: true },
        age: {type: Number, required: true},
        owner: {type: ObjectId, ref: 'User'},
        published: {type: Boolean, required: true},
        layers: [{type: ObjectId, ref: 'Layer'}]
    },
    { timestamps: true },
)

module.exports = mongoose.model('Map', MapSchema)