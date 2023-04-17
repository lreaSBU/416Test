const Map = require('../models/map-model');
const User = require('../models/user-model');
const Layer = require('../models/layer-model');
const SubRegion = require('../models/subregion-model');
const Poly = require('../models/poly-model');
const Point = require('../models/point-model');


startData = async (req, res) => {
    console.log("calling startData!");
    await User.findOne({_id : req.userId}, (err, user) => {
        console.log('FOUND USER WHO CALLED!!!');
        var ret = ({
            gd: [],
            d: [[], [], [], [], []],
            l: [[], [], [], [], []],
            camX: 100,
            camY: 102,
            camZ: 1.69
        });
        return res.status(200).json({ success: true, ed: ret })
    }).catch(err => console.log(err))
}

module.exports = {
    startData
}