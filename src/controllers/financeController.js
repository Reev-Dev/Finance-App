// Import model finance
const Finance = require('../models/financeModel');

// Controller untuk mendapatkan semua data finance user
const getFinances = async (req, res) => {
    try {
        // cari semua data finance milik user yang sedang login
        const finances = await Finance.find({ user: req.user.id });
        res.status(200).json(finances);
    } catch (err) {
        res.status(500).json({ message: 'Server trouble' });
    }
};

// Controller untuk membuat data finance baru
const createFinance = async (req, res) => {
    const { title, amount, type } = req.body;

    // Validasi input
    if (!title || !amount || !type) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    try {
        // Buat data finance baru
        const finance = await Finance.create({
            user: req.user.id,
            title,
            amount,
            type
        });

        res.status(201).json(finance);
    } catch (err) {
        res.status(500).json({ message: 'Gagal membuat data finance' });
    }
};

// Controller untuk mengupdate data finance
const updateFinance = async (req, res) => {
    const { id } = req.params;

    try {
        // cari data berdasarkan id
        const finance = await Finance.findById(id);

        // cek apakah data finance ditemukan dan milik user yang sedang login
        if (!finance || finance.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Data finance tidak ditemukan' });
        }

        // update data finance
        const updatedFinance = await Finance.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedFinance);
    } catch (err) {
        return res.status(500).json({ message: 'Gagal mengupdate data finance' });
    }
}

// Controller untuk menghapus data finance
const deleteFinance = async (req, res) => {
    const { id } = req.params;

    try {
        // cari data berdasarkan id
        const finance = await Finance.findById(id);

        // cek apakah data finance ditemukan dan milik user yang sedang login
        if (!finance || finance.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Data finance tidak ditemukan' });
        }

        // hapus data finance
        await Finance.findByIdAndDelete(id);
        res.status(200).json({ message: 'Data finance berhasil dihapus' });
    } catch (err) {
        return res.status(500).json({ message: 'Gagal menghapus data finance' });
    }
};

module.exports = { getFinances, createFinance, updateFinance, deleteFinance };