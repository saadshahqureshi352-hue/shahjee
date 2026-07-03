import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  FileText, 
  Send, 
  Search, 
  CheckCircle, 
  Download, 
  RefreshCw, 
  TrendingDown, 
  XCircle,
  Truck,
  Printer,
  ChevronDown,
  Edit2,
  Check
} from 'lucide-react';
import { ReturnOrder } from '../../types';

interface ReturnOrdersProps {
  returns: ReturnOrder[];
  brandName: string;
}

export default function ReturnOrders({ returns: initialReturns, brandName }: ReturnOrdersProps) {
  // Use local state initialized from props so that users can actually edit and update statuses in real-time!
  const [returnOrders, setReturnOrders] = useState<ReturnOrder[]>([]);

  useEffect(() => {
    if (initialReturns) {
      setReturnOrders(initialReturns);
    }
  }, [initialReturns]);

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'RTO'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courierFilter, setCourierFilter] = useState('All');

  // Selected order for Detail Modal or Status Update Modal
  const [selectedOrder, setSelectedOrder] = useState<ReturnOrder | null>(null);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // Calculations for Metrics Row
  const totalReturnedOrders = returnOrders.length;
  const totalCodOfParcels = returnOrders.reduce((sum, r) => sum + r.cod_amount, 0);
  const deliveryChargesLost = returnOrders.reduce((sum, r) => sum + r.delivery_charges, 0);
  // Return rate: total returns / total bookings * 100. Let's mock the total bookings to be ~ 24 or calculate dynamically
  const returnRate = '4.2%';

  // Status Category filters mapping
  const statusCategories = [
    { label: 'Returned', icon: '⏳', color: 'text-amber-600 bg-amber-50' },
    { label: 'Ready to Return', icon: '📦', color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Return Confirmed', icon: '✅', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Issue Detected', icon: '⚠️', color: 'text-rose-600 bg-rose-50' },
    { label: 'In Transit', icon: '🚛', color: 'text-sky-600 bg-sky-50' },
    { label: 'Returned (Closed)', icon: '🔄', color: 'text-slate-600 bg-slate-100' }
  ];

  // Filters logic
  const filteredReturns = returnOrders.filter(r => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q || (
      r.id.toLowerCase().includes(q) || 
      r.order_id.toLowerCase().includes(q) || 
      r.tracking_no.toLowerCase().includes(q) ||
      r.customer_name.toLowerCase().includes(q)
    );

    // If active tab is RTO, only show Pending or RTO flagged ones
    const matchesTab = activeSubTab === 'all' || r.status === 'Pending' || r.status === 'Ready to Return';
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesCourier = courierFilter === 'All' || r.courier === courierFilter;

    return matchesSearch && matchesTab && matchesStatus && matchesCourier;
  });

  const exportCSV = () => {
    const header = 'Order ID,Tracking No,Customer,Courier,Return Date,Reason,COD Amount,Del. Charges,Status';
    const rows = filteredReturns.map(r => 
      [r.order_id, r.tracking_no, r.customer_name, r.courier, r.return_date, r.reason, r.cod_amount, r.delivery_charges, r.status].join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([header, ...rows].join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${brandName.replace(/\s+/g, '_')}_returns_ledger.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintLabel = (r: ReturnOrder) => {
    const win = window.open('', '_blank');
    if (!win) {
      alert('Popups are blocked by your browser. Please allow popups to view the label.');
      return;
    }
    win.document.write(`
      <html>
        <head>
          <title>RTO RETURN WAYBILL - SJC</title>
          <style>
            body { font-family: sans-serif; padding: 20px; border: 2px solid #000; max-width: 400px; margin: auto; }
            .badge { background: #e11d48; color: #fff; padding: 4px 8px; font-weight: bold; display: inline-block; font-size: 12px; margin-bottom: 10px; }
            h2 { margin: 0 0 10px 0; font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
            p { margin: 6px 0; font-size: 12px; }
            .bar { border-top: 1px dashed #000; margin: 15px 0; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="badge">REVERSE LOGISTICS (RTO)</div>
          <h2>Shah Jee Courier Services</h2>
          <p><strong>RTO Tracking #:</strong> ${r.tracking_no}</p>
          <p><strong>Original Order ID:</strong> ${r.order_id}</p>
          <p><strong>Consignee:</strong> ${r.customer_name}</p>
          <p><strong>Courier:</strong> ${r.courier}</p>
          <p><strong>Reason for RTO:</strong> ${r.reason}</p>
          <p><strong>Original COD:</strong> Rs. ${r.cod_amount.toLocaleString()}</p>
          
          <div class="bar">
            <p style="text-align:center; font-weight:bold; font-size:14px;">RETURN TO SHIPPER HUB</p>
            <p style="text-align:center; font-size:10px;">Authorized by SJC Reverse Portal. Printed on ${new Date().toLocaleDateString()}</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    setReturnOrders(prev => prev.map(r => r.id === orderId ? { ...r, status } : r));
    setShowStatusUpdateModal(false);
  };

  const handleMarkAsReturned = (orderId: string) => {
    updateOrderStatus(orderId, 'Received');
  };

  const handleCancelReturn = (orderId: string) => {
    setReturnOrders(prev => prev.filter(r => r.id !== orderId));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      {/* 1. Notice Bar */}
      <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4 animate-fade-in text-xs">
        <AlertCircle className="h-5 w-5 text-rose-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-extrabold text-rose-900">Reverse Logistics Control Center</h4>
          <p className="text-rose-700 mt-1">
            Tracking return-to-origin (RTO) parcels from TCS, Leopards, M&P, Trax, and Barqraftar. Deliveries are updated every 6 hours.
          </p>
        </div>
      </div>

      {/* 2. Metrics Row Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Returned Orders */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Returned Orders</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{totalReturnedOrders}</span>
          </div>
          <span className="text-[10px] text-indigo-600 font-extrabold mt-2 block">Active SJC Pipeline</span>
        </div>

        {/* Card 2: Total COD of Parcels */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total COD of Parcels</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">Rs. {totalCodOfParcels.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-extrabold mt-2 block">Value held in transit</span>
        </div>

        {/* Card 3: Delivery Charges Lost */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Delivery Charges Lost</span>
            <span className="text-2xl font-black text-rose-600 block mt-1">Rs. {deliveryChargesLost.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-rose-500 font-extrabold mt-2 block">Non-refundable fees</span>
        </div>

        {/* Card 4: Return Rate */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Return Rate</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{returnRate}</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-extrabold mt-2 block">-1.2% lower than national avg</span>
        </div>
      </div>

      {/* 3. Status Categories Filters Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest">Select Category Filter</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {statusCategories.map((sc) => (
            <button
              key={sc.label}
              onClick={() => setStatusFilter(sc.label === 'Returned (Closed)' ? 'Received' : sc.label === 'Returned' ? 'Pending' : sc.label)}
              className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-slate-50 transition text-left cursor-pointer"
            >
              <span className="text-sm">{sc.icon}</span>
              <div>
                <span className="text-[10px] font-black text-slate-800 block line-clamp-1">{sc.label}</span>
                <span className="text-[9px] text-slate-400">View Status</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Tabs & Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-b border-slate-200 pb-2">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`text-xs font-black pb-2 border-b-2 transition cursor-pointer ${
              activeSubTab === 'all' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            All Reverse Ledger
          </button>
          <button
            onClick={() => setActiveSubTab('RTO')}
            className={`text-xs font-black pb-2 border-b-2 transition cursor-pointer ${
              activeSubTab === 'RTO' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            RTO Returns Framework
          </button>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={exportCSV}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-indigo-200 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition text-[10px] cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 5. Return Main Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {/* Filter Toolbar */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Order ID, Tracking No, Consignee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Received">Received Hub</option>
            <option value="In Transit">In Transit</option>
            <option value="Ready to Return">Ready to Return</option>
            <option value="Return Confirmed">Return Confirmed</option>
          </select>

          <select 
            value={courierFilter}
            onChange={(e) => setCourierFilter(e.target.value)}
            className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none"
          >
            <option value="All">All Couriers</option>
            <option value="Lionex">Lionex</option>
            <option value="Run Courier">Run Courier</option>
            <option value="Leopards">Leopards</option>
            <option value="M&P">M&P</option>
            <option value="TCS">TCS</option>
            <option value="Trax">Trax</option>
            <option value="Barqraftar">Barqraftar</option>
          </select>
        </div>

        {/* Ledger Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Courier</th>
                <th className="p-4">Return Date</th>
                <th className="p-4">Reason for Return</th>
                <th className="p-4 text-right">COD Amount</th>
                <th className="p-4 text-right">Del. Charges</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-400 font-bold italic">
                    No matching return orders found.
                  </td>
                </tr>
              ) : (
                filteredReturns.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <span className="font-mono font-black text-slate-800 text-xs">{r.order_id}</span>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{r.tracking_no}</span>
                    </td>
                    <td className="p-4">
                      <div className="font-black text-slate-800">{r.customer_name}</div>
                      <div className="text-[10px] text-slate-400 font-bold mt-0.5">0321-7894012</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {r.courier}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-semibold">{r.return_date}</td>
                    <td className="p-4 text-slate-600 font-medium">{r.reason}</td>
                    <td className="p-4 text-right font-bold text-slate-900">Rs. {r.cod_amount.toLocaleString()}</td>
                    <td className="p-4 text-right text-rose-600 font-bold">Rs. {r.delivery_charges}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        r.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        r.status === 'Received' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        r.status === 'In Transit' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                        'bg-teal-50 text-teal-700 border border-teal-200'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      {/* View details */}
                      <button
                        onClick={() => {
                          setSelectedOrder(r);
                          alert(
                            `Consignee Return Info:\n` +
                            `Order ID: ${r.order_id}\n` +
                            `Tracking: ${r.tracking_no}\n` +
                            `Customer Name: ${r.customer_name}\n` +
                            `Courier Network: ${r.courier}\n` +
                            `Return Date: ${r.return_date}\n` +
                            `Reason: ${r.reason}\n` +
                            `Status: ${r.status}\n` +
                            `Estimated Charges Loss: Rs. ${r.delivery_charges}`
                          );
                        }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-lg transition"
                        title="View Details"
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </button>

                      {/* Update status */}
                      <button
                        onClick={() => {
                          setSelectedOrder(r);
                          setNewStatus(r.status);
                          setShowStatusUpdateModal(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-teal-600 border border-slate-200 hover:border-teal-200 rounded-lg transition"
                        title="Update Status"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Print Waybill Label */}
                      <button
                        onClick={() => handlePrintLabel(r)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-lg transition"
                        title="Print Return Label"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>

                      {/* Framework level controls if RTO tab */}
                      {activeSubTab === 'RTO' && (
                        <>
                          <button
                            onClick={() => handleMarkAsReturned(r.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition"
                            title="Mark as Returned"
                          >
                            <Check className="h-4.5 w-4.5 font-bold" />
                          </button>
                          <button
                            onClick={() => handleCancelReturn(r.id)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded transition"
                            title="Cancel Return"
                          >
                            <XCircle className="h-4.5 w-4.5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE STATUS MODAL */}
      {showStatusUpdateModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100">
            <div className="p-5 border-b border-slate-100 bg-slate-50 text-left">
              <h3 className="text-sm font-black text-slate-900">Update Return Status</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Order ID: {selectedOrder.order_id}</p>
            </div>

            <div className="p-5 text-left space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Select New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="Pending">Pending (Returned)</option>
                  <option value="Ready to Return">Ready to Return</option>
                  <option value="Return Confirmed">Return Confirmed</option>
                  <option value="Issue Detected">Issue Detected</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Received">Returned (Closed)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => setShowStatusUpdateModal(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => updateOrderStatus(selectedOrder.id, newStatus)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow"
                >
                  Save Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
