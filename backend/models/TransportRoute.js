const mongoose = require('mongoose');

const TransportRouteSchema = new mongoose.Schema({
    mode: {
        type: String,
        enum: ['bus', 'train', 'flight'],
        required: true
    },
    operatorName: { type: String, required: true },
    serviceNumber: { type: String, required: true },
    sourceCity: { type: String, required: true },
    destinationCity: { type: String, required: true },
    temple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Temple'
    },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    classType: { type: String, required: true },
    totalSeats: { type: Number, default: 40 },
    bookedSeats: { type: Number, default: 0 }
}, { timestamps: true });

TransportRouteSchema.virtual('availableSeats').get(function() {
    return Math.max(0, this.totalSeats - this.bookedSeats);
});

TransportRouteSchema.set('toJSON', { virtuals: true });
TransportRouteSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TransportRoute', TransportRouteSchema);
