/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
//const PlaylistController = require('../controllers/playlist-controller')
const MapController = require('../controllers/map-controller')
const ConvoController = require('../controllers/convo-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/map', auth.verify, MapController.createMap)
router.delete('/map/:id', auth.verify, MapController.deleteMap)
router.get('/map/:id', auth.trivial, MapController.getMapById)
router.put('/mappairs/', auth.verify, MapController.getMapPairs)
router.get('/maps', auth.verify, MapController.getMaps)
router.put('/map/:id', auth.verify, MapController.updateMap)
router.put('/convopairs/', auth.verify, ConvoController.getConvoPairs)

module.exports = router