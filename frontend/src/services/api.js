const API_BASE = '/api';

export const api = {
    // Temples
    getTemples: async (search = '', state = 'All') => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (state && state !== 'All') params.append('state', state);
        const res = await fetch(`${API_BASE}/temples?${params.toString()}`);
        return res.json();
    },

    getTempleById: async (id) => {
        const res = await fetch(`${API_BASE}/temples/${id}`);
        return res.json();
    },

    getTempleSlots: async (id, date) => {
        const res = await fetch(`${API_BASE}/temples/${id}/slots?date=${date}`);
        return res.json();
    },

    // Transport
    searchTransport: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.mode && filters.mode !== 'all') params.append('mode', filters.mode);
        if (filters.source) params.append('source', filters.source);
        if (filters.destination) params.append('destination', filters.destination);
        if (filters.templeId) params.append('templeId', filters.templeId);

        const res = await fetch(`${API_BASE}/transport/search?${params.toString()}`);
        return res.json();
    },

    getTransportCities: async () => {
        const res = await fetch(`${API_BASE}/transport/cities`);
        return res.json();
    },

    // Bookings
    createDarshanBooking: async (data) => {
        const res = await fetch(`${API_BASE}/bookings/darshan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    createTransportBooking: async (data) => {
        const res = await fetch(`${API_BASE}/bookings/transport`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    getBooking: async (bookingId) => {
        const res = await fetch(`${API_BASE}/bookings/${bookingId}`);
        return res.json();
    },

    getMyBookings: async (query) => {
        const res = await fetch(`${API_BASE}/bookings/my-bookings?query=${encodeURIComponent(query)}`);
        return res.json();
    },

    cancelBooking: async (bookingId) => {
        const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
            method: 'POST'
        });
        return res.json();
    },

    // Live Queue Tracker
    getCrowdStatus: async () => {
        const res = await fetch(`${API_BASE}/crowd`);
        return res.json();
    }
};
