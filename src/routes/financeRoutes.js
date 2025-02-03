// Import 
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getFinances,
    createFinance,
    updateFinance,
    getCategoryStats,
    getMonthlyStats,
    getFinanceReport,
    filterFinance,
    deleteFinance,
} = require('../controllers/financeController');

router.route('/').get(protect, getFinances).post(protect, createFinance);
router.route('/:id').put(protect, updateFinance).delete(protect, deleteFinance);

// Route untuk mendapatkan laporan finance
router.get('/report', protect, getFinanceReport);

// Route untuk mendapatkan data finance berdasarkan tahun
router.get('/filter', protect, filterFinance);

// Route untuk mendapatkan statistik berdasarkan kategori
router.get('/category-stats', protect, getCategoryStats);

// Route untuk mendapatkan statistik bulanan
router.get('/monthly-stats', protect, getMonthlyStats);

module.exports = router;