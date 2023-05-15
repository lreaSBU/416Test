const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const MapSchema = new Schema(
    {
        name: { type: String, required: true },
        age: {type: Number, required: true},
        owner: {type: ObjectId, ref: 'User'},
        published: {type: Boolean, required: true},
        gd: {type: Object, required: true, default: {}},
        l: [{type: ObjectId, ref: 'Layer'}],
        camX: {type: Number, required: true},
        camY: {type: Number, required: true},
        camZ: {type: Number, required: true},
        viewLevel: {type: Number, required: true, default: 0},
        LOD_RATIO: {type: Number, required: true, default: 3},
        sesh: {type: Number, required: true, default: 0}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Map', MapSchema)