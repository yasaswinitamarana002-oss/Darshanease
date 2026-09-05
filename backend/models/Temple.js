const mongoose = require('mongoose');

const PoojaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // 'Darshan', 'Special Seva', 'Aarti'
    price: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    durationMins: { type: Number, required: true },
    prasadamIncluded: { type: String, required: true }
});

const TempleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    deity: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    dressCode: { type: String, required: true },
    timings: { type: String, required: true },
    rules: { type: String, required: true },
    crowdStatus: { type: String, enum: ['Low', 'Moderate', 'High'], default: 'Moderate' },
    waitTimeMins: { type: Number, default: 45 },
    rating: { type: Number, default: 4.9 },
    poojas: [PoojaSchema]
}, { timestamps: true });

module.exports = mongoose.model('Temple', TempleSchema);
