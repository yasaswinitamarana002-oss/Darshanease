const mongoose = require('mongoose');

const DevoteeSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    idType: { type: String, default: 'Aadhaar Card' },
    idNumber: { type: String, required: true },
    seatNumber: { type: String }
});

const BookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        unique: true,
        required: true
    },
    bookingType: {
        type: String,
        enum: ['darshan', 'transport', 'package'],
        required: true
    },
    temple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Temple'
    },
    pooja: {
        id: String,
        name: String,
        category: String,
        price: Number,
        prasadamIncluded: String
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot'
    },
    transport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TransportRoute'
    },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    devotees: [DevoteeSchema],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Confirmed', 'Cancelled'],
        default: 'Confirmed'
    },
    qrToken: { type: String, required: true },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
