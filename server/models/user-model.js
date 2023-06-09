const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const UserSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        passwordHash: { type: String, required: true },
        maps: [{type: ObjectId, ref: 'Map'}],
        convos: [{type: ObjectId, ref: 'Convo'}],
        verificationCode: { type: Number, required: false },
        expiresAt: { type: Date, required: true, default: new Date('2000-12-01') }
    },
    { timestamps: true },
)

module.exports = mongoose.model('User', UserSchema)
