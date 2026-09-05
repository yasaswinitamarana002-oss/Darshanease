const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const TransportRoute = require('../models/TransportRoute');
const Temple = require('../models/Temple');

// Helper to generate unique booking ID
const generateBookingId = (prefix) => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `DE-${prefix}-${randomNum}`;
};

// @desc    Book Darshan & Pooja Slot
// @route   POST /api/bookings/darshan
exports.bookDarshan = async (req, res) => {
    try {
        const { templeId, poojaId, slotId, contactName, contactEmail, contactPhone, devotees } = req.body;

        if (!templeId || !poojaId || !slotId || !contactName || !contactEmail || !contactPhone || !devotees || devotees.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide all required booking and devotee information.' });
        }

        const devoteeCount = devotees.length;

        // Verify slot existence and capacity
        const slot = await Slot.findById(slotId);
        if (!slot) {
            return res.status(404).json({ success: false, message: 'Darshan slot not found.' });
        }

        if (slot.capacity - slot.bookedCount < devoteeCount) {
            return res.status(400).json({
                success: false,
                message: `Not enough capacity in this slot. Only ${slot.capacity - slot.bookedCount} seats remaining.`
            });
        }

        // Fetch temple & pooja
        const temple = await Temple.findById(templeId);
        if (!temple) {
            return res.status(404).json({ success: false, message: 'Temple not found.' });
        }

        const pooja = temple.poojas.id(poojaId);
        const pricePerPerson = pooja ? pooja.price : 0;
        const totalAmount = pricePerPerson * devoteeCount;

        const bookingId = generateBookingId('DAR');
        const qrToken = `DARSHANEASE:PASS:${bookingId}:${Date.now().toString(36).toUpperCase()}`;

        // Increment slot bookedCount atomically
        await Slot.findByIdAndUpdate(slotId, { $inc: { bookedCount: devoteeCount } });

        const booking = await Booking.create({
            bookingId,
            bookingType: 'darshan',
            temple: templeId,
            pooja: pooja ? {
                id: pooja._id,
                name: pooja.name,
                category: pooja.category,
                price: pooja.price,
                prasadamIncluded: pooja.prasadamIncluded
            } : null,
            slot: slotId,
            contactName,
            contactEmail,
            contactPhone,
            devotees,
            totalAmount,
            status: 'Confirmed',
            qrToken,
            notes: `${devoteeCount} Devotee(s) for ${pooja ? pooja.name : 'Darshan'}`
        });

        res.status(201).json({
            success: true,
            message: 'Temple Darshan slot booked successfully!',
            bookingId: booking.bookingId,
            qrToken: booking.qrToken
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Book Pilgrimage Transport (Bus, Train, Flight)
// @route   POST /api/bookings/transport
exports.bookTransport = async (req, res) => {
    try {
        const { transportId, contactName, contactEmail, contactPhone, passengers } = req.body;

        if (!transportId || !contactName || !contactEmail || !contactPhone || !passengers || passengers.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide all passenger details.' });
        }

        const count = passengers.length;
        const route = await TransportRoute.findById(transportId);
        if (!route) {
            return res.status(404).json({ success: false, message: 'Selected transport service does not exist.' });
        }

        if (route.totalSeats - route.bookedSeats < count) {
            return res.status(400).json({
                success: false,
                message: `Only ${route.totalSeats - route.bookedSeats} seats remaining on this service.`
            });
        }

        const totalAmount = route.price * count;
        const bookingId = generateBookingId('TRN');
        const qrToken = `DARSHANEASE:TRAVEL:${bookingId}:${Date.now().toString(36).toUpperCase()}`;

        // Increment transport booked seats
        await TransportRoute.findByIdAndUpdate(transportId, { $inc: { bookedSeats: count } });

        const booking = await Booking.create({
            bookingId,
            bookingType: 'transport',
            transport: transportId,
            contactName,
            contactEmail,
            contactPhone,
            devotees: passengers.map((p, idx) => ({
                fullName: p.fullName,
                age: p.age,
                gender: p.gender,
                idType: 'Govt ID',
                idNumber: p.idNumber || `ID-${Math.floor(1000 + Math.random() * 9000)}`,
                seatNumber: p.seatNumber || `Seat-${idx + 1}`
            })),
            totalAmount,
            status: 'Confirmed',
            qrToken,
            notes: `${route.mode.toUpperCase()} Ticket - ${count} Passenger(s)`
        });

        res.status(201).json({
            success: true,
            message: 'Pilgrimage transport booked successfully!',
            bookingId: booking.bookingId,
            qrToken: booking.qrToken
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get booking details with populated fields
// @route   GET /api/bookings/:bookingId
exports.getBookingById = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findOne({ bookingId })
            .populate('temple')
            .populate('slot')
            .populate('transport');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }

        res.json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search bookings by query (email, phone, or bookingId)
// @route   GET /api/my-bookings
exports.getMyBookings = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ success: false, message: 'Please provide email, phone, or booking ID.' });
        }

        const bookings = await Booking.find({
            $or: [
                { bookingId: query.trim() },
                { contactEmail: query.trim().toLowerCase() },
                { contactPhone: query.trim() }
            ]
        })
        .populate('temple')
        .populate('slot')
        .populate('transport')
        .sort({ createdAt: -1 });

        res.json({ success: true, count: bookings.length, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Cancel booking and restore capacity
// @route   POST /api/bookings/:bookingId/cancel
exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findOne({ bookingId });

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }

        if (booking.status === 'Cancelled') {
            return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
        }

        const count = booking.devotees.length;

        // Restore slots or seats
        if (booking.slot) {
            await Slot.findByIdAndUpdate(booking.slot, { $inc: { bookedCount: -count } });
        }
        if (booking.transport) {
            await TransportRoute.findByIdAndUpdate(booking.transport, { $inc: { bookedSeats: -count } });
        }

        booking.status = 'Cancelled';
        await booking.save();

        res.json({ success: true, message: 'Booking cancelled and quota restored.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
