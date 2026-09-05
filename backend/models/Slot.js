const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    temple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Temple',
        required: true
    },
    slotDate: {
        type: String, // 'YYYY-MM-DD'
        required: true
    },
    timeSlot: {
        type: String, // e.g. '06:00 AM - 08:00 AM (Morning)'
        required: true
    },
    capacity: {
        type: Number,
        default: 120
    },
    bookedCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Virtual to calculate available seats
SlotSchema.virtual('availableSeats').get(function() {
    return Math.max(0, this.capacity - this.bookedCount);
});

SlotSchema.set('toJSON', { virtuals: true });
SlotSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Slot', SlotSchema);
