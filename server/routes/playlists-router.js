/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
//const PlaylistController = require('../controllers/playlist-controller')
const MapController = require('../controllers/map-controller')
const ConvoController = require('../controllers/convo-controller')
const EditController = require('../controllers/edit-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/map', auth.verify, MapController.createMap)
router.delete('/map/:id', auth.verify, MapController.deleteMap)
router.get('/map/:id', auth.trivial, MapController.getMapById)
router.get('/finduser/:id', auth.trivial, MapController.getUserById)
// router.post('/copymap/:id', auth.verify, MapController.copyMap)
router.put('/mappairs/', auth.verify, MapController.getMapPairs)
router.get('/maps', auth.verify, MapController.getMaps)
router.put('/map/:id', auth.verify, MapController.updateMap)
router.put('/makeconvo/', auth.verify, ConvoController.createConvo)
router.put('/convopairs/', auth.verify, ConvoController.getConvoPairs)
router.put('/block/', auth.verify, ConvoController.blockConvo)
router.put('/message/', auth.verify, ConvoController.submitMessage)
router.put('/start/', auth.verify, EditController.startData)
router.put('/edit/', auth.verify, EditController.edit)

module.exports = router