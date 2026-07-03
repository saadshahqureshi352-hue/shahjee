import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Order } from '../../types';

interface OverallSalesProps {
  orders: Order[];
}

const dispatchBreakdown = [
  { name: 'Successful Deliveries', value: 78, color: '#10b981' },
  { name: 'Returned (RTO)', value: 12, color: '#f43f5e' },
  { name: 'In Transit Hubs', value: 10, color: '#0ea5e9' }
];

export default function OverallSales({ orders }: OverallSalesProps) {
  // Analytical estimates
  const totalBookings = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'Processed' || o.status === 'Received' || o.status === 'Delivered');
  const deliveredVal = deliveredOrders.reduce((sum, o) => sum + o.codAmount, 0);

  // Total Delivery Charges
  const totalDeliveryCharges = deliveredOrders.reduce((sum, o) => sum + o.deliveryCharges, 0);

  // 4% Tax on Total Delivered Parcels Amount
  const taxVal = deliveredVal * 0.04;

  // Net Payable Amount = deliveredVal - taxVal - totalDeliveryCharges
  const netPayable = deliveredVal - taxVal - totalDeliveryCharges;

  return (
    <div className="space-y-6">
      {/* Top Header info */}
      <div>
        <h2 className="text-base font-black text-slate-800">Sales & Payout Intelligence</h2>
        <p className="text-xs text-slate-500">Track Cash-on-Delivery collections, success rates, withholding taxes, and net payable earnings.</p>
      </div>

      {/* Stats row with 4 beautiful columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Delivered Sales */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Delivered Sales</span>
            <span className="text-base font-black text-slate-800 block mt-0.5">
              Rs. {deliveredVal.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">{deliveredOrders.length} delivered parcels</span>
          </div>
        </div>

        {/* 2. Total Delivery Charges */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-sky-50 text-sky-600 shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Delivery Charges</span>
            <span className="text-base font-black text-slate-800 block mt-0.5">
              Rs. {totalDeliveryCharges.toLocaleString()}
            </span>
            <span className="text-[10px] text-sky-600 font-semibold">Charges on delivered parcels</span>
          </div>
        </div>

        {/* 3. WHT / Tax (4%) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-600 shrink-0">
            <Percent className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">WHT / Tax (4%)</span>
            <span className="text-base font-black text-rose-600 block mt-0.5">
              Rs. {taxVal.toLocaleString()}
            </span>
            <span className="text-[10px] text-rose-600 font-semibold">4% of delivered amount</span>
          </div>
        </div>

        {/* 4. Net Payable Amount */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-md flex items-center gap-3 text-white">
          <div className="p-3.5 rounded-2xl bg-teal-500/10 text-teal-400 shrink-0 border border-teal-500/20">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-black text-teal-400 uppercase block tracking-wider">Net Payable Amount</span>
            <span className="text-base font-black text-teal-300 block mt-0.5">
              Rs. {netPayable.toLocaleString()}
            </span>
            <span className="text-[9px] text-slate-400 font-bold block">Deducted: Tax & Delivery</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly sales analysis chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4">Cash-On-Delivery Collection Cycle</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { date: 'Jun 20', cod: 18000 },
                { date: 'Jun 21', cod: 25000 },
                { date: 'Jun 22', cod: 15400 },
                { date: 'Jun 23', cod: 34000 },
                { date: 'Jun 24', cod: 29000 },
                { date: 'Jun 25', cod: 42000 },
                { date: 'Jun 26', cod: 38500 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ background: '#1e293b', color: '#fff', borderRadius: '12px', border: 'none' }}
                />
                <Bar dataKey="cod" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={28}>
                  {/* Decorative gradients */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Success vs RTO PieChart panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">KPI Dispatch Status</h4>
            <p className="text-[11px] text-slate-500 mt-1">E-commerce pipeline success ratio</p>
          </div>

          <div className="h-44 flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dispatchBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {dispatchBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
            {dispatchBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-slate-600 font-semibold">{item.name}</span>
                <span className="font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
