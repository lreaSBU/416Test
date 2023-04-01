/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
router.get('/playlist/:id', auth.trivial, PlaylistController.getPlaylistById)
router.get('/playlistpairs/:type', auth.verify, PlaylistController.getPlaylistPairs)
router.get('/playlists', auth.verify, PlaylistController.getPlaylists)
router.put('/playlist/:id', auth.verify, PlaylistController.updatePlaylist)
router.put('/search', auth.trivial, PlaylistController.getSearchPairs)
router.put('/like', auth.verify, PlaylistController.likePlaylist)
router.put('/comment', auth.verify, PlaylistController.commentPlaylist)

module.exports = router