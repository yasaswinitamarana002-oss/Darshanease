const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Temple = require('./models/Temple');
const Slot = require('./models/Slot');
const TransportRoute = require('./models/TransportRoute');

dotenv.config();

const templesData = [
    {
        name: "Sri Venkateswara Swamy Temple (Tirupati)",
        deity: "Lord Venkateswara (Balaji)",
        city: "Tirupati",
        state: "Andhra Pradesh",
        description: "One of the most revered and visited Vaishnavite pilgrimage shrines in the world, situated atop the scenic Tirumala Seven Hills.",
        imageUrl: "https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=800&q=80",
        dressCode: "Traditional: Dhoti/Kurta or Pyjama with Kurta for Men; Saree, Half-saree, or Chudidar with Dupatta for Women. Western wear strictly prohibited.",
        timings: "03:00 AM - 11:30 PM",
        rules: "Electronic gadgets, leather items, and footwear are prohibited inside the inner sanctum. Carry original ID proof.",
        crowdStatus: "Moderate",
        waitTimeMins: 40,
        rating: 4.9,
        poojas: [
            { name: "Special Entry Darshan (Seeghra Darshan)", category: "Darshan", price: 300, description: "Expedited entry queue for hassle-free darshan with minimal wait time.", durationMins: 45, prasadamIncluded: "2 Free Tirupati Laddus per devotee" },
            { name: "VIP Break Darshan", category: "Darshan", price: 1000, description: "Morning priority sanctum darshan with close proximity to Moolavirat.", durationMins: 30, prasadamIncluded: "4 Specialty Laddus + Srivari Sesha Vastram" },
            { name: "Suprabhata Seva", category: "Special Seva", price: 500, description: "Sacred pre-dawn ritual awakening the Lord of the Universe with Vedic hymns.", durationMins: 60, prasadamIncluded: "2 Laddus + Sacred Theertham" },
            { name: "Kalyanotsavam (Celestial Wedding)", category: "Special Seva", price: 1000, description: "Divine wedding ceremony of Lord Venkateswara and Goddesses Sridevi & Bhudevi.", durationMins: 120, prasadamIncluded: "Uttariyam, Blouse piece, Laddus, Vadas" },
            { name: "Sarva Darshan (General/Free)", category: "Darshan", price: 0, description: "Standard general queue darshan open to all devotees without cost.", durationMins: 120, prasadamIncluded: "1 Free Tirupati Laddu" }
        ]
    },
    {
        name: "Shirdi Sai Baba Sansthan Temple",
        deity: "Shirdi Sai Baba",
        city: "Shirdi",
        state: "Maharashtra",
        description: "The holy resting place and Samadhi Mandir of the revered saint Sri Sai Baba, teaching universal love and devotion.",
        imageUrl: "https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=800&q=80",
        dressCode: "Modest and decent traditional Indian attire. Shoulders and knees must be covered.",
        timings: "04:00 AM - 11:00 PM",
        rules: "Mobile phones must be deposited in digital lockers before entry. Photography is strictly prohibited in the Samadhi hall.",
        crowdStatus: "Low",
        waitTimeMins: 25,
        rating: 4.8,
        poojas: [
            { name: "Kakad Aarti (Morning 4:30 AM)", category: "Aarti", price: 500, description: "Sacred dawn aarti bathing Baba's shrine in celestial morning spiritual energy.", durationMins: 45, prasadamIncluded: "Udi packet & Dry Fruits Prasad" },
            { name: "VIP Darshan Pass", category: "Darshan", price: 200, description: "Fast-track entry into the Samadhi Mandir directly bypassing the general queue.", durationMins: 30, prasadamIncluded: "Blessed Shawl + Udi Packet" },
            { name: "Madhyan Aarti (Noon 12:00 PM)", category: "Aarti", price: 400, description: "Midday aarti offering Bhog and prayers to Sri Sai Baba.", durationMins: 40, prasadamIncluded: "Peda Prasad & Sacred Rose Petals" },
            { name: "General Darshan", category: "Darshan", price: 0, description: "Free general queue darshan for all devotees.", durationMins: 60, prasadamIncluded: "Sacred Udi Prasadam" }
        ]
    },
    {
        name: "Kashi Vishwanath Jyotirlinga Temple",
        deity: "Lord Shiva (Vishwanatha)",
        city: "Varanasi",
        state: "Uttar Pradesh",
        description: "One of the 12 sacred Jyotirlingas, positioned on the holy western bank of the sacred River Ganga along the historic Kashi corridor.",
        imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
        dressCode: "Traditional Dhoti/Kurta for males performing Sparsh Darshan; Saree or Salwar Kameez with Dupatta for females.",
        timings: "03:00 AM - 11:00 PM",
        rules: "Metal detectors at all 4 corridor gates. Original Aadhaar or Passport required for VIP Darshan.",
        crowdStatus: "High",
        waitTimeMins: 75,
        rating: 4.9,
        poojas: [
            { name: "Mangala Aarti (03:00 AM)", category: "Aarti", price: 500, description: "First morning auspicious awakening aarti of Lord Vishwanath.", durationMins: 60, prasadamIncluded: "Rudraksha + Panchamrit Prasad" },
            { name: "Sugam Darshan (Priority Pass)", category: "Darshan", price: 300, description: "Escorted priority entry through the Kashi Corridor directly to sanctum.", durationMins: 30, prasadamIncluded: "Prasad Dabba + Gangajal Vial" },
            { name: "Rudrabhishek Pooja", category: "Special Seva", price: 750, description: "Vedic chant-infused holy bath offering of milk, honey, and sacred water.", durationMins: 75, prasadamIncluded: "Vibhuti, Belpatra & Dry Fruits" },
            { name: "General Darshan", category: "Darshan", price: 0, description: "General corridor darshan of Baba Vishwanath.", durationMins: 90, prasadamIncluded: "Sacred Vibhuti" }
        ]
    },
    {
        name: "Shri Mata Vaishno Devi Shrine",
        deity: "Mata Vaishno Devi",
        city: "Katra",
        state: "Jammu & Kashmir",
        description: "A holy cave temple situated in the Trikuta Mountains, visited by millions seeking the blessings of the Divine Mother.",
        imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
        dressCode: "Warm modest clothing suitable for mountainous trek. Traditional clothes preferred inside the Bhawan.",
        timings: "05:00 AM - 10:00 PM",
        rules: "RFID yatra tracking card is mandatory for all pilgrims starting from Katra base.",
        crowdStatus: "Moderate",
        waitTimeMins: 50,
        rating: 4.9,
        poojas: [
            { name: "Special Atka Aarti Darshan", category: "Aarti", price: 2000, description: "Exclusive seating inside the sacred Bhawan cave during the divine aarti.", durationMins: 90, prasadamIncluded: "Holy Khazana Coins & Mata Chunri" },
            { name: "Priority Darshan Slip", category: "Darshan", price: 500, description: "Dedicated priority channel entry at Bhawan sanctum cave.", durationMins: 45, prasadamIncluded: "Prasad Pouch & Dry Fruits" },
            { name: "General Cave Darshan", category: "Darshan", price: 0, description: "General darshan of the Holy Pindies of Mata Vaishno Devi.", durationMins: 120, prasadamIncluded: "Mata Prashad" }
        ]
    },
    {
        name: "Kedarnath Dham Temple",
        deity: "Lord Shiva (Kedareswara)",
        city: "Kedarnath",
        state: "Uttarakhand",
        description: "The highest of the 12 Jyotirlingas, nestled in the majestic snow-clad Garhwal Himalayas near the Mandakini River.",
        imageUrl: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
        dressCode: "Heavy woolen apparel and comfortable walking boots/shoes; traditional shawls for darshan.",
        timings: "04:00 AM - 09:00 PM",
        rules: "Mandatory Uttarakhand biometric yatra registration and medical fitness certificate.",
        crowdStatus: "High",
        waitTimeMins: 90,
        rating: 5.0,
        poojas: [
            { name: "Shodashopachar Maha Pooja", category: "Special Seva", price: 2500, description: "Elaborate 16-step morning Vedic ritual conducted by temple Rawals.", durationMins: 90, prasadamIncluded: "Sacred Himalayan Vibhuti & Ghee Prasad" },
            { name: "VIP Priority Darshan", category: "Darshan", price: 500, description: "Swift entry pass for pilgrims arriving via helicopter or morning trek.", durationMins: 30, prasadamIncluded: "Kedareswar Prasad Box" },
            { name: "General Sabha Mandap Darshan", category: "Darshan", price: 0, description: "Devotee entry into the historic stone sanctum mandap.", durationMins: 120, prasadamIncluded: "Sacred Ash Prasad" }
        ]
    },
    {
        name: "Madurai Meenakshi Amman Temple",
        deity: "Goddess Meenakshi & Sundareswarar",
        city: "Madurai",
        state: "Tamil Nadu",
        description: "A historic masterpiece of Dravidian architecture with towering sculptured Gopurams and sacred spiritual energy.",
        imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
        dressCode: "Strict traditional South Indian dress code: Dhoti/Veshti with Shirt or Angavastram; Saree or Churidar with Dupatta.",
        timings: "05:00 AM - 12:30 PM, 04:00 PM - 10:00 PM",
        rules: "Cell phones are completely banned inside the temple premises. Free cloakrooms are available at East & South towers.",
        crowdStatus: "Low",
        waitTimeMins: 20,
        rating: 4.8,
        poojas: [
            { name: "Special Tharisanam Pass", category: "Darshan", price: 100, description: "Speedy access line for both Meenakshi Amman and Sundareswarar shrines.", durationMins: 30, prasadamIncluded: "Kumkum, Chandan & Vibhuti" },
            { name: "Navarathri Special Pooja", category: "Special Seva", price: 500, description: "Grand alankaram pooja with floral offerings and chanting.", durationMins: 60, prasadamIncluded: "Sweet Pongal & Temple Silk cloth" },
            { name: "Free General Darshan", category: "Darshan", price: 0, description: "Traditional circumambulation and sanctum darshan.", durationMins: 60, prasadamIncluded: "Sacred Kumkum Prasadam" }
        ]
    },
    {
        name: "Shri Jagannath Temple",
        deity: "Lord Jagannath, Balabhadra, Subhadra",
        city: "Puri",
        state: "Odisha",
        description: "Ancient sacred Char Dham temple celebrated for the world-famous Ratha Yatra and sacred Mahaprasad.",
        imageUrl: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80",
        dressCode: "Decent Indian traditional attire: Kurta-pyjama/Dhoti; Sarees or Salwar suits.",
        timings: "05:30 AM - 11:00 PM",
        rules: "Only Indian Hindus are permitted inside the sanctum sanctorum as per ancient temple tradition.",
        crowdStatus: "Moderate",
        waitTimeMins: 45,
        rating: 4.7,
        poojas: [
            { name: "Sahanamela (Free Close Darshan)", category: "Darshan", price: 0, description: "Time-honored morning open darshan of the deities without barrier.", durationMins: 45, prasadamIncluded: "Sacred Tulsi & Khaja Prasad" },
            { name: "VIP Parimanik Darshan", category: "Darshan", price: 250, description: "Permits devotees to stand inside the inner sanctum (Bhadra Peetha).", durationMins: 30, prasadamIncluded: "Mahaprasad Packet (Dry Sweets)" }
        ]
    },
    {
        name: "Somnath Jyotirlinga Temple",
        deity: "Lord Shiva (Somnath)",
        city: "Prabhas Patan, Veraval",
        state: "Gujarat",
        description: "The eternal, first of the twelve sacred Jyotirlinga shrines, situated majestically on the shore of the Arabian Sea.",
        imageUrl: "https://images.unsplash.com/photo-1620619767323-b95a89183081?auto=format&fit=crop&w=800&q=80",
        dressCode: "Clean traditional or formal clothing. Shorts, sleeveless, and bermudas are strictly not permitted.",
        timings: "06:00 AM - 10:00 PM",
        rules: "Evening Sound & Light show starts at 8:00 PM. High-security check at Sagar Darshan entrance.",
        crowdStatus: "Low",
        waitTimeMins: 15,
        rating: 4.8,
        poojas: [
            { name: "Somnath VIP Darshan", category: "Darshan", price: 200, description: "Direct expedited access line inside the Sompura architecture sanctum.", durationMins: 20, prasadamIncluded: "Prasad Box with Kaju Katli" },
            { name: "Maha Pooja with Bilva Patra", category: "Special Seva", price: 600, description: "Special archana offering 1008 bilva leaves accompanied by Rudra path.", durationMins: 60, prasadamIncluded: "Bilva leaves & Sacred Raksha Thread" }
        ]
    }
];

const seedDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/darshanease';
        await mongoose.connect(uri);
        console.log('MongoDB Connected for Seeding...');

        // Clear existing
        await Temple.deleteMany({});
        await Slot.deleteMany({});
        await TransportRoute.deleteMany({});

        console.log('Old records cleared.');

        // Insert Temples
        const createdTemples = await Temple.insertMany(templesData);
        console.log(`Seeded ${createdTemples.length} Sacred Temples.`);

        // Generate 14-day rolling slots
        const slotTimes = [
            "06:00 AM - 08:00 AM (Morning)",
            "08:00 AM - 10:00 AM (Morning)",
            "10:00 AM - 12:00 PM (Noon)",
            "02:00 PM - 04:00 PM (Afternoon)",
            "04:00 PM - 06:00 PM (Evening)",
            "06:00 PM - 08:00 PM (Night)",
            "08:00 PM - 10:00 PM (Night)"
        ];

        const slotsToInsert = [];
        const today = new Date();

        createdTemples.forEach((temple, tIdx) => {
            for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + dayOffset);
                const dateString = targetDate.toISOString().split('T')[0];

                slotTimes.forEach((timeSlot, sIdx) => {
                    const booked = 25 + ((dayOffset * 7 + sIdx * 11 + tIdx * 5) % 75);
                    slotsToInsert.push({
                        temple: temple._id,
                        slotDate: dateString,
                        timeSlot: timeSlot,
                        capacity: 120,
                        bookedCount: booked
                    });
                });
            }
        });

        await Slot.insertMany(slotsToInsert);
        console.log(`Seeded ${slotsToInsert.length} Darshan time slots.`);

        // Seed Transport Routes
        const tirupatiTemple = createdTemples.find(t => t.city === 'Tirupati');
        const shirdiTemple = createdTemples.find(t => t.city === 'Shirdi');
        const varanasiTemple = createdTemples.find(t => t.city === 'Varanasi');
        const katraTemple = createdTemples.find(t => t.city === 'Katra');
        const kedarnathTemple = createdTemples.find(t => t.city === 'Kedarnath');
        const maduraiTemple = createdTemples.find(t => t.city === 'Madurai');

        const transportData = [
            // BUSES
            { mode: "bus", operatorName: "APSRTC Garuda Plus Multi-Axle AC", serviceNumber: "AP-GAR-101", sourceCity: "Chennai", destinationCity: "Tirupati", temple: tirupatiTemple?._id, departureTime: "06:00 AM", arrivalTime: "09:45 AM", duration: "3h 45m", price: 380, classType: "AC Semi-Sleeper", totalSeats: 45, bookedSeats: 12 },
            { mode: "bus", operatorName: "KSRTC Airavat Club Class", serviceNumber: "KA-AIR-204", sourceCity: "Bangalore", destinationCity: "Tirupati", temple: tirupatiTemple?._id, departureTime: "07:00 AM", arrivalTime: "12:00 PM", duration: "5h 00m", price: 550, classType: "AC Sleeper", totalSeats: 40, bookedSeats: 20 },
            { mode: "bus", operatorName: "TSRTC Super Luxury", serviceNumber: "TS-SUP-302", sourceCity: "Hyderabad", destinationCity: "Tirupati", temple: tirupatiTemple?._id, departureTime: "08:30 PM", arrivalTime: "07:00 AM", duration: "10h 30m", price: 890, classType: "Non-AC Sleeper", totalSeats: 36, bookedSeats: 18 },
            { mode: "bus", operatorName: "MSRTC Shivneri Volvo AC", serviceNumber: "MS-SHV-501", sourceCity: "Mumbai", destinationCity: "Shirdi", temple: shirdiTemple?._id, departureTime: "06:30 AM", arrivalTime: "01:00 PM", duration: "6h 30m", price: 620, classType: "AC Seater", totalSeats: 45, bookedSeats: 14 },
            { mode: "bus", operatorName: "UPSRTC Janrath AC", serviceNumber: "UP-JAN-701", sourceCity: "Delhi", destinationCity: "Varanasi", temple: varanasiTemple?._id, departureTime: "05:00 PM", arrivalTime: "07:30 AM", duration: "14h 30m", price: 1150, classType: "AC Seater", totalSeats: 45, bookedSeats: 22 },
            { mode: "bus", operatorName: "J&K SRTC Super Deluxe", serviceNumber: "JK-DLX-801", sourceCity: "Jammu", destinationCity: "Katra", temple: katraTemple?._id, departureTime: "07:00 AM", arrivalTime: "09:00 AM", duration: "2h 00m", price: 180, classType: "Deluxe Coach", totalSeats: 40, bookedSeats: 8 },

            // TRAINS
            { mode: "train", operatorName: "Vande Bharat Express", serviceNumber: "20677 - VB EXP", sourceCity: "Chennai Central", destinationCity: "Tirupati", temple: tirupatiTemple?._id, departureTime: "05:15 AM", arrivalTime: "08:30 AM", duration: "3h 15m", price: 815, classType: "Chair Car (CC)", totalSeats: 78, bookedSeats: 25 },
            { mode: "train", operatorName: "Vande Bharat Shirdi Express", serviceNumber: "22223 - CSMT SHIRDI VB", sourceCity: "Mumbai CSMT", destinationCity: "Sainagar Shirdi", temple: shirdiTemple?._id, departureTime: "06:20 AM", arrivalTime: "11:40 AM", duration: "5h 20m", price: 975, classType: "Chair Car (CC)", totalSeats: 78, bookedSeats: 30 },
            { mode: "train", operatorName: "Vande Bharat Varanasi Express", serviceNumber: "22436 - NDLS BSB VB", sourceCity: "New Delhi", destinationCity: "Varanasi Jn", temple: varanasiTemple?._id, departureTime: "06:00 AM", arrivalTime: "02:00 PM", duration: "8h 00m", price: 1750, classType: "Chair Car (CC)", totalSeats: 78, bookedSeats: 45 },
            { mode: "train", operatorName: "Vande Bharat Katra Express", serviceNumber: "22439 - NDLS SVDK VB", sourceCity: "New Delhi", destinationCity: "Shri Mata Vaishno Devi Katra", temple: katraTemple?._id, departureTime: "06:00 AM", arrivalTime: "02:00 PM", duration: "8h 00m", price: 1630, classType: "Chair Car (CC)", totalSeats: 78, bookedSeats: 52 },
            { mode: "train", operatorName: "Tejas Vande Bharat Madurai", serviceNumber: "20601 - MAS MDU VB", sourceCity: "Chennai Central", destinationCity: "Madurai Jn", temple: maduraiTemple?._id, departureTime: "06:00 AM", arrivalTime: "12:15 PM", duration: "6h 15m", price: 1250, classType: "Chair Car (CC)", totalSeats: 78, bookedSeats: 35 },

            // FLIGHTS
            { mode: "flight", operatorName: "IndiGo Airlines", serviceNumber: "6E-7214", sourceCity: "Hyderabad (HYD)", destinationCity: "Tirupati (TIR)", temple: tirupatiTemple?._id, departureTime: "07:35 AM", arrivalTime: "08:45 AM", duration: "1h 10m", price: 3450, classType: "Economy", totalSeats: 60, bookedSeats: 18 },
            { mode: "flight", operatorName: "Air India Express", serviceNumber: "IX-1842", sourceCity: "Bangalore (BLR)", destinationCity: "Tirupati (TIR)", temple: tirupatiTemple?._id, departureTime: "09:20 AM", arrivalTime: "10:15 AM", duration: "0h 55m", price: 2890, classType: "Economy", totalSeats: 60, bookedSeats: 12 },
            { mode: "flight", operatorName: "IndiGo Airlines", serviceNumber: "6E-5431", sourceCity: "Delhi (DEL)", destinationCity: "Shirdi (SAG)", temple: shirdiTemple?._id, departureTime: "08:15 AM", arrivalTime: "10:20 AM", duration: "2h 05m", price: 4980, classType: "Economy", totalSeats: 60, bookedSeats: 24 },
            { mode: "flight", operatorName: "Air India", serviceNumber: "AI-406", sourceCity: "Delhi (DEL)", destinationCity: "Varanasi (VNS)", temple: varanasiTemple?._id, departureTime: "10:15 AM", arrivalTime: "11:35 AM", duration: "1h 20m", price: 3850, classType: "Economy", totalSeats: 60, bookedSeats: 22 },
            { mode: "flight", operatorName: "IndiGo Airlines", serviceNumber: "6E-2411", sourceCity: "Delhi (DEL)", destinationCity: "Dehradun (DED) [Kedarnath]", temple: kedarnathTemple?._id, departureTime: "08:30 AM", arrivalTime: "09:25 AM", duration: "0h 55m", price: 3250, classType: "Economy", totalSeats: 60, bookedSeats: 25 }
        ];

        await TransportRoute.insertMany(transportData);
        console.log(`Seeded ${transportData.length} multi-modal pilgrimage transport routes.`);

        console.log('✅ DarshanEase MERN database successfully seeded!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedDB();
