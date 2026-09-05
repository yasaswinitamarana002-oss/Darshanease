# DarshanEase - MERN Stack Temple Darshan & Pilgrimage Travel Booking Platform

**DarshanEase** is a full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) web application engineered to offer devotees a seamless spiritual journey. It brings together advance temple darshan slot reservations, authentic pooja and seva bookings, and integrated multi-modal pilgrimage travel logistics (buses, trains, and flights).

---

## 🏛️ MERN Stack Architecture Overview

```
darshanease-mern/
├── backend/                       # Node.js & Express REST API Server
│   ├── config/                    # MongoDB connection (db.js)
│   ├── controllers/               # Business logic & quota management
│   │   ├── templeController.js    # Shrines, sevas, and slots
│   │   ├── transportController.js # Buses, trains, flights
│   │   ├── bookingController.js   # Darshan & transit reservations
│   │   └── crowdController.js     # Live wait-time tracking
│   ├── models/                    # Mongoose Data Schemas
│   │   ├── Temple.js              # Temple info & embedded poojas
│   │   ├── Slot.js                # Slot capacities & quotas
│   │   ├── TransportRoute.js      # Transit routes & seat counts
│   │   └── Booking.js             # Devotees roster & QR tokens
│   ├── routes/                    # Modular Express Route Mounts
│   │   ├── templeRoutes.js
│   │   ├── transportRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── crowdRoutes.js
│   ├── .env                       # Server & database environment variables
│   ├── server.js                  # Main server entrypoint
│   ├── seed.js                    # Comprehensive pilgrimage database seeder
│   └── package.json
│
└── frontend/                      # React.js Single Page Application (Vite)
    ├── src/
    │   ├── components/            # Reusable UI components
    │   │   ├── Navbar.jsx         # Header & Live crowd radar ticker
    │   │   ├── Hero.jsx           # Unified pilgrimage search card
    │   │   ├── TempleCard.jsx     # Sacred shrine card with crowd badges
    │   │   ├── TempleModal.jsx    # Sanctum rules & seva catalog
    │   │   ├── DarshanBookingModal.jsx # 4-step slot reservation stepper
    │   │   ├── TransportSection.jsx    # Multi-modal transit hub
    │   │   ├── TransportBookingModal.jsx# Passenger booking form
    │   │   ├── DigitalPassModal.jsx    # Official E-Pass with dynamic SVG QR
    │   │   ├── MyBookingsModal.jsx     # Devotee lookup & cancel
    │   │   ├── LiveCrowdTracker.jsx    # Sanctum queue radar
    │   │   ├── Guidelines.jsx          # Traditional attire & photo ID
    │   │   └── Footer.jsx
    │   ├── services/
    │   │   └── api.js             # REST API client
    │   ├── App.jsx                # Main application state coordinator
    │   ├── main.jsx               # React DOM root mount
    │   └── index.css              # Tailwind directives & print styles
    ├── tailwind.config.js         # Sacred saffron & temple gold palette
    ├── vite.config.js             # Proxy config to Express backend
    └── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites (Installing Node.js & MongoDB)
If Node.js and MongoDB are not yet installed on your Windows machine:
1. **Node.js (LTS version)**:
   - Run in PowerShell:
     ```powershell
     winget install OpenJS.NodeJS.LTS
     ```
   - Or download directly from [nodejs.org](https://nodejs.org/).
2. **MongoDB**:
   - Install local MongoDB Community Server via [mongodb.com](https://www.mongodb.com/try/download/community) or use a free cloud **MongoDB Atlas** database cluster.
   - Update your MongoDB connection URI in `backend/.env` if using Atlas:
     ```env
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/darshanease?retryWrites=true&w=majority
     ```

---

### 2. Setting Up & Starting the Backend

1. Open PowerShell / Terminal and navigate to the backend directory:
   ```powershell
   cd C:\Users\yasaswinitamarana\.gemini\antigravity\scratch\darshanease-mern\backend
   ```
2. Install npm dependencies:
   ```powershell
   npm install
   ```
3. Seed the MongoDB database with temples, slots, and travel routes:
   ```powershell
   npm run seed
   ```
4. Start the Express API server:
   ```powershell
   npm run dev
   ```
   *The backend will start on `http://localhost:5000`.*

---

### 3. Setting Up & Starting the React Frontend

1. Open a second PowerShell / Terminal window and navigate to the frontend directory:
   ```powershell
   cd C:\Users\yasaswinitamarana\.gemini\antigravity\scratch\darshanease-mern\frontend
   ```
2. Install frontend dependencies:
   ```powershell
   npm install
   ```
3. Start the Vite React development server:
   ```powershell
   npm run dev
   ```
4. Open your browser and go to:
   ```
   http://localhost:3000
   ```

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/temples` | List temples with optional `?search=` and `?state=` filters |
| `GET` | `/api/temples/:id` | Get details, guidelines, and poojas for a temple |
| `GET` | `/api/temples/:id/slots?date=YYYY-MM-DD` | Get slots and available quota for a date |
| `GET` | `/api/transport/search` | Search buses, trains, flights with origin, destination, and mode |
| `GET` | `/api/transport/cities` | List unique origin and pilgrimage destination cities |
| `POST` | `/api/bookings/darshan` | Reserve darshan slot with devotee roster & quota decrement |
| `POST` | `/api/bookings/transport` | Book seats on buses, trains, or flights |
| `GET` | `/api/bookings/:bookingId` | Get e-ticket / pass with QR token and devotee roster |
| `GET` | `/api/bookings/my-bookings?query=` | Search passes by email, mobile, or reference ID |
| `POST` | `/api/bookings/:bookingId/cancel` | Cancel booking and atomically restore slot/seat capacity |
| `GET` | `/api/crowd` | Get real-time crowd level and wait times across temples |
