const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const PolySchema = new Schema(
    {
        points: [{type: ObjectId, ref: 'Point'}]
    }
)

module.exports = mongoose.model('Poly', PolySchema)