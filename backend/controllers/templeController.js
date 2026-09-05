const Temple = require('../models/Temple');
const Slot = require('../models/Slot');

// @desc    Get all temples with optional search & state filters
// @route   GET /api/temples
exports.getTemples = async (req, res) => {
    try {
        const { search, state } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { deity: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } }
            ];
        }

        if (state && state !== 'All') {
            query.state = state;
        }

        const temples = await Temple.find(query).sort({ rating: -1, createdAt: 1 });
        res.json({ success: true, count: temples.length, temples });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single temple details
// @route   GET /api/temples/:id
exports.getTempleById = async (req, res) => {
    try {
        const temple = await Temple.findById(req.params.id);
        if (!temple) {
            return res.status(404).json({ success: false, message: 'Temple not found' });
        }
        res.json({ success: true, temple });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get available slots for a temple by date
// @route   GET /api/temples/:id/slots
exports.getTempleSlots = async (req, res) => {
    try {
        const { id } = req.params;
        const slotDate = req.query.date || new Date().toISOString().split('T')[0];

        const slots = await Slot.find({
            temple: id,
            slotDate: slotDate
        }).sort({ createdAt: 1 });

        res.json({
            success: true,
            templeId: id,
            date: slotDate,
            slots
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
