const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/darshanease';
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.error(`Tip: Ensure MongoDB is running locally or provide a cloud MongoDB Atlas MONGODB_URI in backend/.env`);
    }
};

module.exports = connectDB;
