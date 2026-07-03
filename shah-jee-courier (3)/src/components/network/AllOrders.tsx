import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Printer, 
  FileText, 
  Download, 
  PlusCircle, 
  Check, 
  AlertCircle,
  XCircle,
  Truck,
  Building,
  CheckCircle,
  Building2,
  HelpCircle,
  TrendingUp,
  MapPin,
  ChevronRight,
  Calculator,
  Loader2
} from 'lucide-react';
import { Order, PickupAddress } from '../../types';

interface LoadSheetRecord {
  id: string;
  courier: string;
  date: string;
  relativeTime: string;
  status: 'Signed' | 'Pending Pick';
  shipments: Order[];
}

interface AllOrdersProps {
  orders: Order[];
  pickupAddresses: PickupAddress[];
  onAddOrder: (order: Omit<Order, 'id' | 'trackingNo' | 'deliveryCharges'>) => void;
  onCancelOrder: (id: string) => void;
  activeView: 'list' | 'create';
  setActiveView: (view: 'list' | 'create') => void;
  statusFilter?: string;
  setStatusFilter?: (status: string) => void;
}

const PAKISTANI_CITIES = [
  'Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi', 'Gujranwala', 
  'Peshawar', 'Multan', 'Hyderabad', 'Islamabad', 'Quetta', 
  'Sargodha', 'Sialkot', 'Bahawalpur', 'Sukkur', 'Sheikhupura', 
  'Rahim Yar Khan', 'Mardan', 'Gujrat', 'Kasur', 'Mingora', 
  'Dera Ghazi Khan', 'Nawabshah', 'Mirpur Khas', 'Chiniot', 
  'Sadiqabad', 'Abbottabad', 'Okara', 'Khuzdar'
];

interface CourierPartner {
  id: 'TCS' | 'Leopards' | 'M&P' | 'Trax' | 'Barqraftar';
  name: string;
  tagline: string;
  baseCharge: number;
  ratePerGrams: number;
}

const COURIER_PARTNERS: CourierPartner[] = [
  { id: 'TCS', name: 'TCS', tagline: 'Market leader in premium courier dispatches', baseCharge: 210, ratePerGrams: 0.1 },
  { id: 'Leopards', name: 'Leopards', tagline: "Pakistan's largest logistics coverage network", baseCharge: 200, ratePerGrams: 0.08 },
  { id: 'M&P', name: 'M&P', tagline: 'National standard secure COD express delivery', baseCharge: 190, ratePerGrams: 0.09 },
  { id: 'Trax', name: 'Trax', tagline: 'Fastest delivery across Pakistan with intelligent routing', baseCharge: 180, ratePerGrams: 0.07 },
  { id: 'Barqraftar', name: 'Barqraftar', tagline: 'Next-generation hyper-fast delivery & analytics', baseCharge: 160, ratePerGrams: 0.06 }
];

const getCourierLogo = (id: string, theme: 'dark' | 'light' = 'light') => {
  const isDark = theme === 'dark';
  switch (id) {
    case 'TCS':
      return (
        <svg viewBox="0 0 100 100" className="w-11 h-11 shrink-0 rounded-xl shadow-md border border-red-500/10">
          {/* Red background */}
          <rect width="100" height="100" rx="20" fill="#E21B22"/>
          {/* Yellow swoosh */}
          <path d="M 12 70 Q 50 82 88 70" stroke="#FFF200" strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* TCS Text */}
          <text x="50" y="55" fill="#FFFFFF" fontSize="28" fontWeight="950" fontStyle="italic" textAnchor="middle" fontFamily="system-ui, sans-serif" letterSpacing="-1">TCS</text>
          <text x="50" y="24" fill="#FFF200" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif" letterSpacing="1">EXPRESS</text>
        </svg>
      );
    case 'Leopards':
      return (
        <svg viewBox="0 0 100 100" className="w-11 h-11 shrink-0 rounded-xl shadow-md border border-amber-500/10">
          {/* Yellow background */}
          <rect width="100" height="100" rx="20" fill="#FFC72C"/>
          {/* Leaping leopard silhouette */}
          <path d="M 12 40 C 22 28, 42 28, 52 35 C 57 38, 62 35, 72 28 C 62 41, 52 45, 42 41 C 32 37, 22 43, 12 40 Z" fill="#1E293B" />
          <path d="M 22 45 C 32 39, 42 47, 52 43 L 67 53 C 57 49, 47 51, 37 49 C 27 47, 25 50, 22 45 Z" fill="#1E293B" />
          {/* Brand text */}
          <text x="50" y="78" fill="#1E293B" fontSize="11" fontWeight="950" textAnchor="middle" fontFamily="system-ui, sans-serif" letterSpacing="0.5">LEOPARDS</text>
          <text x="50" y="90" fill="#E21B22" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif" letterSpacing="0.5">COURIER</text>
        </svg>
      );
    case 'M&P':
      return (
        <svg viewBox="0 0 100 100" className="w-11 h-11 shrink-0 rounded-xl shadow-md border border-blue-500/10">
          {/* Dark Blue background */}
          <rect width="100" height="100" rx="20" fill="#0F172A"/>
          {/* Orange and white details */}
          <path d="M 20 25 L 45 70 L 55 70 L 80 25" stroke="#F97316" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 35 25 L 50 56 L 65 25" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Text */}
          <text x="50" y="88" fill="#FFFFFF" fontSize="10" fontWeight="950" textAnchor="middle" fontFamily="system-ui, sans-serif" letterSpacing="0.5">M&P EXPRESS</text>
        </svg>
      );
    case 'Trax':
      return (
        <svg viewBox="0 0 100 100" className="w-11 h-11 shrink-0 rounded-xl shadow-md border border-slate-800">
          {/* Matte Black background */}
          <rect width="100" height="100" rx="20" fill="#18181B"/>
          {/* Glowing line */}
          <line x1="15" y1="22" x2="85" y2="22" stroke="#EA580C" strokeWidth="5" strokeLinecap="round" />
          {/* TRAX text */}
          <text x="50" y="60" fill="#FFFFFF" fontSize="24" fontWeight="950" textAnchor="middle" fontFamily="system-ui, sans-serif" letterSpacing="2">TRAX</text>
          <text x="50" y="82" fill="#EA580C" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif" letterSpacing="1">LOGISTICS</text>
        </svg>
      );
    case 'Barqraftar':
      return (
        <svg viewBox="0 0 100 100" className="w-11 h-11 shrink-0 rounded-xl shadow-md border border-teal-500/10">
          {/* Teal background */}
          <rect width="100" height="100" rx="20" fill="#0D9488"/>
          {/* Lightning bolt inside */}
          <path d="M 54 15 L 34 48 L 49 48 L 46 80 L 66 48 L 51 48 Z" fill="#FFF200" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Text */}
          <text x="50" y="92" fill="#FFFFFF" fontSize="9" fontWeight="950" textAnchor="middle" fontFamily="system-ui, sans-serif" letterSpacing="0.5">BARQRAFTAR</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-11 h-11 shrink-0 rounded-xl shadow-md border border-slate-600">
          <rect width="100" height="100" rx="20" fill="#475569"/>
          <text x="50" y="58" fill="#FFFFFF" fontSize="22" fontWeight="950" textAnchor="middle" fontFamily="system-ui, sans-serif">SJC</text>
        </svg>
      );
  }
};

const getCleanTagline = (id: string) => {
  switch (id) {
    case 'Trax': return 'Express delivery';
    case 'Leopards': return 'Nation-wide coverage';
    case 'Barqraftar':
    case 'BarqRaftar': return 'Fast & reliable';
    case 'M&P': return 'Premium logistics';
    case 'TCS': return 'Courier service';
    default: return 'Express delivery partner';
  }
};

export default function AllOrders({ 
  orders, 
  pickupAddresses, 
  onAddOrder, 
  onCancelOrder,
  activeView,
  setActiveView,
  statusFilter: propStatusFilter,
  setStatusFilter: propSetStatusFilter
}: AllOrdersProps) {
  const ignoreNextModalOpen = useRef(false);
  const [localActiveView, setLocalActiveView] = useState<'list' | 'create'>(activeView);

  useEffect(() => {
    setLocalActiveView(activeView);
  }, [activeView]);
  // Filtering & searching
  const [searchTerm, setSearchTerm] = useState('');
  const [localStatusFilter, setLocalStatusFilter] = useState('All');
  const statusFilter = propStatusFilter !== undefined ? propStatusFilter : localStatusFilter;
  const setStatusFilter = propSetStatusFilter !== undefined ? propSetStatusFilter : setLocalStatusFilter;
  const [dateFilter, setDateFilter] = useState('');
  const [courierFilter, setCourierFilter] = useState('All');

  // Custom states matching Image 1 & 2 requirements
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);
  const [selectedOrderForTrack, setSelectedOrderForTrack] = useState<Order | null>(null);
  const [activeTopSubTab, setActiveTopSubTab] = useState<'dashboard' | 'finance'>('dashboard');
  const [itemsPerPage, setItemsPerPage] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('Last 60 Days');

  // Multi-step Modals & Wizard state
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Sheets specific state
  const [showLoadSheetCourierModal, setShowLoadSheetCourierModal] = useState(false);
  const [selectedLoadSheetCourier, setSelectedLoadSheetCourier] = useState<CourierPartner | null>(null);
  const [showLoadSheetDetailModal, setShowLoadSheetDetailModal] = useState(false);
  const [showLoadSheetGeneratorModal, setShowLoadSheetGeneratorModal] = useState(false);
  const [selectedOrdersForNewSheet, setSelectedOrdersForNewSheet] = useState<Record<string, boolean>>({});
  const [loadSheetSearchQuery, setLoadSheetSearchQuery] = useState('');
  const [loadSheetDateFilter, setLoadSheetDateFilter] = useState('Today Results');
  const [loadSheetPageLimit, setLoadSheetPageLimit] = useState(50);
  const [showDateFilterDropdown, setShowDateFilterDropdown] = useState(false);
  const [showPageLimitDropdown, setShowPageLimitDropdown] = useState(false);

  const [loadSheetsList, setLoadSheetsList] = useState<LoadSheetRecord[]>(() => {
    return [
      { 
        id: '807008', 
        courier: 'Leopards', 
        date: '20 May 2026', 
        relativeTime: '1 month ago',
        status: 'Signed', 
        shipments: [
          {
            id: 'KL7530762418',
            trackingNo: 'KL7530762418',
            customerName: 'Laskhy Laser Customer',
            customerPhone: '03076542923',
            customerAddress: 'Sardar Pur Road, Hussainabad Near Dera Ch. Abdul Aziz, Tehsil Kabirwala',
            destinationCity: 'MANGA MANDI',
            courier: 'Leopards',
            weight: 0.32,
            codAmount: 0,
            deliveryCharges: 200,
            status: 'Booked',
            bookingDate: '20-May-2026',
            productDescription: 'General Item'
          }
        ]
      },
      { 
        id: '872231', 
        courier: 'Leopards', 
        date: '12 May 2026', 
        relativeTime: '1 month ago',
        status: 'Signed', 
        shipments: [
          {
            id: 'KL7530762419',
            trackingNo: 'KL7530762419',
            customerName: 'Ahmad Khan',
            customerPhone: '03123456789',
            customerAddress: 'DHA Phase 6, Lahore',
            destinationCity: 'LAHORE',
            courier: 'Leopards',
            weight: 0.5,
            codAmount: 1500,
            deliveryCharges: 200,
            status: 'Booked',
            bookingDate: '12-May-2026',
            productDescription: 'Clothes'
          }
        ]
      },
      { 
        id: '261839', 
        courier: 'Leopards', 
        date: '09 May 2026', 
        relativeTime: '1 month ago',
        status: 'Signed', 
        shipments: [
          {
            id: 'KL7530762387',
            trackingNo: 'KL7530762387',
            customerName: 'Ali Raza',
            customerPhone: '03076542923',
            customerAddress: 'Hussainabad Near Dera Ch. Abdul Aziz, Kabirwala',
            destinationCity: 'KHUZDAR',
            courier: 'Leopards',
            weight: 0.32,
            codAmount: 890,
            deliveryCharges: 200,
            status: 'Booked',
            bookingDate: '30-Apr-2026',
            productDescription: 'Electronic parts'
          },
          {
            id: 'KL7530762386',
            trackingNo: 'KL7530762386',
            customerName: 'Muhammad Salman',
            customerPhone: '03001234567',
            customerAddress: 'Gulberg III, Lahore',
            destinationCity: 'SHAKAR GARH',
            courier: 'Leopards',
            weight: 0.33,
            codAmount: 890,
            deliveryCharges: 200,
            status: 'Booked',
            bookingDate: '30-Apr-2026',
            productDescription: 'Leather Wallet'
          }
        ]
      }
    ];
  });

  // Main Booking Inputs
  const [selectedCourier, setSelectedCourier] = useState<CourierPartner>(COURIER_PARTNERS[3]); // Default Trax
  const [destinationCity, setDestinationCity] = useState('Abbottabad');
  const [citySearch, setCitySearch] = useState('Abbottabad');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [completeAddress, setCompleteAddress] = useState('kabirwala pakistan');
  const [customerName, setCustomerName] = useState('Ghulam Hamza');
  const [customerPhone, setCustomerPhone] = useState('03025456646');
  const [referenceNo, setReferenceNo] = useState('SJC-REF-4820');
  const [codAmount, setCodAmount] = useState<number>(0);
  const [weightGrams, setWeightGrams] = useState<number>(5000); // in grams (5 KG is 5000g)
  const [quantity, setQuantity] = useState<number>(1);
  const [productName, setProductName] = useState('General Item');
  const [specialInstructions, setSpecialInstructions] = useState('Handle with Care');
  const [secondPhone, setSecondPhone] = useState('');
  const [refOrderId, setRefOrderId] = useState('');
  const [advancePaid, setAdvancePaid] = useState(true); // Since COD is 0
  const [selectedCityLetter, setSelectedCityLetter] = useState('A'); // Abbottabad letter 'A'

  // Sidebar Inputs
  const [serviceType, setServiceType] = useState<'Overnight' | 'Detain' | 'Overland'>('Overnight');
  const [pickupAddressId, setPickupAddressId] = useState('');

  // Generated results for success state
  const [lastGeneratedTracking, setLastGeneratedTracking] = useState('');

  // Auto-fill default pickup address
  useEffect(() => {
    if (pickupAddresses.length > 0) {
      const def = pickupAddresses.find(p => p.isDefault) || pickupAddresses[0];
      setPickupAddressId(def.id);
    }
  }, [pickupAddresses]);

  // Open courier selection modal when clicking Create New Booking
  useEffect(() => {
    if (localActiveView === 'create') {
      if (ignoreNextModalOpen.current) {
        ignoreNextModalOpen.current = false;
        return;
      }
      setShowCourierModal(true);
    }
  }, [localActiveView]);

  // Delivery Charges Calculation block
  const getDeliveryCharge = (courier: CourierPartner, grams: number, sType: string) => {
    let charge = courier.baseCharge;
    // Multiplier for weight
    if (grams > 500) {
      const extraGrams = grams - 500;
      charge += Math.ceil(extraGrams / 500) * (courier.ratePerGrams * 500);
    }
    // Overnight vs Overland adjustments
    if (sType === 'Overland') {
      charge = Math.max(120, Math.floor(charge * 0.8));
    } else if (sType === 'Detain') {
      charge += 50;
    }
    return Math.round(charge);
  };

  const calculatedDeliveryCharges = getDeliveryCharge(selectedCourier, weightGrams, serviceType);

  const handleCitySearchChange = (val: string) => {
    setCitySearch(val);
    setDestinationCity(val);
    setShowCityDropdown(true);
  };

  const selectCity = (city: string) => {
    setDestinationCity(city);
    setCitySearch(city);
    setShowCityDropdown(false);
  };

  const handleCourierChoice = (cp: CourierPartner) => {
    setSelectedCourier(cp);
    setShowCourierModal(false);
    ignoreNextModalOpen.current = true;
    setLocalActiveView('create');
    setActiveView('create');
  };

  const validateForm = () => {
    if (!destinationCity.trim()) return 'Destination City is required';
    if (!completeAddress.trim()) return 'Complete Address is required';
    if (!customerName.trim()) return 'Customer Name is required';
    
    // Customer Phone validation (03xx-xxxxxxx format check or 11 digits check)
    const cleanPhone = customerPhone.replace(/[-\s]/g, '');
    if (!/^03\d{9}$/.test(cleanPhone)) {
      return 'Customer Phone must be a valid Pakistani mobile number (e.g. 03xx-xxxxxxx, 11 digits)';
    }

    if (!productName.trim()) return 'Product Name is required';
    if (codAmount === undefined || codAmount < 0) return 'Valid COD Amount is required';
    if (!weightGrams || weightGrams <= 0) return 'Valid Weight in grams is required';
    if (!pickupAddressId) return 'Please select an origin pickup address';

    return null;
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }
    setShowConfirmModal(true);
  };

  // Confirm and Final Submission trigger
  const handleFinalConfirm = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const randomId = `SJC${Math.floor(100000 + Math.random() * 900000)}`;
      const randomTrk = `${selectedCourier.id.substring(0, 3)}-TRK-${Math.floor(10000 + Math.random() * 90000)}`;
      
      onAddOrder({
        customerName,
        customerPhone,
        customerAddress: completeAddress,
        destinationCity,
        courier: selectedCourier.name as any,
        weight: weightGrams / 1000, // converted to KG
        codAmount: Number(codAmount),
        productDescription: `${productName} (Qty: ${quantity})`,
        status: 'Pending',
        bookingDate: new Date().toISOString().split('T')[0]
      });

      setLastGeneratedTracking(randomTrk);
      setIsProcessing(false);
      setShowConfirmModal(false);
      setShowSuccessModal(true);

      // Clear form inputs
      setCustomerName('');
      setCustomerPhone('');
      setCompleteAddress('');
      setDestinationCity('');
      setCitySearch('');
      setProductName('');
      setCodAmount(0);
      setWeightGrams(500);
      setQuantity(1);
      setReferenceNo('');
      setSpecialInstructions('');
    }, 1200); // Simulated network delay
  };

  // Dynamic status-specific color helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Processed':
      case 'Received':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'In Transit':
      case 'In Progress':
        return 'bg-sky-50 text-sky-700 border border-sky-200';
      case 'Out for Delivery':
        return 'bg-violet-50 text-violet-700 border border-violet-200';
      case 'Pending':
      case 'Booked':
        return 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-500 border border-slate-200';
      case 'Returned':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'Issued':
      case 'Issue Detected':
        return 'bg-red-50 text-red-700 border border-red-200 font-bold';
      case 'ReAttempt':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'Ready to Return':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'Return Confirmed':
        return 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200';
      case 'Lost':
        return 'bg-zinc-800 text-zinc-100 border border-zinc-900 font-bold';
      case 'At Destination':
        return 'bg-teal-50 text-teal-700 border border-teal-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
    }
  };

  const handlePrintAWB = (order: Order) => {
    const win = window.open('', '_blank');
    if (!win) {
      alert('Popups are blocked by your browser. Please allow popups to view the label.');
      return;
    }

    const activePickup = pickupAddresses.find(p => p.isDefault) || pickupAddresses[0] || {
      name: 'Laskhy Laser',
      phone: '03076542923',
      city: 'Kabir Wala',
      address: 'Sardar Pur Road, Hussainabad Near Dera Ch. Abdul Aziz, Tehsil Kabirwala'
    };

    const getCourierHeaderLogo = (courierName: string) => {
      const c = (courierName || '').toLowerCase();
      if (c.includes('leopard')) {
        return `
          <div style="display:flex; align-items:center; gap: 8px;">
            <span style="font-size: 30px; font-weight: 900; font-style: italic; font-family: sans-serif; color: #111; letter-spacing: -1.5px;">Leopards</span>
            <svg viewBox="0 0 100 100" style="width: 48px; height: 48px;">
              <path d="M 12 40 C 22 28, 42 28, 52 35 C 57 38, 62 35, 72 28 C 62 41, 52 45, 42 41 C 32 37, 22 43, 12 40 Z" fill="#111" />
              <path d="M 22 45 C 32 39, 42 47, 52 43 L 67 53 C 57 49, 47 51, 37 49 C 27 47, 25 50, 22 45 Z" fill="#111" />
            </svg>
          </div>
        `;
      } else if (c.includes('tcs')) {
        return `
          <div style="display:flex; align-items:center; gap: 6px;">
            <svg viewBox="0 0 100 100" style="width: 44px; height: 44px;"><rect width="100" height="100" rx="12" fill="#E21B22"/><path d="M 12 70 Q 50 82 88 70" stroke="#FFF200" stroke-width="5" fill="none" /><text x="50" y="55" fill="#FFFFFF" font-size="28" font-weight="950" font-style="italic" text-anchor="middle" font-family="sans-serif">TCS</text></svg>
            <span style="font-size: 26px; font-weight: 900; font-style: italic; color: #E21B22; font-family: sans-serif;">TCS</span>
          </div>
        `;
      } else if (c.includes('trax')) {
        return `
          <div style="display:flex; align-items:center; gap: 6px;">
            <svg viewBox="0 0 100 100" style="width: 44px; height: 44px;"><rect width="100" height="100" rx="12" fill="#18181B"/><line x1="15" y1="22" x2="85" y2="22" stroke="#EA580C" stroke-width="5" /><text x="50" y="60" fill="#FFFFFF" font-size="22" font-weight="950" text-anchor="middle" font-family="sans-serif">TRAX</text></svg>
            <span style="font-size: 26px; font-weight: 950; color: #18181B; font-family: sans-serif; letter-spacing: 1px;">TRAX</span>
          </div>
        `;
      } else if (c.includes('m&p') || c.includes('m & p')) {
        return `
          <div style="display:flex; align-items:center; gap: 6px;">
            <svg viewBox="0 0 100 100" style="width: 44px; height: 44px;"><rect width="100" height="100" rx="12" fill="#0F172A"/><path d="M 20 25 L 45 70 L 55 70 L 80 25" stroke="#F97316" stroke-width="7" fill="none" /><path d="M 35 25 L 50 56 L 65 25" stroke="#FFFFFF" stroke-width="7" fill="none" /></svg>
            <span style="font-size: 26px; font-weight: 900; color: #0F172A; font-family: sans-serif;">M&P</span>
          </div>
        `;
      } else {
        return `
          <div style="display:flex; align-items:center; gap: 6px;">
            <svg viewBox="0 0 100 100" style="width: 44px; height: 44px;"><rect width="100" height="100" rx="12" fill="#0D9488"/><path d="M 54 15 L 34 48 L 49 48 L 46 80 L 66 48 L 51 48 Z" fill="#FFF200" stroke="#FFFFFF" stroke-width="2.5" /></svg>
            <span style="font-size: 24px; font-weight: 950; color: #0D9488; font-family: sans-serif;">${order.courier}</span>
          </div>
        `;
      }
    };

    win.document.write(`
      <html>
        <head>
          <title>SJ Courier Shipping Label - ${order.trackingNo}</title>
          <style>
            @media print {
              body {
                margin: 0;
                padding: 0;
                background-color: #fff;
              }
              .label-container {
                border: 2px solid #000 !important;
                box-shadow: none !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              margin: 15px;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #f8fafc;
            }
            .label-container {
              width: 880px;
              height: 420px;
              border: 3px solid #000;
              border-radius: 12px;
              background: #fff;
              display: flex;
              flex-direction: column;
              box-sizing: border-box;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            }
            .header-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 10px 18px;
              border-bottom: 2px solid #000;
              height: 70px;
              box-sizing: border-box;
            }
            .courier-logo-section {
              width: 250px;
              display: flex;
              align-items: center;
            }
            .tracking-pill-box {
              background-color: #111;
              color: #fff;
              padding: 4px 15px;
              font-size: 14px;
              font-weight: bold;
              letter-spacing: 0.5px;
              border-radius: 2px;
              font-family: monospace;
              text-align: center;
              min-width: 140px;
              border-top: 4px solid #111;
            }
            .sj-logo-section {
              width: 250px;
              display: flex;
              align-items: center;
              justify-content: flex-end;
            }
            .sj-logo-container {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .sj-logo-text {
              text-align: right;
            }
            .sj-logo-main {
              font-size: 26px;
              font-weight: 950;
              color: #1e3a8a;
              letter-spacing: -0.5px;
              line-height: 0.9;
            }
            .sj-logo-sub {
              font-size: 8px;
              font-weight: bold;
              color: #f97316;
              letter-spacing: 1.2px;
              text-transform: uppercase;
              margin-top: 1px;
            }
            .main-grid {
              display: grid;
              grid-template-columns: 2.2fr 1.6fr 2.2fr;
              flex: 1;
              height: 310px;
              box-sizing: border-box;
            }
            .column-left, .column-right {
              display: flex;
              flex-direction: column;
              box-sizing: border-box;
            }
            .column-left {
              border-right: 2px solid #000;
            }
            .column-right {
              border-left: 2px solid #000;
            }
            .column-middle {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              padding: 6px;
              box-sizing: border-box;
              text-align: center;
            }
            .section-header {
              background-color: #e5e7eb;
              color: #111;
              font-size: 11px;
              font-weight: 900;
              text-transform: uppercase;
              text-align: center;
              padding: 4px 2px;
              border-bottom: 1.5px solid #000;
              letter-spacing: 0.5px;
            }
            .data-row {
              display: flex;
              align-items: flex-start;
              border-bottom: 1px solid #e5e7eb;
              padding: 5px 8px;
              font-size: 11.5px;
              line-height: 1.3;
            }
            .data-row:last-of-type {
              border-bottom: none;
            }
            .data-label {
              font-weight: 900;
              color: #000;
              width: 85px;
              flex-shrink: 0;
            }
            .data-value {
              color: #111;
              font-weight: 600;
            }
            .destination-banner {
              background-color: #1e293b;
              color: #fff;
              font-size: 12px;
              font-weight: 900;
              text-transform: uppercase;
              text-align: center;
              padding: 6px 2px;
              letter-spacing: 0.8px;
              margin-top: auto;
            }
            .qr-container {
              margin-top: 1px;
            }
            .qr-image {
              width: 95px;
              height: 95px;
              display: block;
            }
            .cod-text {
              font-size: 11px;
              font-weight: bold;
              color: #000;
              margin: 2px 0;
            }
            .cod-amount {
              font-size: 19px;
              font-weight: 950;
            }
            .barcode-image {
              width: 100%;
              max-width: 175px;
              height: 48px;
              object-fit: contain;
            }
            .product-box {
              font-size: 10px;
              font-weight: bold;
              border-top: 1px solid #ccc;
              width: 100%;
              padding-top: 3px;
              margin-top: 2px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .split-row {
              display: flex;
              width: 100%;
              border-top: 1px solid #ccc;
              border-bottom: 1px solid #ccc;
              font-size: 10px;
              text-align: center;
            }
            .split-col {
              flex: 1;
              background-color: #f3f4f6;
              padding: 2.5px 2px;
              font-weight: bold;
            }
            .split-col:first-child {
              border-right: 1px solid #ccc;
            }
            .order-id-box {
              font-size: 10px;
              font-weight: bold;
              margin-top: 1px;
            }
            .footer-row {
              background-color: #f3f4f6;
              border-top: 2px solid #000;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 15px;
              box-sizing: border-box;
            }
            .special-request {
              font-size: 11px;
              font-weight: 900;
              color: #000;
            }
            .footer-barcode-section {
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .footer-barcode-image {
              height: 25px;
              max-width: 110px;
            }
            .footer-barcode-text {
              font-size: 8px;
              font-weight: bold;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <div class="label-container">
            <!-- Header Row -->
            <div class="header-row">
              <div class="courier-logo-section">
                ${getCourierHeaderLogo(order.courier)}
              </div>
              <div class="tracking-pill-box">
                ${order.trackingNo || 'SJC-PENDING'}
              </div>
              <div class="sj-logo-section">
                <div class="sj-logo-container">
                  <svg viewBox="0 0 100 100" style="width: 44px; height: 44px; shrink-0: 0;">
                    <circle cx="50" cy="50" r="40" stroke="#1e3a8a" stroke-width="6" fill="none" stroke-dasharray="180 80" />
                    <text x="32" y="65" fill="#1e3a8a" font-size="44" font-weight="950" font-family="sans-serif">S</text>
                    <text x="56" y="65" fill="#f97316" font-size="44" font-weight="950" font-family="sans-serif">J</text>
                    <rect x="70" y="15" width="20" height="20" rx="4" fill="#f97316" />
                    <path d="M 75 25 L 85 25 M 80 20 L 80 30" stroke="#ffffff" stroke-width="2" />
                  </svg>
                  <div class="sj-logo-text">
                    <div class="sj-logo-main">SJ COURIER</div>
                    <div class="sj-logo-sub">SHAH JEE COURIER</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Main 3-Column Grid -->
            <div class="main-grid">
              
              <!-- Left Column: Consignee Details -->
              <div class="column-left">
                <div class="section-header">Consignee Details:</div>
                <div class="data-row">
                  <div class="data-label">Consignee:</div>
                  <div class="data-value">${order.customerName}</div>
                </div>
                <div class="data-row">
                  <div class="data-label">Destination:</div>
                  <div class="data-value">${order.destinationCity}</div>
                </div>
                <div class="data-row">
                  <div class="data-label">Ph:</div>
                  <div class="data-value">${order.customerPhone}</div>
                </div>
                <div class="data-row" style="flex-grow: 1; border-bottom: none;">
                  <div class="data-label">Address:</div>
                  <div class="data-value" style="word-break: break-word;">${order.customerAddress}</div>
                </div>
                <div class="destination-banner">
                  ${activePickup.city.toUpperCase()} &gt;&gt; ${order.destinationCity.toUpperCase()}
                </div>
              </div>

              <!-- Middle Column: QR, COD, Barcode -->
              <div class="column-middle">
                <div class="qr-container">
                  <img class="qr-image" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${order.trackingNo}" referrerPolicy="no-referrer" />
                </div>
                
                <div class="cod-text">
                  COD: <span class="cod-amount">${order.codAmount} Pkr</span>
                </div>

                <img class="barcode-image" src="https://barcode.tec-it.com/barcode.ashx?data=${order.trackingNo}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96" referrerPolicy="no-referrer" />

                <div class="product-box">
                  Product: ${order.productDescription || 'General Item'}
                </div>

                <div class="split-row">
                  <div class="split-col">Wgt: ${order.weight} KG</div>
                  <div class="split-col">Qty: 1</div>
                </div>

                <div class="order-id-box">
                  Order ID: ${order.id || 'N/A'}
                </div>
              </div>

              <!-- Right Column: Shipper Details -->
              <div class="column-right">
                <div class="section-header">Shipper Details:</div>
                <div class="data-row">
                  <div class="data-label">Shipper:</div>
                  <div class="data-value">${activePickup.name}</div>
                </div>
                <div class="data-row">
                  <div class="data-label">Origin:</div>
                  <div class="data-value">${activePickup.city}</div>
                </div>
                <div class="data-row">
                  <div class="data-label">Ph:</div>
                  <div class="data-value">${activePickup.phone}</div>
                </div>
                <div class="data-row" style="flex-grow: 1; border-bottom: none;">
                  <div class="data-label">Pickup Address:</div>
                  <div class="data-value" style="word-break: break-word;">${activePickup.address}</div>
                </div>
                <div class="data-row" style="border-top: 1px solid #e5e7eb; padding: 6px 8px; background: #fafafa;">
                  <div class="data-label">Return Address:</div>
                  <div class="data-value">Same As Above</div>
                </div>
              </div>

            </div>

            <!-- Footer Row -->
            <div class="footer-row">
              <div class="special-request">
                Special Request: <span style="font-weight: 500;">${order.productDescription?.toLowerCase().includes('fragile') ? 'Fragile Item ⚠️' : 'Handle with Care'}</span>
              </div>
              <div class="footer-barcode-section">
                <img class="footer-barcode-image" src="https://barcode.tec-it.com/barcode.ashx?data=${order.trackingNo}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96" referrerPolicy="no-referrer" />
                <span class="footer-barcode-text">${order.trackingNo}</span>
              </div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const getCourierFinanceStats = (courierKey: string) => {
    const courierOrders = orders.filter(o => {
      const ocr = o.courier as string;
      if (courierKey === 'BarqRaftar' || courierKey === 'Barqraftar') {
        return ocr === 'Barqraftar' || ocr === 'Lionex' || ocr === 'Run Courier';
      }
      return ocr === courierKey;
    });

    const filteredCourierOrders = courierOrders.filter(o => {
      const matchesSearch = !searchTerm || o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.trackingNo && o.trackingNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerPhone.includes(searchTerm) ||
        o.destinationCity.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesDateRange = true;
      if (dateRangeFilter && dateRangeFilter !== 'All Time') {
        const orderDate = new Date(o.bookingDate);
        const today = new Date('2026-07-01');
        const diffTime = Math.abs(today.getTime() - orderDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (dateRangeFilter === 'Last 7 Days') {
          matchesDateRange = diffDays <= 7;
        } else if (dateRangeFilter === 'Last 30 Days') {
          matchesDateRange = diffDays <= 30;
        } else if (dateRangeFilter === 'Last 60 Days') {
          matchesDateRange = diffDays <= 60;
        }
      }
      return matchesSearch && matchesDateRange;
    });

    const booked = filteredCourierOrders.filter(o => {
      const ost = o.status as string;
      return ost === 'Pending' || ost === 'Booked';
    });
    const delivered = filteredCourierOrders.filter(o => {
      const ost = o.status as string;
      return ost === 'Delivered' || ost === 'Processed' || ost === 'Received';
    });
    const inProgress = filteredCourierOrders.filter(o => {
      const ost = o.status as string;
      return ost === 'In Transit' || ost === 'In Progress' || ost === 'Out for Delivery' || ost === 'ReAttempt' || ost === 'At Destination';
    });
    const returned = filteredCourierOrders.filter(o => {
      const ost = o.status as string;
      return ost === 'Returned' || ost === 'Ready to Return' || ost === 'Return Confirmed';
    });

    const dispatchedAmount = filteredCourierOrders.reduce((sum, o) => sum + o.codAmount, 0);
    const bookedAmount = booked.reduce((sum, o) => sum + o.codAmount, 0);
    const deliveredAmount = delivered.reduce((sum, o) => sum + o.codAmount, 0);
    const inProgressAmount = inProgress.reduce((sum, o) => sum + o.codAmount, 0);
    const returnedAmount = returned.reduce((sum, o) => sum + o.codAmount, 0);

    return {
      totalCount: filteredCourierOrders.length,
      dispatchedAmount,
      bookedCount: booked.length,
      bookedAmount,
      deliveredCount: delivered.length,
      deliveredAmount,
      inProgressCount: inProgress.length,
      inProgressAmount,
      returnedCount: returned.length,
      returnedAmount,
    };
  };

  const filteredCities = PAKISTANI_CITIES.filter(c => 
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.trackingNo && o.trackingNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm) ||
      o.destinationCity.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter !== 'All') {
      const ost = o.status as string;
      if (statusFilter === 'Active') {
        matchesStatus = ost !== 'Pending' && ost !== 'Booked' && ost !== 'Delivered' && ost !== 'Returned' && ost !== 'Return Confirmed' && ost !== 'Cancelled';
      } else if (statusFilter === 'Booked') {
        matchesStatus = ost === 'Pending' || ost === 'Booked';
      } else if (statusFilter === 'Rider Picked') {
        matchesStatus = ost === 'Processed' || ost === 'Received';
      } else if (statusFilter === 'In Transit') {
        matchesStatus = ost === 'In Transit' || ost === 'In Progress';
      } else if (statusFilter === 'Out for Delivery') {
        matchesStatus = ost === 'Out for Delivery';
      } else if (statusFilter === 'Issue Detected') {
        matchesStatus = ost === 'Issued' || ost === 'Issue Detected';
      } else if (statusFilter === 'Re-Attempt') {
        matchesStatus = ost === 'ReAttempt';
      } else if (statusFilter === 'Ready to Return') {
        matchesStatus = ost === 'Ready to Return';
      } else if (statusFilter === 'Delivered') {
        matchesStatus = ost === 'Delivered';
      } else if (statusFilter === 'Return Confirmed') {
        matchesStatus = ost === 'Return Confirmed';
      } else if (statusFilter === 'Returned to Shipper') {
        matchesStatus = ost === 'Returned';
      } else if (statusFilter === 'Lost') {
        matchesStatus = ost === 'Lost';
      } else if (statusFilter === 'Cancelled') {
        matchesStatus = ost === 'Cancelled';
      } else if (statusFilter === 'At Destination') {
        matchesStatus = ost === 'At Destination';
      } else {
        matchesStatus = ost === statusFilter;
      }
    }

    let matchesCourier = true;
    if (courierFilter !== 'All') {
      const ocr = o.courier as string;
      if (courierFilter === 'BarqRaftar' || courierFilter === 'Barqraftar') {
        matchesCourier = ocr === 'Barqraftar' || ocr === 'Lionex' || ocr === 'Run Courier';
      } else {
        matchesCourier = ocr === courierFilter;
      }
    }

    let matchesDate = !dateFilter || o.bookingDate === dateFilter;

    // Date Range logic
    let matchesDateRange = true;
    if (dateRangeFilter && dateRangeFilter !== 'All Time') {
      const orderDate = new Date(o.bookingDate);
      const today = new Date('2026-07-01'); // Fixed current system local time from metadata
      const diffTime = Math.abs(today.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (dateRangeFilter === 'Last 7 Days') {
        matchesDateRange = diffDays <= 7;
      } else if (dateRangeFilter === 'Last 30 Days') {
        matchesDateRange = diffDays <= 30;
      } else if (dateRangeFilter === 'Last 60 Days') {
        matchesDateRange = diffDays <= 60;
      }
    }

    return matchesSearch && matchesStatus && matchesCourier && matchesDate && matchesDateRange;
  });

  return (
    <div className="space-y-6">
      {/* Top Navigation switcher with remove of 'Create New Booking' tab */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 flex-wrap gap-2">
        <div className="flex gap-6">
          <button
            onClick={() => {
              setLocalActiveView('list');
              setActiveView('list');
            }}
            className={`text-sm font-black pb-2 border-b-2 transition-all cursor-pointer border-indigo-600 text-indigo-600`}
          >
            My Shipment Bookings
          </button>
        </div>
      </div>

      {/* VIEW 1: BOOKINGS LIST */}
      {localActiveView === 'list' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Top Layout Buttons (Dashboard & Finance) */}
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => setActiveTopSubTab('dashboard')}
              className={`px-5 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                activeTopSubTab === 'dashboard'
                  ? 'bg-[#00925e] text-white shadow-sm'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Dashboard
            </button>
            <button 
              type="button"
              onClick={() => setActiveTopSubTab('finance')}
              className={`px-5 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                activeTopSubTab === 'finance'
                  ? 'bg-[#5b6e85] text-white shadow-sm'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Finance
            </button>
          </div>

          {/* 3PL Network Selector row with Logos & counts */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { id: 'Leopards', name: 'Leopards', count: orders.filter(o => o.courier === 'Leopards').length, color: 'border-amber-500' },
              { id: 'Trax', name: 'Trax', count: orders.filter(o => o.courier === 'Trax').length, color: 'border-orange-600' },
              { id: 'M&P', name: 'M&P', count: orders.filter(o => o.courier === 'M&P').length, color: 'border-blue-600' },
              { id: 'TCS', name: 'TCS', count: orders.filter(o => o.courier === 'TCS').length, color: 'border-red-600' },
              { id: 'BarqRaftar', name: 'BarqRaftar', count: orders.filter(o => (o.courier as string) === 'Barqraftar' || o.courier === 'Lionex' || o.courier === 'Run Courier').length, color: 'border-teal-600' },
            ].map((cp) => {
              const isSelected = courierFilter === cp.id;
              return (
                <button
                  key={cp.id}
                  type="button"
                  onClick={() => setCourierFilter(isSelected ? 'All' : cp.id)}
                  className={`bg-white border p-3.5 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left shadow-xs hover:shadow-md ${
                    isSelected 
                      ? `${cp.color} ring-2 ring-orange-500/10 bg-orange-50/10` 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                    {getCourierLogo(cp.id === 'BarqRaftar' ? 'Barqraftar' : cp.id)}
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-800 tracking-tight">{cp.name}</h5>
                    <p className="text-[10px] text-slate-400 font-extrabold mt-0.5">({cp.count})</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search, Date range, Exports & Page limits bar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs flex flex-col md:flex-row items-center gap-3.5">
            {/* Date Range dropdown selection */}
            <div className="w-full md:w-auto shrink-0">
              <select
                value={dateRangeFilter}
                onChange={(e) => {
                  setDateRangeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-slate-700 cursor-pointer focus:outline-none focus:border-indigo-500"
              >
                <option value="Last 7 Days">📅 Last 7 Days</option>
                <option value="Last 30 Days">📅 Last 30 Days</option>
                <option value="Last 60 Days">📅 Last 60 Days</option>
                <option value="All Time">📅 All Time</option>
              </select>
            </div>

            {/* Core Search box */}
            <div className="relative flex-grow w-full">
              <Search className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search track no, name, city, reference..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 font-semibold"
              />
            </div>

            {/* Quick action buttons & Limits */}
            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-between md:justify-end">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => alert('Exporting all shipment records to Microsoft Excel format...')}
                  className="h-10 w-10 bg-[#0f8f5d] hover:bg-[#0c7c50] active:scale-95 text-white flex items-center justify-center rounded-xl transition shadow-xs cursor-pointer"
                  title="Export to Excel"
                >
                  <Download className="h-4.5 w-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => alert('Generating PDF consolidated loadsheet report...')}
                  className="h-10 w-10 bg-[#c22026] hover:bg-[#a61b20] active:scale-95 text-white flex items-center justify-center rounded-xl transition shadow-xs cursor-pointer"
                  title="Export to PDF"
                >
                  <FileText className="h-4.5 w-4.5" />
                </button>
              </div>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="10">10 Per Page</option>
                <option value="25">25 Per Page</option>
                <option value="50">50 Per Page</option>
                <option value="100">100 Per Page</option>
              </select>
            </div>
          </div>

          {/* Dynamic 14 Status Filter Cards Grid OR Financial Audit per activeTopSubTab */}
          {activeTopSubTab === 'finance' ? (
            <div className="space-y-6">
              {/* 1. Large 4 Financial Cards matching Image 3 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Delivered Amount',
                    amount: orders
                      .filter(o => {
                        const ost = o.status as string;
                        const isDelivered = ost === 'Delivered' || ost === 'Processed' || ost === 'Received';
                        let matchesCourier = true;
                        if (courierFilter !== 'All') {
                          const ocr = o.courier as string;
                          if (courierFilter === 'BarqRaftar' || courierFilter === 'Barqraftar') {
                            matchesCourier = ocr === 'Barqraftar' || ocr === 'Lionex' || ocr === 'Run Courier';
                          } else {
                            matchesCourier = ocr === courierFilter;
                          }
                        }
                        return isDelivered && matchesCourier;
                      })
                      .reduce((sum, o) => sum + o.codAmount, 0),
                    color: 'border-emerald-200 bg-emerald-50/10 text-emerald-700',
                  },
                  {
                    label: 'In Progress Amount',
                    amount: orders
                      .filter(o => {
                        const ost = o.status as string;
                        const isInProgress = ost === 'In Transit' || ost === 'In Progress' || ost === 'Out for Delivery' || ost === 'ReAttempt' || ost === 'At Destination';
                        let matchesCourier = true;
                        if (courierFilter !== 'All') {
                          const ocr = o.courier as string;
                          if (courierFilter === 'BarqRaftar' || courierFilter === 'Barqraftar') {
                            matchesCourier = ocr === 'Barqraftar' || ocr === 'Lionex' || ocr === 'Run Courier';
                          } else {
                            matchesCourier = ocr === courierFilter;
                          }
                        }
                        return isInProgress && matchesCourier;
                      })
                      .reduce((sum, o) => sum + o.codAmount, 0),
                    color: 'border-blue-200 bg-blue-50/10 text-blue-700',
                  },
                  {
                    label: 'Returned Amount',
                    amount: orders
                      .filter(o => {
                        const ost = o.status as string;
                        const isReturned = ost === 'Returned' || ost === 'Ready to Return' || ost === 'Return Confirmed';
                        let matchesCourier = true;
                        if (courierFilter !== 'All') {
                          const ocr = o.courier as string;
                          if (courierFilter === 'BarqRaftar' || courierFilter === 'Barqraftar') {
                            matchesCourier = ocr === 'Barqraftar' || ocr === 'Lionex' || ocr === 'Run Courier';
                          } else {
                            matchesCourier = ocr === courierFilter;
                          }
                        }
                        return isReturned && matchesCourier;
                      })
                      .reduce((sum, o) => sum + o.codAmount, 0),
                    color: 'border-rose-200 bg-rose-50/10 text-rose-700',
                  },
                  {
                    label: 'Dispatched Amount',
                    amount: orders
                      .filter(o => {
                        let matchesCourier = true;
                        if (courierFilter !== 'All') {
                          const ocr = o.courier as string;
                          if (courierFilter === 'BarqRaftar' || courierFilter === 'Barqraftar') {
                            matchesCourier = ocr === 'Barqraftar' || ocr === 'Lionex' || ocr === 'Run Courier';
                          } else {
                            matchesCourier = ocr === courierFilter;
                          }
                        }
                        return matchesCourier;
                      })
                      .reduce((sum, o) => sum + o.codAmount, 0),
                    color: 'border-orange-200 bg-orange-50/10 text-[#ea580c]',
                  },
                ].map((card) => (
                  <div key={card.label} className={`border rounded-2xl p-4 bg-white shadow-xs text-left ${card.color}`}>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{card.label}</span>
                    <div className="flex items-baseline mt-2.5">
                      <span className="text-xs text-slate-400 font-extrabold mr-1">Rs.</span>
                      <span className="text-xl font-black text-slate-800 leading-none">{card.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. Comparative grid of all couriers showing dispatch, booked, delivered, progress, returned */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-left">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">3PL Network Financial Audit</h4>
                    <p className="text-[10.5px] text-slate-400 font-bold mt-0.5">Summary of dispatches, books, deliveries, transit & return values per courier partner</p>
                  </div>
                  <div className="bg-orange-50 text-[#ea580c] border border-orange-100 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shrink-0">
                    Live Finance Reporting
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[
                    { id: 'Leopards', name: 'Leopards Courier' },
                    { id: 'Trax', name: 'Trax Logistics' },
                    { id: 'M&P', name: 'M&P Express' },
                    { id: 'TCS', name: 'TCS Express' },
                    { id: 'BarqRaftar', name: 'BarqRaftar (Run/LNX)' }
                  ].map((cp) => {
                    const stats = getCourierFinanceStats(cp.id);
                    const isSelected = courierFilter === cp.id;
                    return (
                      <div 
                        key={cp.id}
                        className={`border rounded-2xl p-4 bg-white transition-all duration-200 ${
                          isSelected 
                            ? 'border-orange-500 ring-2 ring-orange-500/10 shadow-md' 
                            : 'border-slate-200 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-slate-50 border border-slate-100">
                            {getCourierLogo(cp.id === 'BarqRaftar' ? 'Barqraftar' : cp.id)}
                          </div>
                          <div>
                            <h5 className="text-[11px] font-black text-slate-800 leading-tight">{cp.name}</h5>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                              Total: {stats.totalCount} orders
                            </span>
                          </div>
                        </div>

                        {/* Stats Rows */}
                        <div className="space-y-2 text-[10.5px]">
                          {/* Dispatched */}
                          <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                            <span className="text-slate-400 font-bold">Dispatched</span>
                            <span className="font-black text-slate-700">Rs. {stats.dispatchedAmount.toLocaleString()}</span>
                          </div>

                          {/* Booked */}
                          <button
                            type="button"
                            onClick={() => {
                              setCourierFilter(cp.id);
                              setStatusFilter('Booked');
                              setCurrentPage(1);
                            }}
                            className="w-full flex justify-between items-center py-0.5 text-left text-slate-600 hover:text-indigo-600 font-bold transition cursor-pointer"
                          >
                            <span className="text-slate-400 font-bold">└ Booked</span>
                            <span className="font-black text-indigo-600">Rs. {stats.bookedAmount.toLocaleString()} ({stats.bookedCount})</span>
                          </button>

                          {/* Delivered */}
                          <button
                            type="button"
                            onClick={() => {
                              setCourierFilter(cp.id);
                              setStatusFilter('Delivered');
                              setCurrentPage(1);
                            }}
                            className="w-full flex justify-between items-center py-0.5 text-left text-slate-600 hover:text-emerald-600 font-bold transition cursor-pointer"
                          >
                            <span className="text-slate-400 font-bold">└ Delivered</span>
                            <span className="font-black text-emerald-600">Rs. {stats.deliveredAmount.toLocaleString()} ({stats.deliveredCount})</span>
                          </button>

                          {/* In Progress */}
                          <button
                            type="button"
                            onClick={() => {
                              setCourierFilter(cp.id);
                              setStatusFilter('In Transit');
                              setCurrentPage(1);
                            }}
                            className="w-full flex justify-between items-center py-0.5 text-left text-slate-600 hover:text-blue-600 font-bold transition cursor-pointer"
                          >
                            <span className="text-slate-400 font-bold">└ In Progress</span>
                            <span className="font-black text-blue-600">Rs. {stats.inProgressAmount.toLocaleString()} ({stats.inProgressCount})</span>
                          </button>

                          {/* Returned */}
                          <button
                            type="button"
                            onClick={() => {
                              setCourierFilter(cp.id);
                              setStatusFilter('Returned to Shipper');
                              setCurrentPage(1);
                            }}
                            className="w-full flex justify-between items-center py-0.5 text-left text-slate-600 hover:text-rose-600 font-bold transition cursor-pointer"
                          >
                            <span className="text-slate-400 font-bold">└ Returned</span>
                            <span className="font-black text-rose-600">Rs. {stats.returnedAmount.toLocaleString()} ({stats.returnedCount})</span>
                          </button>
                        </div>

                        {/* View Orders trigger */}
                        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setCourierFilter(cp.id);
                              setStatusFilter('All');
                              setCurrentPage(1);
                            }}
                            className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider transition ${
                              isSelected 
                                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Filter All below
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Dynamic 15 Status Filter Cards Grid */
            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">Filter by Shipment Status:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-3">
                {[
                  { label: 'All', value: 'All' },
                  { label: 'Active', value: 'Active' },
                  { label: 'Booked', value: 'Booked' },
                  { label: 'Rider Picked', value: 'Rider Picked' },
                  { label: 'In Transit', value: 'In Transit' },
                  { label: 'Out for Delivery', value: 'Out for Delivery' },
                  { label: 'Issue Detected', value: 'Issue Detected' },
                  { label: 'Re-Attempt', value: 'Re-Attempt' },
                  { label: 'Ready to Return', value: 'Ready to Return' },
                  { label: 'Delivered', value: 'Delivered' },
                  { label: 'Return Confirmed', value: 'Return Confirmed' },
                  { label: 'Returned to Shipper', value: 'Returned to Shipper' },
                  { label: 'Lost', value: 'Lost' },
                  { label: 'Cancelled', value: 'Cancelled' },
                  { label: 'At Destination', value: 'At Destination' }
                ].map((card) => {
                  const isSelected = statusFilter === card.value;
                  
                  // Get dynamic counts using local helper
                  const getStatusCount = (statusName: string) => {
                    return orders.filter(o => {
                      // Search filter
                      const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (o.trackingNo && o.trackingNo.toLowerCase().includes(searchTerm.toLowerCase())) || 
                        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        o.customerPhone.includes(searchTerm) ||
                        o.destinationCity.toLowerCase().includes(searchTerm.toLowerCase());
                      
                      // Courier filter
                      let matchesCourier = true;
                      if (courierFilter !== 'All') {
                        const ocr = o.courier as string;
                        if (courierFilter === 'BarqRaftar' || courierFilter === 'Barqraftar') {
                          matchesCourier = ocr === 'Barqraftar' || ocr === 'Lionex' || ocr === 'Run Courier';
                        } else {
                          matchesCourier = ocr === courierFilter;
                        }
                      }

                      // Date range filter
                      let matchesDateRange = true;
                      if (dateRangeFilter && dateRangeFilter !== 'All Time') {
                        const orderDate = new Date(o.bookingDate);
                        const today = new Date('2026-07-01');
                        const diffTime = Math.abs(today.getTime() - orderDate.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        if (dateRangeFilter === 'Last 7 Days') matchesDateRange = diffDays <= 7;
                        else if (dateRangeFilter === 'Last 30 Days') matchesDateRange = diffDays <= 30;
                        else if (dateRangeFilter === 'Last 60 Days') matchesDateRange = diffDays <= 60;
                      }

                      if (!matchesSearch || !matchesCourier || !matchesDateRange) return false;

                      // Status filter matching
                      const ost = o.status as string;
                      if (statusName === 'All') return true;
                      if (statusName === 'Active') {
                        return ost !== 'Pending' && ost !== 'Booked' && ost !== 'Delivered' && ost !== 'Returned' && ost !== 'Return Confirmed' && ost !== 'Cancelled';
                      }
                      if (statusName === 'Booked') {
                        return ost === 'Pending' || ost === 'Booked';
                      }
                      if (statusName === 'Rider Picked') {
                        return ost === 'Processed' || ost === 'Received';
                      }
                      if (statusName === 'In Transit') {
                        return ost === 'In Transit' || ost === 'In Progress';
                      }
                      if (statusName === 'Out for Delivery') {
                        return ost === 'Out for Delivery';
                      }
                      if (statusName === 'Issue Detected') {
                        return ost === 'Issued' || ost === 'Issue Detected';
                      }
                      if (statusName === 'Re-Attempt') {
                        return ost === 'ReAttempt';
                      }
                      if (statusName === 'Ready to Return') {
                        return ost === 'Ready to Return';
                      }
                      if (statusName === 'Delivered') {
                        return ost === 'Delivered';
                      }
                      if (statusName === 'Return Confirmed') {
                        return ost === 'Return Confirmed';
                      }
                      if (statusName === 'Returned to Shipper') {
                        return ost === 'Returned';
                      }
                      if (statusName === 'Lost') {
                        return ost === 'Lost';
                      }
                      if (statusName === 'Cancelled') {
                        return ost === 'Cancelled';
                      }
                      if (statusName === 'At Destination') {
                        return ost === 'At Destination';
                      }
                      return ost === statusName;
                    }).length;
                  };

                  const count = getStatusCount(card.value);

                  return (
                    <button
                      key={card.value}
                      type="button"
                      onClick={() => {
                        setStatusFilter(card.value);
                        setCurrentPage(1);
                      }}
                      className={`bg-white border p-3 rounded-2xl flex flex-col items-center justify-between text-center transition-all cursor-pointer relative group/card ${
                        isSelected 
                          ? 'border-orange-500 ring-2 ring-orange-500/10' 
                          : 'border-slate-200/85 hover:border-slate-300'
                      }`}
                      style={{ minHeight: '90px' }}
                    >
                      {isSelected && (
                        <span className="absolute top-1.5 text-orange-500 text-[10px] font-black">✓</span>
                      )}
                      <span className="pt-2 text-[9.5px] font-extrabold text-slate-500 tracking-tight uppercase leading-none">
                        {card.label}
                      </span>
                      <span className="pb-1 text-base font-black text-slate-900 mt-2">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Action buttons: Add packet, Loadsheet, Bulk labels */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setShowCourierModal(true);
              }}
              className="bg-[#0284c7] hover:bg-sky-600 active:scale-95 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-sky-500/10 cursor-pointer flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Book New Parcel</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLoadSheetCourierModal(true);
              }}
              className="bg-[#7c3aed] hover:bg-violet-600 active:scale-95 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-violet-500/10 cursor-pointer flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span>Generate Loadsheet</span>
            </button>
            <button
              type="button"
              onClick={() => {
                alert('Generating PDF thermal barcoded shipping labels in bulk for thermal printers...\nSuccessfully sent to printer spool!');
              }}
              className="bg-[#ea580c] hover:bg-orange-600 active:scale-95 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-orange-500/10 cursor-pointer flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              <span>Bulk Print Labels</span>
            </button>
          </div>

          {/* Paginated Orders Table with Custom Headers */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[950px]">
                <thead>
                  <tr className="bg-slate-900 text-white font-black text-xs border-b border-slate-800">
                    <th className="p-4 text-[10.5px] uppercase tracking-wider text-center" style={{ width: '60px' }}>SR NO</th>
                    <th className="p-4 text-[10.5px] uppercase tracking-wider">COURIER</th>
                    <th className="p-4 text-[10.5px] uppercase tracking-wider">STATUS</th>
                    <th className="p-4 text-[10.5px] uppercase tracking-wider">TRACKING</th>
                    <th className="p-4 text-[10.5px] uppercase tracking-wider">CONSIGNEE</th>
                    <th className="p-4 text-[10.5px] uppercase tracking-wider">DESTINATION</th>
                    <th className="p-4 text-[10.5px] uppercase tracking-wider">DATE</th>
                    <th className="p-4 text-[10.5px] uppercase tracking-wider">COD</th>
                    <th className="p-4 text-[10.5px] uppercase tracking-wider text-center" style={{ width: '320px' }}>ACT.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-12 text-center text-slate-400 font-bold italic">
                        No orders found for selected filters.
                      </td>
                    </tr>
                  ) : (
                    // Implement real slicing based on pagination
                    filteredOrders
                      .slice((Math.min(currentPage, Math.ceil(filteredOrders.length / itemsPerPage) || 1) - 1) * itemsPerPage, Math.min(currentPage, Math.ceil(filteredOrders.length / itemsPerPage) || 1) * itemsPerPage)
                      .map((order, idx) => {
                        const globalIndex = (Math.min(currentPage, Math.ceil(filteredOrders.length / itemsPerPage) || 1) - 1) * itemsPerPage + idx + 1;
                        return (
                          <tr key={order.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-4 text-center font-mono font-black text-slate-800">
                              {globalIndex}
                            </td>
                            <td className="p-4">
                              <button
                                type="button"
                                className="inline-flex items-center gap-1.5 text-[10px] font-black text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 px-2.5 py-1.5 rounded-lg shadow-2xs transition select-none cursor-pointer"
                                onClick={() => setCourierFilter(order.courier)}
                              >
                                <span>🚚</span>
                                <span>{order.courier}</span>
                              </button>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                                {order.status === 'Pending' || order.status === 'Booked' ? 'Booked' :
                                 order.status === 'Processed' || order.status === 'Received' ? 'Rider Picked' :
                                 order.status === 'In Transit' || order.status === 'In Progress' ? 'In Transit' :
                                 order.status === 'ReAttempt' ? 'Re-Attempt' :
                                 order.status === 'Issued' ? 'Issue Detected' :
                                 order.status === 'Ready to Return' ? 'Ready to Return' :
                                 order.status === 'Return Confirmed' ? 'Return Confirmed' :
                                 order.status === 'Returned' ? 'Returned to Shipper' :
                                 order.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="font-mono font-black text-indigo-900 block text-xs">{order.id}</span>
                              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                                {order.trackingNo || 'SJC-TRK-PENDING'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="font-black text-slate-900 text-xs">{order.customerName}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5 font-bold">{order.customerPhone}</div>
                            </td>
                            <td className="p-4">
                              <div className="font-black text-slate-800">{order.destinationCity}</div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[200px] mt-0.5 font-medium">{order.customerAddress}</div>
                            </td>
                            <td className="p-4 font-bold text-slate-600">
                              {order.bookingDate}
                            </td>
                            <td className="p-4">
                              <div className="font-black text-emerald-600 text-xs">Rs. {order.codAmount.toLocaleString()}</div>
                              <div className="text-[9.5px] text-slate-400 mt-0.5 font-bold">DC: Rs. {order.deliveryCharges}</div>
                            </td>
                            <td className="p-4 text-center space-x-1 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setSelectedOrderForDetail(order)}
                                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl transition text-[10px] font-black cursor-pointer inline-flex items-center gap-1"
                                title="View Detail"
                              >
                                <span>🔍</span>
                                <span>View Detail</span>
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => setSelectedOrderForTrack(order)}
                                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-xl transition text-[10px] font-black cursor-pointer inline-flex items-center gap-1"
                                title="Live Track"
                              >
                                <span>🛰️</span>
                                <span>Live Track</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handlePrintAWB(order)}
                                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl transition text-[10px] font-black cursor-pointer inline-flex items-center gap-1"
                                title="Print Slip"
                              >
                                <Printer className="h-3 w-3" />
                                <span>Print Slip</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>

            {/* Real Pagination Controls */}
            {filteredOrders.length > itemsPerPage && (
              <div className="bg-slate-50 border-t border-slate-100 p-4 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} shipments
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={currentPage >= Math.ceil(filteredOrders.length / itemsPerPage)}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* VIEW 2: CREATE NEW BOOKING WORKSPACE */}
      {localActiveView === 'create' && (
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 animate-fade-in text-left">
          {/* Main Input Form Column */}
          <form onSubmit={handleOpenConfirm} className="flex-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              
              <div className="border-b border-slate-100 pb-4 mb-2">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-orange-600" />
                  <span>Create New Parcel Booking</span>
                </h3>
                <p className="text-[11px] text-slate-500">Provide the correct address information and customer details for COD collections.</p>
              </div>

              {/* Selected Courier Top Banner with Name & Logo */}
              <div className="bg-gradient-to-r from-slate-50 to-orange-50/10 border border-slate-200/80 p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
                {getCourierLogo(selectedCourier.id, 'light')}
                <div className="flex-1">
                  <span className="text-[9px] bg-orange-100 text-orange-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Selected Dispatch Carrier</span>
                  <h4 className="text-sm font-black text-slate-900 mt-1 uppercase tracking-tight">{selectedCourier.name} Express Dispatch</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{selectedCourier.tagline}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCourierModal(true)}
                  className="text-xs bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 hover:border-orange-300 px-4 py-2 rounded-xl font-black transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Change Courier
                </button>
              </div>

              {/* CONSIGNEE DETAILS BLOCK */}
              <div className="space-y-4 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg">
                  1. Consignee Details (وصول کنندہ کی معلومات)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Searchable Autocomplete City with A-Z slider boxes */}
                  <div className="relative md:col-span-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10.5px] font-black uppercase text-slate-700 block">Destination City * (شہر کا نام منتخب کریں)</label>
                      <span className="text-[10px] text-orange-600 font-bold">Selected: {destinationCity || 'None'}</span>
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input 
                          type="text" 
                          placeholder="Search city (A-Z)..."
                          value={citySearch}
                          onChange={(e) => handleCitySearchChange(e.target.value)}
                          onFocus={() => setShowCityDropdown(true)}
                          className="w-full text-xs p-3 pl-10 pr-8 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-slate-900 font-bold bg-white" 
                        />
                        <Search className="h-4 w-4 absolute left-3 top-3.5 text-slate-400" />
                      </div>
                      <button 
                        type="button"
                        onClick={() => selectCity(citySearch)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-3 rounded-xl font-black shadow-sm transition active:scale-95 shrink-0"
                      >
                        Find City
                      </button>
                    </div>

                    {/* A-Z Letter Box Slider Slider/Carousel */}
                    <div>
                      <p className="text-[9.5px] font-bold text-slate-400 uppercase mb-1.5">A-Z Fast Filter City Slider</p>
                      <div className="flex gap-1 overflow-x-auto pb-2 custom-scrollbar scroll-smooth">
                        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
                          const hasCities = PAKISTANI_CITIES.some(c => c.toUpperCase().startsWith(letter));
                          const isLetterActive = selectedCityLetter === letter;
                          return (
                            <button
                              key={letter}
                              type="button"
                              onClick={() => {
                                setSelectedCityLetter(letter);
                                const firstCity = PAKISTANI_CITIES.find(c => c.toUpperCase().startsWith(letter));
                                if (firstCity) {
                                  selectCity(firstCity);
                                }
                              }}
                              className={`w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center shrink-0 border transition-all ${
                                !hasCities 
                                  ? 'opacity-30 border-slate-200 text-slate-300 cursor-not-allowed'
                                  : isLetterActive 
                                  ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                              }`}
                              disabled={!hasCities}
                            >
                              {letter}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Horizontal Box of cities starting with selected letter */}
                    <div>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-white border border-slate-200/60 rounded-xl custom-scrollbar">
                        {PAKISTANI_CITIES.filter(c => c.toUpperCase().startsWith(selectedCityLetter)).map(c => {
                          const isSel = destinationCity === c;
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => selectCity(c)}
                              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition ${
                                isSel
                                  ? 'bg-orange-50 border-orange-500 text-orange-700 font-extrabold'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {showCityDropdown && citySearch.trim() && (
                      <div className="absolute left-0 right-0 mt-1 max-h-44 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50 text-xs custom-scrollbar">
                        {filteredCities.length > 0 ? (
                          filteredCities.map(c => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => selectCity(c)}
                              className="w-full text-left px-3 py-2.5 hover:bg-slate-50 transition font-black text-slate-800 border-b border-slate-100 last:border-none cursor-pointer"
                            >
                              {c}
                            </button>
                          ))
                        ) : (
                          <div className="p-3 text-slate-400 italic">No matching city found.</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Consignee Name */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Consignee Name * (نام)</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter consignee full name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-slate-900 font-bold bg-white"
                    />
                  </div>

                  {/* Consignee Phone */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Consignee Phone * (موبائل نمبر)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 03332459021"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-slate-900 font-bold bg-white"
                    />
                  </div>

                  {/* 2nd Phone (Optional) */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">2nd Phone (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 03462344807"
                      value={secondPhone}
                      onChange={(e) => setSecondPhone(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-slate-900 font-medium bg-white"
                    />
                  </div>

                  {/* Reference ID / Shopify / WooCommerce */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Reference Order ID (optional)</label>
                    <input
                      type="text"
                      placeholder="Shopify / WooCommerce ID"
                      value={refOrderId}
                      onChange={(e) => setRefOrderId(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-slate-900 font-medium bg-white"
                    />
                  </div>

                  {/* Complete Address Textarea */}
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Complete Address * (تفصیلی پتہ)</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="House, Street number, Sector, Block or Landmark"
                      value={completeAddress}
                      onChange={(e) => setCompleteAddress(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-slate-900 font-semibold bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* PARCEL DETAILS BLOCK */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg">
                  2. Parcel Details (پارسل کی تفصیلات)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  
                  {/* Product Name selection and writing */}
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Product Name * (پروڈکٹ کا نام)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Premium Peshawari Chappal, Ladies Kurti..."
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-slate-900 font-bold bg-white"
                    />
                    
                    {/* Product quick option tags */}
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {["General Item", "Gift Item", "Flash Item", "Customised", "Unstitched Suit"].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setProductName(item)}
                          className="px-2.5 py-1 text-[9.5px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition"
                        >
                          + {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity and tags */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Quantity * (تعداد)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-slate-900 font-bold bg-white"
                    />
                    {/* Quick quantity tags */}
                    <div className="flex gap-1.5 mt-1.5">
                      {[1, 2, 3, 4].map((qty) => (
                        <button
                          key={qty}
                          type="button"
                          onClick={() => setQuantity(qty)}
                          className={`px-3 py-1 rounded-lg text-[9.5px] font-black transition ${
                            quantity === qty 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {String(qty).padStart(2, '0')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weight in kg and tags */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Weight (KG) * (وزن کلوگرام میں)</label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      min={0.1}
                      value={(weightGrams / 1000).toFixed(1)}
                      onChange={(e) => setWeightGrams(Number(e.target.value) * 1000)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-slate-900 font-bold bg-white"
                    />
                    {/* Weight quick tags */}
                    <div className="flex gap-1.5 mt-1.5">
                      {[0.5, 1.0, 2.0, 3.0, 5.0].map((kg) => (
                        <button
                          key={kg}
                          type="button"
                          onClick={() => setWeightGrams(kg * 1000)}
                          className={`px-3 py-1 rounded-lg text-[9.5px] font-black transition ${
                            (weightGrams / 1000) === kg
                              ? 'bg-orange-500 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {kg.toFixed(1)}kg
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* COD AMOUNT and NON-COD CHECKBOX */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">COD Amount (PKR) * (جمع رقم)</label>
                    <input
                      type="number"
                      required
                      disabled={advancePaid}
                      value={advancePaid ? 0 : (codAmount === 0 ? '' : codAmount)}
                      onChange={(e) => setCodAmount(Number(e.target.value))}
                      placeholder="e.g. 3800"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-emerald-600 font-black bg-white disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>

                  {/* Non-COD checkbox option */}
                  <div className="flex items-center gap-2.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/50 mt-4.5">
                    <input 
                      type="checkbox" 
                      id="advance_paid"
                      checked={advancePaid}
                      onChange={(e) => {
                        setAdvancePaid(e.target.checked);
                        if (e.target.checked) setCodAmount(0);
                      }}
                      className="h-4.5 w-4.5 rounded text-orange-600 border-slate-300 focus:ring-orange-500 cursor-pointer"
                    />
                    <label htmlFor="advance_paid" className="cursor-pointer">
                      <p className="text-[10px] font-black text-slate-800 uppercase leading-none">Non-COD (Advance Paid)</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-1">Payment collected in advance via Easypaisa/HBL.</p>
                    </label>
                  </div>
                </div>
              </div>

              {/* SPECIAL INSTRUCTIONS BLOCK */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg">
                  3. Special Instructions (خصوصی ہدایات)
                </span>

                <div className="space-y-2 pt-2">
                  <textarea
                    rows={2}
                    placeholder="Type or select standard instructions below..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-slate-900 font-medium bg-white"
                  />

                  {/* Quick multi-select instruction chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Handle Carefully 📦",
                      "Allow to Open Parcel 🔍",
                      "Fragile Item ⚠️",
                      "Call Before Delivery 📞"
                    ].map((opt) => {
                      const isActive = specialInstructions.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            if (isActive) {
                              // Remove option from textarea
                              const regex = new RegExp(opt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*,?\\s*', 'g');
                              setSpecialInstructions(prev => prev.replace(regex, '').trim());
                            } else {
                              // Append option
                              setSpecialInstructions(prev => {
                                const trimPrev = prev.trim();
                                return trimPrev ? `${trimPrev}, ${opt}` : opt;
                              });
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[9.5px] font-bold border transition ${
                            isActive
                              ? 'bg-orange-50 border-orange-500 text-orange-700 font-black'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Form Footer Action buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCourierModal(true)}
                  className="text-xs text-orange-600 font-black hover:underline cursor-pointer flex items-center gap-1"
                >
                  Change Courier ({selectedCourier.name})
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLocalActiveView('list');
                      setActiveView('list');
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-black border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-black bg-[#ea580c] hover:bg-orange-600 text-white shadow-md active:scale-95 transition cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>

            </div>
          </form>

          {/* Sidebar calculations column */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 h-20 w-20 bg-orange-500/10 blur-2xl rounded-full"></div>
              
              <h3 className="text-xs font-black uppercase tracking-widest text-orange-400 mb-4 flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span>Rate Estimator</span>
              </h3>

              <div className="space-y-4">
                
                {/* Selected Courier mini banner with checkmark */}
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCourierLogo(selectedCourier.id, 'dark')}
                    <div>
                      <p className="text-[11px] font-black text-white">{selectedCourier.name} Express</p>
                      <p className="text-[9px] text-emerald-400 font-bold">Ready to Book</p>
                    </div>
                  </div>
                  <div className="h-6 w-6 bg-emerald-500/15 rounded-full flex items-center justify-center border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    ✓
                  </div>
                </div>

                {/* SERVICE TYPE (Overnight, Detain, Overland) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 block">Service Type * (سروس کی قسم)</label>
                  <div className="space-y-1.5 bg-slate-950 p-2 rounded-2xl border border-slate-800/50">
                    {[
                      { value: 'Overnight', label: 'Overnight', desc: 'Standard fast delivery next-day.' },
                      { value: 'Detain', label: 'Detain (above 5 kg)', desc: 'Secure transit hold for packets > 5 kg.' },
                      { value: 'Overland', label: 'Overland (10 kg sy ziada)', desc: 'Cheaper land cargo for heavy boxes > 10 kg.' }
                    ].map(type => {
                      const isSel = serviceType === type.value;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setServiceType(type.value as any)}
                          className={`w-full text-left p-2 rounded-xl transition cursor-pointer border ${
                            isSel 
                              ? 'bg-orange-500/10 border-orange-500 text-white' 
                              : 'border-slate-800 bg-transparent text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black">{type.label}</span>
                            {isSel && <span className="text-[9px] bg-orange-500 text-white font-extrabold px-1.5 rounded uppercase">Active</span>}
                          </div>
                          <p className="text-[8px] text-slate-500 font-medium mt-0.5">{type.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SHIPPER PICKUP ADDRESS (My Pickup Address select) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase text-slate-400 block">Shipper Pickup Address *</label>
                    <span className="text-[8.5px] text-teal-400 font-bold uppercase">Active Warehouse</span>
                  </div>
                  <div className="space-y-1.5 bg-slate-950 p-2 rounded-2xl border border-slate-800/50 max-h-48 overflow-y-auto custom-scrollbar">
                    {pickupAddresses.length === 0 ? (
                      <p className="p-3 text-slate-500 italic text-[10px]">No saved pickup address. Go to "My Pickup Address" to add one.</p>
                    ) : (
                      pickupAddresses.map(addr => {
                        const isSelected = pickupAddressId === addr.id;
                        return (
                          <div 
                            key={addr.id}
                            onClick={() => setPickupAddressId(addr.id)}
                            className={`border rounded-xl p-2 cursor-pointer transition text-left ${
                              isSelected 
                                ? 'border-orange-500/80 bg-orange-500/10 text-white' 
                                : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <input 
                                type="radio" 
                                checked={isSelected}
                                onChange={() => setPickupAddressId(addr.id)}
                                className="accent-orange-500 mt-0.5"
                              />
                              <div className="flex-grow min-w-0">
                                <p className="text-[10px] font-black truncate">{addr.name}</p>
                                <p className="text-[8px] truncate text-slate-500 leading-tight mt-0.5">{addr.address}, {addr.city}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Real-time Calculation Display box */}
                <div className="border-t border-slate-800 pt-4 mt-2 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400 font-bold">
                    <span>Base Fare (up to 500g):</span>
                    <span>Rs. {selectedCourier.baseCharge}</span>
                  </div>
                  {weightGrams > 500 && (
                    <div className="flex justify-between text-xs text-slate-400 font-bold">
                      <span>Extra Weight Fee ({((weightGrams - 500) / 1000).toFixed(1)} kg):</span>
                      <span>Rs. {Math.round(Math.ceil((weightGrams - 500) / 500) * (selectedCourier.ratePerGrams * 500))}</span>
                    </div>
                  )}
                  {serviceType !== 'Overnight' && (
                    <div className="flex justify-between text-xs text-slate-400 font-bold">
                      <span>Service Adjustment ({serviceType}):</span>
                      <span>
                        {serviceType === 'Overland' ? '-20%' : '+Rs. 50'}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t border-slate-800 pt-3 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest">Est. Delivery Charges</p>
                      <p className="text-[8px] text-slate-500 mt-0.5">* Charged on final delivery invoice</p>
                    </div>
                    <p className="text-xl font-black text-orange-400">
                      Rs. {calculatedDeliveryCharges}
                    </p>
                  </div>
                </div>

                {/* Confirm Booking CTA in Estimator Sidebar */}
                <button
                  type="submit"
                  onClick={handleOpenConfirm}
                  className="w-full py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-center block cursor-pointer"
                >
                  Confirm Booking
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3PL COURIER SELECTOR MODAL */}
      {showCourierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100 animate-scale-in">
            {/* Header matches screenshot */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3.5 text-left">
                <div className="bg-orange-500 text-white p-2.5 rounded-2xl flex items-center justify-center shadow-md shadow-orange-500/15">
                  <Check className="h-5 w-5 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">Select Courier</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">Pick a partner to book a packet</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowCourierModal(false); if (localActiveView === 'create' && !selectedCourier) { setLocalActiveView('list'); setActiveView('list'); } }}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl p-2.5 transition cursor-pointer w-10 h-10 flex items-center justify-center font-bold"
              >
                <span className="text-lg">&times;</span>
              </button>
            </div>

            {/* List matches screenshot */}
            <div className="p-6 flex flex-col gap-3 max-h-[65vh] overflow-y-auto">
              {COURIER_PARTNERS.map(cp => {
                const isSelected = selectedCourier && selectedCourier.id === cp.id;
                return (
                  <div
                    key={cp.id}
                    onClick={() => handleCourierChoice(cp)}
                    className={`rounded-2xl border p-4 cursor-pointer text-left transition-all duration-200 flex items-center justify-between select-none group hover:shadow-xs ${
                      isSelected 
                        ? 'border-orange-500 bg-orange-50/5 ring-1 ring-orange-500/10' 
                        : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-slate-50/30'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Logo container like image */}
                      <div className="w-14 h-14 shrink-0 rounded-2xl border border-slate-200/60 bg-white flex items-center justify-center p-1.5 overflow-hidden shadow-2xs group-hover:scale-102 transition-transform duration-200">
                        {getCourierLogo(cp.id, 'light')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-black text-slate-900 text-sm tracking-tight">{cp.name}</span>
                        <p className="text-xs text-slate-400 font-bold mt-0.5">{getCleanTagline(cp.id)}</p>
                        {cp.id === 'Barqraftar' && (
                          <p className="text-[10px] text-amber-600 font-extrabold mt-1 bg-amber-50 border border-amber-200/30 rounded-lg px-2 py-0.5 inline-block">
                            ⚠️ Delivery only in: Faisalabad, Gujranwala, Islamabad, Rawalpindi & Lahore (Only Pickup and Delivery)
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Chevron right indicator like image */}
                    <div className={`p-2 rounded-xl transition-all duration-200 border flex items-center justify-center ${
                      isSelected 
                        ? 'bg-orange-50 text-orange-500 border-orange-200 group-hover:scale-105' 
                        : 'bg-slate-50 text-slate-400 border-slate-200 group-hover:text-slate-700 group-hover:border-slate-300 group-hover:bg-slate-100 group-hover:scale-105'
                    }`}>
                      <ChevronRight className="h-4 w-4 stroke-[3]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="p-5 border-b border-slate-100 bg-slate-50 text-left">
              <h3 className="text-base font-black text-slate-900">Confirm Booking / بکنگ کی تصدیق</h3>
              <p className="text-xs text-slate-500 mt-0.5">Please verify the shipment details before final booking:</p>
            </div>

            <div className="p-5 text-left text-xs space-y-3.5">
              {/* Customer Details Block */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Customer Details</span>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400 font-bold">Customer Name:</span>
                  <span className="text-slate-900 font-black text-xs">{customerName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400 font-bold">Phone Number:</span>
                  <span className="text-slate-900 font-black text-xs">{customerPhone}</span>
                </div>
                {secondPhone && (
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-400 font-bold">2nd Phone:</span>
                    <span className="text-slate-900 font-black text-xs">{secondPhone}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400 font-bold">City:</span>
                  <span className="text-slate-900 font-black text-xs">{destinationCity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Address:</span>
                  <span className="text-slate-800 font-semibold truncate max-w-[210px] text-right" title={completeAddress}>{completeAddress}</span>
                </div>
              </div>

              {/* Courier and Cost details */}
              <div className="bg-orange-50/30 p-4 rounded-2xl border border-orange-100 space-y-3">
                <span className="text-[9px] text-orange-600 font-black uppercase tracking-wider block">Courier & Cost Details</span>
                
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-100">
                  {getCourierLogo(selectedCourier.id, 'light')}
                  <div>
                    <span className="text-[8px] bg-orange-100 text-orange-700 font-extrabold px-1.5 py-0.5 rounded">CARRIER</span>
                    <p className="text-xs font-black text-slate-900 mt-0.5">{selectedCourier.name} Express</p>
                  </div>
                </div>

                <div className="flex justify-between border-b border-orange-100/30 pb-1.5">
                  <span className="text-slate-500 font-bold">COD Amount:</span>
                  <span className="text-emerald-700 font-black text-sm">Rs. {Number(codAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Delivery Charges:</span>
                  <span className="text-slate-900 font-black">Rs. {calculatedDeliveryCharges}</span>
                </div>

                {/* VISIBILITY NOTICE */}
                <div className="pt-2 border-t border-orange-200/50">
                  <p className="text-[10px] text-orange-700 font-extrabold text-center">
                    ⚠️ Delivery charges are visible only to you on this portal.
                  </p>
                </div>
              </div>

              {/* Cancel & Confirm Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-500 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFinalConfirm}
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-orange-500/10 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Booking...</span>
                    </>
                  ) : (
                    <span>Confirm Book</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL STATE */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 p-6 text-center animate-scale-up">
            <div className="h-14 w-14 bg-emerald-50 rounded-full text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <Check className="h-7 w-7 font-black" />
            </div>

            <h3 className="text-lg font-black text-slate-950">Booking Confirmed!</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Your packet has been booked successfully.</p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 my-5 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200/50 pb-2">
                <span className="text-slate-400 font-bold">Tracking # :</span>
                <span className="text-indigo-600 font-black text-sm">{lastGeneratedTracking}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400 font-bold">Assigned Courier:</span>
                <span className="text-slate-800 font-black uppercase">{selectedCourier.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  const lastOrder = orders[0] || {
                    id: 'SJC-TEMP',
                    trackingNo: lastGeneratedTracking,
                    customerName: 'Customer',
                    customerPhone: '03000000000',
                    customerAddress: 'Address',
                    destinationCity: 'City',
                    courier: selectedCourier.name,
                    weight: weightGrams / 1000,
                    codAmount: 1000,
                    deliveryCharges: calculatedDeliveryCharges,
                    bookingDate: new Date().toISOString().split('T')[0]
                  };
                  handlePrintAWB(lastOrder as any);
                }}
                className="px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-md"
              >
                Print Slip
              </button>
              <button
                type="button"
                onClick={() => { setShowSuccessModal(false); setShowCourierModal(true); }}
                className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black cursor-pointer"
              >
                New Booking
              </button>
              <button
                type="button"
                onClick={() => { setShowSuccessModal(false); setActiveView('list'); }}
                className="px-3 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold cursor-pointer"
              >
                Go to Orders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GENERATE LOAD SHEET: COURIER SELECTION MODAL */}
      {showLoadSheetCourierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100 animate-scale-in">
            {/* Header matches screenshot */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3.5 text-left">
                <div className="bg-orange-500 text-white p-2.5 rounded-2xl flex items-center justify-center shadow-md shadow-orange-500/15">
                  <Check className="h-5 w-5 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">Select Courier</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">Pick a partner to book a packet</p>
                </div>
              </div>
              <button 
                onClick={() => setShowLoadSheetCourierModal(false)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl p-2.5 transition cursor-pointer w-10 h-10 flex items-center justify-center font-bold"
              >
                <span className="text-lg">&times;</span>
              </button>
            </div>

            {/* List matches screenshot */}
            <div className="p-6 flex flex-col gap-3 max-h-[65vh] overflow-y-auto">
              {COURIER_PARTNERS.map(cp => {
                const isSelected = selectedLoadSheetCourier && selectedLoadSheetCourier.id === cp.id;
                return (
                  <div
                    key={cp.id}
                    onClick={() => {
                      setSelectedLoadSheetCourier(cp);
                      setShowLoadSheetCourierModal(false);
                      setShowLoadSheetDetailModal(true);
                    }}
                    className={`rounded-2xl border p-4 cursor-pointer text-left transition-all duration-200 flex items-center justify-between select-none group hover:shadow-xs ${
                      isSelected 
                        ? 'border-orange-500 bg-orange-50/5 ring-1 ring-orange-500/10' 
                        : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-slate-50/30'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Logo container like image */}
                      <div className="w-14 h-14 shrink-0 rounded-2xl border border-slate-200/60 bg-white flex items-center justify-center p-1.5 overflow-hidden shadow-2xs group-hover:scale-102 transition-transform duration-200">
                        {getCourierLogo(cp.id, 'light')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-black text-slate-900 text-sm tracking-tight">{cp.name}</span>
                        <p className="text-xs text-slate-400 font-bold mt-0.5">{getCleanTagline(cp.id)}</p>
                        {cp.id === 'Barqraftar' && (
                          <p className="text-[10px] text-amber-600 font-extrabold mt-1 bg-amber-50 border border-amber-200/30 rounded-lg px-2 py-0.5 inline-block">
                            ⚠️ Delivery only in: Faisalabad, Gujranwala, Islamabad, Rawalpindi & Lahore (Only Pickup and Delivery)
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Chevron right indicator like image */}
                    <div className={`p-2 rounded-xl transition-all duration-200 border flex items-center justify-center ${
                      isSelected 
                        ? 'bg-orange-50 text-orange-500 border-orange-200 group-hover:scale-105' 
                        : 'bg-slate-50 text-slate-400 border-slate-200 group-hover:text-slate-700 group-hover:border-slate-300 group-hover:bg-slate-100 group-hover:scale-105'
                    }`}>
                      <ChevronRight className="h-4 w-4 stroke-[3]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* GENERATE LOAD SHEET: DETAIL LIST (PICTURE 2 STYLE) */}
      {showLoadSheetDetailModal && selectedLoadSheetCourier && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-100 animate-scale-in">
            {/* Header section (Picture 2 style) */}
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="text-left flex items-center gap-3">
                {getCourierLogo(selectedLoadSheetCourier.id, 'light')}
                <div>
                  <h3 className="text-lg font-black text-slate-900">Manage {selectedLoadSheetCourier.name} Load Sheets</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Total: {loadSheetsList.filter(ls => ls.courier.toLowerCase() === selectedLoadSheetCourier.name.toLowerCase()).length} load sheets
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">• Secure Manifest Pipeline</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowLoadSheetDetailModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer w-8 h-8 flex items-center justify-center bg-slate-200/50 rounded-full"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-5 text-left">
              {/* Search and Filters row (Picture 2 style) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Date range filter button on left */}
                <div className="sm:col-span-3 relative">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowDateFilterDropdown(!showDateFilterDropdown);
                      setShowPageLimitDropdown(false);
                    }}
                    className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs px-3.5 py-3 rounded-xl transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{loadSheetDateFilter}</span>
                    </span>
                    <span className="text-slate-400 text-[10px]">▼</span>
                  </button>

                  {showDateFilterDropdown && (
                    <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-fade-in">
                      {['Today Results', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'All Time'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setLoadSheetDateFilter(opt);
                            setShowDateFilterDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 transition cursor-pointer flex items-center justify-between ${
                            loadSheetDateFilter === opt ? 'text-amber-600 bg-amber-50/50' : 'text-slate-700'
                          }`}
                        >
                          <span>{opt}</span>
                          {loadSheetDateFilter === opt && <span className="text-amber-500 font-black">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search box in center */}
                <div className="sm:col-span-6 relative">
                  <Search className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search anything here"
                    value={loadSheetSearchQuery}
                    onChange={(e) => setLoadSheetSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-bold"
                  />
                  {loadSheetSearchQuery && (
                    <button 
                      onClick={() => setLoadSheetSearchQuery('')}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 font-bold text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Pages limit selector on right */}
                <div className="sm:col-span-3 relative">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowPageLimitDropdown(!showPageLimitDropdown);
                      setShowDateFilterDropdown(false);
                    }}
                    className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs px-3.5 py-3 rounded-xl transition cursor-pointer"
                  >
                    <span>{loadSheetPageLimit} Per Page</span>
                    <span className="text-slate-400 text-[10px]">▼</span>
                  </button>

                  {showPageLimitDropdown && (
                    <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-fade-in">
                      {[25, 50, 100].map((limit) => (
                        <button
                          key={limit}
                          type="button"
                          onClick={() => {
                            setLoadSheetPageLimit(limit);
                            setShowPageLimitDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 transition cursor-pointer flex items-center justify-between ${
                            loadSheetPageLimit === limit ? 'text-amber-600 bg-amber-50/50' : 'text-slate-700'
                          }`}
                        >
                          <span>{limit} Per Page</span>
                          {loadSheetPageLimit === limit && <span className="text-amber-500 font-black">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action row containing ONLY Generate New Load Sheet button (Picture 2 requirement) */}
              <div className="flex items-center justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    // Pre-select all booked orders for convenience
                    const cpBooked = orders.filter(
                      o => o.courier.toLowerCase() === selectedLoadSheetCourier.name.toLowerCase() && o.status === 'Booked'
                    );
                    const initialSelection: Record<string, boolean> = {};
                    cpBooked.forEach(o => {
                      initialSelection[o.id] = true;
                    });
                    setSelectedOrdersForNewSheet(initialSelection);
                    setShowLoadSheetGeneratorModal(true);
                  }}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs px-6 py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-orange-500/10 cursor-pointer animate-pulse"
                >
                  <PlusCircle className="h-4.5 w-4.5" />
                  <span>Generate New Load Sheet</span>
                </button>
              </div>

              {/* Table list of Load Sheets (Picture 2 style) */}
              <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4 text-center w-24">Sr No</th>
                      <th className="p-4">Courier</th>
                      <th className="p-4">Created Date</th>
                      <th className="p-4">Packets</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const filteredList = loadSheetsList
                        .filter(ls => ls.courier.toLowerCase() === selectedLoadSheetCourier.name.toLowerCase())
                        .filter(ls => {
                          // Search query filter
                          if (loadSheetSearchQuery) {
                            const query = loadSheetSearchQuery.toLowerCase();
                            const matchId = ls.id.includes(query);
                            const matchDate = ls.date.toLowerCase().includes(query);
                            if (!matchId && !matchDate) return false;
                          }

                          // Date filter
                          if (loadSheetDateFilter === 'All Time') {
                            return true;
                          }

                          const now = new Date();
                          const lsDate = new Date(ls.date);
                          if (isNaN(lsDate.getTime())) return true; // Fail-safe

                          const diffTime = Math.abs(now.getTime() - lsDate.getTime());
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                          if (loadSheetDateFilter === 'Today Results') {
                            return lsDate.getDate() === now.getDate() &&
                                   lsDate.getMonth() === now.getMonth() &&
                                   lsDate.getFullYear() === now.getFullYear();
                          } else if (loadSheetDateFilter === 'Yesterday') {
                            const yesterday = new Date();
                            yesterday.setDate(now.getDate() - 1);
                            return lsDate.getDate() === yesterday.getDate() &&
                                   lsDate.getMonth() === yesterday.getMonth() &&
                                   lsDate.getFullYear() === yesterday.getFullYear();
                          } else if (loadSheetDateFilter === 'Last 7 Days') {
                            return diffDays <= 7;
                          } else if (loadSheetDateFilter === 'Last 30 Days') {
                            return diffDays <= 30;
                          }

                          return true;
                        });

                      // Apply pagination limit (loadSheetPageLimit)
                      const paginatedList = filteredList.slice(0, loadSheetPageLimit);

                      if (paginatedList.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="p-10 text-center text-slate-400 italic font-semibold bg-slate-50/50">
                              No load sheets found under filter "{loadSheetDateFilter}". 
                              {loadSheetDateFilter === 'Today Results' && " Select 'All Time' from the date dropdown above to see older records!"}
                            </td>
                          </tr>
                        );
                      }

                      return paginatedList.map((ls, idx) => (
                        <tr key={ls.id} className="hover:bg-slate-50/50 transition">
                          {/* Serial No and Challan ID (Picture 2 exact style) */}
                          <td className="p-4 text-center font-bold text-slate-800 border-r border-slate-100">
                            <div className="text-sm font-black text-slate-900">{idx + 1}</div>
                            <div className="text-[10px] text-slate-500 font-mono font-black mt-0.5">{ls.id}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-800 text-sm">{ls.courier}</span>
                              <span className="text-[9px] bg-slate-100 text-slate-600 font-black px-1.5 py-0.5 rounded uppercase">Express</span>
                            </div>
                          </td>
                          {/* Created Date with "1 month ago" (Picture 2 style) */}
                          <td className="p-4">
                            <div className="font-semibold text-slate-800">{ls.date}</div>
                            <div className="text-[10px] text-slate-400 font-bold mt-0.5">{ls.relativeTime}</div>
                          </td>
                          {/* Packets count with "CN count" (Picture 2 style) */}
                          <td className="p-4">
                            <div className="font-black text-slate-900 text-sm">{ls.shipments.length}</div>
                            <div className="text-[9px] text-blue-500 font-extrabold mt-0.5 uppercase tracking-wide">CN count</div>
                          </td>
                          {/* Actions button with custom printer/download */}
                          <td className="p-4 text-right border-l border-slate-100">
                            <button
                              onClick={() => {
                                // PDF printed/downloaded dynamically (Picture 4 & 5 styles)
                                const savedMerchantInfo = localStorage.getItem('merchant_info');
                                const merchantInfo = savedMerchantInfo ? JSON.parse(savedMerchantInfo) : { brandName: 'Laskhy Laser', userName: 'Laskhy Laser Merchant', email: 'laskhylaser@gmail.com' };

                                const printWindow = window.open('', '_blank');
                                if (!printWindow) return;

                                const defaultAddress = pickupAddresses.find(a => a.isDefault) || pickupAddresses[0] || {
                                  address: 'Sardar Pur Road, Hussainabad Near Dera Ch. Abdul Aziz, Tehsil Kabirwala',
                                  phone: '03462344807',
                                  city: 'Kabir Wala'
                                };

                                const totalCOD = ls.shipments.reduce((sum, s) => sum + (s.codAmount || 0), 0);
                                const totalWeight = ls.shipments.reduce((sum, s) => sum + (s.weight || 0.5), 0);
                                const totalPieces = ls.shipments.length;

                                const printedAt = new Date().toLocaleString('en-GB', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: false
                                }).replace(',', '');

                                const merchantBrand = merchantInfo.brandName || 'Laskhy Laser';

                                // Generate simulated barcode lines for crisp high fidelity
                                const barcodeLines = Array.from({ length: 45 }).map(() => {
                                  const width = Math.random() > 0.4 ? '2px' : Math.random() > 0.5 ? '4px' : '1px';
                                  const margin = Math.random() > 0.3 ? '1px' : '2px';
                                  return `<div style="background-color:black; width:${width}; height:40px; margin-right:${margin}; display:inline-block;"></div>`;
                                }).join('');

                                const tableRows = ls.shipments.map((s, sIdx) => `
                                  <tr style="border-bottom: 1px solid #000000;">
                                    <td style="padding: 6px; border-right: 1px solid #000000; text-align: center; font-size: 11px;">${sIdx + 1}</td>
                                    <td style="padding: 6px; border-right: 1px solid #000000; font-weight: bold; font-size: 11px;">${s.trackingNo || 'KL' + s.id}</td>
                                    <td style="padding: 6px; border-right: 1px solid #000000; font-size: 11px;">${s.id}</td>
                                    <td style="padding: 6px; border-right: 1px solid #000000; text-align: center; font-size: 11px;">${s.bookingDate || '20-May-2026'}</td>
                                    <td style="padding: 6px; border-right: 1px solid #000000; text-align: right; font-weight: bold; font-size: 11px;">Rs. ${(s.codAmount || 0).toLocaleString()}</td>
                                    <td style="padding: 6px; border-right: 1px solid #000000; text-transform: uppercase; font-size: 11px; font-weight: bold;">${s.destinationCity}</td>
                                    <td style="padding: 6px; border-right: 1px solid #000000; text-align: center; text-transform: lowercase; font-size: 11px;">overnight</td>
                                    <td style="padding: 6px; border-right: 1px solid #000000; text-align: center; font-size: 11px;">${s.weight || 0.5}</td>
                                    <td style="padding: 6px; text-align: center; font-size: 11px;">1</td>
                                  </tr>
                                `).join('');

                                printWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>Receiving Sheet - Challan# ${ls.id}</title>
                                      <style>
                                        body {
                                          font-family: 'Courier New', Courier, monospace, Arial, sans-serif;
                                          color: #000;
                                          margin: 10px;
                                          padding: 0;
                                          background-color: #fff;
                                        }
                                        .container {
                                          width: 100%;
                                          max-width: 850px;
                                          margin: 0 auto;
                                          border: 2px solid #000000;
                                          padding: 15px;
                                        }
                                        .header-table {
                                          width: 100%;
                                          border-collapse: collapse;
                                          margin-bottom: 12px;
                                          border: 2px solid #000000;
                                        }
                                        .header-table td {
                                          border: 1px solid #000000;
                                          padding: 6px;
                                          vertical-align: top;
                                        }
                                        .brand-logo-cell {
                                          width: 25%;
                                          text-align: center;
                                          font-weight: bold;
                                        }
                                        .sheet-title-cell {
                                          width: 50%;
                                          text-align: center;
                                          font-size: 26px;
                                          font-weight: 900;
                                          text-transform: uppercase;
                                          letter-spacing: 2px;
                                          vertical-align: middle !important;
                                        }
                                        .print-meta-cell {
                                          width: 25%;
                                          font-size: 11px;
                                          text-align: right;
                                          line-height: 1.4;
                                        }
                                        .shipper-details-table {
                                          width: 100%;
                                          border-collapse: collapse;
                                          font-size: 11px;
                                        }
                                        .shipper-details-table td {
                                          padding: 4px 6px;
                                          border: 1px solid #000000;
                                        }
                                        .shipper-details-table td.label {
                                          font-weight: bold;
                                          background-color: #f1f5f9;
                                          width: 22%;
                                        }
                                        .barcode-container {
                                          text-align: center;
                                          padding-top: 4px;
                                        }
                                        .challan-text {
                                          font-weight: bold;
                                          font-size: 13px;
                                          margin-top: 3px;
                                        }
                                        .main-table {
                                          width: 100%;
                                          border-collapse: collapse;
                                          font-size: 11px;
                                          margin-top: 12px;
                                          border: 2px solid #000000;
                                        }
                                        .main-table th {
                                          background-color: #e2e8f0;
                                          border: 1px solid #000000;
                                          padding: 6px;
                                          font-weight: bold;
                                          text-align: left;
                                          text-transform: uppercase;
                                        }
                                        .main-table td {
                                          border: 1px solid #000000;
                                          padding: 6px;
                                        }
                                        .total-row {
                                          font-weight: bold;
                                          background-color: #f8fafc;
                                        }
                                        .disclaimer {
                                          font-size: 10px;
                                          margin-top: 15px;
                                          line-height: 1.4;
                                          border-top: 1px solid #000000;
                                          padding-top: 8px;
                                        }
                                        .disclaimer-title {
                                          font-weight: bold;
                                          text-transform: uppercase;
                                        }
                                        .signatures {
                                          margin-top: 45px;
                                          font-size: 11px;
                                          font-weight: bold;
                                          display: flex;
                                          justify-content: space-between;
                                        }
                                        @media print {
                                          body { margin: 0; }
                                          .container { border: 2px solid #000000; padding: 15px; }
                                        }
                                      </style>
                                    </head>
                                    <body>
                                      <div class="container">
                                        <table class="header-table">
                                          <tr>
                                            <td class="brand-logo-cell" style="text-align: center; vertical-align: middle;">
                                              <div style="font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px;">
                                                ${ls.courier}
                                              </div>
                                              <div style="font-size: 8px; font-weight: bold; letter-spacing: 0.5px; margin-top: 2px;">EXPRESS DISPATCH</div>
                                            </td>
                                            <td class="sheet-title-cell">Receiving Sheet</td>
                                            <td class="print-meta-cell">
                                              <div><strong>Printed at:</strong></div>
                                              <div>${printedAt}</div>
                                              <div style="margin-top: 4px;"><strong>By:</strong> ${merchantBrand}</div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td colspan="2" style="padding: 0; border: none;">
                                              <table class="shipper-details-table">
                                                <tr>
                                                  <td class="label">Shipper</td>
                                                  <td style="font-weight: bold;">${merchantBrand}</td>
                                                </tr>
                                                <tr>
                                                  <td class="label">Address</td>
                                                  <td>${defaultAddress.address}</td>
                                                </tr>
                                                <tr>
                                                  <td class="label">Phone</td>
                                                  <td>03462344807</td>
                                                </tr>
                                                <tr>
                                                  <td class="label">Origin</td>
                                                  <td>${defaultAddress.city}</td>
                                                </tr>
                                                <tr>
                                                  <td class="label">Total Shipments</td>
                                                  <td><strong>${totalPieces}</strong></td>
                                                </tr>
                                                <tr>
                                                  <td class="label">Total COD</td>
                                                  <td><strong>Rs. ${totalCOD.toLocaleString()}</strong></td>
                                                </tr>
                                              </table>
                                            </td>
                                            <td style="text-align: center; vertical-align: middle;">
                                              <div class="barcode-container">
                                                <div style="display: inline-block; transform: scaleY(1.1);">${barcodeLines}</div>
                                                <div class="challan-text">Challan# ${ls.id}</div>
                                              </div>
                                            </td>
                                          </tr>
                                        </table>

                                        <table class="main-table">
                                          <thead>
                                            <tr>
                                              <th style="text-align: center; width: 6%;">S.No</th>
                                              <th style="width: 20%;">Consignment #</th>
                                              <th style="width: 14%;">Cust Ref#</th>
                                              <th style="text-align: center; width: 14%;">Booked On</th>
                                              <th style="text-align: right; width: 14%;">Cod Amount</th>
                                              <th style="width: 14%;">Destination</th>
                                              <th style="text-align: center; width: 10%;">Service</th>
                                              <th style="text-align: center; width: 8%;">Weight</th>
                                              <th style="text-align: center; width: 5%;">Pcs</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            ${tableRows}
                                            <tr class="total-row" style="border-top: 2px solid #000000; font-weight: bold;">
                                              <td style="padding: 6px; text-align: center;">Total</td>
                                              <td style="padding: 6px;" colspan="2">${totalPieces} packets</td>
                                              <td style="padding: 6px;"></td>
                                              <td style="padding: 6px; text-align: right;">Rs. ${totalCOD.toLocaleString()}</td>
                                              <td style="padding: 6px;" colspan="2"></td>
                                              <td style="padding: 6px; text-align: center;">${totalWeight.toFixed(2)} kg</td>
                                              <td style="padding: 6px; text-align: center;">${totalPieces}</td>
                                            </tr>
                                          </tbody>
                                        </table>

                                        <div class="disclaimer">
                                          <div class="disclaimer-title">Disclaimer</div>
                                          <div style="margin-top: 3px;">
                                            • ${merchantBrand} is to ensure that the items being handed over to ${ls.courier} Express Logistic's pick-up staff are pasted with right address label.
                                          </div>
                                          <div>
                                            • ${merchantBrand} will be responsible for the content packed inside the shipment.
                                          </div>
                                          <div>
                                            • Booked weight may vary with invoice / billing weight as our manifested weight will be treated as final weight.
                                          </div>
                                        </div>

                                        <div class="signatures">
                                          <div>Booking Staff Signature:: _______________________</div>
                                          <div>Booking Staff Signature: _______________________</div>
                                        </div>
                                      </div>
                                      <script>
                                        window.onload = function() {
                                          window.print();
                                        }
                                      </script>
                                    </body>
                                  </html>
                                `);
                                printWindow.document.close();
                              }}
                              className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg cursor-pointer transition text-xs font-black"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>Download PDF</span>
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Close footer button */}
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLoadSheetDetailModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GENERATE NEW LOAD SHEET: POPUP FOR SELECTION (PICTURE 1 STYLE) */}
      {showLoadSheetGeneratorModal && selectedLoadSheetCourier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 animate-scale-in">
            {/* Modal Header (Picture 1 exact style) */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-base font-black text-slate-900">
                  Generate Load Sheet For <span className="text-orange-500 font-extrabold">{selectedLoadSheetCourier.name}</span>
                </h3>
              </div>
              <button 
                onClick={() => setShowLoadSheetGeneratorModal(false)}
                className="text-slate-400 hover:text-slate-700 text-base font-bold cursor-pointer w-7 h-7 flex items-center justify-center bg-slate-200/50 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-left">
              {/* Date Range drop down (Picture 1 style) */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Date Range</label>
                <div className="relative">
                  <button 
                    type="button"
                    className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition w-full justify-between cursor-default"
                  >
                    <span className="flex items-center gap-2">
                      <span>📅</span>
                      <span>Today Results</span>
                    </span>
                    <span className="text-slate-400 text-[10px]">▼</span>
                  </button>
                </div>
              </div>

              {/* Available Orders Section (Picture 1 style) */}
              {(() => {
                const bookedParcels = orders.filter(
                  o => o.courier.toLowerCase() === selectedLoadSheetCourier.name.toLowerCase() && o.status === 'Booked'
                );

                const selectedCount = Object.keys(selectedOrdersForNewSheet).filter(
                  id => selectedOrdersForNewSheet[id] && bookedParcels.some(p => p.id === id)
                ).length;

                return (
                  <>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm font-black text-slate-900">Available Orders</span>
                      <span className="bg-slate-100 text-slate-700 text-xs font-black px-2.5 py-1 rounded-full">
                        {selectedCount} / {bookedParcels.length}
                      </span>
                    </div>

                    {/* Master Checkbox block */}
                    {bookedParcels.length > 0 && (
                      <div className="flex items-center gap-3 bg-slate-100/60 p-2.5 rounded-xl border border-slate-200/40">
                        <input
                          type="checkbox"
                          id="select-all-booked"
                          checked={selectedCount === bookedParcels.length && bookedParcels.length > 0}
                          onChange={(e) => {
                            const val = e.target.checked;
                            const updated = { ...selectedOrdersForNewSheet };
                            bookedParcels.forEach(p => {
                              updated[p.id] = val;
                            });
                            setSelectedOrdersForNewSheet(updated);
                          }}
                          className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer accent-amber-500"
                        />
                        <label htmlFor="select-all-booked" className="text-xs font-black text-slate-600 cursor-pointer select-none">
                          Select All Booked Consignments ({bookedParcels.length})
                        </label>
                      </div>
                    )}

                    {/* Booked parcels listing container */}
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 max-h-[40vh] overflow-y-auto">
                      {bookedParcels.length === 0 ? (
                        <div className="p-8 text-center bg-white">
                          <p className="text-xs font-bold text-slate-400">No orders found for the user.</p>
                          <p className="text-[10px] text-slate-400 mt-1">Please book some shipments with {selectedLoadSheetCourier.name} first.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100 bg-white">
                          {bookedParcels.map((order) => {
                            const isChecked = !!selectedOrdersForNewSheet[order.id];
                            return (
                              <div key={order.id} className="flex items-start gap-3 p-3 hover:bg-slate-50 transition">
                                <div className="pt-0.5">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      setSelectedOrdersForNewSheet(prev => ({
                                        ...prev,
                                        [order.id]: e.target.checked
                                      }));
                                    }}
                                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer accent-amber-500"
                                  />
                                </div>
                                <div className="flex-1 text-xs">
                                  <div className="flex justify-between items-start">
                                    <span className="font-mono font-black text-indigo-900 block">{order.trackingNo || order.id}</span>
                                    <span className="font-extrabold text-slate-900">Rs. {order.codAmount.toLocaleString()}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 mt-1 text-slate-500 font-semibold text-[10px]">
                                    <div><strong>To:</strong> {order.customerName}</div>
                                    <div><strong>City:</strong> <span className="uppercase">{order.destinationCity}</span></div>
                                  </div>
                                  <div className="text-[9px] text-slate-400 mt-0.5">Booked Date: {order.bookingDate} • {order.weight} kg</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Bottom action panel */}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <span className="text-xs font-black text-slate-500">
                        {selectedCount === 0 ? 'No orders selected' : `${selectedCount} orders selected`}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowLoadSheetGeneratorModal(false)}
                          className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={selectedCount === 0}
                          onClick={() => {
                            const selectedIds = Object.keys(selectedOrdersForNewSheet).filter(id => selectedOrdersForNewSheet[id]);
                            const selectedOrders = bookedParcels.filter(p => selectedIds.includes(p.id));

                            if (selectedOrders.length === 0) {
                              alert("Please select at least one booked order to generate load sheet!");
                              return;
                            }

                            const randomChallan = String(Math.floor(800000 + Math.random() * 100000));
                            const newRecord: LoadSheetRecord = {
                              id: randomChallan,
                              courier: selectedLoadSheetCourier.name,
                              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                              relativeTime: 'Just now',
                              status: 'Pending Pick',
                              shipments: selectedOrders
                            };

                            setLoadSheetsList([newRecord, ...loadSheetsList]);
                            setSelectedOrdersForNewSheet({});
                            setShowLoadSheetGeneratorModal(false);

                            alert(`✓ Successfully generated load sheet ${randomChallan} with ${selectedOrders.length} packets!`);
                          }}
                          className={`px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer shadow-md ${
                            selectedCount === 0 
                              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none' 
                              : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/10'
                          }`}
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY MODAL: ORDER DETAILS (IMAGE 1 STYLE) */}
      {selectedOrderForDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-slate-800 border border-slate-100 animate-scale-in">
            {/* Top right close icon */}
            <button 
              type="button"
              onClick={() => setSelectedOrderForDetail(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition text-lg font-bold cursor-pointer bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Header */}
            <div className="pb-4 border-b border-slate-100 mb-4 text-left">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Order Details</h3>
            </div>

            {/* Two-column Grid exactly matching Image 1 layout */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs text-slate-700 border-b border-slate-100 pb-5 mb-5 text-left">
              
              {/* Row 1 */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-400">Sr#</span>
                <span className="font-black text-slate-800">
                  {orders.findIndex(o => o.id === selectedOrderForDetail.id) + 1}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-400">CN</span>
                <span className="font-black text-indigo-900 font-mono">
                  {selectedOrderForDetail.trackingNo || 'SJC-TRK-PENDING'}
                </span>
              </div>

              {/* Row 2 */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-400">Date</span>
                <span className="font-black text-slate-800">{selectedOrderForDetail.bookingDate}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-400">Status</span>
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusBadge(selectedOrderForDetail.status)}`}>
                  {selectedOrderForDetail.status === 'Pending' || selectedOrderForDetail.status === 'Booked' ? 'Booked' :
                   selectedOrderForDetail.status === 'Processed' || selectedOrderForDetail.status === 'Received' ? 'Rider Picked' :
                   selectedOrderForDetail.status === 'In Transit' || selectedOrderForDetail.status === 'In Progress' ? 'In Transit' :
                   selectedOrderForDetail.status === 'ReAttempt' ? 'Re-Attempt' :
                   selectedOrderForDetail.status === 'Issued' ? 'Issue Detected' :
                   selectedOrderForDetail.status}
                </span>
              </div>

              {/* Row 3 */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-400">Booking</span>
                <span className="font-black text-slate-800">{selectedOrderForDetail.bookingDate}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-400">Destination</span>
                <span className="font-black text-slate-800">{selectedOrderForDetail.destinationCity}</span>
              </div>

              {/* Row 4 */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-400">COD</span>
                <span className="font-black text-emerald-600">Rs. {selectedOrderForDetail.codAmount}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-400">Name</span>
                <span className="font-black text-slate-800">{selectedOrderForDetail.customerName}</span>
              </div>

              {/* Row 5 */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-400">DC</span>
                <span className="font-black text-slate-800">Rs. {selectedOrderForDetail.deliveryCharges}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-400">Phone</span>
                <span className="font-black text-slate-800">{selectedOrderForDetail.customerPhone}</span>
              </div>

              {/* Row 6 */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-400">Courier</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 px-2.5 py-1 rounded-md shadow-2xs transition select-none">
                  <span>🚚</span>
                  <span>{selectedOrderForDetail.courier}</span>
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-400">Weight</span>
                <span className="font-black text-slate-800">{selectedOrderForDetail.weight} kg</span>
              </div>

            </div>

            {/* Address box matching Image 1 layout style */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left mb-6">
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[9.5px] mb-1">Address</p>
              <p className="text-slate-700 font-semibold leading-relaxed">
                {selectedOrderForDetail.customerAddress}, {selectedOrderForDetail.destinationCity}
              </p>
            </div>

            {/* Bottom Close Button styled with orange BG, rounded corners, white bold uppercase text */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrderForDetail(null)}
                className="bg-[#ea580c] hover:bg-orange-600 text-white font-black text-xs px-6 py-2.5 rounded-lg transition-all shadow-md shadow-orange-500/10 cursor-pointer uppercase tracking-wider"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* OVERLAY MODAL: LIVE TRACKING TIMELINE */}
      {selectedOrderForTrack && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-slate-800 border border-slate-100 animate-scale-in">
            {/* Top close button */}
            <button 
              type="button"
              onClick={() => setSelectedOrderForTrack(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition text-lg font-bold cursor-pointer bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Title */}
            <div className="pb-4 border-b border-slate-100 mb-4 text-left">
              <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <span>🛰️</span>
                <span>Live Shah Jee Courier Tracking</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-1">WAYBILL / TRACKING: {selectedOrderForTrack.trackingNo || 'SJC-TRK-PENDING'}</p>
            </div>

            {/* Tracker meta details cards */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-left">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Courier Network</span>
                <span className="font-black text-slate-800 uppercase text-xs">{selectedOrderForTrack.courier} Express</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Destination Hub</span>
                <span className="font-black text-slate-800 text-xs">{selectedOrderForTrack.destinationCity}</span>
              </div>
            </div>

            {/* Custom Interactive Vertical Timeline */}
            <div className="space-y-4 mb-6 text-left">
              {[
                { 
                  title: 'Dispatched / Booked', 
                  desc: 'Shipper booked package. Waybill barcodes printed successfully.', 
                  date: selectedOrderForTrack.bookingDate, 
                  isDone: true 
                },
                { 
                  title: 'Rider Picked Up', 
                  desc: 'Rider took physical custody of the parcel. Sorted at regional hub.', 
                  date: selectedOrderForTrack.bookingDate, 
                  isDone: selectedOrderForTrack.status !== 'Pending' && selectedOrderForTrack.status !== 'Booked' && selectedOrderForTrack.status !== 'Cancelled'
                },
                { 
                  title: 'In Transit sorter', 
                  desc: 'Package in linehaul transit container moving towards destination city.', 
                  date: 'Updating...', 
                  isDone: selectedOrderForTrack.status === 'In Transit' || selectedOrderForTrack.status === 'Delivered' || selectedOrderForTrack.status === 'Processed' || selectedOrderForTrack.status === 'Received'
                },
                { 
                  title: 'Out For Delivery', 
                  desc: 'Rider assigned to customer home address for Cash on Delivery collection.', 
                  date: 'Updating...', 
                  isDone: selectedOrderForTrack.status === 'Out for Delivery' || selectedOrderForTrack.status === 'Delivered' || selectedOrderForTrack.status === 'Processed' || selectedOrderForTrack.status === 'Received'
                },
                { 
                  title: 'Delivered successfully', 
                  desc: 'Successfully delivered to customer. Rs. ' + selectedOrderForTrack.codAmount.toLocaleString() + ' collected.', 
                  date: 'Completed', 
                  isDone: selectedOrderForTrack.status === 'Delivered' || selectedOrderForTrack.status === 'Processed' || selectedOrderForTrack.status === 'Received'
                }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  {/* Circle checkmarks vertical line */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                      step.isDone 
                        ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/20' 
                        : 'bg-slate-100 border border-slate-300 text-slate-400'
                    }`}>
                      {step.isDone ? '✓' : idx + 1}
                    </div>
                    {idx < 4 && (
                      <div className={`w-0.5 h-10 ${step.isDone ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    )}
                  </div>
                  {/* Step Description text */}
                  <div className="pt-0.5">
                    <h5 className={`text-xs font-black ${step.isDone ? 'text-slate-800' : 'text-slate-400 font-bold'}`}>{step.title}</h5>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{step.desc}</p>
                    <span className="text-[8px] font-black text-slate-400 block mt-1 uppercase">{step.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  alert(`Copied tracking number: ${selectedOrderForTrack.trackingNo || selectedOrderForTrack.id} to clipboard!`);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-4 py-2.5 rounded-lg transition cursor-pointer"
              >
                📋 Copy AWB Link
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrderForTrack(null)}
                className="bg-[#ea580c] hover:bg-orange-600 text-white font-black text-xs px-5 py-2.5 rounded-lg transition-all shadow-md shadow-orange-500/10 cursor-pointer"
              >
                Close Tracking
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
