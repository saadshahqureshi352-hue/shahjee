import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  ClipboardList, 
  Wallet, 
  LineChart, 
  FileSpreadsheet, 
  PlusCircle, 
  Search, 
  MessageSquare, 
  Sliders, 
  RotateCcw,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Server,
  User
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  brandName?: string;
}

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, brandName = 'Shah Jee Courier' }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    network: true,
    payments: true,
    smart: true
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Close mobile sidebar on click
  };

  const isSubActive = (tabs: string[]) => tabs.includes(activeTab);

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-teal-950 text-slate-200 shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header/Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/5 px-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 blur-lg opacity-40 animate-pulse"></div>
              <div className="relative h-12 w-12 bg-slate-950 p-1 rounded-2xl ring-2 ring-orange-500/50 shadow-xl flex items-center justify-center overflow-hidden">
                {/* Simulated Shah Jee Courier Logo */}
                <div className="text-xl font-black text-transparent bg-gradient-to-br from-orange-400 to-amber-400 bg-clip-text">
                  SJC
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-black tracking-wider text-transparent bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text leading-tight uppercase">
                Shah Jee
              </p>
              <p className="text-[10px] uppercase tracking-widest text-teal-300 font-bold">
                COURIER PORTAL
              </p>
            </div>
          </div>
          
          <button 
            type="button" 
            onClick={() => setSidebarOpen(false)} 
            className="rounded-lg p-1 text-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all lg:hidden"
          >
            &times;
          </button>
        </div>

        {/* Navigation Content */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 text-sm space-y-1 custom-scrollbar">
          {/* Dashboard */}
          <button
            onClick={() => handleTabClick('dashboard')}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 font-semibold transition-all duration-200 hover:scale-105 ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/30 font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            <span>Dashboard</span>
          </button>

          {/* My Profile */}
          <button
            onClick={() => handleTabClick('profile')}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 font-semibold transition-all duration-200 hover:scale-105 ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-rose-500/30 font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <User className="h-5 w-5 shrink-0 text-pink-400" />
            <span>My Profile</span>
          </button>

          {/* Courier Network Category */}
          <div className="pt-2">
            <button 
              type="button" 
              onClick={() => toggleMenu('network')} 
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-slate-300 transition hover:bg-slate-800 hover:text-white ${
                isSubActive(['pickup-address', 'bookings', 'new-booking']) ? 'bg-slate-800/50 text-white font-medium' : ''
              }`}
            >
              <span className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 shrink-0 text-teal-400" />
                <span>Courier Network</span>
              </span>
              {openMenus.network ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              )}
            </button>
            
            {openMenus.network && (
              <div className="mt-1 ml-4 border-l border-white/5 pl-2 space-y-1">
                <button 
                  onClick={() => handleTabClick('pickup-address')}
                  className={`w-full text-left block rounded-lg py-2 px-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ${
                    activeTab === 'pickup-address' ? 'text-teal-400 bg-slate-800/80 font-bold border-l-2 border-teal-500 pl-4' : ''
                  }`}
                >
                  My Pickup Address
                </button>
                <button 
                  onClick={() => handleTabClick('bookings')}
                  className={`w-full text-left block rounded-lg py-2 px-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ${
                    activeTab === 'bookings' ? 'text-teal-400 bg-slate-800/80 font-bold border-l-2 border-teal-500 pl-4' : ''
                  }`}
                >
                  My All Orders
                </button>
              </div>
            )}
          </div>

          {/* My Payments Category */}
          <div className="pt-1">
            <button 
              type="button" 
              onClick={() => toggleMenu('payments')} 
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-slate-300 transition hover:bg-slate-800 hover:text-white ${
                isSubActive(['overall-sales', 'invoices', 'non-cod']) ? 'bg-slate-800/50 text-white font-medium' : ''
              }`}
            >
              <span className="flex items-center gap-3">
                <Wallet className="h-5 w-5 shrink-0 text-amber-400" />
                <span>My Payments</span>
              </span>
              {openMenus.payments ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              )}
            </button>
            
            {openMenus.payments && (
              <div className="mt-1 ml-4 border-l border-white/5 pl-2 space-y-1">
                <button 
                  onClick={() => handleTabClick('overall-sales')}
                  className={`w-full text-left block rounded-lg py-2 px-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ${
                    activeTab === 'overall-sales' ? 'text-teal-400 bg-slate-800/80 font-bold border-l-2 border-teal-500 pl-4' : ''
                  }`}
                >
                  Overall Sales
                </button>
                <button 
                  onClick={() => handleTabClick('invoices')}
                  className={`w-full text-left block rounded-lg py-2 px-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ${
                    activeTab === 'invoices' ? 'text-teal-400 bg-slate-800/80 font-bold border-l-2 border-teal-500 pl-4' : ''
                  }`}
                >
                  My Invoices
                </button>
                <button 
                  onClick={() => handleTabClick('non-cod')}
                  className={`w-full text-left block rounded-lg py-2 px-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ${
                    activeTab === 'non-cod' ? 'text-teal-400 bg-slate-800/80 font-bold border-l-2 border-teal-500 pl-4' : ''
                  }`}
                >
                  Payment for Non-COD
                </button>
              </div>
            )}
          </div>

          {/* Smart Tools Category */}
          <div className="pt-1">
            <button 
              type="button" 
              onClick={() => toggleMenu('smart')} 
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-slate-300 transition hover:bg-slate-800 hover:text-white ${
                isSubActive(['tracking', 'return-orders']) ? 'bg-slate-800/50 text-white font-medium' : ''
              }`}
            >
              <span className="flex items-center gap-3">
                <Sliders className="h-5 w-5 shrink-0 text-rose-400" />
                <span>Smart Tools</span>
              </span>
              {openMenus.smart ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              )}
            </button>
            
            {openMenus.smart && (
              <div className="mt-1 ml-4 border-l border-white/5 pl-2 space-y-1">
                <button 
                  onClick={() => handleTabClick('tracking')}
                  className={`w-full text-left block rounded-lg py-2 px-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ${
                    activeTab === 'tracking' ? 'text-teal-400 bg-slate-800/80 font-bold border-l-2 border-teal-500 pl-4' : ''
                  }`}
                >
                  Tracking System
                </button>
                <button 
                  onClick={() => handleTabClick('return-orders')}
                  className={`w-full text-left block rounded-lg py-2 px-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ${
                    activeTab === 'return-orders' ? 'text-teal-400 bg-slate-800/80 font-bold border-l-2 border-teal-500 pl-4' : ''
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span>Return Orders</span>
                    <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      RTO
                    </span>
                  </span>
                </button>
                <button 
                  onClick={() => handleTabClick('api-keys')}
                  className={`w-full text-left block rounded-lg py-2 px-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 ${
                    activeTab === 'api-keys' ? 'text-teal-400 bg-slate-800/80 font-bold border-l-2 border-teal-500 pl-4' : ''
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span>Shah Jee API Setup</span>
                    <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                      Keys
                    </span>
                  </span>
                </button>
              </div>
            )/* cPanel Exporter hidden */}
          </div>
        </nav>

        {/* Footer info inside sidebar */}
        <div className="p-4 border-t border-white/5 bg-black/20 text-xs">
          <a 
            href="https://wa.me/923462344807?text=Assalam-o-Alaikum!%20I%20need%20help."
            target="_blank" 
            rel="noopener noreferrer" 
            className="group block transition hover:scale-105"
          >
            <div className="flex items-center gap-2 mb-1 text-emerald-400 font-bold">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Contact Us</span>
            </div>
            <p className="text-white font-mono font-bold text-xs group-hover:text-emerald-400 transition">
              03462344807
            </p>
            <p className="text-slate-400 text-[10px] mt-0.5">
              If you need help contact Us
            </p>
          </a>
        </div>
      </aside>
    </>
  );
}
