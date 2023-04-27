const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const MapSchema = new Schema(
    {
        name: { type: String, required: true },
        age: {type: Number, required: true},
        owner: {type: ObjectId, ref: 'User'},
        published: {type: Boolean, required: true},
        gd: Object,
        l: [{type: ObjectId, ref: 'Layer'}],
        camX: {type: Number, required: true},
        camY: {type: Number, required: true},
        camZ: {type: Number, required: true},
        sesh: {type: Number, required: true, default: 0}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Map', MapSchema)
/*
var ret = ({
            gd: [],
            d: [[], [], [], [], []],
            l: [[], [], [], [], []],
            camX: 100,
            camY: 102,
            camZ: 1.69
        });
*/