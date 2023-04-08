const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const LayerSchema = new Schema(
    {
        groups: [{type: ObjectId, ref: 'SubRegion'}]
    }
)

module.exports = mongoose.model('Layer', LayerSchema)