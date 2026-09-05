const express = require('express');
const router = express.Router();
const {
    bookDarshan,
    bookTransport,
    getBookingById,
    getMyBookings,
    cancelBooking
} = require('../controllers/bookingController');

router.post('/darshan', bookDarshan);
router.post('/transport', bookTransport);
router.get('/my-bookings', getMyBookings);
router.get('/:bookingId', getBookingById);
router.post('/:bookingId/cancel', cancelBooking);

module.exports = router;
