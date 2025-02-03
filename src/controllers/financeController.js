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

// Controller untuk mendapatkan laporan finance user
const getFinanceReport = async (req, res) => {
    const finances = await Finance.find({ user: req.user.id });

    try {
        // filter dan hitung total incomes
        const totalIncomes = finances
            .filter(finance => finance.type === 'income')
            .reduce((total, finance) => total + finance.amount, 0);

        // filter dan hitung total expenses
        const totalExpenses = finances
            .filter(finance => finance.type === 'expense')
            .reduce((total, finance) => total + finance.amount, 0);

        // hitung balance
        const balance = totalIncomes - totalExpenses;

        // kirimkan laporan sebagai response
        res.status(200).json({
            totalIncomes,
            totalExpenses,
            balance
        });
    } catch (err) {
        res.status(500).json({ message: 'Server trouble' });
    }
};

// Controller untuk mendapatkan data berdasarkan tahun
const filterFinance = async (req, res) => {
    try {
        const userId = req.user._id; // Ambil ID user dari JWT
        const { type, month, year } = req.query; // Ambil query parameters

        let query = { user: userId };

        if (type) {
            query.type = type; // ex: 'income' atau 'expense'
        }

        // Filter berdasarkan tahun
        if (year) {
            const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
            const endOfYear = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);
            query.createdAt = { $gte: startOfYear, $lt: endOfYear };
        }

        // Filter berdasarkan bulan (jika bulan ada)
        if (month) {
            if (!query.createdAt) {
                query.createdAt = {};
            }
            const yearValue = year || new Date().getFullYear(); // Gunakan tahun saat ini jika tidak diberikan
            const monthStart = new Date(`${yearValue}-${String(month).padStart(2, '0')}-01T00:00:00.000Z`);
            const nextMonth = Number(month) + 1;
            const monthEnd = nextMonth > 12
                ? new Date(`${Number(yearValue) + 1}-01-01T00:00:00.000Z`)
                : new Date(`${yearValue}-${String(nextMonth).padStart(2, '0')}-01T00:00:00.000Z`);
            query.createdAt.$gte = monthStart;
            query.createdAt.$lt = monthEnd;
        }

        // Ambil data berdasarkan query yang telah dibuat
        const finances = await Finance.find(query).sort({ createdAt: -1 });

        res.status(200).json(finances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

module.exports = { getFinances, createFinance, updateFinance, getFinanceReport, filterFinance, deleteFinance };