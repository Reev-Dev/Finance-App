// Import mongoose untuk buat skema
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definisi skema user
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Nama diperlukan'],
        },
        email: {
            type: String,
            required: [true, 'Email diperlukan'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Password diperlukan'],
        },
    }, {
    timestamps: true,
    }
);

// Middleware untuk hashing password sebelum menyimpan data user
userSchema.pre('save', async function (next) {
    // Hanya hash password jika field password diubah
    if (!this.isModified('password')) {
        return next();
    }

    // Hash password pakai bcrypt
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Metode untuk memeriksa kecocokan password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);    
}

// Buat model user berdasarkan skema
const User = mongoose.model('User', userSchema);

module.exports = User;