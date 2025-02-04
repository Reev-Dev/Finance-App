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
    const { title, amount, type, category } = req.body;

    // Validasi input
    if (!title || !amount || !type || !category) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ message: 'Tipe harus income atau expense' });
    }

    if (!['salary', 'education', 'health', 'food', 'transportation', 'entertainment', 'utilities', 'others'].includes(category)) {
        return res.status(400).json({ message: 'Kategori harus salary, food, transportation, entertainment, utilities, others' });
    }

    try {
        // Buat data finance baru
        const finance = await Finance.create({
            user: req.user.id,
            title,
            amount,
            type,
            category
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

// Fungsi untuk mendapatkan statistik berdasarkan kategori
const getCategoryStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Ambil semua data keuangan user
        const finances = await Finance.find({ user: userId });

        // Kelompokkan data berdasarkan kategori
        const categoryStats = finances.reduce((acc, curr) => {
            if (!acc[curr.category]) {
                acc[curr.category] = { total: 0, count: 0 };
            }
            acc[curr.category].total += curr.amount;
            acc[curr.category].count += 1;
            return acc;
        }, {});

        res.status(200).json(categoryStats);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mendapatkan statistik kategori' });
    }
};

// Fungsi untuk mendapatkan statistik bulanan
const getMonthlyStats = async (req, res) => {
    try {
        const userId = req.user.id; // ID user dari JWT
        const { year } = req.query; // Ambil tahun dari query parameter

        if (!year) {
            return res.status(400).json({ message: 'Tahun harus disertakan dalam query parameter.' });
        }

        // Filter data berdasarkan tahun
        const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);

        const finances = await Finance.find({
            user: userId,
            createdAt: { $gte: startOfYear, $lt: endOfYear },
        });

        // Hitung statistik bulanan
        const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            totalIncome: 0,
            totalExpense: 0,
            balance: 0,
        }));

        finances.forEach((item) => {
            const monthIndex = item.createdAt.getUTCMonth(); // Dapatkan bulan (0-11)
            if (item.type === 'income') {
                monthlyStats[monthIndex].totalIncome += item.amount;
            } else if (item.type === 'expense') {
                monthlyStats[monthIndex].totalExpense += item.amount;
            }
            monthlyStats[monthIndex].balance =
                monthlyStats[monthIndex].totalIncome - monthlyStats[monthIndex].totalExpense;
        });

        res.status(200).json(monthlyStats); // Kirim data statistik bulanan
    } catch (error) {
        res.status(500).json({ message: error.message }); // Tangani error
    }
};

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
        const userId = req.user.id;
        const {
            type,
            month,
            year,
            keyword,
            category,
            minAmount,
            maxAmount,
            startDate,
            endDate
        } = req.query;


        let query = { user: userId };

        // Filter type
        if (type) {
            query.type = type;
        }

        // Filter tahun
        if (year) {
            const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
            const endOfYear = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);
            query.createdAt = { $gte: startOfYear, $lt: endOfYear };
        }

        // Filter bulan
        if (month) {
            if (!query.createdAt) {
                query.createdAt = {};
            }
            const yearValue = year || new Date().getFullYear(); // Gunakan tahun ini jika tidak diberikan
            const monstStart = new Date(`${yearValue}-${String(month).padStart(2, '0')}-01T00:00:00.000Z`);
            const nextMonth = Number(month) + 1;
            const monthEnd = nextMonth > 12
            ? new Date(`${Number(yearValue) + 1}-01-01T00:00:00.000Z`)
            : new Date(`${yearValue}-${String(nextMonth).padStart(2, '0')}-01T00:00:00.000Z`);
            query.createdAt.$gte = monstStart;
            query.createdAt.$lt = monthEnd;
        }

        // Filter keyword
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { category: { $regex: keyword, $options: 'i' } },
            ];
        }

        // Filter kategori
        if (category) {
            query.category = category;
        }

        // Filter jumlah uang
        if (minAmount || maxAmount) {
            query.amount = {};
            if (minAmount) query.amount.$gte = Number(minAmount);
            if (maxAmount) query.amount.$lte = Number(maxAmount);
        }

        // Filter tanggal
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lt = new Date(endDate);
        }

        // eksekusi query
        const finances = await Finance.find(query).sort({ createdAt: -1 });

        res.status(200).json(finances);
    } catch (err) {
        res.status(500).json({ message: 'Server trouble' });
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

module.exports = { getFinances, createFinance, updateFinance, getCategoryStats, getMonthlyStats, getFinanceReport, filterFinance, deleteFinance };