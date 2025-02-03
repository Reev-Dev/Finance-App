// import library yang dibutuhkan
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// konfigurasi dotenv agar membaca variabel lingkungan dari .env
dotenv.config();

// Inisialisasi express
const app = express();

// Middleware untuk parsing JSON pada request body
app.use(express.json());

// Import Rute API
const userRoutes = require('./routes/userRoutes');
const financeRoutes = require('./routes/financeRoutes');
const reminderRoutes = require('./routes/reminderRoutes');

// Gunakan Rute API
app.use('/api/users', userRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/reminders', reminderRoutes);

// Port aplikasi
const PORT = process.env.PORT || 5000;

// Run server
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
});

// Panggil koneksi ke database
connectDB();