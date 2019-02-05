const Boom = require('boom');
const express = require('express');
const router = express.Router();
const database = require('../modules/database');

router.get('/matches/:nickName', (req, res) => {
    database.getMatchesByNickName(req.params.nickName)
        .then((matches) => {
            res.json(matches);
        })
        .catch((reason) => {
            res.send(Boom.badImplementation('Error getting matches', reason));
        });
});

module.exports = router;