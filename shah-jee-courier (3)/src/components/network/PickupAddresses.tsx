import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Plus, 
  Trash2, 
  Check, 
  Building,
  Edit2,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  MapPinOff,
  Building2
} from 'lucide-react';
import { PickupAddress } from '../../types';

interface ExtendedPickupAddress extends PickupAddress {
  status?: 'active' | 'blocked' | 'deleted';
  bookingId?: string; // e.g. SJC-PKP-001
}

interface PickupAddressesProps {
  addresses: PickupAddress[];
  onAddAddress: (addr: Omit<PickupAddress, 'id'> & { status?: 'active' | 'blocked' | 'deleted' }) => void;
  onDeleteAddress: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const PAKISTANI_CITIES = [
  'Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi', 'Gujranwala', 
  'Peshawar', 'Multan', 'Hyderabad', 'Islamabad', 'Quetta', 
  'Sargodha', 'Sialkot', 'Bahawalpur', 'Sukkur', 'Sheikhupura', 
  'Rahim Yar Khan', 'Mardan', 'Gujrat', 'Kasur', 'Mingora', 
  'Dera Ghazi Khan', 'Nawabshah', 'Mirpur Khas', 'Chiniot', 
  'Sadiqabad', 'Abbottabad', 'Okara', 'Khuzdar'
];

export default function PickupAddresses({ 
  addresses, 
  onAddAddress, 
  onDeleteAddress, 
  onSetDefault 
}: PickupAddressesProps) {
  // Enhanced local list to keep track of statuses (Active / Blocked / Deleted) and edits
  const [localAddresses, setLocalAddresses] = useState<ExtendedPickupAddress[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'blocked' | 'deleted'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ExtendedPickupAddress | null>(null);

  // Form states
  const [brandName, setBrandName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [fullAddress, setFullAddress] = useState('');
  const [locationStatus, setLocationStatus] = useState<'active' | 'blocked'>('active');
  const [isDefault, setIsDefault] = useState(false);

  // Sync initial and prop updates
  useEffect(() => {
    // Merge addresses prop with statuses if not present
    const initialized = addresses.map((addr, idx) => ({
      ...addr,
      status: (addr as any).status || (idx === 1 ? 'blocked' : 'active'),
      bookingId: (addr as any).bookingId || `SJC-PKP-${1000 + idx}`
    }));
    setLocalAddresses(initialized);
  }, [addresses]);

  // Handle address submit (Create or Edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) {
      alert('Brand Name is required');
      return;
    }
    if (!phoneNumber.trim()) {
      alert('Phone Number is required');
      return;
    }
    if (!selectedCity) {
      alert('Please select a valid city from the searchable list.');
      return;
    }
    if (!fullAddress.trim()) {
      alert('Address is required');
      return;
    }

    if (editingAddress) {
      // Edit mode
      const updated = localAddresses.map(addr => {
        if (addr.id === editingAddress.id) {
          return {
            ...addr,
            name: brandName,
            phone: phoneNumber,
            city: selectedCity,
            address: fullAddress,
            status: locationStatus,
            isDefault: isDefault
          };
        }
        return isDefault ? { ...addr, isDefault: false } : addr;
      });
      setLocalAddresses(updated);
      // Trigger default update if changed
      if (isDefault) {
        onSetDefault(editingAddress.id);
      }
    } else {
      // Add mode
      const newId = `PA-00${localAddresses.length + 1}`;
      const newBookingId = `SJC-PKP-${1000 + localAddresses.length + 1}`;
      const created: ExtendedPickupAddress = {
        id: newId,
        bookingId: newBookingId,
        name: brandName,
        phone: phoneNumber,
        city: selectedCity,
        address: fullAddress,
        status: locationStatus,
        isDefault: isDefault
      };

      setLocalAddresses(prev => {
        let list = prev;
        if (isDefault) {
          list = list.map(a => ({ ...a, isDefault: false }));
        }
        return [...list, created];
      });

      // Call parent standard callback to update overall app context
      onAddAddress({
        name: brandName,
        phone: phoneNumber,
        city: selectedCity,
        address: fullAddress,
        isDefault: isDefault,
        status: locationStatus
      });
    }

    // Reset Form
    resetForm();
  };

  const resetForm = () => {
    setBrandName('');
    setPhoneNumber('');
    setCitySearch('');
    setSelectedCity('');
    setFullAddress('');
    setLocationStatus('active');
    setIsDefault(false);
    setEditingAddress(null);
    setIsModalOpen(false);
  };

  const handleEditClick = (addr: ExtendedPickupAddress) => {
    setEditingAddress(addr);
    setBrandName(addr.name);
    setPhoneNumber(addr.phone);
    setCitySearch(addr.city);
    setSelectedCity(addr.city);
    setFullAddress(addr.address);
    setLocationStatus(addr.status === 'blocked' ? 'blocked' : 'active');
    setIsDefault(addr.isDefault);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this pickup address location? This action will mark it as Deleted in the history.');
    if (confirmDelete) {
      setLocalAddresses(prev => 
        prev.map(addr => addr.id === id ? { ...addr, status: 'deleted' } : addr)
      );
      onDeleteAddress(id);
    }
  };

  const handleRestoreClick = (id: string) => {
    setLocalAddresses(prev => 
      prev.map(addr => addr.id === id ? { ...addr, status: 'active' } : addr)
    );
  };

  // Filtered business addresses
  const filteredAddresses = localAddresses.filter(addr => {
    if (activeFilter === 'all') return addr.status !== 'deleted';
    return addr.status === activeFilter;
  });

  // Filter city options based on user input
  const filteredCities = PAKISTANI_CITIES.filter(c => 
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Upper Information Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between md:items-center gap-4 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500 opacity-5 blur-3xl rounded-full"></div>
        <div>
          <h2 className="text-xl font-black flex items-center gap-2">
            <MapPin className="h-5.5 w-5.5 text-orange-400" />
            <span>My Pickup Addresses</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Click cards below to filter the list instantly. Manage multiple business address inventory centers for seamless Cash-On-Delivery dispatch pickups.
          </p>
          <p className="text-[11px] text-teal-400 font-extrabold tracking-wider uppercase mt-1">
            {activeFilter === 'all' && 'Showing All Active & Blocked Hubs'}
            {activeFilter === 'active' && 'Showing Active Dispatches only'}
            {activeFilter === 'blocked' && 'Showing Suspended / Blocked Hubs'}
            {activeFilter === 'deleted' && 'Showing Deleted History Archive'}
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl px-4 py-2.5 text-xs font-black hover:scale-105 shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add Pickup Address</span>
        </button>
      </div>

      {/* Interactive Tabs Row */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'all' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Total Pickups ({localAddresses.filter(a => a.status !== 'deleted').length})
        </button>

        <button
          onClick={() => setActiveFilter('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'active' 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Active Pickup ({localAddresses.filter(a => a.status === 'active').length})
        </button>

        <button
          onClick={() => setActiveFilter('blocked')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'blocked' 
              ? 'bg-amber-600 text-white shadow-md' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Blocked Pickups ({localAddresses.filter(a => a.status === 'blocked').length})
        </button>

        <button
          onClick={() => setActiveFilter('deleted')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'deleted' 
              ? 'bg-rose-600 text-white shadow-md' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Deleted ({localAddresses.filter(a => a.status === 'deleted').length})
        </button>
      </div>

      {/* Subtitle helper requested by user */}
      <p className="text-[11px] text-slate-400 italic">
        * Click cards below to filter the list instantly. Ensure at least one active location is set to default.
      </p>

      {/* Empty State Container if no address found */}
      {filteredAddresses.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm max-w-xl mx-auto flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <MapPinOff className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800">No pickup address found</h3>
            <p className="text-xs text-slate-500 mt-1">Tap Add Pickup to create one.</p>
          </div>
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="px-4 py-2 bg-slate-900 hover:bg-orange-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Add Pickup
          </button>
        </div>
      ) : (
        /* Address Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAddresses.map((addr, idx) => (
            <div 
              key={addr.id} 
              className={`rounded-3xl border-2 p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden bg-white shadow-sm hover:shadow-md ${
                addr.isDefault 
                  ? 'border-indigo-500 shadow-indigo-500/5' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Top Bar with Sr and Booking ID */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 text-xs font-bold text-slate-400">
                <span className="text-slate-950 font-black">Sr {idx + 1}</span>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg text-[10px]">
                  Booking ID: {addr.bookingId}
                </span>
              </div>

              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-start gap-2.5">
                    <span className={`p-2.5 rounded-2xl shrink-0 ${addr.isDefault ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                      <Building2 className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-slate-800">{addr.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{addr.city}</p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {addr.isDefault && (
                      <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 uppercase rounded-full tracking-wider">
                        Default Hub
                      </span>
                    )}
                    {addr.status === 'active' && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Active
                      </span>
                    )}
                    {addr.status === 'blocked' && (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Blocked
                      </span>
                    )}
                    {addr.status === 'deleted' && (
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Deleted
                      </span>
                    )}
                  </div>
                </div>

                {/* Display Fields */}
                <div className="space-y-2 text-xs text-slate-600 pl-1 mt-4">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold">{addr.phone}</span>
                  </p>
                  <p className="leading-relaxed text-slate-500 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {addr.address}
                  </p>
                </div>
              </div>

              {/* Actions Footer block */}
              <div className="flex items-center justify-between border-t border-slate-100 mt-5 pt-3.5 text-xs">
                {addr.status !== 'deleted' ? (
                  <>
                    {!addr.isDefault && addr.status === 'active' ? (
                      <button
                        onClick={() => onSetDefault(addr.id)}
                        className="font-black text-indigo-600 hover:text-indigo-700 transition cursor-pointer text-[11px]"
                      >
                        Set as Default Hub
                      </button>
                    ) : addr.isDefault ? (
                      <span className="text-indigo-600 font-extrabold flex items-center gap-1 text-[11px]">
                        <Check className="h-4 w-4 text-indigo-600 font-black" />
                        <span>Default Pickup Location</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 font-semibold text-[11px]">Cannot Set Blocked as Default</span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditClick(addr)}
                        className="text-slate-500 hover:text-slate-900 transition p-2 bg-slate-100 hover:bg-slate-200 rounded-xl"
                        title="Edit Address"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(addr.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-2 bg-slate-100 hover:bg-rose-50 rounded-xl"
                        title="Delete Address"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => handleRestoreClick(addr.id)}
                    className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Restore Business Address Hub</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-scale-up">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {editingAddress ? 'Edit Pickup Dispatch Location' : 'Add New Pickup Dispatch Location'}
                </h3>
                <p className="text-[11px] text-slate-500">Provide verified business address details for courier riders.</p>
              </div>
              <button 
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
              {/* Brand Name */}
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Brand Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Shah Jee Store Hub"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 font-medium" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Phone Number *</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. 03462344807"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 font-medium" 
                  />
                </div>

                {/* Searchable Autocomplete City */}
                <div className="relative">
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Select City *</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Type to search city (e.g. Sialkot, Lahore, Multan)…"
                      value={citySearch}
                      onChange={(e) => {
                        setCitySearch(e.target.value);
                        setSelectedCity(e.target.value); // Temporarily accept
                        setShowCityDropdown(true);
                      }}
                      onFocus={() => setShowCityDropdown(true)}
                      className="w-full text-xs p-3 pr-8 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 font-medium" 
                    />
                    <Search className="h-4 w-4 absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                  </div>

                  {showCityDropdown && citySearch.trim() && (
                    <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50 text-xs custom-scrollbar">
                      {filteredCities.length > 0 ? (
                        filteredCities.map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setSelectedCity(c);
                              setCitySearch(c);
                              setShowCityDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 transition font-medium text-slate-800 border-b border-slate-100 last:border-none cursor-pointer"
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
              </div>

              {/* Full Address */}
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Address *</label>
                <textarea 
                  rows={2}
                  required
                  placeholder="e.g. Shop # 2, Shah Jee Plaza, Main Bazaar Road..."
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 font-medium" 
                />
              </div>

              {/* Default options checkbox */}
              <div className="pt-2">
                <div className="flex items-center gap-2 py-3 bg-slate-50 px-4 rounded-xl border border-slate-100">
                  <input 
                    type="checkbox" 
                    id="makeDefault"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="h-4.5 w-4.5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer" 
                  />
                  <label htmlFor="makeDefault" className="text-xs text-slate-700 cursor-pointer font-extrabold select-none">
                    Mark as Default Pickup Hub
                  </label>
                </div>
              </div>

              {/* Actions Footer button */}
              <div className="flex gap-2.5 justify-end pt-5 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-500 hover:bg-slate-150 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  {editingAddress ? 'Save Changes' : 'Add Business Address Hub'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
