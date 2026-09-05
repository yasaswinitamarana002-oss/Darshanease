const express = require('express');
const router = express.Router();
const { getCrowdStatus } = require('../controllers/crowdController');

router.get('/', getCrowdStatus);

module.exports = router;
