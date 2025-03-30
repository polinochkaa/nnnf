const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Doclad = require("../models/Doclad");



router.get('/', (req, res) => res.render('index', {
    user: req.user
}));


router.get('/komitet', (req, res) => {
    res.render('komitet', {
        user: req.user
    })
});

router.get('/archive', (req, res) => {
    res.render('archive', {
        user: req.user
    })
});

router.get('/collection2024', async (req, res) => {
    const doclads = await Doclad.find({
        date: '2024'
    })
    res.render('collection', {user: req.user, doclads: doclads})
})

module.exports = router;
