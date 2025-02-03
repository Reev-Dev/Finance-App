// Import 
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getFinances,
    createFinance,
    updateFinance,
    getFinanceReport,
    filterFinance,
    deleteFinance,
} = require('../controllers/financeController');

// Route untuk mendapatkan semua data finance
router.get('/', protect, getFinances);

// Route untuk membuat data finance baru
router.post('/', protect, createFinance);

// Route untuk mengupdate data finance
router.put('/:id', protect, updateFinance);

// Route untuk mendapatkan laporan finance
router.get('/report', protect, getFinanceReport);

// Route untuk mendapatkan data finance berdasarkan tahun
router.get('/filter', protect, filterFinance);

// Route untuk menghapus data finance   
router.delete('/:id', protect, deleteFinance);

module.exports = router;