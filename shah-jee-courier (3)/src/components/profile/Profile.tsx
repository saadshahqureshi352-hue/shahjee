import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Bell, 
  Camera, 
  Eye, 
  EyeOff, 
  Upload, 
  Check, 
  Building, 
  PiggyBank, 
  FileText, 
  Globe, 
  AlertCircle,
  Briefcase
} from 'lucide-react';

interface ProfileProps {
  merchantInfo: any;
  setMerchantInfo: (info: any) => void;
}

export default function Profile({ merchantInfo, setMerchantInfo }: ProfileProps) {
  // Ensure we have a robust set of default values matching picture 2
  const profileData = {
    userName: merchantInfo.userName || 'Mohsin Raza',
    username: merchantInfo.username || 'lashkylaser',
    brandName: merchantInfo.brandName || 'Laskhy Laser',
    phone: merchantInfo.phone || '03076542923',
    email: merchantInfo.email || 'lashkylaser@gmail.com',
    address: merchantInfo.address || 'Sardarpur Road Hussainabad Kabirwala (Khanewal)',
    city: merchantInfo.city || 'Kabirwala',
    state: merchantInfo.state || 'Punjab',
    country: merchantInfo.country || 'Pakistan',
    postalCode: merchantInfo.postalCode || '58250',
    websiteUrl: merchantInfo.websiteUrl || '',
    password: merchantInfo.password || 'password123',
    cnic: merchantInfo.cnic || '34101-1234567-9',
    bankName: merchantInfo.bankName || 'United Bank Limited (UBL)',
    bankHolderName: merchantInfo.bankHolderName || 'Mohsin Raza',
    bankAccountNumber: merchantInfo.bankAccountNumber || '03156705277',
    bankIban: merchantInfo.bankIban || 'PK12UBLB03156705277',
    avatar: merchantInfo.avatar || ''
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Notification States
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Password Edit State
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>(profileData.password);
  const [confirmPassword, setConfirmPassword] = useState<string>(profileData.password);

  // Avatar Upload Handler
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setErrorMsg('Image size should be less than 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        
        // Update both merchantInfo in App state and local storage accounts if needed
        const updatedInfo = { ...merchantInfo, avatar: base64String };
        setMerchantInfo(updatedInfo);
        
        // Save in accounts database too so it persists across logouts
        updateStoredAccount({ avatar: base64String });

        setSuccessMsg('Profile picture updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to update account in registered database
  const updateStoredAccount = (fieldsToUpdate: Partial<typeof profileData>) => {
    const savedAccounts = localStorage.getItem('sjc_registered_accounts');
    if (savedAccounts) {
      try {
        const accounts = JSON.parse(savedAccounts);
        const updatedAccounts = accounts.map((acc: any) => {
          if (acc.email === profileData.email || acc.username === profileData.username) {
            return { ...acc, ...fieldsToUpdate };
          }
          return acc;
        });
        localStorage.setItem('sjc_registered_accounts', JSON.stringify(updatedAccounts));
      } catch (e) {
        console.error('Error updating account in list:', e);
      }
    }
  };

  // Password Save Handler
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length < 5) {
      setErrorMsg('Password must be at least 5 characters long.');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    // Save Password
    const updatedInfo = { ...merchantInfo, password: newPassword };
    setMerchantInfo(updatedInfo);
    updateStoredAccount({ password: newPassword });

    setIsEditingPassword(false);
    setSuccessMsg('Password updated successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1 sm:p-4">
      {/* Dynamic Toast Notifications */}
      {successMsg && (
        <div className="fixed top-20 right-4 z-50 rounded-xl bg-emerald-500 text-white px-5 py-3.5 shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce">
          <Check className="h-5 w-5 shrink-0" />
          <span className="font-bold text-xs">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-20 right-4 z-50 rounded-xl bg-rose-500 text-white px-5 py-3.5 shadow-2xl flex items-center gap-3 border border-rose-400 animate-pulse">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="font-bold text-xs">{errorMsg}</span>
        </div>
      )}

      {/* Title block with sub-info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl border border-slate-700">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Merchant Profile Profile</h2>
          <p className="text-xs text-slate-300 mt-1 font-semibold">
            Manage your personal profile avatar, authentication credentials, and view registered compliance details.
          </p>
        </div>
        <div className="bg-white/10 rounded-2xl px-4 py-2 text-right border border-white/5">
          <span className="text-[10px] text-teal-300 uppercase font-black block tracking-wider">Account Identity Status</span>
          <span className="text-xs font-black text-amber-300 flex items-center gap-1 mt-0.5 justify-end">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
            ACTIVE MERCHANT COURIER
          </span>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout matching Picture 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column Cards (Profile Summary Card + Payment Details) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* 1. Profile Core Card */}
          <div className="bg-[#fff5f5]/60 rounded-3xl p-6 border border-pink-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                {/* Profile Picture with Upload Hover Effect */}
                <div className="relative group cursor-pointer h-20 w-20 shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white z-10" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="h-6 w-6" />
                  </div>
                  {profileData.avatar ? (
                    <img 
                      src={profileData.avatar} 
                      alt="Merchant Logo" 
                      className="h-20 w-20 object-cover rounded-2xl border-2 border-pink-200 shadow-md"
                    />
                  ) : (
                    <div className="h-20 w-20 bg-gradient-to-br from-pink-400 to-rose-500 text-white rounded-2xl border-2 border-pink-200 shadow-md flex items-center justify-center font-black text-3xl">
                      {profileData.userName.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  {/* Floating badge for upload */}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 bg-white hover:bg-slate-100 text-slate-700 p-1.5 rounded-xl shadow-md border border-slate-100 transition-all z-20"
                    title="Upload profile picture"
                  >
                    <Upload className="h-3 w-3" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-800 leading-tight">{profileData.userName}</h3>
                  <p className="text-xs text-pink-600 font-bold mt-0.5">@{profileData.username}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">N/A years, {profileData.country}</p>
                </div>
              </div>

              {/* Contacts Details list in Left Column */}
              <div className="space-y-4 text-xs text-slate-600 font-semibold border-t border-pink-100/50 pt-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-50 text-pink-500">
                    <Phone className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-black leading-none">Phone Number</p>
                    <p className="text-slate-800 mt-0.5">{profileData.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-50 text-pink-500">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-black leading-none">Email Address</p>
                    <p className="text-slate-800 mt-0.5 break-all">{profileData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-50 text-pink-500">
                    <span className="text-xs">🎂</span>
                  </span>
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-black leading-none">Birthday</p>
                    <p className="text-slate-800 mt-0.5">Not Specified</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-50 text-pink-500">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-black leading-none">Home Address</p>
                    <p className="text-slate-800 mt-0.5 leading-tight">{profileData.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-pink-100/50 pt-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-black py-2.5 transition flex items-center justify-center gap-1.5 uppercase tracking-wider"
              >
                <Camera className="h-4 w-4" />
                <span>Edit Profile Picture</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (Profile Settings Forms & Authentication Details) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 3. Profile Settings Form Card (Top Right) */}
          <div className="bg-[#fff5f5]/60 rounded-3xl p-6 border border-pink-100 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100 mb-5">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <User className="h-4.5 w-4.5 text-pink-500" />
                <span>Profile Settings</span>
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                Read-Only Compliance
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={profileData.userName} 
                  disabled 
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed" 
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Username</label>
                <input 
                  type="text" 
                  value={profileData.username} 
                  disabled 
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed" 
                />
              </div>

              {/* Brand Name */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Company / Brand Name</label>
                <input 
                  type="text" 
                  value={profileData.brandName} 
                  disabled 
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed" 
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={profileData.phone} 
                  disabled 
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed" 
                />
              </div>

              {/* Complete Address */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Warehouse Address</label>
                <textarea 
                  rows={2}
                  value={profileData.address} 
                  disabled 
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed resize-none" 
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={profileData.email} 
                  disabled 
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed" 
                />
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Website URL</label>
                <input 
                  type="text" 
                  value={profileData.websiteUrl || 'Not Specified'} 
                  disabled 
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed" 
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Country</label>
                <input 
                  type="text" 
                  value={profileData.country} 
                  disabled 
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed" 
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Province / State</label>
                <input 
                  type="text" 
                  value={profileData.state} 
                  disabled 
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed" 
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">City</label>
                <input 
                  type="text" 
                  value={profileData.city} 
                  disabled 
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed" 
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Postal Code</label>
                <input 
                  type="text" 
                  value={profileData.postalCode} 
                  disabled 
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed" 
                />
              </div>
            </div>

            {/* Explanatory Info Alert box */}
            <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 font-semibold leading-relaxed">
                <p className="font-extrabold uppercase tracking-wider text-[10px]">Compliance Safety Rule Notice:</p>
                To prevent fraud and enforce state-law courier guidelines in Pakistan, changes to high-security details (Email, Phone, Name, City, and Address) require support coordination. Please launch a ticket or contact direct Support at <strong className="font-extrabold">03462344807</strong> to request adjustments.
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-pink-100 flex justify-end">
              <button 
                type="button" 
                disabled 
                className="rounded-xl bg-pink-100 text-pink-700 text-xs font-black px-6 py-2.5 uppercase tracking-wider cursor-not-allowed opacity-75"
              >
                Edit Settings
              </button>
            </div>
          </div>

          {/* New Relational Section: Bank Account and Payout Compliance Information */}
          <div className="bg-[#fff5f5]/60 rounded-3xl p-6 border border-pink-100 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100 mb-5">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <PiggyBank className="h-4.5 w-4.5 text-pink-500" />
                <span>Bank Details &amp; CNIC Profile</span>
              </h3>
              <span className="text-[10px] bg-rose-100 text-rose-800 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                Payout Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bank Name */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Bank Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Building className="h-4 w-4" />
                  </span>
                  <input 
                    type="text" 
                    value={profileData.bankName} 
                    disabled 
                    className="w-full text-xs pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed" 
                  />
                </div>
              </div>

              {/* Account Holder Name */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Account Holder Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input 
                    type="text" 
                    value={profileData.bankHolderName} 
                    disabled 
                    className="w-full text-xs pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed" 
                  />
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Account Number / Mobile Wallet</label>
                <input 
                  type="text" 
                  value={profileData.bankAccountNumber} 
                  disabled 
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed" 
                />
              </div>

              {/* IBAN */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">International IBAN (24 Characters)</label>
                <input 
                  type="text" 
                  value={profileData.bankIban} 
                  disabled 
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed" 
                />
              </div>

              {/* CNIC Number */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Registered Biometric CNIC Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <FileText className="h-4 w-4" />
                  </span>
                  <input 
                    type="text" 
                    value={profileData.cnic} 
                    disabled 
                    className="w-full text-xs pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Authentication Details Card (Rendered neatly as a beautiful, dedicated card) */}
          <div className="bg-[#fff5f5]/60 rounded-3xl p-6 border border-pink-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lock className="h-4 w-4 text-pink-500" />
                <span>Authentication Details</span>
              </h3>

              <div className="space-y-4 text-xs font-semibold pl-1">
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase">User Name</span>
                  <p className="text-slate-800 font-extrabold mt-0.5">{profileData.username}</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase">Login Password</span>
                  
                  {isEditingPassword ? (
                    <form onSubmit={handleSavePassword} className="space-y-3 mt-2">
                      <div>
                        <label className="block text-[9px] text-slate-500 uppercase font-black mb-0.5">New Password</label>
                        <input 
                          type="password" 
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-pink-500/20"
                          placeholder="Min 5 characters"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-500 uppercase font-black mb-0.5">Confirm Password</label>
                        <input 
                          type="password" 
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-pink-500/20"
                          placeholder="Repeat password"
                        />
                      </div>
                      
                      <div className="flex gap-2 pt-1">
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsEditingPassword(false);
                            setNewPassword(profileData.password);
                            setConfirmPassword(profileData.password);
                          }}
                          className="flex-1 py-1.5 text-[10px] font-black border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="flex-1 py-1.5 text-[10px] font-black bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-sm"
                        >
                          Save Pass
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl border border-pink-100/50 mt-1">
                      <span className="font-mono text-slate-800 tracking-wider">
                        {showPassword ? profileData.password : '••••••••'}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-500 hover:text-slate-800 p-1"
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!isEditingPassword && (
              <div className="mt-5 pt-3 border-t border-pink-100/50">
                <button 
                  onClick={() => {
                    setIsEditingPassword(true);
                    setNewPassword(profileData.password);
                    setConfirmPassword(profileData.password);
                  }}
                  className="w-full rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-black py-2.5 uppercase tracking-wider transition"
                >
                  Edit Authentication
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
