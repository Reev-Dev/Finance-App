// Import mongoose
const mongoose = require('mongoose');

// Definisi skema finance
const financeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: [true, 'Judul diperlukan'],
        },
        amount: {
            type: Number,
            required: [true, 'Jumlah diperlukan'],
        },
        type: {
            type: String,
            required: [true, 'Tipe diperlukan'],
            enum: ['income', 'expense'],
        },
        category: {
            type: String,
            required: true,
            enum: ['salary', 'education', 'health', 'food', 'transportation', 'entertainment', 'utilities', 'others'],
        },
    }, {
    timestamps: true,
}
)

// Buat model finance berdasarkan skema
const Finance = mongoose.model('Finance', financeSchema);

module.exports = Finance;