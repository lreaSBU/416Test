const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const PointSchema = new Schema(
    {
        x: {type: Number, required: true},
        y: {type: Number, required: true},
    },
)

module.exports = mongoose.model('Point', PointSchema)