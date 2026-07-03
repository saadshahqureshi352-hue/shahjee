import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PickupAddress, Order, ReturnOrder } from './types';
import { 
  INITIAL_PICKUP_ADDRESSES, 
  INITIAL_ORDERS, 
  INITIAL_RETURN_ORDERS, 
  INITIAL_INVOICES
} from './data/mockData';

// Component imports
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginRegister from './components/onboarding/LoginRegister';
import Overview from './components/dashboard/Overview';
import PickupAddresses from './components/network/PickupAddresses';
import AllOrders from './components/network/AllOrders';
import OverallSales from './components/payments/OverallSales';
import Invoices from './components/payments/Invoices';
import NonCodPayment from './components/payments/NonCodPayment';
import TrackingSystem from './components/smart/TrackingSystem';
import ReturnOrders from './components/smart/ReturnOrders';
import ApiSetup from './components/smart/ApiSetup';
import Profile from './components/profile/Profile';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('is_auth') === 'true';
  });

  const [merchantInfo, setMerchantInfo] = useState(() => {
    const saved = localStorage.getItem('merchant_info');
    return saved ? JSON.parse(saved) : { brandName: 'Laskhy Laser', userName: 'Laskhy Laser Merchant', email: 'laskhylaser@gmail.com' };
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [headerSearchTerm, setHeaderSearchTerm] = useState<string>('');

  // Main synchronized states
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sjc_orders');
    if (saved) {
      try {
        const parsed: Order[] = JSON.parse(saved);
        const parsedIds = new Set(parsed.map(o => o.id));
        const missing = INITIAL_ORDERS.filter(o => !parsedIds.has(o.id));
        if (missing.length > 0) {
          return [...parsed, ...missing];
        }
        return parsed;
      } catch (e) {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  const [pickupAddresses, setPickupAddresses] = useState<PickupAddress[]>(() => {
    const saved = localStorage.getItem('sjc_addresses');
    return saved ? JSON.parse(saved) : INITIAL_PICKUP_ADDRESSES;
  });

  const [returnOrders, setReturnOrders] = useState<ReturnOrder[]>(() => {
    const saved = localStorage.getItem('sjc_returns');
    return saved ? JSON.parse(saved) : INITIAL_RETURN_ORDERS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('is_auth', isAuthenticated ? 'true' : 'false');
    localStorage.setItem('merchant_info', JSON.stringify(merchantInfo));
  }, [isAuthenticated, merchantInfo]);

  useEffect(() => {
    localStorage.setItem('sjc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sjc_addresses', JSON.stringify(pickupAddresses));
  }, [pickupAddresses]);

  useEffect(() => {
    localStorage.setItem('sjc_returns', JSON.stringify(returnOrders));
  }, [returnOrders]);

  // Handle Authentication success
  const handleAuthSuccess = (data: { brandName: string; userName: string; email: string }) => {
    setMerchantInfo(data);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  // State manipulation handlers
  const handleAddAddress = (newAddr: Omit<PickupAddress, 'id'>) => {
    const created: PickupAddress = {
      ...newAddr,
      id: `PA-00${pickupAddresses.length + 1}`
    };

    if (newAddr.isDefault) {
      setPickupAddresses(prev => 
        prev.map(addr => ({ ...addr, isDefault: false })).concat(created)
      );
    } else {
      setPickupAddresses(prev => [...prev, created]);
    }
  };

  const handleDeleteAddress = (id: string) => {
    setPickupAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const handleSetDefaultAddress = (id: string) => {
    setPickupAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    );
  };

  const handleAddOrder = (newOrder: Omit<Order, 'id' | 'trackingNo' | 'deliveryCharges'>) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const courierPrefix = newOrder.courier === 'Lionex' ? 'LNX' : newOrder.courier === 'Run Courier' ? 'RUN' : 'SJC';
    
    // Delivery charge calculation based on courier choice
    let charges = 220;
    if (newOrder.courier === 'Lionex') charges = 140;
    if (newOrder.courier === 'Run Courier') charges = 150;

    const created: Order = {
      ...newOrder,
      id: `${courierPrefix}${randomSuffix}042`,
      trackingNo: `${courierPrefix.substring(0, 3)}-TRK-${randomSuffix}`,
      deliveryCharges: charges
    };

    setOrders(prev => [created, ...prev]);
  };

  const handleCancelOrder = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      setOrders(prev => 
        prev.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o)
      );
    }
  };

  if (!isAuthenticated) {
    return <LoginRegister onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        brandName={merchantInfo.brandName} 
      />

      {/* Main Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Header 
          setSidebarOpen={setSidebarOpen} 
          brandName={merchantInfo.brandName} 
          userName={merchantInfo.userName} 
          userEmail={merchantInfo.email} 
          onLogout={() => setIsAuthenticated(false)} 
          onSearchTrack={(term) => { setHeaderSearchTerm(term); setActiveTab('tracking'); }}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userAvatar={merchantInfo.avatar}
        />

        {/* Dynamic View Route Container */}
        <main className="flex-grow pt-24 px-4 pb-12 sm:px-6 lg:px-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.99 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'dashboard' && (
                <Overview 
                  orders={orders} 
                  returns={returnOrders} 
                  setActiveTab={setActiveTab} 
                  brandName={merchantInfo.brandName} 
                  setOrderStatusFilter={setOrderStatusFilter}
                />
              )}

              {activeTab === 'pickup-address' && (
                <PickupAddresses 
                  addresses={pickupAddresses} 
                  onAddAddress={handleAddAddress} 
                  onDeleteAddress={handleDeleteAddress} 
                  onSetDefault={handleSetDefaultAddress} 
                />
              )}

              {(activeTab === 'bookings' || activeTab === 'new-booking') && (
                <AllOrders 
                  orders={orders} 
                  pickupAddresses={pickupAddresses} 
                  onAddOrder={handleAddOrder} 
                  onCancelOrder={handleCancelOrder} 
                  activeView={activeTab === 'new-booking' ? 'create' : 'list'} 
                  setActiveView={(view) => {
                    setActiveTab(view === 'create' ? 'new-booking' : 'bookings');
                  }} 
                  statusFilter={orderStatusFilter}
                  setStatusFilter={setOrderStatusFilter}
                />
              )}

              {activeTab === 'overall-sales' && (
                <OverallSales orders={orders} />
              )}

              {activeTab === 'invoices' && (
                <Invoices invoices={INITIAL_INVOICES} />
              )}

              {activeTab === 'non-cod' && (
                <NonCodPayment />
              )}

              {activeTab === 'tracking' && (
                <TrackingSystem 
                  orders={orders} 
                  searchTermFromHeader={headerSearchTerm} 
                  onClearHeaderSearch={() => setHeaderSearchTerm('')} 
                />
              )}

              {activeTab === 'return-orders' && (
                <ReturnOrders 
                  returns={returnOrders} 
                  brandName={merchantInfo.brandName} 
                />
              )}

              {activeTab === 'api-keys' && (
                <ApiSetup />
              )}

              {activeTab === 'profile' && (
                <Profile 
                  merchantInfo={merchantInfo}
                  setMerchantInfo={setMerchantInfo}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
