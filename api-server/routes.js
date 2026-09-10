import express from 'express';
import Database from './database.js';

const router = express.Router();
const db = new Database();

// ==================== PENDING (المنتظر) ====================

// إضافة حوالة أو فاتورة إلى المنتظر
router.post('/api/transactions/add', (req, res) => {
  const { type, amount, date, reference, description } = req.body;

  if (!type || !amount || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const transaction = db.addToPending({
    type, // 'transfer' أو 'invoice'
    amount,
    date,
    reference,
    description,
  });

  res.json({
    success: true,
    message: 'تم إضافة العملية إلى المنتظر',
    transaction,
  });
});

// الحصول على قائمة المنتظر
router.get('/api/pending', (req, res) => {
  res.json({
    success: true,
    data: db.getPending(),
    count: db.getPending().length,
  });
});

// ==================== ASSISTED MATCHING (مساعد المطابقة) ====================

// تشغيل المطابقة الآلية
router.post('/api/matching/auto', (req, res) => {
  const matches = db.performAutoMatching();
  res.json({
    success: true,
    message: `تم العثور على ${matches.length} مطابقات آلية`,
    matches,
  });
});

// الحصول على المطابقات من مساعد المطابقة
router.get('/api/matching/assisted', (req, res) => {
  res.json({
    success: true,
    data: db.getAssistedMatches(),
    count: db.getAssistedMatches().length,
  });
});

// ==================== MANUAL MATCHING (المطابقة اليدوية) ====================

// نقل مطابقة من مساعد المطابقة إلى المطابقة اليدوية للمراجعة
router.post('/api/matching/move-to-manual/:matchId', (req, res) => {
  const { matchId } = req.params;
  const match = db.moveToManualMatching(matchId);

  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }

  res.json({
    success: true,
    message: 'تم نقل المطابقة إلى المطابقة اليدوية',
    match,
  });
});

// إجراء مطابقة يدوية من الصفر
router.post('/api/matching/manual', (req, res) => {
  const { transferId, invoiceId, userId } = req.body;

  if (!transferId || !invoiceId || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const result = db.manualMatchTransactions(transferId, invoiceId, userId);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json({
    success: true,
    message: 'تم إنشاء مطابقة يدوية بنجاح',
    match: result.match,
  });
});

// الحصول على قائمة المطابقة اليدوية
router.get('/api/matching/manual', (req, res) => {
  res.json({
    success: true,
    data: db.getManualMatches(),
    count: db.getManualMatches().length,
  });
});

// ==================== CONFIRM MATCHING (تأكيد وتحريك إلى المؤكد) ====================
// هذا هو الزر الأهم!

router.post('/api/matching/confirm/:matchId', (req, res) => {
  const { matchId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  const result = db.confirmMatch(matchId, userId);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json({
    success: true,
    message: result.message,
    match: result.match,
    confirmRecord: result.confirmRecord,
  });
});

// الحصول على قائمة المؤكد
router.get('/api/confirmed', (req, res) => {
  res.json({
    success: true,
    data: db.getConfirmed(),
    count: db.getConfirmed().length,
  });
});

// ==================== REPORTS (التقارير) ====================

router.get('/api/reports/status', (req, res) => {
  res.json({
    success: true,
    report: db.getMatchingReport(),
  });
});

router.get('/api/reports/matches', (req, res) => {
  res.json({
    success: true,
    records: db.getAllMatchRecords(),
    total: db.getAllMatchRecords().length,
  });
});

export { router, db };
