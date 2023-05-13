const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const SubRegionSchema = new Schema(
    {
        polys: [{type: ObjectId, ref: 'Poly'}],
        props: {type: Object, required: true, default: {}}
    }
)

module.exports = mongoose.model('SubRegion', SubRegionSchema)