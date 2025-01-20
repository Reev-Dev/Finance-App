// Import JWT dan Model User
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware untuk validasi token JWT
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Ambil token dari header Authorization
            token = req.headers.authorization.split(' ')[1];

            // Verifikasi token JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Cari user berdasarkan ID yang terkait dengan token 
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            res.status(401).json({ message: 'Token tidak valid' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Tidak ada token, akses ditolak' });
    }
};

module.exports = { protect };