const TransportRoute = require('../models/TransportRoute');

// @desc    Search transport routes (buses, trains, flights)
// @route   GET /api/transport/search
exports.searchTransport = async (req, res) => {
    try {
        const { mode, source, destination, templeId } = req.query;
        let query = {};

        if (mode && mode !== 'all') {
            query.mode = mode.toLowerCase();
        }

        if (source) {
            query.sourceCity = { $regex: source, $options: 'i' };
        }

        if (destination) {
            query.destinationCity = { $regex: destination, $options: 'i' };
        }

        if (templeId) {
            query.temple = templeId;
        }

        const routes = await TransportRoute.find(query).sort({ price: 1 });
        res.json({
            success: true,
            count: routes.length,
            results: routes
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get unique source & destination cities
// @route   GET /api/transport/cities
exports.getCities = async (req, res) => {
    try {
        const sources = await TransportRoute.distinct('sourceCity');
        const destinations = await TransportRoute.distinct('destinationCity');

        res.json({
            success: true,
            sources: sources.sort(),
            destinations: destinations.sort()
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
