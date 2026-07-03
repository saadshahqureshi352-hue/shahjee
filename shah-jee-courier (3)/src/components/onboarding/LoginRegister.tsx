import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  User, 
  Lock, 
  HelpCircle, 
  Info, 
  CheckCircle, 
  Check, 
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  DollarSign,
  Briefcase,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  MapPin,
  Calendar,
  Layers,
  Building,
  CreditCard,
  UploadCloud,
  X,
  Send,
  LockKeyhole
} from 'lucide-react';

interface LoginRegisterProps {
  onSuccess: (data: { brandName: string; userName: string; email: string }) => void;
}

interface RegisteredAccount {
  email: string;
  phone: string;
  username: string;
  password: string;
  name: string;
  brand: string;
}

const DEFAULT_ACCOUNTS: RegisteredAccount[] = [
  {
    email: 'aliraza@galaxy.com',
    username: 'galaxy_electronics',
    phone: '03001234567',
    password: 'securePass123',
    name: 'Ali Raza',
    brand: 'Galaxy Electronics'
  },
  {
    email: 'demo_shipper@shahjeecourier.com',
    username: 'demo_shipper',
    phone: '03007654321',
    password: 'password123',
    name: 'Muhammad Salman',
    brand: 'Al-Madina E-Commerce'
  }
];

export default function LoginRegister({ onSuccess }: LoginRegisterProps) {
  // Authentication views: 'login' | 'register' | 'forgot'
  const [viewState, setViewState] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Carousel slides for the interactive right banner slider
  const bannerSlides = [
    {
      title: "FAST DELIVERY",
      urduTitle: "تیز ترین اور محفوظ ڈیلیوری",
      desc: "Tez tareen aur safe delivery - integrated with TCS, Leopards, Lionex & Run Courier directly in your dashboard.",
      badge: "⚡ FAST DELIVERY",
      image: "/src/assets/images/fast_delivery_banner_1782899088093.jpg",
      highlight: "Direct automated 3PL networks in Pakistan"
    },
    {
      title: "LOW RETURN RATIO",
      urduTitle: "سب سے کم ریٹرن ریشو کا وعدہ",
      desc: "Active call verification checks to filter addresses, verify clients, and reduce returns dramatically.",
      badge: "📉 LOW RETURN",
      image: "/src/assets/images/low_return_banner_1782899114098.jpg",
      highlight: "Poore Pakistan mein sab se kam return ratio!"
    },
    {
      title: "INSTANT PAYMENTS",
      urduTitle: "فوری اور خودکار ادائیگیاں",
      desc: "Automated 2x weekly payout runs with zero delays or hidden fees, directly to your preferred bank or wallet.",
      badge: "💰 INSTANT PAYMENTS",
      image: "/src/assets/images/instant_payments_banner_1782899134456.jpg",
      highlight: "Tuesdays & Fridays cash settlements"
    },
    {
      title: "24/7 WHATSAPP HELP",
      urduTitle: "چوبیس گھنٹے براہ راست مدد",
      desc: "Helpline: 03462344807. Get direct live coordinator assistance whenever you face any issues.",
      badge: "💬 24/7 WHATSAPP",
      image: "/src/assets/images/whatsapp_support_banner_1782899155871.jpg",
      highlight: "Support Helpline: 03462344807"
    }
  ];
  
  const [activeSlide, setActiveSlide] = useState(0);

  // Simulated Database
  const [accounts, setAccounts] = useState<RegisteredAccount[]>(() => {
    const saved = localStorage.getItem('sjc_registered_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_ACCOUNTS;
      }
    }
    return DEFAULT_ACCOUNTS;
  });

  // Save accounts database
  useEffect(() => {
    localStorage.setItem('sjc_registered_accounts', JSON.stringify(accounts));
  }, [accounts]);

  // Login form states
  const [loginCredential, setLoginCredential] = useState('demo_shipper');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');

  // Register multi-step states
  const [registerStep, setRegisterStep] = useState(1);
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [isPendingApproval, setIsPendingApproval] = useState(false);

  // Onboarding Step 1 form states
  const [regName, setRegName] = useState('');
  const [regBrand, setRegBrand] = useState('');
  const [regFather, setRegFather] = useState('');
  const [regCnic, setRegCnic] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regGender, setRegGender] = useState('Male');
  const [regAddress, setRegAddress] = useState('');

  // Step 2: Bank states
  const [bankHolderName, setBankHolderName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIban, setBankIban] = useState('');
  const [bankName, setBankName] = useState('United Bank Limited (UBL)');
  const [paymentCycle, setPaymentCycle] = useState('twice_weekly'); // 'once_weekly' | 'twice_weekly'

  // Step 3: Verification photo filenames mock
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<File | null>(null);
  const [cnicFrontPhoto, setCnicFrontPhoto] = useState<File | null>(null);
  const [cnicBackPhoto, setCnicBackPhoto] = useState<File | null>(null);
  const [businessPhoto, setBusinessPhoto] = useState<File | null>(null);
  const [chequePhoto, setChequePhoto] = useState<File | null>(null);

  // Step 4: Authentication states
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Forgot password flow states
  const [forgotInput, setForgotInput] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1); // 1: Input, 2: OTP, 3: New Pass
  const [simulatedOTP, setSimulatedOTP] = useState('');
  const [enteredOTP, setEnteredOTP] = useState('');
  const [otpError, setOtpError] = useState('');
  const [forgotUser, setForgotUser] = useState<RegisteredAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Slide rotation for carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Set document title dynamically
  useEffect(() => {
    if (viewState === 'login') {
      document.title = "Login – Shah Jee Courier";
    } else if (viewState === 'register') {
      document.title = "Register – Shah Jee Courier";
    } else {
      document.title = "Forgot Password – Shah Jee Courier";
    }
  }, [viewState]);

  // Handle Login Authentication
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginCredential || !loginPassword) {
      setLoginError('Plese fill in all details.');
      return;
    }

    // Lookup credentials in our accounts database
    const match = accounts.find(
      acc => (acc.username === loginCredential || acc.email === loginCredential || acc.phone === loginCredential)
    );

    if (match) {
      if (match.password === loginPassword) {
        onSuccess({
          brandName: match.brand,
          userName: match.name,
          email: match.email
        });
      } else {
        setLoginError('Incorrect password. Please verify and try again.');
      }
    } else {
      // Allow fallback to demo_shipper for extreme ease of testing
      if (loginCredential === 'demo_shipper' && loginPassword === 'password123') {
        onSuccess({
          brandName: 'Al-Madina E-Commerce',
          userName: 'Muhammad Salman',
          email: 'demo_shipper@shahjeecourier.com'
        });
      } else {
        setLoginError('No merchant account found with this Email/Username/Phone.');
      }
    }
  };

  // Handle Registration Submit (Step 4)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      alert('Passwords do not match. Please verify.');
      return;
    }

    // Create new account
    const newAccount: RegisteredAccount = {
      email: regEmail,
      phone: regPhone,
      username: regUsername.toLowerCase().trim(),
      password: regPassword,
      name: regName,
      brand: regBrand
    };

    // Update state & localStorage
    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);

    // Save step values
    setIsPendingApproval(true);
  };

  // Bypass approval during demo session
  const handleBypassOnboarding = () => {
    onSuccess({
      brandName: regBrand || 'Galaxy Electronics',
      userName: regName || 'Ali Raza',
      email: regEmail || 'aliraza@galaxy.com'
    });
  };

  // Step controls
  const nextStep = () => {
    setRegisterStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setRegisterStep(prev => Math.max(prev - 1, 1));
  };

  // Forgot Password Trigger Flow
  const handleForgotSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    const targetUser = accounts.find(
      acc => (acc.email === forgotInput || acc.phone === forgotInput || acc.username === forgotInput)
    );

    if (targetUser) {
      setForgotUser(targetUser);
      // Generate simulated OTP
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setSimulatedOTP(code);
      setForgotStep(2);
    } else {
      setForgotError('We could not find any account registered with this email, phone, or username.');
    }
  };

  // Handle OTP Submission
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (enteredOTP === simulatedOTP || enteredOTP === '1234') {
      setForgotStep(3);
    } else {
      setOtpError('Invalid verification OTP code. Please enter the simulated code shown above.');
    }
  };

  // Reset Password Submit
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewPasswordError('');

    if (newPassword !== confirmNewPassword) {
      setNewPasswordError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 5) {
      setNewPasswordError('Password must be at least 5 characters long.');
      return;
    }

    if (forgotUser) {
      // Update password in accounts database
      const updatedAccounts = accounts.map(acc => {
        if (acc.email === forgotUser.email) {
          return { ...acc, password: newPassword };
        }
        return acc;
      });
      setAccounts(updatedAccounts);
      setForgotSuccess(true);

      // Reset state and transition back to login with success alert
      setTimeout(() => {
        setForgotSuccess(false);
        setForgotStep(1);
        setForgotInput('');
        setEnteredOTP('');
        setNewPassword('');
        setConfirmNewPassword('');
        setForgotUser(null);
        setViewState('login');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen antialiased flex items-center justify-center p-3 md:p-6 lg:p-8 bg-slate-900 relative">
      {/* Background Animated Gradient Glow Orbs */}
      <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute -right-20 -bottom-20 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none"></div>

      {/* Main Grid Wrapper */}
      <div className="relative flex flex-col lg:flex-row items-stretch justify-center w-full max-w-7xl gap-6 z-10 my-auto">
        
        {/* ================= LEFT SIDE: FORMS WINDOW ================= */}
        <div className="w-full lg:w-[48%] xl:w-[44%] flex flex-col justify-center max-w-lg mx-auto lg:max-w-none">
          
          <AnimatePresence mode="wait">
            {/* 1. REGISTRATION PENDING APPROVAL VIEW */}
            {isPendingApproval ? (
              <motion.div 
                key="pending"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 text-center flex flex-col items-center"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 ring-4 ring-orange-100 shadow-md mb-6">
                  <span className="text-4xl animate-bounce">⏳</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight uppercase">
                  Account Pending Approval
                </h2>

                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  Your merchant account for <strong className="text-teal-600">{regBrand}</strong> is currently under 3PL compliance audit security review.
                </p>
                
                <p className="text-slate-500 text-xs mt-2 max-w-md leading-relaxed">
                  Under the guidelines of Shah Jee Courier networks, our compliance desk usually reviews CNIC and Bank credentials in 15-30 minutes.
                </p>

                {/* Info guidelines box */}
                <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5 mt-6 w-full text-left max-w-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4.5 w-4.5 text-orange-600" />
                    <span className="text-xs font-black text-orange-800 uppercase tracking-wider">Demo Quick Access Protocol</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside font-medium">
                    <li>Compliance checks CNIC formats and active IBAN codes.</li>
                    <li>Auto-tracking notifications will activate for WhatsApp Gateway.</li>
                    <li>We have successfully saved your account in our registered database!</li>
                    <li className="text-teal-700 font-bold">You can also bypass this screen and open the system instantly.</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-6">
                  <button
                    onClick={handleBypassOnboarding}
                    className="flex-1 rounded-xl bg-gradient-to-r from-teal-600 to-teal-800 py-3 text-xs font-black text-white shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Bypass & Open Live Portal (Demo)
                  </button>
                  <button
                    onClick={() => {
                      setIsPendingApproval(false);
                      setViewState('login');
                    }}
                    className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Go To Login
                  </button>
                </div>

                <div className="mt-6 text-xs text-slate-400 font-semibold">
                  Support desk: <span className="font-bold text-slate-600">support@shahjeecourier.com</span>
                </div>
              </motion.div>
            ) : viewState === 'login' ? (
              
              /* 2. MAIN LOGIN FORM CARD (WHITE BACKGROUND, ROUNDED CORNERS) */
              <motion.div 
                key="login"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100 flex flex-col justify-between"
              >
                {/* Logo and Greeting Header */}
                <div className="text-center mb-6">
                  {/* Shah Jee Courier stylized brand logo */}
                  <div className="flex justify-center mb-3">
                    <div className="h-20 w-20 bg-slate-50 border border-slate-100 p-2.5 rounded-2xl shadow-sm flex items-center justify-center relative group">
                      <div className="absolute inset-0 bg-orange-500/5 rounded-2xl scale-105 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {/* Stylized S J logo representation */}
                      <svg viewBox="0 0 100 100" className="w-14 h-14">
                        <circle cx="50" cy="50" r="45" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
                        <path d="M30 40 C 35 30, 65 30, 70 40 C 73 45, 60 55, 50 50 C 40 45, 27 55, 30 60 C 35 70, 65 70, 70 60" fill="none" stroke="#ea580c" strokeWidth="8" strokeLinecap="round" />
                        <path d="M50 32 L 50 68 C 50 78, 40 78, 35 73" fill="none" stroke="#1e3a8a" strokeWidth="8" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-extrabold uppercase tracking-widest mb-1">
                    Welcome to
                  </p>
                  
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
                    <span className="text-[#ea580c]">Shah Jee </span>
                    <span className="text-[#1e3a8a]">Courier</span>
                  </h1>
                  
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1.5 border-t border-slate-100 pt-1.5 max-w-xs mx-auto">
                    Clients Portal
                  </p>
                </div>

                {loginError && (
                  <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-bold flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Credential input */}
                  <div>
                    <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Email / Username / Phone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <User className="h-4.5 w-4.5 text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        required
                        value={loginCredential}
                        onChange={(e) => setLoginCredential(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-xs font-semibold text-slate-800 transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 placeholder-slate-400" 
                        placeholder="Enter your email, username or phone"
                      />
                    </div>
                  </div>

                  {/* Password input */}
                  <div>
                    <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Lock className="h-4.5 w-4.5 text-slate-400" />
                      </div>
                      <input 
                        type="password" 
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-xs font-semibold text-slate-800 transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 placeholder-slate-400" 
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  {/* Remember and Forgot buttons */}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <label className="flex items-center gap-1.5 text-slate-500 font-bold cursor-pointer">
                      <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500" defaultChecked />
                      <span>Remember Me</span>
                    </label>
                    <button 
                      type="button" 
                      onClick={() => {
                        setViewState('forgot');
                        setForgotStep(1);
                        setForgotError('');
                        setForgotInput('');
                      }} 
                      className="font-bold text-[#ea580c] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Red/orange Login submit button */}
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit" 
                    className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 text-xs font-black text-white shadow-md shadow-orange-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                  >
                    <span>Login Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </form>

                {/* Footer and Register options */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">New shipper to Shah Jee Courier?</span>
                  <button 
                    onClick={() => {
                      setViewState('register');
                      setRegisterStep(1);
                      setAcceptedRules(false);
                    }} 
                    className="text-[#1e3a8a] hover:text-[#ea580c] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Register Account</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Secure network tags */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-6 text-[10px] text-slate-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Secure Connection</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-emerald-600" />
                    <span>SSL Protected</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 text-center text-[10px] text-slate-400 font-semibold">
                  © 2026 Shah Jee Courier. All rights reserved.
                </div>
              </motion.div>
            ) : viewState === 'forgot' ? (
              
              /* 3. INTERACTIVE STEP-BY-STEP FORGOT PASSWORD SCREEN */
              <motion.div 
                key="forgot"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100"
              >
                <div className="mb-5 flex items-center justify-between pb-3 border-b border-slate-100">
                  <button 
                    onClick={() => setViewState('login')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Login</span>
                  </button>
                  <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Password recovery
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Recover Portal Access</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Verify your identity via registered credentials. If your account exists, we will generate an instant simulation verification code.
                  </p>
                </div>

                {/* STEPS PREVIEW BAR */}
                <div className="grid grid-cols-3 gap-1.5 mb-5 bg-slate-50 p-1.5 rounded-xl text-center">
                  <span className={`text-[9px] font-black py-1.5 rounded-lg ${forgotStep === 1 ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400'}`}>1. Find</span>
                  <span className={`text-[9px] font-black py-1.5 rounded-lg ${forgotStep === 2 ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400'}`}>2. Verify OTP</span>
                  <span className={`text-[9px] font-black py-1.5 rounded-lg ${forgotStep === 3 ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400'}`}>3. Set New</span>
                </div>

                {/* Sub-steps of recovery */}
                {forgotStep === 1 && (
                  <form onSubmit={handleForgotSearch} className="space-y-4">
                    {forgotError && (
                      <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs text-rose-700 font-bold">
                        {forgotError}
                      </div>
                    )}
                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1.5">Your Registered Email, Username, or Phone *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <Mail className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          required
                          value={forgotInput}
                          onChange={(e) => setForgotInput(e.target.value)}
                          placeholder="e.g. aliraza@galaxy.com or 03001234567"
                          className="w-full text-xs pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-xs py-3.5 rounded-xl hover:scale-101 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/10 cursor-pointer uppercase tracking-wider"
                    >
                      <Send className="h-4 w-4" />
                      <span>Search Account & Send Code</span>
                    </button>
                  </form>
                )}

                {forgotStep === 2 && forgotUser && (
                  <form onSubmit={handleOtpSubmit} className="space-y-4">
                    {otpError && (
                      <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs text-rose-700 font-bold">
                        {otpError}
                      </div>
                    )}

                    {/* Simulation OTP display box */}
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-center gap-2 text-amber-800 text-xs font-black uppercase tracking-wider mb-1">
                        <LockKeyhole className="h-4 w-4 text-amber-600" />
                        <span>[SIMULATED DISPATCH SMS/MAIL]</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        To bypass real SMTP delays, a secure verification token has been generated:
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xl font-black text-orange-600 font-mono tracking-widest bg-white border border-amber-200 px-3 py-1 rounded-xl">
                          {simulatedOTP}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">(Or use default bypass: <strong className="font-extrabold text-slate-800">1234</strong>)</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1.5">Enter 4-Digit OTP Code *</label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        placeholder="e.g. 5829"
                        value={enteredOTP}
                        onChange={(e) => setEnteredOTP(e.target.value)}
                        className="w-full text-center text-lg font-black tracking-widest p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-slate-800"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setForgotStep(1)}
                        className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-500 font-black text-xs py-3 rounded-xl transition cursor-pointer"
                      >
                        Change Email
                      </button>
                      <button
                        type="submit"
                        className="flex-[2] bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-xs py-3 rounded-xl transition cursor-pointer uppercase tracking-wider"
                      >
                        Verify Code
                      </button>
                    </div>
                  </form>
                )}

                {forgotStep === 3 && (
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                    {forgotSuccess && (
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3.5 text-xs text-emerald-800 font-bold flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        <div>
                          <p className="font-extrabold">Password Saved Successfully!</p>
                          <p className="font-medium text-[11px] text-emerald-600">You are being redirected to the login panel...</p>
                        </div>
                      </div>
                    )}

                    {newPasswordError && (
                      <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs text-rose-700 font-bold">
                        {newPasswordError}
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">New Secret Password *</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter at least 5 characters"
                        className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Confirm New Password *</label>
                      <input
                        type="password"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Repeat password"
                        className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-800"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={forgotSuccess}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md shadow-orange-500/10 cursor-pointer disabled:opacity-50 uppercase tracking-wider"
                    >
                      Update Secret Password
                    </button>
                  </form>
                )}
              </motion.div>
            ) : (
              
              /* 4. SHIPPERS ONBOARDING MULTI-STEP WIZARD */
              <motion.div 
                key="register"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-100 max-h-[88vh] overflow-y-auto custom-scrollbar text-slate-800"
              >
                
                {/* Back Link */}
                <div className="mb-4">
                  <button 
                    onClick={() => setViewState('login')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Login</span>
                  </button>
                </div>

                {/* Steps Visual Bar Progress indicator */}
                <div className="flex items-center justify-between mb-6 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg ${registerStep === 1 ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400'}`}>1. Personal</span>
                  <span className="text-slate-300 font-black">→</span>
                  <span className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg ${registerStep === 2 ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400'}`}>2. Bank</span>
                  <span className="text-slate-300 font-black">→</span>
                  <span className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg ${registerStep === 3 ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400'}`}>3. Verification</span>
                  <span className="text-slate-300 font-black">→</span>
                  <span className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg ${registerStep === 4 ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400'}`}>4. Credentials</span>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  
                  {/* STEP 1: Personal Information */}
                  {registerStep === 1 && (
                    <div className="space-y-4">
                      <div className="pb-1 border-b border-slate-100">
                        <h4 className="text-base font-black text-slate-800 uppercase tracking-tight">Personal Information</h4>
                        <p className="text-[11px] text-slate-400 font-semibold">Provide your authentic biometric and business identity parameters.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Your Name *</label>
                          <input 
                            type="text" 
                            required
                            value={regName} 
                            onChange={(e) => setRegName(e.target.value)} 
                            placeholder="e.g. Ali Raza"
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Brand Name *</label>
                          <input 
                            type="text" 
                            required
                            value={regBrand} 
                            onChange={(e) => setRegBrand(e.target.value)} 
                            placeholder="e.g. Galaxy Electronics"
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Father Name *</label>
                          <input 
                            type="text" 
                            required
                            value={regFather} 
                            onChange={(e) => setRegFather(e.target.value)} 
                            placeholder="e.g. Muhammad Raza"
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">CNIC Number *</label>
                          <input 
                            type="text" 
                            required
                            value={regCnic} 
                            onChange={(e) => setRegCnic(e.target.value)} 
                            placeholder="e.g. 42101-1234567-9"
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">City *</label>
                          <input 
                            type="text" 
                            required
                            value={regCity} 
                            onChange={(e) => setRegCity(e.target.value)} 
                            placeholder="e.g. Karachi"
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Phone Number *</label>
                          <input 
                            type="tel" 
                            required
                            value={regPhone} 
                            onChange={(e) => setRegPhone(e.target.value)} 
                            placeholder="e.g. 03001234567"
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Date of Birth *</label>
                          <input 
                            type="date" 
                            required
                            value={regDob} 
                            onChange={(e) => setRegDob(e.target.value)} 
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Gender *</label>
                          <select 
                            value={regGender}
                            onChange={(e) => setRegGender(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold bg-white"
                          >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Complete Home/Shop Address *</label>
                        <textarea 
                          rows={2}
                          required
                          value={regAddress}
                          onChange={(e) => setRegAddress(e.target.value)}
                          placeholder="Please enter complete shop address for parcel collections"
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                        />
                      </div>

                      <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 flex flex-col gap-2">
                        <div className="flex items-start gap-3">
                          <input 
                            type="checkbox" 
                            id="rules-chk"
                            checked={acceptedRules}
                            onChange={(e) => setAcceptedRules(e.target.checked)}
                            className="mt-1 h-4.5 w-4.5 rounded text-orange-600 focus:ring-orange-500 border-slate-300 cursor-pointer" 
                          />
                          <label htmlFor="rules-chk" className="text-[11px] text-slate-600 font-bold cursor-pointer select-none leading-tight">
                            I have read and agree to the <button type="button" onClick={() => setShowGuidelinesModal(true)} className="text-[#ea580c] underline font-extrabold hover:text-orange-600 focus:outline-none cursor-pointer">Shipper Registration Guidelines</button> and <span className="text-[#1e3a8a] underline">Terms of Service</span> of Shah Jee Courier.
                          </label>
                        </div>
                        <div className="pl-7 mt-0.5">
                          <button 
                            type="button" 
                            onClick={() => setShowGuidelinesModal(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-black text-[#ea580c] hover:underline cursor-pointer"
                          >
                            <span>📝 رجسٹریشن کی ہدایات پڑھیں (Read Guidelines)</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          disabled={!acceptedRules || !regName || !regBrand || !regCnic || !regPhone}
                          onClick={nextStep}
                          className={`px-6 py-3 rounded-xl text-xs font-black shadow-md uppercase tracking-wider transition-all cursor-pointer ${
                            acceptedRules && regName && regBrand && regCnic && regPhone
                              ? 'bg-orange-500 hover:bg-orange-600 text-white hover:scale-[1.02] active:scale-95' 
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Bank Details & Payable Days */}
                  {registerStep === 2 && (
                    <div className="space-y-4">
                      <div className="pb-1 border-b border-slate-100">
                        <h4 className="text-base font-black text-slate-800 uppercase tracking-tight">Bank Details & Payable Days</h4>
                        <p className="text-[11px] text-slate-400 font-semibold">Your daily COD payments will be processed into this verified channel.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Account Holder Name *</label>
                          <input 
                            type="text" 
                            required
                            value={bankHolderName} 
                            onChange={(e) => setBankHolderName(e.target.value)} 
                            placeholder="e.g. Ali Raza"
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Account Number *</label>
                          <input 
                            type="text" 
                            required
                            value={bankAccountNumber} 
                            onChange={(e) => setBankAccountNumber(e.target.value)} 
                            placeholder="e.g. 01920392019401"
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">IBAN Number *</label>
                          <input 
                            type="text" 
                            required
                            value={bankIban} 
                            onChange={(e) => setBankIban(e.target.value)} 
                            placeholder="e.g. PK12UNIB0000019203920194"
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono font-bold" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Bank / Wallet *</label>
                          <select
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold bg-white"
                          >
                            <option>United Bank Limited (UBL)</option>
                            <option>Habib Bank Limited (HBL)</option>
                            <option>Meezan Bank</option>
                            <option>Faysal Bank</option>
                            <option>Alfalah Bank</option>
                            <option>Easypaisa Wallet</option>
                            <option>JazzCash Wallet</option>
                            <option>Nayapay Wallet</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1.5">Payment Cycle *</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                            paymentCycle === 'once_weekly' ? 'border-[#ea580c] bg-orange-50/20' : 'border-slate-200'
                          }`}>
                            <input 
                              type="radio" 
                              name="cycle" 
                              checked={paymentCycle === 'once_weekly'} 
                              onChange={() => setPaymentCycle('once_weekly')} 
                              className="text-orange-600 focus:ring-orange-500"
                            />
                            <div>
                              <p className="text-xs font-black text-slate-700">Once in a week</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Every Friday settlement run</p>
                            </div>
                          </label>

                          <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                            paymentCycle === 'twice_weekly' ? 'border-[#ea580c] bg-orange-50/20' : 'border-slate-200'
                          }`}>
                            <input 
                              type="radio" 
                              name="cycle" 
                              checked={paymentCycle === 'twice_weekly'} 
                              onChange={() => setPaymentCycle('twice_weekly')} 
                              className="text-orange-600 focus:ring-orange-500"
                            />
                            <div>
                              <p className="text-xs font-black text-slate-700">Twice in a week</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Tuesdays & Fridays settlement</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Add Cheque Photo (Optional)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition">
                          <div className="space-y-1 text-center">
                            <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />
                            <div className="flex text-xs text-slate-600 justify-center">
                              <label className="relative cursor-pointer bg-white rounded-md font-extrabold text-[#ea580c] hover:text-orange-600">
                                <span>Choose File</span>
                                <input 
                                  type="file" 
                                  className="sr-only" 
                                  onChange={(e) => setChequePhoto(e.target.files?.[0] || null)}
                                  accept="image/*" 
                                />
                              </label>
                            </div>
                            <p className="text-[10px] text-slate-400">PNG, JPG, PDF up to 5MB</p>
                            {chequePhoto && <span className="text-[10px] text-emerald-600 font-bold block">✓ Selected: {chequePhoto.name}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          disabled={!bankHolderName || !bankAccountNumber || !bankIban}
                          onClick={nextStep}
                          className={`px-6 py-3 rounded-xl text-xs font-black shadow-md uppercase tracking-wider transition-all cursor-pointer ${
                            bankHolderName && bankAccountNumber && bankIban
                              ? 'bg-orange-500 hover:bg-orange-600 text-white hover:scale-[1.02] active:scale-95'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Verifications */}
                  {registerStep === 3 && (
                    <div className="space-y-4">
                      <div className="pb-1 border-b border-slate-100">
                        <h4 className="text-base font-black text-slate-800 uppercase tracking-tight">Verifications</h4>
                        <p className="text-[11px] text-slate-400 font-semibold">Upload clear document files for quick KYC compliance approval.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50">
                          <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Profile Image *</label>
                          <input 
                            type="file" 
                            required
                            accept="image/*"
                            onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                            className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-slate-200 file:text-slate-700 cursor-pointer"
                          />
                          {profilePhoto && <span className="text-[10px] text-emerald-600 font-semibold block mt-1">✓ {profilePhoto.name}</span>}
                        </div>

                        <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50">
                          <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Selfie Live Face Image *</label>
                          <input 
                            type="file" 
                            required
                            accept="image/*"
                            onChange={(e) => setSelfiePhoto(e.target.files?.[0] || null)}
                            className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-slate-200 file:text-slate-700 cursor-pointer"
                          />
                          {selfiePhoto && <span className="text-[10px] text-emerald-600 font-semibold block mt-1">✓ {selfiePhoto.name}</span>}
                        </div>

                        <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50">
                          <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">CNIC Front *</label>
                          <input 
                            type="file" 
                            required
                            accept="image/*"
                            onChange={(e) => setCnicFrontPhoto(e.target.files?.[0] || null)}
                            className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-slate-200 file:text-slate-700 cursor-pointer"
                          />
                          {cnicFrontPhoto && <span className="text-[10px] text-emerald-600 font-semibold block mt-1">✓ {cnicFrontPhoto.name}</span>}
                        </div>

                        <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50">
                          <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">CNIC Back *</label>
                          <input 
                            type="file" 
                            required
                            accept="image/*"
                            onChange={(e) => setCnicBackPhoto(e.target.files?.[0] || null)}
                            className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-slate-200 file:text-slate-700 cursor-pointer"
                          />
                          {cnicBackPhoto && <span className="text-[10px] text-emerald-600 font-semibold block mt-1">✓ {cnicBackPhoto.name}</span>}
                        </div>
                      </div>

                      <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50">
                        <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Business Photos (Max 5) *</label>
                        <input 
                          type="file" 
                          required
                          accept="image/*"
                          onChange={(e) => setBusinessPhoto(e.target.files?.[0] || null)}
                          className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-slate-200 file:text-slate-700 cursor-pointer"
                        />
                        {businessPhoto && <span className="text-[10px] text-emerald-600 font-semibold block mt-1">✓ {businessPhoto.name}</span>}
                      </div>

                      <div className="flex justify-between pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          disabled={!profilePhoto || !selfiePhoto || !cnicFrontPhoto || !cnicBackPhoto}
                          onClick={nextStep}
                          className={`px-6 py-3 rounded-xl text-xs font-black shadow-md uppercase tracking-wider transition-all cursor-pointer ${
                            profilePhoto && selfiePhoto && cnicFrontPhoto && cnicBackPhoto
                              ? 'bg-orange-500 hover:bg-orange-600 text-white hover:scale-[1.02] active:scale-95'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Authentication Details */}
                  {registerStep === 4 && (
                    <div className="space-y-4">
                      <div className="pb-1 border-b border-slate-100">
                        <h4 className="text-base font-black text-slate-800 uppercase tracking-tight">Authentication Details</h4>
                        <p className="text-[11px] text-slate-400 font-semibold">Establish your login credentials to access the clients dashboard.</p>
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Email *</label>
                        <input 
                          type="email" 
                          required
                          value={regEmail} 
                          onChange={(e) => setRegEmail(e.target.value)} 
                          placeholder="e.g. aliraza@galaxy.com"
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold" 
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Username *</label>
                          <input 
                            type="text" 
                            required
                            value={regUsername} 
                            onChange={(e) => setRegUsername(e.target.value)} 
                            placeholder="small letters no spaces"
                            pattern="[a-z0-9_]+"
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-800" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Phone (Login) *</label>
                          <input 
                            type="text" 
                            required
                            disabled
                            value={regPhone} 
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-mono" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Password *</label>
                          <input 
                            type="password" 
                            required
                            value={regPassword} 
                            onChange={(e) => setRegPassword(e.target.value)} 
                            placeholder="Enter login password"
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-800" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Confirm Password *</label>
                          <input 
                            type="password" 
                            required
                            value={regConfirmPassword} 
                            onChange={(e) => setRegConfirmPassword(e.target.value)} 
                            placeholder="Repeat password exactly"
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-800" 
                          />
                        </div>
                      </div>

                      <div className="flex justify-between pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                        >
                          Previous
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
                        >
                          Submit Registration
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ================= RIGHT SIDE: INTERACTIVE SHOWCASE ================= */}
        <div className="w-full lg:w-[52%] xl:w-[56%] flex flex-col gap-6">
          
          {/* A. SHAH JEE COURIER PRESTIGE HEADER */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 bg-white p-1.5 rounded-xl shadow-lg flex items-center justify-center">
                  <span className="text-sm font-black text-transparent bg-gradient-to-br from-orange-500 to-amber-600 bg-clip-text">SJC</span>
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight uppercase leading-none text-orange-500">SHAH JEE COURIER (SMC PVT) LTD</h4>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">SMART LOGISTICS TO BOOST YOUR BUSINESS</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[8.5px] font-extrabold text-emerald-400 uppercase tracking-widest">
                  SECP & FBR REG: 0341596
                </span>
                <span className="bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-[7.5px] font-extrabold text-blue-400 uppercase tracking-widest">
                  Your Trusted Logistics Partner
                </span>
              </div>
            </div>
          </div>

          {/* B. IMMERSIVE PICTURE CAROUSEL SLIDER */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-3xl text-white shadow-2xl relative overflow-hidden flex flex-col justify-between flex-1 group">
            
            {/* Top section: Full Clear Image */}
            <div className="relative w-full h-[310px] overflow-hidden rounded-t-3xl bg-slate-900 shrink-0">
              <img 
                src={bannerSlides[activeSlide].image} 
                alt={bannerSlides[activeSlide].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-100 select-none pointer-events-none transition-transform duration-[5000ms] group-hover:scale-105 animate-fade-in"
              />
              {/* Badges on top of image */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <span className="text-[10px] font-black bg-orange-500/95 text-white px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  {bannerSlides[activeSlide].badge}
                </span>
                <span className="text-[9px] font-bold bg-slate-950/90 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-md text-slate-300 shadow-md">
                  SLIDE {activeSlide + 1} / {bannerSlides.length}
                </span>
              </div>
            </div>

            {/* Bottom Section: Text and details shown below the picture */}
            <div className="p-6 flex flex-col justify-between flex-1 bg-slate-950">
              <div className="space-y-3">
                <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest block">
                  {bannerSlides[activeSlide].highlight}
                </span>
                
                <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight leading-tight">
                  {bannerSlides[activeSlide].title}
                </h3>

                <h4 className="text-sm font-black text-orange-400 font-sans tracking-wide">
                  {bannerSlides[activeSlide].urduTitle}
                </h4>

                <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                  {bannerSlides[activeSlide].desc}
                </p>

                {/* Sub-badge indicating integrations */}
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-3 mt-4">
                  <div className="text-xl shrink-0">🚚</div>
                  <div className="text-[10.5px] leading-snug">
                    <p className="font-extrabold text-slate-100">Directly Integrated courier networks:</p>
                    <p className="text-slate-300 font-medium mt-0.5">TCS, Leopards, Lionex & Run Courier in one panel</p>
                  </div>
                </div>
              </div>

              {/* Slider Bottom controls */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-6">
                {/* Dots indicator */}
                <div className="flex gap-2">
                  {bannerSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === activeSlide ? 'w-8 bg-orange-500' : 'w-2 bg-slate-600 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* WhatsApp call to action */}
                <a 
                  href="https://wa.me/923462344807" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition text-white px-3 py-1.5 rounded-xl text-[10.5px] font-black shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  <span>💬 WhatsApp Support</span>
                </a>
              </div>
            </div>
          </div>

          {/* C. HELPLINE & FOOTER BANNER */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 text-center flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-left">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Automated Logistics Support</p>
              <p className="text-xs text-slate-200 font-black mt-0.5">Poore Pakistan mein sab se kam return ratio ka wada!</p>
            </div>
            <div className="text-right sm:text-right shrink-0">
              <p className="text-[10px] text-orange-500 font-extrabold uppercase tracking-widest">Helpline Support</p>
              <p className="text-xs text-white font-mono font-bold mt-0.5">03462344807</p>
            </div>
          </div>

        </div>

      </div>

      {/* ================= GUIDELINES POPUP MODAL ================= */}
      <AnimatePresence>
        {showGuidelinesModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-800 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowGuidelinesModal(false)}
                className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-lg">📝</div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">شپر رجسٹریشن کی ہدایات</h3>
                  <p className="text-xs text-slate-500 font-bold">Shipper Registration Guidelines – Shah Jee Courier</p>
                </div>
              </div>

              <div className="space-y-5 py-6 text-xs text-slate-700 leading-relaxed text-right font-medium">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left">
                  <p className="text-xs font-black text-[#1e3a8a] mb-1.5 uppercase tracking-wider">Please Read Carefully before continuing</p>
                  <p className="text-slate-500 text-[11px] font-medium leading-normal">
                    Compliance with these guidelines ensures your account is approved swiftly (usually within 15-30 minutes) and payouts run smoothly.
                  </p>
                </div>

                <div className="border-b border-slate-100 pb-4">
                  <p className="font-extrabold text-orange-600 text-sm flex justify-between items-center flex-row-reverse">
                    <span>1۔ درست معلومات (Accurate Bank Account)</span>
                    <span className="text-[10px] text-slate-400 font-mono font-semibold">Step 1</span>
                  </p>
                  <p className="text-slate-600 mt-1.5 pr-2">
                    رجسٹریشن فارم میں اپنا مکمل نام، موبائل نمبر اور ای میل ایڈریس بالکل صحیح درج کریں۔ اکاؤنٹ نمبر، اکاؤنٹ ہولڈر کا نام اور IBAN نمبر بالکل صحیح اور دھیان سے درج کریں تاکہ ڈیلیوری پیمنٹ میں تاخیر نہ ہو۔
                  </p>
                </div>

                <div className="border-b border-slate-100 pb-4">
                  <p className="font-extrabold text-orange-600 text-sm flex justify-between items-center flex-row-reverse">
                    <span>2۔ کوریئر کمپنیاں، پارسل گمشدگی اور کلیم پالیسی (Claim Guidelines)</span>
                    <span className="text-[10px] text-slate-400 font-mono font-semibold">Step 2</span>
                  </p>
                  <p className="text-slate-600 mt-1.5 pr-2">
                    شاہ جی کوریئر ایک 3PL ایگریگیٹر پورٹل ہے جو TCS, Leopards, Lionex اور Run کی سروسز فراہم کرتا ہے۔ پارسلز کی سیفٹی ہماری ترجیح ہے۔ کسی بھی کلیم کی صورت میں تصفیہ اوسطاً 18 سے 20 دن میں ہو گا۔
                  </p>
                </div>

                <div>
                  <p className="font-extrabold text-orange-600 text-sm flex justify-between items-center flex-row-reverse">
                    <span>3۔ روزانہ اور فوری ادائیگی (Daily & Instant Payouts)</span>
                    <span className="text-[10px] text-slate-400 font-mono font-semibold">Step 3</span>
                  </p>
                  <p className="text-slate-600 mt-1.5 pr-2">
                    ادائیگی روزانہ اور فوری ہو گی۔ آپ کے والٹ میں موجود بیلنس یا جمع شدہ ڈیلیوری چارجز بغیر کسی اضافی فیس کے فوراً آپ کے منتخب کردہ بینک یا والٹ میں منتقل کر دیئے جاتے ہیں۔
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <span className="text-[11px] text-slate-500 font-bold">Have questions? Support Helpline: 03462344807</span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => {
                      setAcceptedRules(true);
                      setShowGuidelinesModal(false);
                    }}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-md uppercase tracking-wider transition cursor-pointer"
                  >
                    I Agree & Accept (منظور ہے)
                  </button>
                  <button 
                    onClick={() => setShowGuidelinesModal(false)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-black transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
