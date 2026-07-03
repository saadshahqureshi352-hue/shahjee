import React, { useState } from 'react';
import { 
  CreditCard, 
  PlusCircle, 
  Check, 
  Smartphone, 
  Info,
  Wallet,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Search,
  Sparkles,
  Coins,
  Receipt,
  FileText,
  BadgeAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LedgerItem {
  id: string; // TID or Order ID
  type: 'deposit' | 'deduction';
  methodOrCourier: string; // e.g. "Easypaisa", "Nayapay", "TCS", "Lionex"
  amount: number;
  date: string;
  status: 'Verified' | 'Pending' | 'Deducted';
  details: string; // e.g. "Wallet Top-up", "Order DC (LNX9820042 to Islamabad)"
}

const INITIAL_LEDGER: LedgerItem[] = [
  {
    id: '2026062799102',
    type: 'deposit',
    methodOrCourier: 'Easypaisa',
    amount: 15000,
    date: '2026-06-25',
    status: 'Verified',
    details: 'Prepaid Merchant Wallet Top-up'
  },
  {
    id: 'LNX-TRK-78401',
    type: 'deduction',
    methodOrCourier: 'Lionex',
    amount: 180,
    date: '2026-06-25',
    status: 'Deducted',
    details: 'Prepaid Shipment DC - LNX9820042 (to Islamabad)'
  },
  {
    id: 'RUN-TRK-49301',
    type: 'deduction',
    methodOrCourier: 'Run Courier',
    amount: 220,
    date: '2026-06-26',
    status: 'Deducted',
    details: 'Prepaid Shipment DC - RUN7829103 (to Karachi)'
  },
  {
    id: '2026062601938',
    type: 'deposit',
    methodOrCourier: 'Nayapay',
    amount: 5000,
    date: '2026-06-26',
    status: 'Verified',
    details: 'Prepaid Merchant Wallet Top-up'
  },
  {
    id: 'TCS-TRK-48201',
    type: 'deduction',
    methodOrCourier: 'TCS',
    amount: 250,
    date: '2026-06-26',
    status: 'Deducted',
    details: 'Prepaid Shipment DC - TCS48201 (to Peshawar)'
  },
  {
    id: 'LEO-TRK-88204',
    type: 'deduction',
    methodOrCourier: 'Leopards',
    amount: 320,
    date: '2026-06-27',
    status: 'Deducted',
    details: 'Prepaid Shipment DC - LEO48204 (to Quetta)'
  },
  {
    id: '2026062711094',
    type: 'deposit',
    methodOrCourier: 'JazzCash',
    amount: 4000,
    date: '2026-06-27',
    status: 'Pending',
    details: 'Prepaid Merchant Wallet Top-up'
  }
];

export default function NonCodPayment() {
  const [ledger, setLedger] = useState<LedgerItem[]>(() => {
    const saved = localStorage.getItem('sjc_non_cod_ledger');
    return saved ? JSON.parse(saved) : INITIAL_LEDGER;
  });

  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'deduction'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [method, setMethod] = useState('easypaisa');
  const [amountInput, setAmountInput] = useState('5000');
  const [transactionId, setTransactionId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync to local storage for realistic persistence
  const saveLedger = (newLedger: LedgerItem[]) => {
    setLedger(newLedger);
    localStorage.setItem('sjc_non_cod_ledger', JSON.stringify(newLedger));
  };

  // Calculations
  const verifiedDeposits = ledger
    .filter(item => item.type === 'deposit' && item.status === 'Verified')
    .reduce((sum, item) => sum + item.amount, 0);

  const deductions = ledger
    .filter(item => item.type === 'deduction')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalBalance = verifiedDeposits - deductions;

  const pendingAmount = ledger
    .filter(item => item.type === 'deposit' && item.status === 'Pending')
    .reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountInput || !transactionId || !senderPhone) {
      alert('Please fill out all transaction submission details.');
      return;
    }

    const numAmount = parseFloat(amountInput);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    // Add new pending deposit to ledger
    const newDeposit: LedgerItem = {
      id: transactionId,
      type: 'deposit',
      methodOrCourier: method.charAt(0).toUpperCase() + method.slice(1),
      amount: numAmount,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      details: `Prepaid Merchant Wallet Top-up (From ${senderPhone})`
    };

    const updatedLedger = [newDeposit, ...ledger];
    saveLedger(updatedLedger);

    setIsSuccess(true);
    
    // Clear Form & Close Modal with beautiful timed feedback
    setTimeout(() => {
      setIsSuccess(false);
      setShowAddPaymentModal(false);
      // Reset inputs
      setAmountInput('5000');
      setTransactionId('');
      setSenderPhone('');
    }, 3000);
  };

  // Filter ledger list
  const filteredLedger = ledger.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.methodOrCourier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' ? true : item.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-teal-600" />
            <h2 className="text-base font-black text-slate-800 uppercase tracking-tight">Non-COD Prepaid Wallet</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Buy pre-paid labels with automatic shipping charge deductions. Keep zero-COD parcels moving smoothly.
          </p>
        </div>

        <button
          onClick={() => setShowAddPaymentModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-800 text-white font-black text-xs px-5 py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-teal-600/10 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>Add Payment Reference</span>
        </button>
      </div>

      {/* Ledger Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Balance */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute right-4 top-4 bg-teal-50 p-2 rounded-xl text-teal-600 group-hover:scale-110 transition-transform">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Total Prepaid Balance</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Rs. {totalBalance.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-emerald-600 font-bold bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
            <Sparkles className="h-3 w-3" />
            <span>Active & Ready to Use</span>
          </div>
        </div>

        {/* Card 2: Pending Approval */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute right-4 top-4 bg-amber-50 p-2 rounded-xl text-amber-600 group-hover:scale-110 transition-transform">
            <Clock className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Pending Approvals</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Rs. {pendingAmount.toLocaleString()}
          </h3>
          <p className="text-[10px] text-slate-500 mt-2.5">
            TID references undergoing validation by audit team.
          </p>
        </div>

        {/* Card 3: Used Payment for Delivery Charges */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute right-4 top-4 bg-indigo-50 p-2 rounded-xl text-indigo-600 group-hover:scale-110 transition-transform">
            <Receipt className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Used for Delivery Charges (DC)</span>
          <h3 className="text-2xl font-black text-rose-600 mt-1 tracking-tight">
            Rs. {deductions.toLocaleString()}
          </h3>
          <p className="text-[10px] text-slate-500 mt-2.5">
            Deducted automatically upon Non-COD booking generation.
          </p>
        </div>
      </div>

      {/* Info Warning banner */}
      <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-4 flex items-start gap-3 text-xs text-teal-800 leading-relaxed shadow-sm">
        <Info className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold block mb-0.5 uppercase tracking-wide text-[10px]">Prepaid Label Automatic Deduction Protocol</span>
          <p className="font-medium text-teal-700">
            For items booked as <strong>Non-COD</strong> (zero cash collection at doorstep), the courier delivery charges are instantly deducted from your prepaid balance. Keep your wallet topped up to ensure uninterrupted express labels dispatch.
          </p>
        </div>
      </div>

      {/* Ledger History List Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-xl p-1 shrink-0 w-fit">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                filterType === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setFilterType('deposit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                filterType === 'deposit' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Deposits Only
            </button>
            <button
              onClick={() => setFilterType('deduction')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                filterType === 'deduction' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              DC Deductions
            </button>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search ledger by TID, Courier, details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold text-slate-700"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Transaction ID / Ref</th>
                <th className="p-4">Date</th>
                <th className="p-4">Type</th>
                <th className="p-4">Method / Channel</th>
                <th className="p-4">Description Details</th>
                <th className="p-4 text-right">Amount (PKR)</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <FileText className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700">No ledger transactions found</p>
                    <p className="text-[11px] text-slate-500">Try adjusting your filters or search criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredLedger.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* ID */}
                    <td className="p-4 font-mono font-bold text-slate-800">
                      {item.id}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-slate-500 font-semibold whitespace-nowrap">
                      {item.date}
                    </td>

                    {/* Type badge */}
                    <td className="p-4">
                      {item.type === 'deposit' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded text-[10px] border border-emerald-100 uppercase tracking-wide">
                          <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                          <span>Deposit</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 font-extrabold px-2 py-0.5 rounded text-[10px] border border-rose-100 uppercase tracking-wide">
                          <ArrowDownLeft className="h-3 w-3 text-rose-600" />
                          <span>DC Charge</span>
                        </span>
                      )}
                    </td>

                    {/* Method / Courier */}
                    <td className="p-4 font-bold text-slate-700">
                      {item.methodOrCourier}
                    </td>

                    {/* Description Details */}
                    <td className="p-4 text-slate-600 font-medium max-w-xs truncate" title={item.details}>
                      {item.details}
                    </td>

                    {/* Amount */}
                    <td className={`p-4 text-right font-black text-sm ${
                      item.type === 'deposit' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {item.type === 'deposit' ? '+' : '-'}Rs. {item.amount.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-tight ${
                        item.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'Pending' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Submission Modal Backdrop & Content */}
      <AnimatePresence>
        {showAddPaymentModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSuccess) setShowAddPaymentModal(false);
              }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Body Container */}
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-250 p-6 space-y-5"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-teal-600" />
                    <h3 className="font-black text-sm text-slate-800 uppercase tracking-wide">
                      Submit Wallet Pre-Payment
                    </h3>
                  </div>
                  {!isSuccess && (
                    <button
                      onClick={() => setShowAddPaymentModal(false)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs font-bold text-emerald-800 flex items-center gap-2.5 animate-pulse"
                  >
                    <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-extrabold text-emerald-900">Reference Reference Queued!</p>
                      <p className="font-medium text-emerald-700 mt-0.5">TID reference submitted successfully. Live audit compliance will confirm credit in 10-15 mins.</p>
                    </div>
                  </motion.div>
                )}

                {/* Step 1: Receiving Accounts instructions */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs space-y-3">
                  <h4 className="font-extrabold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                    <Smartphone className="h-4 w-4 text-teal-600" />
                    <span>Official Receiving Merchant Accounts</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-[11px] shadow-xs">
                      <p className="font-black text-slate-800">Easypaisa Merchant</p>
                      <p className="text-emerald-600 font-black text-xs mt-0.5">0319-7290092</p>
                      <p className="text-slate-400 font-semibold">Title: SHAH JEE COURIER</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-[11px] shadow-xs">
                      <p className="font-black text-slate-800">Nayapay Wallet</p>
                      <p className="text-teal-600 font-black text-xs mt-0.5">0300-1234567</p>
                      <p className="text-slate-400 font-semibold">Title: LIONEX LOGISTICS</p>
                    </div>
                  </div>
                </div>

                {/* Verification form submission */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Receiving Channel Chosen *</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        disabled={isSuccess}
                        onClick={() => setMethod('easypaisa')}
                        className={`p-2.5 text-center text-xs rounded-xl border font-black transition ${
                          method === 'easypaisa' ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        Easypaisa
                      </button>
                      <button
                        type="button"
                        disabled={isSuccess}
                        onClick={() => setMethod('jazzcash')}
                        className={`p-2.5 text-center text-xs rounded-xl border font-black transition ${
                          method === 'jazzcash' ? 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        JazzCash
                      </button>
                      <button
                        type="button"
                        disabled={isSuccess}
                        onClick={() => setMethod('nayapay')}
                        className={`p-2.5 text-center text-xs rounded-xl border font-black transition ${
                          method === 'nayapay' ? 'border-teal-500 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        Nayapay
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Pre-paid Amount (Rs) *</label>
                      <input
                        type="number"
                        required
                        disabled={isSuccess}
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-slate-800"
                        placeholder="e.g. 5000"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Sender Mobile No *</label>
                      <input
                        type="tel"
                        required
                        disabled={isSuccess}
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder="e.g. 03001234567"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Transaction Ref ID (TID) *</label>
                    <input
                      type="text"
                      required
                      disabled={isSuccess}
                      placeholder="e.g. 1920392019"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Proof Receipt Screenshot *</label>
                    <input
                      type="file"
                      required={ledger.length < 10} // Optional override if mock
                      disabled={isSuccess}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-black file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                      accept="image/*"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                    {!isSuccess && (
                      <button
                        type="button"
                        onClick={() => setShowAddPaymentModal(false)}
                        className="px-4 py-2.5 rounded-xl text-xs font-black text-slate-500 hover:bg-slate-100 transition"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSuccess}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-black text-xs py-3 rounded-xl hover:scale-102 transition shadow-md shadow-teal-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Smartphone className="h-4 w-4" />
                      <span>Submit Deposit Reference</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
