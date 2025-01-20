// Import model user
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Fungsi untuk membuat token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Controller untuk registrasi user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Validasi input
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    // Cek apakah email sudah terdaftar
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Buat user baru
    const user = await User.create({
        name,
        email,
        password,
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Gagal membuat user' });
    }
}

// Controller untuk login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Cari berdasarkan email
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Email atau password salah' });
    }
};

module.exports = {
    registerUser,
    loginUser,
};