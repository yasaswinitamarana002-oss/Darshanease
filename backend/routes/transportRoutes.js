const express = require('express');
const router = express.Router();
const {
    searchTransport,
    getCities
} = require('../controllers/transportController');

router.get('/search', searchTransport);
router.get('/cities', getCities);

module.exports = router;
