import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  ChevronDown, 
  User, 
  Settings as SettingsIcon, 
  LogOut, 
  Search,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Clock,
  MapPin
} from 'lucide-react';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  brandName: string;
  userName: string;
  userEmail: string;
  onLogout: () => void;
  onSearchTrack: (term: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userAvatar?: string;
}

interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  seen: boolean;
  icon: string;
  type: 'order' | 'success' | 'alert' | 'system';
}

export default function Header({ 
  setSidebarOpen, 
  brandName, 
  userName, 
  userEmail, 
  onLogout, 
  onSearchTrack,
  activeTab,
  setActiveTab,
  userAvatar
}: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n-1',
      title: 'New Booking Success',
      message: 'Order #LNX9820042 has been confirmed for Islamabad delivery.',
      time: '2 minutes ago',
      seen: false,
      icon: '📦',
      type: 'order'
    },
    {
      id: 'n-2',
      title: 'Payout Processed',
      message: 'COD invoice INV-2026-0421 of Rs. 55,450 cleared.',
      time: '1 hour ago',
      seen: false,
      icon: '💰',
      type: 'success'
    },
    {
      id: 'n-3',
      title: 'Return Warning (RTO)',
      message: 'Order #SJC1029499 marked as Customer Refused.',
      time: '3 hours ago',
      seen: true,
      icon: '⚠️',
      type: 'alert'
    },
    {
      id: 'n-4',
      title: 'Gateway Online',
      message: 'WhatsApp API Instance #3011 successfully authenticated.',
      time: 'Yesterday',
      seen: true,
      icon: '🟢',
      type: 'system'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.seen).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onSearchTrack(searchVal.trim());
      setActiveTab('tracking');
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between bg-slate-900 px-4 text-slate-100 shadow-xl lg:left-64">
      {/* Left side: Mobile menu toggle and title */}
      <div className="flex items-center gap-3">
        <button 
          type="button" 
          onClick={() => setSidebarOpen(true)} 
          className="rounded-lg bg-white/10 p-2 lg:hidden hover:bg-white/20 transition-all duration-300 hover:scale-110"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5 tracking-tight uppercase">
          <span className="hidden sm:inline text-slate-400 font-bold tracking-wider text-[10px]">Portal:</span>
          <span className="bg-gradient-to-r from-teal-300 via-amber-200 to-emerald-300 bg-clip-text text-transparent font-black drop-shadow-sm">
            {brandName}
          </span>
        </h1>
      </div>

      {/* Right side: Time, WhatsApp Floating, Notification Bell, User Avatar */}
      <div className="flex items-center gap-4">
        {/* Floating WhatsApp Support Button with pulse animation */}
        <a 
          href="https://wa.me/923462344807?text=Assalam-o-Alaikum!%20I%20need%20assistance%20with%20Shah%20Jee%20Courier%20Portal."
          target="_blank" 
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500 text-white shadow-md transition-all duration-300 animate-[whatsappGlowPulse_2s_infinite_ease-in-out] hover:scale-110 hover:bg-emerald-600"
          title="Contact Support on WhatsApp (+92 346 2344807)"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
          </svg>
        </a>

        {/* Notification Bell with Bell list popover */}
        <div className="relative">
          <button 
            type="button" 
            onClick={() => { setNotifyOpen(!notifyOpen); setProfileOpen(false); }}
            className="relative rounded-full p-2 hover:bg-white/10 transition-all duration-200 hover:scale-110"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4.5 w-4.5 flex items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popup Dropdown */}
          {notifyOpen && (
            <div 
              className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl overflow-hidden flex flex-col"
              style={{ maxHeight: '420px' }}
            >
              {/* Dropdown Header */}
              <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-100 px-4 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <button 
                  onClick={markAllRead} 
                  className="text-[11px] font-bold text-teal-600 hover:text-teal-700 transition"
                >
                  Mark all read
                </button>
              </div>

              {/* Notification List */}
              <div className="overflow-y-auto divide-y divide-slate-100 max-h-64 custom-scrollbar">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`flex gap-3 px-4 py-3 transition hover:bg-slate-50 cursor-pointer ${
                      notif.seen ? 'bg-white' : 'bg-slate-50/70 font-medium'
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
                      {notif.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-bold text-slate-800 truncate">{notif.title}</p>
                        {!notif.seen && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* View all alert template shortcuts */}
              <div className="bg-slate-50 p-3 border-t border-slate-100 text-center">
                <button 
                  onClick={() => { setNotifyOpen(false); setActiveTab('alert-templates'); }}
                  className="text-xs font-bold text-teal-600 hover:underline"
                >
                  Configure Notification Templates
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown selection */}
        <div className="relative">
          <button 
            type="button" 
            onClick={() => { setProfileOpen(!profileOpen); setNotifyOpen(false); }}
            className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all duration-200 hover:scale-105"
          >
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt="User Avatar" 
                className="h-9 w-9 rounded-full object-cover border-2 border-white/20 shadow-md"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 border-2 border-white/20 text-xs font-black text-white shadow-md">
                {userName.substring(0, 2).toUpperCase()}
              </div>
            )}
            <ChevronDown className="hidden h-4 w-4 text-slate-300 sm:block" />
          </button>

          {/* Profile Dropdown Popup Menu */}
          {profileOpen && (
            <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-slate-200 bg-white py-2 text-slate-700 shadow-2xl">
              <div className="px-4 py-2 border-b border-slate-100 mb-1 bg-slate-50/50">
                <p className="text-xs font-bold text-slate-800 truncate">{userName}</p>
                <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
              </div>

              <button 
                onClick={() => { setProfileOpen(false); setActiveTab('dashboard'); }}
                className="w-full text-left block px-4 py-2.5 text-xs hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  <span>Dashboard Overview</span>
                </div>
              </button>

              <button 
                onClick={() => { setProfileOpen(false); setActiveTab('profile'); }}
                className="w-full text-left block px-4 py-2.5 text-xs hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2">
                  <SettingsIcon className="h-3.5 w-3.5 text-pink-500" />
                  <span className="font-bold text-slate-800">My Profile Settings</span>
                </div>
              </button>

              <button 
                onClick={() => { setProfileOpen(false); setActiveTab('pickup-address'); }}
                className="w-full text-left block px-4 py-2.5 text-xs hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <span>Pickup Addresses</span>
                </div>
              </button>

              <div className="my-1 border-t border-slate-100"></div>

              <button 
                onClick={() => { setProfileOpen(false); onLogout(); }}
                className="w-full text-left block px-4 py-2.5 text-xs text-red-600 font-bold hover:bg-red-50 transition"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="h-3.5 w-3.5 text-red-500" />
                  <span>Logout Portal</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
