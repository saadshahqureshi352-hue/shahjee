import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Check, 
  Calendar,
  X,
  CreditCard,
  CheckCircle2,
  Clock,
  HelpCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Coins,
  Package,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Invoice } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

const AUGMENTED_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-0421',
    date: '2026-06-25',
    billingPeriod: '2026-06-18 to 2026-06-24',
    ordersCount: 14,
    totalCod: 58400,
    charges: 2950,
    netPayout: '55,450',
    status: 'Paid',
  },
  {
    id: 'INV-2026-0410',
    date: '2026-06-18',
    billingPeriod: '2026-06-11 to 2026-06-17',
    ordersCount: 8,
    totalCod: 31200,
    charges: 1840,
    netPayout: '29,360',
    status: 'Paid',
  },
  {
    id: 'INV-2026-0399',
    date: '2026-06-11',
    billingPeriod: '2026-06-04 to 2026-06-10',
    ordersCount: 19,
    totalCod: 84300,
    charges: 4200,
    netPayout: '80,100',
    status: 'Paid',
  },
  {
    id: 'INV-2026-0435',
    date: '2026-06-26',
    billingPeriod: '2026-06-25 to 2026-06-26',
    ordersCount: 3,
    totalCod: 13500,
    charges: 550,
    netPayout: '12,950',
    status: 'Processing',
  },
  {
    id: 'INV-2026-0440',
    date: '2026-06-27',
    billingPeriod: '2026-06-26 to 2026-06-27',
    ordersCount: 3,
    totalCod: 24800,
    charges: 900,
    netPayout: '23,900',
    status: 'On Hold', // Displays as Ready to Pay / On Hold
  }
];

const INVOICE_ORDERS: Record<string, any[]> = {
  'INV-2026-0421': [
    { id: 'LNX9820042', trackingNo: 'LNX-TRK-78401', customerName: 'Muhammad Salman', destinationCity: 'Islamabad', codAmount: 14500, courier: 'Lionex', status: 'Delivered', productDescription: 'Shah Jee Premium Peshawari Chappal' },
    { id: 'RUN7829103', trackingNo: 'RUN-TRK-49301', customerName: 'Aisha Khan', destinationCity: 'Karachi', codAmount: 8200, courier: 'Run Courier', status: 'Delivered', productDescription: 'Wireless Ergonomic Keyboard' },
    { id: 'SJC48201', trackingNo: 'TCS-TRK-48201', customerName: 'Dania Baig', destinationCity: 'Karachi', codAmount: 3800, courier: 'TCS', status: 'Delivered', productDescription: 'Summer Linen Kurta Collection' },
    { id: 'LEO48204', trackingNo: 'LEO-TRK-88204', customerName: 'Farhan Ahmed', destinationCity: 'Lahore', codAmount: 16500, courier: 'Leopards', status: 'Delivered', productDescription: 'Smart Fitness Band Pro' },
    { id: 'TRX12903', trackingNo: 'TRX-TRK-12903', customerName: 'Zainab Bibi', destinationCity: 'Peshawar', codAmount: 15400, courier: 'Trax', status: 'Delivered', productDescription: 'Leather Handbag Gold Series' }
  ],
  'INV-2026-0410': [
    { id: 'LNX38291', trackingNo: 'LNX-TRK-38291', customerName: 'Bilal Saeed', destinationCity: 'Rawalpindi', codAmount: 12900, courier: 'Lionex', status: 'Delivered', productDescription: 'Men Casual Denim Shirt' },
    { id: 'RUN10294', trackingNo: 'RUN-TRK-10294', customerName: 'Sania Mirza', destinationCity: 'Faisalabad', codAmount: 14500, courier: 'Run Courier', status: 'Delivered', productDescription: 'Active Noise Cancelling Buds' },
    { id: 'TRX99201', trackingNo: 'TRX-TRK-99201', customerName: 'Hamza Ali', destinationCity: 'Multan', codAmount: 3800, courier: 'Trax', status: 'Delivered', productDescription: 'Orthopedic Seat Cushion' }
  ],
  'INV-2026-0399': [
    { id: 'LEO22839', trackingNo: 'LEO-TRK-22839', customerName: 'Khurram Shahzad', destinationCity: 'Sialkot', codAmount: 27800, courier: 'Leopards', status: 'Delivered', productDescription: 'Pro Leather Football Size 5' },
    { id: 'TCS77123', trackingNo: 'TCS-TRK-77123', customerName: 'Mehak Fatima', destinationCity: 'Gujranwala', codAmount: 25400, courier: 'TCS', status: 'Delivered', productDescription: '100% Organic Saffron Extract' },
    { id: 'LNX55291', trackingNo: 'LNX-TRK-55291', customerName: 'Ahsan Khan', destinationCity: 'Islamabad', codAmount: 31100, courier: 'Lionex', status: 'Delivered', productDescription: 'Mechanical Gaming Keyboard RGB' }
  ],
  'INV-2026-0435': [
    { id: 'RUN33821', trackingNo: 'RUN-TRK-33821', customerName: 'Zafar Iqbal', destinationCity: 'Karachi', codAmount: 4500, courier: 'Run Courier', status: 'In Transit', productDescription: 'Anti-Theft Laptop Backpack' },
    { id: 'TRX44721', trackingNo: 'TRX-TRK-44721', customerName: 'Danish Khan', destinationCity: 'Lahore', codAmount: 3200, courier: 'Trax', status: 'Pending', productDescription: 'Stainless Steel Water Flask 1L' },
    { id: 'BRQ99021', trackingNo: 'BRQ-TRK-99021', customerName: 'Rida Zehra', destinationCity: 'Rawalpindi', codAmount: 5800, courier: 'Barqraftar', status: 'Booked', productDescription: 'LED Ring Light with Tripod Stand' }
  ],
  'INV-2026-0440': [
    { id: 'TCS10292', trackingNo: 'TCS-TRK-10292', customerName: 'Amna Sheikh', destinationCity: 'Karachi', codAmount: 12400, courier: 'TCS', status: 'Delivered', productDescription: 'Bridal Mehndi Henna Kit' },
    { id: 'LNX44122', trackingNo: 'LNX-TRK-44122', customerName: 'Yaseen Malik', destinationCity: 'Lahore', codAmount: 12400, courier: 'Lionex', status: 'Delivered', productDescription: 'Cotton Slim-Fit Chinos' }
  ]
};

interface InvoicesProps {
  invoices: Invoice[];
}

export default function Invoices({ invoices: originalInvoices }: InvoicesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  // We use our enriched set of invoices which contains 'On Hold' for realistic Ready to Pay simulation
  const targetInvoices = AUGMENTED_INVOICES;

  // Calculate Aggregates
  const totalCodValue = targetInvoices.reduce((sum, inv) => sum + inv.totalCod, 0);
  const paidCodValue = targetInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.totalCod, 0);
  const unpaidCodValue = targetInvoices.filter(inv => inv.status === 'Processing').reduce((sum, inv) => sum + inv.totalCod, 0);
  const readyToPayCodValue = targetInvoices.filter(inv => inv.status === 'On Hold').reduce((sum, inv) => sum + inv.totalCod, 0);

  // Date filter logic (check both direct match and billing period inclusion)
  const matchesDate = (inv: Invoice, dateStr: string) => {
    if (!dateStr) return true;
    if (inv.date === dateStr) return true;
    
    try {
      const parts = inv.billingPeriod.split(' to ');
      if (parts.length === 2) {
        const start = new Date(parts[0]);
        const end = new Date(parts[1]);
        const selected = new Date(dateStr);
        return selected >= start && selected <= end;
      }
    } catch (e) {
      // Fail-safe
    }
    return false;
  };

  // Filter invoices list
  const filteredInvoices = targetInvoices.filter(inv => {
    const matchesSearch = inv.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.billingPeriod.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDt = matchesDate(inv, selectedDate);
    
    let matchesStatus = true;
    if (statusFilter === 'Paid') {
      matchesStatus = inv.status === 'Paid';
    } else if (statusFilter === 'Processing') {
      matchesStatus = inv.status === 'Processing';
    } else if (statusFilter === 'On Hold') {
      matchesStatus = inv.status === 'On Hold';
    }

    return matchesSearch && matchesDt && matchesStatus;
  });

  const handlePrintInvoice = (inv: Invoice) => {
    const win = window.open('', '_blank');
    if (!win) {
      alert('Popups are blocked by your browser. Please allow popups to view the invoice.');
      return;
    }
    
    const ordersListHtml = (INVOICE_ORDERS[inv.id] || []).map(o => `
      <tr>
        <td>${o.trackingNo}</td>
        <td>${o.customerName}</td>
        <td>${o.destinationCity}</td>
        <td>${o.courier}</td>
        <td>${o.productDescription}</td>
        <td style="text-align:right;">Rs. ${o.codAmount.toLocaleString()}</td>
      </tr>
    `).join('');

    win.document.write(`
      <html>
        <head>
          <title>Invoice - ${inv.id}</title>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #333; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #ddd; padding-bottom: 20px; }
            .invoice-title { font-size: 24px; font-weight: 900; color: #0f172a; }
            .meta { margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 13px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 30px; font-size: 13px; }
            .table th, .table td { border-bottom: 1px solid #eee; padding: 12px; text-align: left; }
            .table th { background: #f8fafc; font-weight: bold; color: #475569; }
            .total-section { margin-top: 30px; text-align: right; font-size: 15px; }
            .net-pay { font-size: 20px; font-weight: 900; color: #0d9488; margin-top: 10px; }
            .footer { margin-top: 80px; text-align: center; font-size: 11px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="invoice-title">SHAH JEE COURIER NETWORK</div>
              <p style="font-size:12px;color:#666;margin: 4px 0 0 0;">Integrated 3PL Merchant Logistics Portal</p>
            </div>
            <div style="text-align:right;">
              <strong>INVOICE:</strong> ${inv.id}<br>
              <strong>Settlement Date:</strong> ${inv.date}
            </div>
          </div>
          
          <div class="meta">
            <div>
              <strong>BILLING TO:</strong><br>
              Registered Shah Jee Store Merchant<br>
              Warehouse Dispatch Hub
            </div>
            <div>
              <strong>BILLING PERIOD:</strong><br>
              ${inv.billingPeriod}<br>
              <strong>Invoice Status:</strong> <span style="color:#0d9488;font-weight:bold;">${inv.status}</span>
            </div>
          </div>

          <h3 style="margin-top: 40px; margin-bottom: 10px; font-size: 15px; border-bottom: 1px solid #eee; padding-bottom: 8px;">SETTLED SHIPMENTS LIST</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Customer Name</th>
                <th>City</th>
                <th>3PL Partner</th>
                <th>Product Detail</th>
                <th style="text-align:right;">COD Collected</th>
              </tr>
            </thead>
            <tbody>
              ${ordersListHtml || '<tr><td colspan="6" style="text-align:center;color:#999;">Bulk shipment breakdown consolidated</td></tr>'}
            </tbody>
          </table>
          
          <div class="total-section">
            <div><strong>Collected COD Subtotal:</strong> Rs. ${inv.totalCod.toLocaleString()}</div>
            <div><strong>Service Deductions (Fees):</strong> Rs. ${inv.charges.toLocaleString()}</div>
            <div class="net-pay">NET BANK DISBURSEMENT: Rs. ${inv.netPayout}</div>
          </div>

          <div class="footer">
            Thank you for utilizing Shah Jee Courier Portal. This is a secure computer-generated bank disbursement invoice statement.
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const renderCourierBadge = (courier: string) => {
    switch (courier) {
      case 'TCS':
        return (
          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 font-extrabold px-2 py-0.5 rounded text-[10px] border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            TCS Express
          </span>
        );
      case 'Leopards':
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 font-extrabold px-2 py-0.5 rounded text-[10px] border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Leopards Courier
          </span>
        );
      case 'M&P':
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded text-[10px] border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            M&P Express
          </span>
        );
      case 'Trax':
        return (
          <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-800 font-extrabold px-2 py-0.5 rounded text-[10px] border border-zinc-200">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
            Trax Logistics
          </span>
        );
      case 'Barqraftar':
        return (
          <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 font-extrabold px-2 py-0.5 rounded text-[10px] border border-teal-200">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            Barqraftar⚡
          </span>
        );
      case 'Lionex':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded text-[10px] border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Lionex 3PL
          </span>
        );
      case 'Run Courier':
        return (
          <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 font-extrabold px-2 py-0.5 rounded text-[10px] border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
            Run Courier
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 font-extrabold px-2 py-0.5 rounded text-[10px] border border-slate-200">
            {courier}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper Title Area */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-600" />
            <h2 className="text-base font-black text-slate-800 uppercase tracking-tight">
              My COD Invoices & Payments
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            View breakdown summaries and dispatches connected directly with previous settlements.
          </p>
        </div>
        
        {/* Filters Group: Search + Calendar Box */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-stretch lg:self-auto">
          {/* Calendar Box */}
          <div className="relative flex-1 sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Calendar className="h-4 w-4" />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSearchTerm(''); // clear search term to prioritize date selection
              }}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-slate-700 cursor-pointer shadow-sm hover:border-slate-300 transition-colors"
              title="Select settlement or billing date to filter"
            />
            {selectedDate && (
              <button 
                onClick={() => setSelectedDate('')}
                className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-full transition"
                title="Clear date filter"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Invoice ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm font-semibold"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-full transition"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Interactive Metric Buttons (Stats Tiles) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total COD Amount */}
        <motion.button
          whileHover={{ scale: 1.015, translateY: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => setStatusFilter(null)}
          className={`relative text-left p-4 rounded-2xl border transition-all duration-300 shadow-sm cursor-pointer overflow-hidden group ${
            statusFilter === null 
              ? 'bg-gradient-to-br from-slate-900 to-slate-850 border-slate-900 text-white ring-4 ring-slate-900/10' 
              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="absolute right-3 top-3 opacity-15 group-hover:scale-110 transition-transform duration-300">
            <Coins className="h-10 w-10 text-indigo-400" />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-wider ${statusFilter === null ? 'text-indigo-300' : 'text-slate-400'}`}>
            Total COD Amount
          </span>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-black tracking-tight">Rs. {totalCodValue.toLocaleString()}</span>
          </div>
          <p className={`text-[10px] mt-1 ${statusFilter === null ? 'text-slate-300' : 'text-slate-500'}`}>
            {statusFilter === null ? '● Currently viewing all' : 'Click to view all invoices'}
          </p>
        </motion.button>

        {/* Metric 2: Paid Amount */}
        <motion.button
          whileHover={{ scale: 1.015, translateY: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => setStatusFilter('Paid')}
          className={`relative text-left p-4 rounded-2xl border transition-all duration-300 shadow-sm cursor-pointer overflow-hidden group ${
            statusFilter === 'Paid' 
              ? 'bg-gradient-to-br from-emerald-900 to-emerald-800 border-emerald-950 text-white ring-4 ring-emerald-600/20' 
              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="absolute right-3 top-3 opacity-15 group-hover:scale-110 transition-transform duration-300">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-wider ${statusFilter === 'Paid' ? 'text-emerald-300' : 'text-slate-400'}`}>
            Paid Amount (Cleared)
          </span>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-black tracking-tight">Rs. {paidCodValue.toLocaleString()}</span>
          </div>
          <p className={`text-[10px] mt-1 ${statusFilter === 'Paid' ? 'text-emerald-100' : 'text-slate-500'}`}>
            {statusFilter === 'Paid' ? '● Paid filter active' : 'Click to filter Paid'}
          </p>
        </motion.button>

        {/* Metric 3: Unpaid Amount */}
        <motion.button
          whileHover={{ scale: 1.015, translateY: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => setStatusFilter('Processing')}
          className={`relative text-left p-4 rounded-2xl border transition-all duration-300 shadow-sm cursor-pointer overflow-hidden group ${
            statusFilter === 'Processing' 
              ? 'bg-gradient-to-br from-amber-650 to-amber-550 border-amber-600 text-white ring-4 ring-amber-500/20' 
              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="absolute right-3 top-3 opacity-15 group-hover:scale-110 transition-transform duration-300">
            <Clock className="h-10 w-10 text-amber-400" />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-wider ${statusFilter === 'Processing' ? 'text-amber-200' : 'text-slate-400'}`}>
            Unpaid / Processing
          </span>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-black tracking-tight">Rs. {unpaidCodValue.toLocaleString()}</span>
          </div>
          <p className={`text-[10px] mt-1 ${statusFilter === 'Processing' ? 'text-amber-50' : 'text-slate-500'}`}>
            {statusFilter === 'Processing' ? '● Unpaid filter active' : 'Click to filter Processing'}
          </p>
        </motion.button>

        {/* Metric 4: Ready to Pay */}
        <motion.button
          whileHover={{ scale: 1.015, translateY: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => setStatusFilter('On Hold')}
          className={`relative text-left p-4 rounded-2xl border transition-all duration-300 shadow-sm cursor-pointer overflow-hidden group ${
            statusFilter === 'On Hold' 
              ? 'bg-gradient-to-br from-teal-900 to-teal-800 border-teal-950 text-white ring-4 ring-teal-500/20' 
              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="absolute right-3 top-3 opacity-15 group-hover:scale-110 transition-transform duration-300">
            <TrendingUp className="h-10 w-10 text-teal-400" />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-wider ${statusFilter === 'On Hold' ? 'text-teal-300' : 'text-slate-400'}`}>
            Ready to Pay
          </span>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-black tracking-tight">Rs. {readyToPayCodValue.toLocaleString()}</span>
          </div>
          <p className={`text-[10px] mt-1 ${statusFilter === 'On Hold' ? 'text-teal-100' : 'text-slate-500'}`}>
            {statusFilter === 'On Hold' ? '● Ready to pay active' : 'Click to filter Ready to Pay'}
          </p>
        </motion.button>
      </div>

      {/* Quick filters overview / Reset indicator */}
      {(statusFilter || selectedDate) && (
        <div className="flex items-center justify-between bg-teal-50/50 border border-teal-100 px-4 py-2.5 rounded-xl text-xs text-teal-800">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span>
              Active Filter: {statusFilter ? `[Status: ${statusFilter === 'On Hold' ? 'Ready to Pay' : statusFilter}]` : ''} 
              {selectedDate ? ` [Date/Period: ${selectedDate}]` : ''}
              {` (${filteredInvoices.length} invoices found)`}
            </span>
          </div>
          <button 
            onClick={() => {
              setStatusFilter(null);
              setSelectedDate('');
            }}
            className="flex items-center gap-1 font-bold text-red-600 hover:text-red-700 hover:underline transition"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* Invoice Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4 w-12"></th>
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Settled Date</th>
                <th className="p-4">Billing Statement Period</th>
                <th className="p-4 text-center">Settled Bookings</th>
                <th className="p-4 text-right">Collected COD Value</th>
                <th className="p-4 text-right">3PL Service Fees</th>
                <th className="p-4 text-right">Disbursed Net Payout</th>
                <th className="p-4 text-center">Settlement Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center">
                    <div className="max-w-md mx-auto space-y-2">
                      <HelpCircle className="h-8 w-8 text-slate-300 mx-auto" />
                      <p className="font-bold text-slate-700 text-sm">No settled invoices found</p>
                      <p className="text-xs text-slate-500">
                        No record matches your search. Try picking another date or clear active filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isExpanded = expandedInvoiceId === inv.id;
                  const orders = INVOICE_ORDERS[inv.id] || [];

                  return (
                    <React.Fragment key={inv.id}>
                      {/* Main Row */}
                      <tr className={`hover:bg-slate-50/50 transition-colors ${isExpanded ? 'bg-indigo-50/30' : ''}`}>
                        {/* Expand Button Column */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setExpandedInvoiceId(isExpanded ? null : inv.id)}
                            className="p-1 hover:bg-slate-200/60 rounded transition text-slate-500"
                            title={isExpanded ? "Hide detailed parcels" : "Show detailed parcels"}
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4 text-teal-600" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </td>
                        
                        {/* Invoice ID */}
                        <td className="p-4 font-bold text-teal-800">
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-4 w-4 text-slate-400" />
                            <span>{inv.id}</span>
                          </div>
                        </td>

                        {/* Settled Date */}
                        <td className="p-4 font-semibold text-slate-500">{inv.date}</td>

                        {/* Statement period */}
                        <td className="p-4 font-semibold text-slate-600">{inv.billingPeriod}</td>
                        
                        {/* Bookings Count */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setExpandedInvoiceId(isExpanded ? null : inv.id)}
                            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full text-[11px] font-black text-slate-700 transition"
                            title="Click to view detailed parcels below"
                          >
                            <Package className="h-3 w-3 text-slate-500" />
                            <span>{inv.ordersCount} Parcels</span>
                            <ArrowRight className="h-2.5 w-2.5 ml-0.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </td>

                        {/* COD amount */}
                        <td className="p-4 text-right font-black text-slate-900">Rs. {inv.totalCod.toLocaleString()}</td>
                        
                        {/* Deductions */}
                        <td className="p-4 text-right text-rose-600 font-bold">Rs. {inv.charges.toLocaleString()}</td>
                        
                        {/* Payout */}
                        <td className="p-4 text-right font-black text-emerald-700">Rs. {inv.netPayout}</td>
                        
                        {/* Status badge */}
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight ${
                            inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                            inv.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                            'bg-teal-50 text-teal-700 border border-teal-200' // On Hold / Ready to Pay
                          }`}>
                            {inv.status === 'On Hold' ? 'Ready to Pay' : inv.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handlePrintInvoice(inv)}
                            className="p-1.5 text-slate-500 hover:text-teal-600 border border-slate-200 hover:border-teal-200 rounded-lg transition hover:bg-teal-50"
                            title="Download Invoice PDF"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Shipment Details with beautiful motion height and opacity */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={10} className="p-0 bg-slate-50/70 border-t border-b border-slate-100">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="p-6">
                                <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
                                  {/* Header inside accordion */}
                                  <div className="bg-slate-900 px-4 py-3 text-white flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Package className="h-4.5 w-4.5 text-teal-400" />
                                      <span className="font-extrabold text-xs tracking-wider uppercase">
                                        Shipments Details for {inv.id} ({orders.length} of {inv.ordersCount} listed below)
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-300">
                                      Settlement Date: {inv.date}
                                    </span>
                                  </div>

                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                      <thead>
                                        <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                          <th className="p-3">Order Code</th>
                                          <th className="p-3">Tracking Reference</th>
                                          <th className="p-3">Customer Details</th>
                                          <th className="p-3">Destination City</th>
                                          <th className="p-3">3PL Dispatch Courier</th>
                                          <th className="p-3">Product Name</th>
                                          <th className="p-3 text-right">COD Value (PKR)</th>
                                          <th className="p-3 text-center">Status</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100">
                                        {orders.map((o) => (
                                          <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3 font-bold text-slate-700">{o.id}</td>
                                            <td className="p-3 font-mono font-semibold text-teal-800">{o.trackingNo}</td>
                                            <td className="p-3">
                                              <span className="font-bold block text-slate-800">{o.customerName}</span>
                                            </td>
                                            <td className="p-3 font-semibold text-slate-600">{o.destinationCity}</td>
                                            <td className="p-3">{renderCourierBadge(o.courier)}</td>
                                            <td className="p-3 text-slate-500 max-w-xs truncate" title={o.productDescription}>
                                              {o.productDescription}
                                            </td>
                                            <td className="p-3 text-right font-black text-slate-900">Rs. {o.codAmount.toLocaleString()}</td>
                                            <td className="p-3 text-center">
                                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                                                o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                                                o.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                                                o.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                                'bg-indigo-50 text-indigo-700'
                                              }`}>
                                                {o.status}
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>

                                  {/* Subfooter */}
                                  <div className="bg-slate-50 px-4 py-3 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200">
                                    <span>* Settlement covers successful shipments delivered and acknowledged in billing cycle.</span>
                                    <span className="font-bold text-slate-700">Total Listed COD: Rs. {orders.reduce((s, x) => s + x.codAmount, 0).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
