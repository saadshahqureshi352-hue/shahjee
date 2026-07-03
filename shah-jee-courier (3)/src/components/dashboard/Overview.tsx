import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { 
  Package, 
  TrendingUp, 
  Truck, 
  AlertTriangle, 
  CheckCircle, 
  ChevronRight, 
  PlusCircle, 
  FileText,
  DollarSign,
  XCircle,
  AlertCircle,
  RotateCcw,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Megaphone
} from 'lucide-react';
import { Order, ReturnOrder } from '../../types';
import { getStatusCount } from '../../utils/statusUtils';

interface OverviewProps {
  orders: Order[];
  returns: ReturnOrder[];
  setActiveTab: (tab: string) => void;
  brandName: string;
  setOrderStatusFilter?: (status: string) => void;
}

const mockTrendData = [
  { name: 'Mon', sales: 12000, bookings: 4 },
  { name: 'Tue', sales: 18500, bookings: 6 },
  { name: 'Wed', sales: 14000, bookings: 5 },
  { name: 'Thu', sales: 29000, bookings: 9 },
  { name: 'Fri', sales: 22000, bookings: 7 },
  { name: 'Sat', sales: 34000, bookings: 11 },
  { name: 'Sun', sales: 41200, bookings: 15 }
];

const courierShare = [
  { name: 'TCS', value: 35, color: '#4f46e5' },
  { name: 'Leopards', value: 30, color: '#d97706' },
  { name: 'M&P', value: 20, color: '#0d9488' },
  { name: 'Trax', value: 15, color: '#db2777' }
];

export default function Overview({ orders, returns, setActiveTab, brandName, setOrderStatusFilter }: OverviewProps) {
  // Stats calculations
  const totalShipments = orders.length;
  const transitCount = getStatusCount(orders, 'In Transit');
  const deliveredCount = getStatusCount(orders, 'Delivered');
  const rtoCount = getStatusCount(orders, 'Returned to Shipper');
  const rtoRate = totalShipments > 0 ? ((rtoCount / totalShipments) * 100).toFixed(1) : '0.0';

  // Card 1 Calculations: Total Sales (Sum of COD amount of all orders)
  const totalSales = orders.reduce((sum, o) => sum + o.codAmount, 0);

  // Status Grid counts matching the 10 requested statuses (perfectly same same counts)
  const bookedCount = getStatusCount(orders, 'Booked');
  const inProgressCount = getStatusCount(orders, 'In Transit');
  const cancelledCount = getStatusCount(orders, 'Cancelled');
  const issuedCount = getStatusCount(orders, 'Issue Detected');
  const returnedCount = getStatusCount(orders, 'Returned to Shipper');
  const lostCount = getStatusCount(orders, 'Lost');
  const reAttemptCount = getStatusCount(orders, 'Re-Attempt');
  const readyToReturnCount = getStatusCount(orders, 'Ready to Return');
  const returnConfirmedCount = getStatusCount(orders, 'Return Confirmed');

  const handleStatusClick = (statusFilterValue: string) => {
    if (setOrderStatusFilter) {
      setOrderStatusFilter(statusFilterValue);
    }
    setActiveTab('bookings');
  };

  return (
    <div className="space-y-6">
      {/* 1. CEO ANNOUNCEMENT BAR */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 px-4 py-3 border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
          </span>
          <p className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">Official Alert</span>
            CEO : <span className="text-white font-black">Saad Shah .</span>
          </p>
        </div>
        <div className="text-[10px] font-extrabold text-teal-400 tracking-wider uppercase sm:bg-slate-950/40 sm:px-2.5 sm:py-1 sm:rounded-lg sm:border sm:border-slate-800">
          Shah Jee Courier SMC Pvt Ltd
        </div>
      </div>

      {/* Top Banner Greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-4 text-white shadow-lg border border-slate-800/60">
        <div className="absolute top-0 right-0 h-24 w-24 bg-teal-500 opacity-5 blur-2xl rounded-full"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1 bg-slate-800 text-[10px] text-teal-300 font-extrabold px-2.5 py-1 rounded-full border border-slate-700 mb-2">
              🟢 Active Session
            </div>
            <h2 className="text-base font-black tracking-tight">
              Assalam-o-Alaikum, <span className="text-transparent bg-gradient-to-r from-amber-300 to-teal-300 bg-clip-text font-black">{brandName}</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Your shipping pipeline is healthy today. {transitCount} active packages are in our secure networks.
            </p>
          </div>
        </div>
      </div>

      {/* 2. MAIN GRID METRICS (Card 1 and Card 2 requested) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1 – Total Sales */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-orange-400 transition-all duration-300 hover:shadow-md relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 h-24 w-24 bg-orange-500/5 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Total Sales</h4>
              <p className="text-xs text-slate-400 font-semibold tracking-wide mt-0.5">PKR Revenue Generated</p>
            </div>
            <span className="p-3.5 rounded-2xl bg-orange-50 text-orange-600 transition-colors duration-300 group-hover:bg-orange-100">
              <DollarSign className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-6">
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Rs. {totalSales.toLocaleString()}
            </h3>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-2">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+18.4% from average pipeline</span>
            </p>
          </div>
        </div>

        {/* Card 2 – Total Orders */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-teal-400 transition-all duration-300 hover:shadow-md relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 h-24 w-24 bg-teal-500/5 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Total Orders</h4>
              <p className="text-xs text-slate-400 font-semibold tracking-wide mt-0.5">Packages Delivered</p>
            </div>
            <span className="p-3.5 rounded-2xl bg-teal-50 text-teal-600 transition-colors duration-300 group-hover:bg-teal-100">
              <Package className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-6">
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {totalShipments}
            </h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-slate-500 font-semibold">
                Delivered Parcels: <strong className="text-teal-600">{deliveredCount}</strong>
              </span>
              <span className="text-[11px] text-slate-400">
                Success rate: {((deliveredCount / Math.max(1, totalShipments)) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STATUS GRID (10 requested statuses) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Shipment Status Pipeline</h3>
            <p className="text-xs text-slate-500">Real-time status grid allocation (Click cards to view orders)</p>
          </div>
          <span className="text-[10px] bg-slate-100 px-2.5 py-1 rounded-full font-bold text-slate-500">
            10 Main Phases
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {/* Status 1: Booked */}
          <div 
            onClick={() => handleStatusClick('Booked')}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:border-orange-400 hover:bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 select-none group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800">Booked</span>
              <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-200 transition-colors">
                <PlusCircle className="h-4 w-4" />
              </span>
            </div>
            <h4 className="text-xl font-black text-slate-800 mt-2">{bookedCount}</h4>
          </div>

          {/* Status 2: In Progress */}
          <div 
            onClick={() => handleStatusClick('In Transit')}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-400 hover:bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 select-none group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800">In Progress</span>
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                <Truck className="h-4 w-4" />
              </span>
            </div>
            <h4 className="text-xl font-black text-slate-800 mt-2">{inProgressCount}</h4>
          </div>

          {/* Status 3: Delivered */}
          <div 
            onClick={() => handleStatusClick('Delivered')}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-400 hover:bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 select-none group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800">Delivered</span>
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200 transition-colors">
                <CheckCircle className="h-4 w-4" />
              </span>
            </div>
            <h4 className="text-xl font-black text-slate-800 mt-2">{deliveredCount}</h4>
          </div>

          {/* Status 4: Cancelled */}
          <div 
            onClick={() => handleStatusClick('Cancelled')}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:border-rose-400 hover:bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 select-none group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800">Cancelled</span>
              <span className="p-1.5 rounded-lg bg-rose-100 text-rose-600 group-hover:bg-rose-200 transition-colors">
                <XCircle className="h-4 w-4" />
              </span>
            </div>
            <h4 className="text-xl font-black text-slate-800 mt-2">{cancelledCount}</h4>
          </div>

          {/* Status 5: Issued */}
          <div 
            onClick={() => handleStatusClick('Issue Detected')}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-400 hover:bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 select-none group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800">Issued</span>
              <span className="p-1.5 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors">
                <FileText className="h-4 w-4" />
              </span>
            </div>
            <h4 className="text-xl font-black text-slate-800 mt-2">{issuedCount}</h4>
          </div>

          {/* Status 6: Returned */}
          <div 
            onClick={() => handleStatusClick('Returned to Shipper')}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:border-yellow-600 hover:bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 select-none group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800">Returned</span>
              <span className="p-1.5 rounded-lg bg-yellow-100 text-yellow-700 group-hover:bg-yellow-200 transition-colors">
                <RotateCcw className="h-4 w-4" />
              </span>
            </div>
            <h4 className="text-xl font-black text-slate-800 mt-2">{returnedCount}</h4>
          </div>

          {/* Status 7: Lost */}
          <div 
            onClick={() => handleStatusClick('Lost')}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-400 hover:bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 select-none group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800">Lost</span>
              <span className="p-1.5 rounded-lg bg-slate-200 text-slate-700 group-hover:bg-slate-300 transition-colors">
                <AlertTriangle className="h-4 w-4" />
              </span>
            </div>
            <h4 className="text-xl font-black text-slate-800 mt-2">{lostCount}</h4>
          </div>

          {/* Status 8: ReAttempt */}
          <div 
            onClick={() => handleStatusClick('Re-Attempt')}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:border-cyan-400 hover:bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 select-none group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800">ReAttempt</span>
              <span className="p-1.5 rounded-lg bg-cyan-100 text-cyan-600 group-hover:bg-cyan-200 transition-colors">
                <RefreshCw className="h-4 w-4" />
              </span>
            </div>
            <h4 className="text-xl font-black text-slate-800 mt-2">{reAttemptCount}</h4>
          </div>

          {/* Status 9: ready to return */}
          <div 
            onClick={() => handleStatusClick('Ready to Return')}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:border-fuchsia-400 hover:bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 select-none group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 capitalize group-hover:text-slate-800">Ready to Return</span>
              <span className="p-1.5 rounded-lg bg-fuchsia-100 text-fuchsia-600 group-hover:bg-fuchsia-200 transition-colors">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
            <h4 className="text-xl font-black text-slate-800 mt-2">{readyToReturnCount}</h4>
          </div>

          {/* Status 10: return confirmed */}
          <div 
            onClick={() => handleStatusClick('Return Confirmed')}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:border-teal-400 hover:bg-white cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 select-none group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 capitalize group-hover:text-slate-800">Return Confirmed</span>
              <span className="p-1.5 rounded-lg bg-teal-100 text-teal-600 group-hover:bg-teal-200 transition-colors">
                <ShieldCheck className="h-4 w-4" />
              </span>
            </div>
            <h4 className="text-xl font-black text-slate-800 mt-2">{returnConfirmedCount}</h4>
          </div>
        </div>
      </div>

      {/* Analytics Visualizer & Recharts split panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Trend AreaChart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-black text-slate-800">E-Commerce Sales Velocity</h4>
              <p className="text-[11px] text-slate-500">Shipper daily performance trend</p>
            </div>
            <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-1 rounded-md">
              Current Cycle
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrendData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Courier performance breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-black text-slate-800">Courier Grid Allocation</h4>
            <p className="text-[11px] text-slate-500">3PL dispatch percentage</p>
          </div>

          <div className="relative h-44 my-2 flex items-center justify-center">
            {/* Legend breakdown list */}
            <div className="w-full space-y-2 mt-4">
              {courierShare.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                     <span className="h-3 w-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-500">{item.value}% allocation</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 text-center">
            <button 
              onClick={() => setActiveTab('bookings')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
            >
              <span>View All Dispatch Details</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
