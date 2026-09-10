// Database Schema and Logic
// This file manages all data operations

class Database {
  constructor() {
    // In-memory database (replace with real DB later)
    this.transactions = {
      pending: [], // الفواتير والحوالات المنتظرة
      matched: [], // المطابقة الآلية (مساعد المطابقة)
      manual: [], // قيد المطابقة اليدوية
      confirmed: [], // المؤكد والمطابق
    };

    this.matchRecords = []; // سجل المطابقات
    this.users = [
      { id: 1, username: 'admin', role: 'admin' }
    ];
  }

  // ==================== PENDING (المنتظر) ====================
  addToPending(transaction) {
    const id = Date.now().toString();
    const newTransaction = {
      id,
      ...transaction,
      status: 'pending',
      createdAt: new Date(),
    };
    this.transactions.pending.push(newTransaction);
    return newTransaction;
  }

  getPending() {
    return this.transactions.pending;
  }

  removeFromPending(id) {
    this.transactions.pending = this.transactions.pending.filter(
      (t) => t.id !== id
    );
  }

  // ==================== ASSISTED MATCHING (مساعد المطابقة) ====================
  // خوارزمية المطابقة الآلية
  performAutoMatching() {
    const transfers = this.transactions.pending.filter(
      (t) => t.type === 'transfer'
    );
    const invoices = this.transactions.pending.filter(
      (t) => t.type === 'invoice'
    );

    const matches = [];

    for (const transfer of transfers) {
      for (const invoice of invoices) {
        // تطابق إذا تساوت المبالغ والتواريخ قريبة
        if (
          transfer.amount === invoice.amount &&
          this.datesAreClose(transfer.date, invoice.date, 3)
        ) {
          matches.push({
            id: `match-${Date.now()}-${Math.random()}`,
            transferId: transfer.id,
            invoiceId: invoice.id,
            transfer: { ...transfer },
            invoice: { ...invoice },
            status: 'assisted',
            matchedAt: new Date(),
            confidence: 'high',
          });
          break; // كل حوالة تطابق فاتورة واحدة فقط
        }
      }
    }

    // إضافة المطابقات إلى قائمة مساعد المطابقة
    this.transactions.matched.push(...matches);
    return matches;
  }

  datesAreClose(date1, date2, days) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  }

  getAssistedMatches() {
    return this.transactions.matched;
  }

  // ==================== MANUAL MATCHING (المطابقة اليدوية) ====================
  // نقل المطابقة من مساعد المطابقة إلى المطابقة اليدوية
  moveToManualMatching(matchId) {
    const match = this.transactions.matched.find((m) => m.id === matchId);
    if (match) {
      match.status = 'manual';
      // إضافة إلى قائمة المطابقة اليدوية
      this.transactions.manual.push(match);
      return match;
    }
    return null;
  }

  // المطابقة اليدوية من الصفر (بدون مساعد)
  manualMatchTransactions(transferId, invoiceId, userId) {
    const transfer = this.transactions.pending.find((t) => t.id === transferId);
    const invoice = this.transactions.pending.find((t) => t.id === invoiceId);

    if (!transfer || !invoice) {
      return { success: false, error: 'Transaction not found' };
    }

    // التحقق من التوافق
    if (transfer.amount !== invoice.amount) {
      return { success: false, error: 'Amounts do not match' };
    }

    // إنشاء سجل مطابقة
    const matchRecord = {
      id: `match-${Date.now()}`,
      transferId,
      invoiceId,
      transfer: { ...transfer },
      invoice: { ...invoice },
      status: 'manual',
      matchedAt: new Date(),
      matchedBy: userId,
      type: 'manual',
      amount: transfer.amount,
    };

    // إضافة إلى سجل المطابقات
    this.matchRecords.push(matchRecord);

    // إضافة إلى قائمة المطابقة اليدوية (للعرض)
    this.transactions.manual.push(matchRecord);

    return { success: true, match: matchRecord };
  }

  getManualMatches() {
    return this.transactions.manual;
  }

  // ==================== CONFIRM MATCHING (تأكيد وتحريك إلى المؤكد) ====================
  // هذا هو الخطوة الحاسمة!
  confirmMatch(matchId, userId) {
    // البحث عن المطابقة
    let match = null;
    let sourceList = null;

    // البحث في جميع القوائم
    if (this.transactions.matched.find((m) => m.id === matchId)) {
      match = this.transactions.matched.find((m) => m.id === matchId);
      sourceList = this.transactions.matched;
    } else if (this.transactions.manual.find((m) => m.id === matchId)) {
      match = this.transactions.manual.find((m) => m.id === matchId);
      sourceList = this.transactions.manual;
    }

    if (!match) {
      return { success: false, error: 'Match not found' };
    }

    // === الخطوة 1: نقل البيانات من المنتظر إلى المؤكد ===
    const confirmedTransfer = { ...match.transfer, status: 'confirmed' };
    const confirmedInvoice = { ...match.invoice, status: 'confirmed' };

    this.transactions.confirmed.push(confirmedTransfer);
    this.transactions.confirmed.push(confirmedInvoice);

    // === الخطوة 2: حذف من المنتظر ===
    this.removeFromPending(match.transferId);
    this.removeFromPending(match.invoiceId);

    // === الخطوة 3: حذف من قائمة المطابقة (مساعد أو يدوي) ===
    if (sourceList) {
      const index = sourceList.findIndex((m) => m.id === matchId);
      if (index > -1) {
        sourceList.splice(index, 1);
      }
    }

    // === الخطوة 4: تحديث حالة المطابقة ===
    match.status = 'confirmed';
    match.confirmedAt = new Date();
    match.confirmedBy = userId;

    // === الخطوة 5: تسجيل المطابقة في السجل ===
    const confirmRecord = {
      id: `confirm-${Date.now()}`,
      matchId: match.id,
      transferId: match.transferId,
      invoiceId: match.invoiceId,
      amount: match.amount,
      status: 'confirmed',
      confirmedAt: new Date(),
      confirmedBy: userId,
      matchType: match.type || 'manual',
    };

    this.matchRecords.push(confirmRecord);

    return {
      success: true,
      message: 'تم تأكيد المطابقة والنقل إلى المؤكد بنجاح',
      match,
      confirmRecord,
    };
  }

  getConfirmed() {
    return this.transactions.confirmed;
  }

  // ==================== REPORTS ====================
  getMatchingReport() {
    return {
      pending: {
        count: this.transactions.pending.length,
        total: this.transactions.pending.reduce(
          (sum, t) => sum + (t.amount || 0),
          0
        ),
      },
      assisted: {
        count: this.transactions.matched.length,
        total: this.transactions.matched.reduce(
          (sum, m) => sum + (m.amount || 0),
          0
        ),
      },
      manual: {
        count: this.transactions.manual.length,
        total: this.transactions.manual.reduce(
          (sum, m) => sum + (m.amount || 0),
          0
        ),
      },
      confirmed: {
        count: this.transactions.confirmed.length,
        total: this.transactions.confirmed.reduce(
          (sum, t) => sum + (t.amount || 0),
          0
        ),
      },
      matchRecords: this.matchRecords.length,
    };
  }

  getAllMatchRecords() {
    return this.matchRecords;
  }
}

export default Database;
