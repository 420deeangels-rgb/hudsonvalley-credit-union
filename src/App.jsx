import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  ArrowUp,
  ArrowDown,
  DollarSign,
  TrendingUp,
  Search,
  X,
  CheckCircle2,
  RefreshCw,
  Menu,
  Building2,
  Send,
  Home,
  Clock,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  LogOut,
  FileText,
  Phone,
  Mail,
  MessageSquare,
  ArrowLeftRight,
  Download,
  AlertCircle,
  CheckCircle,
  Headphones
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard State
  const [showBalances, setShowBalances] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [txFilterCategory, setTxFilterCategory] = useState('All');
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Refs for outside click handling
  const profileMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Dynamic time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Account details matching total $3,865,000
  const [accounts, setAccounts] = useState([
    {
      id: 'acc-1',
      name: 'Current Account',
      accountNumber: '2536748930',
      balance: 2450000.00,
      type: 'Checking',
      iconBg: 'bg-indigo-100 text-indigo-600',
      icon: Building2
    },
    {
      id: 'acc-2',
      name: 'Savings Account',
      accountNumber: '6524418305',
      balance: 1175000.00,
      type: 'High-Yield Savings',
      iconBg: 'bg-emerald-100 text-emerald-600',
      icon: DollarSign
    },
    {
      id: 'acc-3',
      name: 'Investment Account',
      accountNumber: '8243434176',
      balance: 240000.00,
      type: 'Portfolio Assets',
      iconBg: 'bg-blue-100 text-blue-600',
      icon: TrendingUp
    }
  ]);

  const [transferForm, setTransferForm] = useState({
    fromAccount: '2536748930',
    toAccount: '6524418305',
    amount: '',
    memo: ''
  });
  const [isSubmittingTransfer, setIsSubmittingTransfer] = useState(false);

  // REAL LIFE RECENT ACTIVITIES
  const [transactions, setTransactions] = useState([
    { id: 'tx-1', title: 'J.P. Morgan Treasury Wire Credit', accountNumber: '6524418305', amount: 1000000.00, type: 'inflow', date: 'Today, 14:20', category: 'Wire Transfer' },
    { id: 'tx-2', title: 'Vanguard S&P 500 Index Dividend (VOO)', accountNumber: '8243434176', amount: 23445.00, type: 'inflow', date: 'Yesterday, 09:45', category: 'Dividend' },
    { id: 'tx-3', title: 'BlackRock Total Market Fund Rebalance', accountNumber: '8243434176', amount: 200000.00, type: 'outflow', date: 'Sep 15, 2026', category: 'Investment' },
    { id: 'tx-4', title: 'Hudson Valley Tax Reserve Allocation', accountNumber: '2536748930', amount: 200000.00, type: 'outflow', date: 'Sep 14, 2026', category: 'Transfer' },
    { id: 'tx-5', title: 'ConEdison Executive Utility Auto-Pay', accountNumber: '2536748930', amount: 3445.00, type: 'outflow', date: 'Sep 12, 2026', category: 'Utilities' },
    { id: 'tx-6', title: 'High-Yield Treasury Monthly Interest', accountNumber: '6524418305', amount: 4747.92, type: 'inflow', date: 'Sep 01, 2026', category: 'Interest' },
    { id: 'tx-7', title: 'Amex Centurion Monthly Auto-Settle', accountNumber: '2536748930', amount: 12850.40, type: 'outflow', date: 'Aug 28, 2026', category: 'Credit Card' },
    { id: 'tx-8', title: 'Goldman Sachs Private Fund Distribution', accountNumber: '8243434176', amount: 45000.00, type: 'inflow', date: 'Aug 22, 2026', category: 'Dividend' },
    { id: 'tx-9', title: 'Internal Transfer — Checking to Savings', accountNumber: '2536748930', amount: 50000.00, type: 'outflow', date: 'Aug 18, 2026', category: 'Transfer' },
    { id: 'tx-10', title: 'Apple Wealth Management Advisory Fee', accountNumber: '8243434176', amount: 2800.00, type: 'outflow', date: 'Aug 10, 2026', category: 'Fees' },
  ]);

  const txCategories = ['All', ...Array.from(new Set(transactions.map(t => t.category)))];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const formatCurrency = (val, includeDollar = false) => {
    if (!showBalances) return '•••••••• USD';
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
    return includeDollar ? `$${formatted} USD` : `${formatted} USD`;
  };

  // Login Handler — strict credential check
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      setLoginError('Please enter your Member ID and Password.');
      return;
    }
    if (loginForm.username.trim() !== 'jesse.garcia@hudsonvalley.com' || loginForm.password !== 'jessgarcHV01@') {
      setLoginError('Invalid Member ID or Password. Please try again.');
      return;
    }
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      setIsLoggedIn(true);
      showToast('Encrypted session initiated. Welcome, Jesse.');
    }, 900);
  };

  // Transfer Handler
  const handleTransferSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(transferForm.amount);
    if (isNaN(amountNum) || amountNum <= 0) return;
    if (transferForm.fromAccount === transferForm.toAccount) { showToast('From and To accounts must be different.'); return; }
    const fromAcc = accounts.find(a => a.accountNumber === transferForm.fromAccount);
    if (fromAcc && amountNum > fromAcc.balance) { showToast('Insufficient funds in selected account.'); return; }
    setIsSubmittingTransfer(true);
    setTimeout(() => {
      setAccounts(prev => prev.map(acc => {
        if (acc.accountNumber === transferForm.fromAccount) return { ...acc, balance: acc.balance - amountNum };
        if (acc.accountNumber === transferForm.toAccount) return { ...acc, balance: acc.balance + amountNum };
        return acc;
      }));
      const newTx = { id: `tx-${Date.now()}`, title: `Internal Transfer (${transferForm.memo || 'Transfer'})`, accountNumber: transferForm.fromAccount, amount: amountNum, type: 'outflow', date: 'Just now', category: 'Transfer' };
      setTransactions(prev => [newTx, ...prev]);
      setIsSubmittingTransfer(false);
      setTransferSuccess(true);
      setTransferForm(f => ({ ...f, amount: '', memo: '' }));
      showToast(`Transfer of $${amountNum.toLocaleString()} completed successfully.`);
    }, 900);
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase()) || tx.accountNumber.includes(searchQuery) || tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = txFilterCategory === 'All' || tx.category === txFilterCategory;
    return matchesSearch && matchesCat;
  });

  const navTabs = ['Dashboard', 'Transfers', 'Transactions', 'Support'];

  // ==========================================
  // RENDER LOGIN SCREEN (SPLIT-SCREEN WITH CUSTOM PURPLE BACKGROUND)
  // ==========================================
  if (!isLoggedIn) {
    return (
      <>
        {/* FULL-SCREEN LOGGING IN OVERLAY */}
        {isLoggingIn && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0F172A] gap-6">
            {/* Animated ring */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-indigo-900/60">H</div>
              </div>
            </div>
            {/* Text */}
            <div className="text-center space-y-2">
              <p className="text-white font-semibold text-sm tracking-wide">Logging in</p>
              <p className="text-slate-400 text-xs">Securing your session…</p>
            </div>
            {/* Animated dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
      <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col lg:flex-row selection:bg-indigo-600 selection:text-white antialiased">
        
        {/* LEFT SIDE FORM PANEL */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-white min-h-screen">
          
          {/* Top Bank Name Branding */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white text-xs">
              H
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              Hudson Valley Credit Union
            </span>
          </div>

          {/* Login Form Container */}
          <div className="max-w-md w-full mx-auto my-auto py-8 space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Login
              </h1>
              <p className="text-xs text-slate-400 mt-2">
                Enter your credentials to access your private wealth accounts
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-6">
              
              {/* Username Input */}
              <div className="space-y-2">
                <label htmlFor="login-username" className="text-xs font-medium text-slate-500">
                  Username / Member ID
                </label>
                <input
                  id="login-username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                  autoComplete="username"
                  placeholder="Enter your member email"
                  className="w-full border-b border-slate-200 py-3 text-sm text-slate-800 focus:outline-none focus:border-slate-900 transition-colors bg-transparent placeholder:text-slate-300"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="login-password" className="text-xs font-medium text-slate-500">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full border-b border-slate-200 py-3 text-sm text-slate-800 focus:outline-none focus:border-slate-900 transition-colors bg-transparent placeholder:text-slate-300"
                />
                <div className="flex justify-end pt-1">
                  <a
                    href="#forgot"
                    onClick={(e) => { e.preventDefault(); showToast('Security reset instructions sent to your registered email.'); }}
                    className="text-xs text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    Forgot Your Password?
                  </a>
                </div>
              </div>

              {/* Pill Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider uppercase rounded-full shadow-lg shadow-slate-950/20 transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>LOGGING IN...</span>
                  </>
                ) : (
                  <span>LOGIN</span>
                )}
              </button>

            </form>
          </div>

          {/* Footer Copyright */}
          <div className="text-xs text-slate-400">
            © 2026 Hudson Valley Credit Union. All rights reserved.
          </div>

        </div>

        {/* RIGHT SIDE PANEL WITH PURPLE DIAGONAL BACKGROUND */}
        <div
          className="hidden lg:flex w-1/2 text-white p-12 lg:p-16 flex-col justify-between relative overflow-hidden bg-cover bg-center shadow-2xl"
          style={{ backgroundImage: `url('/login-bg.svg')` }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-slate-950/20 pointer-events-none"></div>

          {/* Center Welcome Banner */}
          <div className="max-w-md space-y-4 relative z-10 my-auto">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
              Welcome to <span className="text-purple-200">Hudson Valley Credit Union</span>
            </h2>
            <p className="text-sm text-purple-100 leading-relaxed font-light drop-shadow">
              Institutional Private Wealth Management &amp; Secure Banking Portal.
            </p>
          </div>

          {/* Bottom Indicators */}
          <div className="flex items-center gap-2 relative z-10">
            <span className="w-8 h-1 bg-white rounded-full"></span>
            <span className="w-2 h-1 bg-white/40 rounded-full"></span>
            <span className="w-2 h-1 bg-white/40 rounded-full"></span>
          </div>

        </div>

      </div>
    </>
    );
  }

  // ==========================================
  // PAGE: TRANSFERS
  // ==========================================
  const TransfersPage = () => (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">Transfers</h1>
        <p className="text-sm text-slate-500">Move funds securely between your Hudson Valley accounts.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">New Transfer</h2>
              <p className="text-xs text-slate-400">Transfers are processed instantly between your accounts</p>
            </div>
          </div>
          {transferSuccess ? (
            <div className="py-10 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">Transfer Successful</p>
                <p className="text-sm text-slate-500 mt-1">Your funds have been moved successfully.</p>
              </div>
              <button
                onClick={() => setTransferSuccess(false)}
                className="mt-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Make Another Transfer
              </button>
            </div>
          ) : (
            <form onSubmit={handleTransferSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">From Account</label>
                  <select
                    value={transferForm.fromAccount}
                    onChange={(e) => setTransferForm({ ...transferForm, fromAccount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-colors cursor-pointer"
                  >
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.accountNumber}>{acc.name} ({acc.accountNumber})</option>
                    ))}
                  </select>
                  {transferForm.fromAccount && (
                    <p className="text-xs text-slate-400 pl-1">
                      Available: {formatCurrency(accounts.find(a => a.accountNumber === transferForm.fromAccount)?.balance || 0)}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">To Account</label>
                  <select
                    value={transferForm.toAccount}
                    onChange={(e) => setTransferForm({ ...transferForm, toAccount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-colors cursor-pointer"
                  >
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.accountNumber}>{acc.name} ({acc.accountNumber})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">$</span>
                  <input type="number" step="0.01" min="0.01" placeholder="0.00" value={transferForm.amount}
                    onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })} required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-400 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Note / Reference</label>
                <input type="text" placeholder="e.g. Monthly Savings" value={transferForm.memo}
                  onChange={(e) => setTransferForm({ ...transferForm, memo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-colors"
                />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isSubmittingTransfer}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                >
                  {isSubmittingTransfer ? (<><RefreshCw className="w-4 h-4 animate-spin" /><span>Processing...</span></>) : (<><Send className="w-4 h-4" /><span>Complete Transfer</span></>)}
                </button>
              </div>
            </form>
          )}
        </div>
        {/* Sidebar */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 px-1">Account Balances</h3>
          {accounts.map(acc => {
            const IconComp = acc.icon;
            return (
              <div key={acc.id} className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${acc.iconBg}`}><IconComp className="w-5 h-5" /></div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 truncate">{acc.name}</p>
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(acc.balance)}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{acc.accountNumber}</p>
                </div>
              </div>
            );
          })}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-1.5 mt-2">
            <div className="flex items-center gap-2 text-indigo-700"><ShieldCheck className="w-4 h-4" /><span className="text-xs font-semibold">Secure Transfer</span></div>
            <p className="text-xs text-indigo-600/80 leading-relaxed">All transfers are encrypted with 256-bit SSL and processed through Hudson Valley's secure banking infrastructure.</p>
          </div>
        </div>
      </div>
      {/* Recent Transfers */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Recent Transfers</h2>
        <div className="divide-y divide-slate-100">
          {transactions.filter(t => t.category === 'Transfer').map(tx => (
            <div key={tx.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  {tx.type === 'inflow' ? <ArrowDown className="w-4 h-4 text-emerald-600" /> : <ArrowUp className="w-4 h-4 text-slate-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{tx.title}</p>
                  <p className="text-xs text-slate-400">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${tx.type === 'inflow' ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {tx.type === 'inflow' ? '+ ' : '- '}{showBalances ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(tx.amount) + ' USD' : '•••••• USD'}
                </p>
                <p className="text-[10px] text-slate-400">Acc. {tx.accountNumber}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ==========================================
  // PAGE: TRANSACTIONS
  // ==========================================
  const TransactionsPage = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">Transactions</h1>
          <p className="text-sm text-slate-500">Full ledger of all account activity.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer shadow-sm self-start sm:self-auto">
          <Download className="w-4 h-4" />Export CSV
        </button>
      </div>
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Inflows', value: transactions.filter(t => t.type === 'inflow').reduce((s, t) => s + t.amount, 0), color: 'text-emerald-600', bg: 'bg-emerald-50', icon: ArrowDown },
          { label: 'Total Outflows', value: transactions.filter(t => t.type === 'outflow').reduce((s, t) => s + t.amount, 0), color: 'text-slate-700', bg: 'bg-slate-50', icon: ArrowUp },
          { label: 'Transactions', value: null, count: transactions.length, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: FileText },
          { label: 'Net Activity', value: transactions.filter(t => t.type === 'inflow').reduce((s, t) => s + t.amount, 0) - transactions.filter(t => t.type === 'outflow').reduce((s, t) => s + t.amount, 0), color: 'text-indigo-600', bg: 'bg-indigo-50', icon: TrendingUp },
        ].map((stat, i) => {
          const IconComp = stat.icon;
          return (
            <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${stat.bg}`}><IconComp className={`w-3.5 h-3.5 ${stat.color}`} /></div>
                <span className="text-xs text-slate-500">{stat.label}</span>
              </div>
              <div className={`text-base sm:text-lg font-bold ${stat.color}`}>
                {stat.count != null ? stat.count : (showBalances ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(stat.value) + ' USD' : '•••••• USD')}
              </div>
            </div>
          );
        })}
      </div>
      {/* Filters + List */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search transactions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {txCategories.map(cat => (
              <button key={cat} onClick={() => setTxFilterCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${txFilterCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >{cat}</button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center space-y-2"><Search className="w-8 h-8 text-slate-300 mx-auto" /><p className="text-sm text-slate-400">No transactions found.</p></div>
          ) : (
            filteredTransactions.map(tx => (
              <div key={tx.id} onClick={() => setSelectedTransaction(tx)}
                className="py-4 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'inflow' ? 'bg-emerald-50' : 'bg-slate-100'}`}>
                    {tx.type === 'inflow' ? <ArrowDown className="w-4 h-4 text-emerald-600" /> : <ArrowUp className="w-4 h-4 text-slate-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{tx.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400">{tx.accountNumber}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">{tx.category}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className={`text-sm font-semibold ${tx.type === 'inflow' ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {tx.type === 'inflow' ? '+ ' : '- '}{showBalances ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(tx.amount) + ' USD' : '•••••• USD'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{tx.date}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  // ==========================================
  // PAGE: SUPPORT
  // ==========================================
  const SupportPage = () => {
    const [localForm, setLocalForm] = useState({ subject: '', message: '', category: 'Account Inquiry' });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = (e) => {
      e.preventDefault();
      setSubmitting(true);
      setTimeout(() => { setSubmitting(false); setSubmitted(true); showToast('Your message has been submitted. A specialist will respond within 24h.'); }, 1000);
    };
    return (
      <div className="space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">Support Center</h1>
          <p className="text-sm text-slate-500">Get help from your dedicated private wealth team.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-indigo-600" /></div>
              <div><h2 className="text-base font-semibold text-slate-900">Send a Message</h2><p className="text-xs text-slate-400">Our specialists respond within 2–24 business hours</p></div>
            </div>
            {submitted ? (
              <div className="py-10 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-emerald-600" /></div>
                <div>
                  <p className="text-lg font-bold text-slate-900">Message Submitted</p>
                  <p className="text-sm text-slate-500 mt-1">A private wealth specialist will respond within 24 hours.</p>
                  <p className="text-xs text-slate-400 mt-3">Reference: <span className="font-mono text-slate-600">SR-{Date.now().toString().slice(-6)}</span></p>
                </div>
                <button onClick={() => setSubmitted(false)} className="mt-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-colors cursor-pointer">Submit Another Request</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category</label>
                  <select value={localForm.category} onChange={(e) => setLocalForm({ ...localForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-colors cursor-pointer"
                  >
                    {['Account Inquiry', 'Wire Transfer Issue', 'Card Services', 'Investment Question', 'Security Concern', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</label>
                  <input type="text" required placeholder="Brief description of your issue..." value={localForm.subject} onChange={(e) => setLocalForm({ ...localForm, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Message</label>
                  <textarea required rows={5} placeholder="Describe your concern in detail..." value={localForm.message} onChange={(e) => setLocalForm({ ...localForm, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
                  />
                </div>
                <button type="submit" disabled={submitting} className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-70">
                  {submitting ? (<><RefreshCw className="w-4 h-4 animate-spin" /><span>Sending...</span></>) : (<><Send className="w-4 h-4" /><span>Send Message</span></>)}
                </button>
              </form>
            )}
          </div>
          {/* Sidebar */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 px-1">Contact Channels</h3>
            {[
              { icon: Phone, label: 'Private Client Line', value: '1-800-HV-WEALTH', sub: 'Mon–Fri, 8AM–8PM EST', color: 'bg-emerald-50 text-emerald-600' },
              { icon: Mail, label: 'Secure Email', value: 'wealth@hudsonvalley.com', sub: 'Response within 24h', color: 'bg-indigo-50 text-indigo-600' },
              { icon: Headphones, label: 'Priority Support', value: 'Premier Member', sub: 'Dedicated advisor line', color: 'bg-purple-50 text-purple-600' },
            ].map((c, i) => {
              const IconComp = c.icon;
              return (
                <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.color}`}><IconComp className="w-5 h-5" /></div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">{c.label}</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{c.value}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{c.sub}</p>
                  </div>
                </div>
              );
            })}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 space-y-3">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Quick Links</h4>
              {['Report a lost card', 'Dispute a transaction', 'Update contact info', 'Security settings'].map((item, i) => (
                <button key={i} onClick={() => showToast(`Opening: ${item}...`)} className="w-full flex items-center justify-between text-xs text-slate-600 hover:text-indigo-600 py-1.5 transition-colors cursor-pointer">
                  <span>{item}</span><ChevronRight className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-700"><AlertCircle className="w-4 h-4" /><span className="text-xs font-semibold">Emergency?</span></div>
              <p className="text-xs text-amber-600/80 leading-relaxed">For lost/stolen cards or urgent security issues, call <strong>1-800-HV-URGENT</strong> available 24/7.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE: DASHBOARD
  // ==========================================
  const DashboardPage = () => (
    <div className="space-y-8">
      <section className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">{getGreeting()}, Jesse</h1>
        <p className="text-sm text-slate-500">Here's an overview of your accounts.</p>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accounts.map(acc => {
          const IconComp = acc.icon;
          return (
            <div key={acc.id} className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-normal text-slate-500">{acc.name}</span>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${acc.iconBg} shrink-0`}><IconComp className="w-5 h-5" /></div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">{formatCurrency(acc.balance)}</div>
                  <div className="text-xs text-slate-400 mt-1">{acc.accountNumber}</div>
                </div>
              </div>
              <div className="mt-6 pt-2">
                <button onClick={() => { setTransferForm(prev => ({ ...prev, fromAccount: acc.accountNumber })); setActiveTab('Transfers'); }}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >Make Transfer</button>
              </div>
            </div>
          );
        })}
      </section>
      <section className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
          <div className="relative w-48 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search transactions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredTransactions.slice(0, 5).length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No recent activity matching search.</div>
          ) : (
            filteredTransactions.slice(0, 5).map(tx => (
              <div key={tx.id} onClick={() => setSelectedTransaction(tx)} className="py-4 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    {tx.type === 'inflow' ? <ArrowDown className="w-4 h-4 text-emerald-600" /> : <ArrowUp className="w-4 h-4 text-slate-600" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{tx.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{tx.accountNumber}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${tx.type === 'inflow' ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {showBalances ? (<>{tx.type === 'inflow' ? '+ ' : '- '}{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(tx.amount)} USD</>) : '•••••••• USD'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{tx.date}</div>
                </div>
              </div>
            ))
          )}
        </div>
        <button onClick={() => setActiveTab('Transactions')} className="w-full text-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors py-2 cursor-pointer">
          View all transactions →
        </button>
      </section>
    </div>
  );

  // ==========================================
  // MAIN APP SHELL (WHEN LOGGED IN)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 font-sans flex flex-col pb-16 md:pb-0 selection:bg-indigo-600 selection:text-white">

      {/* TOAST */}
      {toastMessage && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:top-auto sm:bottom-6 sm:right-6 z-[60] flex items-center justify-between gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl">
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium truncate">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white shrink-0 p-1 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* NAVBAR */}
      <header className="bg-[#0F172A] text-white shadow-xl sticky top-0 z-40 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16 sm:h-20">

            {/* LEFT: BANK NAME */}
            <div className="flex items-center shrink-0">
              <span className="font-bold text-base sm:text-xl tracking-tight text-white whitespace-nowrap">Hudson Valley Credit Union</span>
            </div>

            {/* CENTER: NAV LINKS */}
            <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2 text-sm font-medium">
              {navTabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="relative py-2 cursor-pointer transition-colors group">
                  <span className={activeTab === tab ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'}>{tab}</span>
                  <span className={`absolute bottom-0 left-0 w-full h-[2px] rounded-full transition-all duration-200 origin-center ${activeTab === tab ? 'bg-indigo-400 scale-x-100' : 'bg-indigo-400 scale-x-0 group-hover:scale-x-100'}`}></span>
                </button>
              ))}
            </nav>

            {/* RIGHT UTILITIES */}
            <div className="flex items-center gap-3 shrink-0">

              {/* Notification Bell */}
              <div className="relative" ref={notificationMenuRef}>
                <button onClick={() => { setIsNotificationOpen(!isNotificationOpen); setIsProfileMenuOpen(false); }}
                  className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 relative transition-all cursor-pointer hover:text-white" title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#0F172A]"></span>
                </button>
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-sm text-slate-900">Notifications</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">1 New</span>
                    </div>
                    <div className="text-xs space-y-1.5">
                      <p className="font-semibold text-slate-900">Wire Clearance Complete</p>
                      <p className="text-slate-500">$1,000,000.00 USD posted to Savings Account #6524418305.</p>
                    </div>
                    <button onClick={() => setIsNotificationOpen(false)} className="w-full text-center text-xs text-indigo-600 hover:text-indigo-800 font-semibold pt-1 cursor-pointer">Dismiss</button>
                  </div>
                )}
              </div>

              {/* Profile Circle */}
              <div className="relative" ref={profileMenuRef}>
                <button onClick={() => { setIsProfileMenuOpen(!isProfileMenuOpen); setIsNotificationOpen(false); }}
                  title="User Profile & Settings"
                  className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center font-bold text-xs text-white border border-indigo-400/40 transition-all cursor-pointer shadow-md shadow-indigo-950/50 active:scale-95"
                >JG</button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 space-y-1">
                      <div className="font-bold text-sm text-slate-900">Jesse Garcia</div>
                      <div className="text-xs text-slate-500 font-mono truncate">jesse.garcia@hudsonvalley.com</div>
                      <div className="text-[10px] text-emerald-600 font-medium pt-0.5">● Premier Private Wealth Account</div>
                    </div>
                    <div className="p-2 space-y-1">
                      <button onClick={() => { setShowBalances(!showBalances); setIsProfileMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span>{showBalances ? 'Hide Balances' : 'Show Balances'}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{showBalances ? 'ON' : 'OFF'}</span>
                      </button>
                      <button onClick={() => { setIsProfileMenuOpen(false); setIsLoggedIn(false); setActiveTab('Dashboard'); setLoginForm({ username: '', password: '' }); showToast('Logged out securely.'); }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-red-500" /><span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 cursor-pointer transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE FULL-SCREEN OVERLAY — ease-in/out via CSS opacity transition */}
        <div
          className={`lg:hidden fixed inset-0 z-50 flex flex-col bg-[#0F172A] transition-opacity duration-300 ease-in-out ${
            isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
            <span className="font-bold text-base text-white tracking-tight">Hudson Valley Credit Union</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg bg-slate-800 text-white border border-slate-700 cursor-pointer" aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex-1 flex flex-col justify-center px-6 space-y-3">
            {[
              { id: 'Dashboard', icon: Home },
              { id: 'Transfers', icon: ArrowLeftRight },
              { id: 'Transactions', icon: Clock },
              { id: 'Support', icon: HelpCircle },
            ].map(({ id, icon: IconComp }) => (
              <button key={id} onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-semibold transition-all cursor-pointer ${
                  activeTab === id ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <IconComp className="w-6 h-6" />{id}
              </button>
            ))}
          </div>

          {/* Bottom user info + sign out */}
          <div className="px-6 py-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">JG</div>
              <div>
                <p className="text-sm font-semibold text-white">Jesse Garcia</p>
                <p className="text-xs text-slate-400">jesse.garcia@hudsonvalley.com</p>
              </div>
            </div>
            <button onClick={() => { setIsMobileMenuOpen(false); setIsLoggedIn(false); setActiveTab('Dashboard'); setLoginForm({ username: '', password: '' }); showToast('Signed out securely.'); }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT — page routing */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'Dashboard' && <DashboardPage />}
        {activeTab === 'Transfers' && <TransfersPage />}
        {activeTab === 'Transactions' && <TransactionsPage />}
        {activeTab === 'Support' && <SupportPage />}
      </main>

      {/* MOBILE BOTTOM DOCK */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-4 py-2 flex items-center justify-around">
        {[
          { id: 'Dashboard', label: 'Home', icon: Home },
          { id: 'Transfers', label: 'Transfers', icon: Send },
          { id: 'Transactions', label: 'Ledger', icon: Clock },
          { id: 'Support', label: 'Support', icon: HelpCircle }
        ].map(item => {
          const IconComp = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors cursor-pointer ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <IconComp className="w-5 h-5" /><span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* TRANSACTION RECEIPT MODAL */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-900 text-base">Transaction Details</span>
              <button onClick={() => setSelectedTransaction(null)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="text-center py-2 space-y-1">
              <span className="text-xs text-slate-400 uppercase">Amount</span>
              <div className={`text-2xl font-bold ${selectedTransaction.type === 'inflow' ? 'text-emerald-600' : 'text-slate-900'}`}>
                {selectedTransaction.type === 'inflow' ? '+ ' : '- '}{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(selectedTransaction.amount)} USD
              </div>
              <p className="text-sm font-medium text-slate-700">{selectedTransaction.title}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs text-slate-600 border border-slate-100">
              <div className="flex justify-between"><span>Account:</span><span className="text-slate-900 font-mono">{selectedTransaction.accountNumber}</span></div>
              <div className="flex justify-between"><span>Category:</span><span className="text-slate-900">{selectedTransaction.category}</span></div>
              <div className="flex justify-between"><span>Date:</span><span className="text-slate-900">{selectedTransaction.date}</span></div>
              <div className="flex justify-between"><span>Status:</span><span className="text-emerald-600 font-semibold">Cleared</span></div>
            </div>
            <button onClick={() => setSelectedTransaction(null)} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors cursor-pointer">Close</button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>© 2026 Hudson Valley Credit Union. All rights reserved.</div>
          <div className="flex items-center justify-center gap-6 text-slate-500">
            <a href="#support" onClick={(e) => { e.preventDefault(); setActiveTab('Support'); }} className="hover:text-indigo-600 cursor-pointer">Support</a>
            <a href="#terms" className="hover:text-indigo-600">Terms</a>
            <a href="#privacy" className="hover:text-indigo-600">Privacy</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
