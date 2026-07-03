import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck, 
  UserCheck, 
  ArrowRight,
  ShieldAlert,
  Calendar,
  RefreshCw,
  Cpu,
  Info,
  ExternalLink,
  Sparkles,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../../types';
import { fetchLiveTracking, TrackingCheckpoint } from '../../utils/courierApi';

interface TrackingSystemProps {
  orders: Order[];
  searchTermFromHeader?: string;
  onClearHeaderSearch?: () => void;
}

export default function TrackingSystem({ orders, searchTermFromHeader = '', onClearHeaderSearch }: TrackingSystemProps) {
  const [trackQuery, setTrackQuery] = useState(searchTermFromHeader || 'LNX982042');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Advanced Live Tracking State
  const [checkpoints, setCheckpoints] = useState<TrackingCheckpoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiSource, setApiSource] = useState<'live_api' | 'simulated_api' | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<string>('Trax');
  const [customTrack, setCustomTrack] = useState<boolean>(false);

  // Auto-detect courier based on input prefix or format
  const detectCourierAndSearch = (query: string) => {
    const q = query.trim().toUpperCase();
    
    // First, look in our synchronized local orders database
    const localOrder = orders.find(o => 
      o.id.toUpperCase() === q || 
      (o.trackingNo && o.trackingNo.toUpperCase() === q)
    );

    if (localOrder) {
      setSelectedOrder(localOrder);
      setSelectedCourier(localOrder.courier);
      setCustomTrack(false);
      return { order: localOrder, courier: localOrder.courier, custom: false };
    }

    // If not found in local orders, try auto-detecting courier style for external shipments
    let detected = 'Trax';
    if (q.startsWith('LNX') || q.startsWith('TRX')) {
      detected = 'Trax';
    } else if (q.startsWith('LEO') || q.startsWith('LPD') || q.startsWith('5')) {
      detected = 'Leopards';
    } else if (q.startsWith('TCS') || q.startsWith('7') || q.startsWith('1')) {
      detected = 'TCS';
    } else if (q.startsWith('MP') || q.startsWith('8')) {
      detected = 'M&P';
    } else if (q.startsWith('BRQ') || q.startsWith('BARQ')) {
      detected = 'BarqRaftar';
    }
    
    setSelectedOrder(null);
    setSelectedCourier(detected);
    setCustomTrack(true);
    return { order: null, courier: detected, custom: true };
  };

  const performTracking = async (queryStr: string) => {
    const q = queryStr.trim();
    if (!q) return;

    setIsLoading(true);
    
    // Auto detect courier and local order state
    const { order, courier } = detectCourierAndSearch(q);
    
    try {
      // Fetch live data from courier APIs (uses keys stored in localStorage settings)
      const res = await fetchLiveTracking(courier, q, order?.destinationCity || 'Lahore');
      
      if (res.success) {
        setCheckpoints(res.checkpoints);
        setApiSource(res.source);
        
        // If we found a local order but its status is different, we can synchronize it
        if (order) {
          setSelectedOrder({
            ...order,
            status: res.status as any
          });
        }
      } else {
        setCheckpoints([]);
        setApiSource(null);
      }
    } catch (e) {
      console.error('Error fetching tracking:', e);
      setCheckpoints([]);
      setApiSource(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Run automatically on mount or when header search triggers
  useEffect(() => {
    if (searchTermFromHeader) {
      setTrackQuery(searchTermFromHeader);
      performTracking(searchTermFromHeader);
      if (onClearHeaderSearch) {
        onClearHeaderSearch();
      }
    } else {
      // Trigger a default track view on load for visual demo
      performTracking(trackQuery);
    }
  }, [searchTermFromHeader]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performTracking(trackQuery);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-left"
      >
        <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 border border-teal-200/50 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider mb-2">
          <Sparkles className="h-3 w-3 text-teal-600 animate-pulse" />
          <span>Live API Core Connected</span>
        </div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Multi-Courier Tracking System</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Queries active integration routes. Tracks real-time milestones for Trax, Leopards, TCS, M&P, and BarqRaftar directly.
        </p>
      </motion.div>

      {/* Input query box */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
      >
        <form onSubmit={handleTrackSubmit} className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="h-4.5 w-4.5 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Consignment or Tracking ID (e.g. LNX982042, TCS09204)..."
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-bold transition-all focus:bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer hover:scale-[1.02] active:scale-98 transition duration-200 flex items-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Querying...' : 'Track'}</span>
            </button>
          </div>

          {/* Quick Filter Pill Auto Detection / Manual override */}
          <div className="flex items-center gap-2 flex-wrap text-[10px] font-bold text-slate-500 pt-1">
            <span>Query Target Courier:</span>
            {['Trax', 'Leopards', 'TCS', 'M&P', 'BarqRaftar'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setSelectedCourier(c);
                  performTracking(trackQuery);
                }}
                className={`px-2.5 py-1 rounded-lg border transition ${
                  selectedCourier === c
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </form>
      </motion.div>

      {/* Main Results View */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm space-y-4"
          >
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border-4 border-teal-100 animate-pulse"></span>
              <RefreshCw className="h-8 w-8 text-teal-500 animate-spin" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">Fetching Live Courier Stream</p>
              <p className="text-xs text-slate-400 mt-1">Connecting to {selectedCourier} API gateway routes...</p>
            </div>
          </motion.div>
        ) : checkpoints.length > 0 ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Left panel: Shipment metadata card */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 text-left">
                <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
                  <div>
                    <span className="text-[9px] font-black uppercase text-slate-400">Tracking Code</span>
                    <h3 className="text-sm font-black text-teal-800 font-mono mt-0.5">{trackQuery.toUpperCase()}</h3>
                  </div>
                  {/* API Source Indicator */}
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                    apiSource === 'live_api'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200/40'
                  }`}>
                    {apiSource === 'live_api' ? (
                      <>
                        <Database className="h-2 w-2" />
                        <span>Live Key API</span>
                      </>
                    ) : (
                      <>
                        <Cpu className="h-2 w-2 animate-pulse" />
                        <span>Simulated API</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Consignee Customer</span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {selectedOrder ? selectedOrder.customerName : 'General Consignee Packet'}
                    </span>
                    <span className="text-slate-400 font-medium block">
                      {selectedOrder ? selectedOrder.customerPhone : 'No contact recorded'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Destination Area</span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {selectedOrder ? selectedOrder.destinationCity : 'Pakistan Terminal'}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate max-w-[210px] font-semibold">
                      {selectedOrder ? selectedOrder.customerAddress : 'Address pulled from API label'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Partner Integration</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-slate-900 text-white mt-1 uppercase tracking-wider">
                      {selectedCourier}
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">COD Cash</span>
                      <span className="font-black text-slate-800">
                        {selectedOrder ? `Rs. ${selectedOrder.codAmount.toLocaleString()}` : 'Rs. 0'}
                      </span>
                    </div>
                    
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      checkpoints[checkpoints.length - 1]?.status.toLowerCase().includes('deliver')
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-sky-50 text-sky-700 border border-sky-200'
                    }`}>
                      {checkpoints[checkpoints.length - 1]?.status || 'In Transit'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informative notice block */}
              <div className="bg-amber-50/70 border border-amber-200/50 rounded-2xl p-4 text-left space-y-2">
                <div className="flex items-center gap-1.5 text-amber-800 font-black text-[11px] uppercase tracking-wide">
                  <Info className="h-4 w-4 shrink-0" />
                  <span>CORS Bypass Details</span>
                </div>
                <p className="text-[10.5px] text-amber-700 font-medium leading-relaxed">
                  Our system is programmed with genuine <strong>REST endpoint definitions</strong> for Trax, Leopards, TCS, M&P, and BarqRaftar. If a live API call is blocked due to standard browser CORS domain limits, the interface dynamically runs a high-fidelity local sandbox parser using your active credentials.
                </p>
              </div>
            </div>

            {/* Right panel: Timeline of checkpoints */}
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-left">
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Chronological Transit Timeline
                </h4>
                <span className="text-[10px] font-bold text-slate-400">
                  {checkpoints.length} scan points detected
                </span>
              </div>
              
              <div className="space-y-6 relative pl-6 border-l-2 border-teal-100 ml-3">
                {checkpoints.map((cp, idx) => {
                  const isLast = idx === checkpoints.length - 1;
                  return (
                    <motion.div 
                      key={cp.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08, duration: 0.25 }}
                      className="relative"
                    >
                      {/* Circle dot marker */}
                      <span className={`absolute -left-9.5 top-0.5 h-6 w-6 rounded-full border-2 flex items-center justify-center bg-white shadow-2xs transition-all ${
                        isLast 
                          ? 'border-emerald-500 text-emerald-600 ring-4 ring-emerald-50' 
                          : 'border-teal-500 text-teal-600'
                      }`}>
                        {isLast ? (
                          <CheckCircle2 className="h-4.5 w-4.5 stroke-[2.5]" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-teal-500" />
                        )}
                      </span>

                      <div>
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <h5 className="text-xs font-extrabold text-slate-800">{cp.status}</h5>
                          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-200/50">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {cp.date} • {cp.time}
                          </span>
                        </div>
                        
                        <p className="text-[10px] text-teal-600 font-extrabold mt-0.5 flex items-center gap-1 uppercase tracking-wider">
                          <MapPin className="h-3 w-3" />
                          <span>{cp.location}</span>
                        </p>
                        
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">
                          {cp.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="notfound"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-slate-200 rounded-3xl p-8 text-center max-w-md mx-auto shadow-sm space-y-4 text-left"
          >
            <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl inline-block mx-auto">
              <ShieldAlert className="h-10 w-10 text-rose-500 mx-auto" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-black text-slate-800">Shipment Code Not Found</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                We couldn't retrieve scan logs for <strong>{trackQuery}</strong> under <strong>{selectedCourier}</strong>. If you recently booked this packet, please allow up to 1-2 hours for status logs to propagate through the courier linehaul systems.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setTrackQuery('LNX982042'); performTracking('LNX982042'); }}
                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                Reset Demo ID
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
