const Temple = require('../models/Temple');

// @desc    Get live crowd status and queue wait times
// @route   GET /api/crowd
exports.getCrowdStatus = async (req, res) => {
    try {
        const temples = await Temple.find({}, 'name city state crowdStatus waitTimeMins timings rating');
        res.json({ success: true, crowdUpdates: temples });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
