const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const SubRegionSchema = new Schema(
    {
        polys: [{type: ObjectId, ref: 'Poly'}],
        props: Object
    }
)

module.exports = mongoose.model('SubRegion', SubRegionSchema)