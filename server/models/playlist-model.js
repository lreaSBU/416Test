const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.Array
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        age: {type: Number, required: true},
        ownerName: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        published: {type: Boolean, required: true},
        listens: {type: Number, default: 0},
        likes: {type: Number, required: true},
        dislikes: {type: Number, required: true},
        likers: {type: Array, default: []},
        dislikers: {type: Array, default: []},
        comments: {type: [{
            msg: String,
            name: String
        }], required: true},
        songs: { type: [{
            title: String,
            artist: String,
            youTubeId: String
        }], required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
