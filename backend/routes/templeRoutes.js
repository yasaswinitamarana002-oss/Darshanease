const express = require('express');
const router = express.Router();
const {
    getTemples,
    getTempleById,
    getTempleSlots
} = require('../controllers/templeController');

router.get('/', getTemples);
router.get('/:id', getTempleById);
router.get('/:id/slots', getTempleSlots);

module.exports = router;
