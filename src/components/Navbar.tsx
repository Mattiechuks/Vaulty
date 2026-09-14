import React, { useState } from 'react';
import {
  Wallet,
  History,
  LogOut,
  ChevronDown,
  Plus,
  Sparkles,
  Shield,
  Layers,
  ArrowRightLeft,
  Calculator,
  User as UserIcon,
} from 'lucide-react';
import { UserAccount } from '../types';
import { sounds } from '../utils/audio';

interface NavbarProps {
  currentTab: 'marketplace' | 'vault' | 'sell' | 'calculator' | 'history' | 'detail';
  setTab: (tab: 'marketplace' | 'vault' | 'sell' | 'calculator' | 'history') => void;
  user: UserAccount | null;
  onOpenAuth: () => void;
  onOpenAddFunds: () => void;
  onLogout: () => void;
  activeCardsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setTab,
  user,
  onOpenAuth,
  onOpenAddFunds,
  onLogout,
  activeCardsCount,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleNav = (tab: 'marketplace' | 'vault' | 'sell' | 'calculator' | 'history') => {
    sounds.click();
    setTab(tab);
    setDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#261c3b] bg-[#0b0813]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            <button
              type="button"
              onClick={() => handleNav('marketplace')}
              className="flex items-center gap-2 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa] rounded-lg shrink-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#8b5cf6] to-[#d946ef] p-0.5 shadow-lg shadow-purple-950/40 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#130d24] rounded-[10px] flex items-center justify-center">
                  <span className="font-['Space_Grotesk'] font-bold text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-200">
                    V
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="font-['Space_Grotesk'] font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-[#d2b3ff] transition-colors">
                    Vaultly
                  </span>
                  <span className="px-1.5 py-0.2 sm:py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-medium bg-[#22163d] text-[#c4b5fd] border border-[#3b2762]">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-[#8e82ad] hidden sm:block tracking-wide">
                  Digital Gift Card Exchange
                </p>
              </div>
            </button>

            {/* Primary Desktop Tabs */}
            <nav className="hidden md:flex items-center gap-1 ml-2 lg:ml-4 bg-[#140d25] p-1 rounded-xl border border-[#2b1e47]">
              <button
                type="button"
                onClick={() => handleNav('marketplace')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  currentTab === 'marketplace'
                    ? 'bg-[#2b1b4d] text-white shadow-xs font-semibold'
                    : 'text-[#9c90b8] hover:text-white hover:bg-[#1a1230]'
                }`}
              >
                <Sparkles size={13} className={currentTab === 'marketplace' ? 'text-[#c4b5fd]' : ''} />
                Marketplace
              </button>

              <button
                type="button"
                onClick={() => handleNav('vault')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  currentTab === 'vault'
                    ? 'bg-[#2b1b4d] text-white shadow-xs font-semibold'
                    : 'text-[#9c90b8] hover:text-white hover:bg-[#1a1230]'
                }`}
              >
                <Layers size={13} className={currentTab === 'vault' ? 'text-emerald-400' : ''} />
                <span>My Vault</span>
                {activeCardsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    {activeCardsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleNav('sell')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  currentTab === 'sell'
                    ? 'bg-[#2b1b4d] text-white shadow-xs font-semibold'
                    : 'text-[#9c90b8] hover:text-white hover:bg-[#1a1230]'
                }`}
              >
                <ArrowRightLeft size={13} className={currentTab === 'sell' ? 'text-cyan-400' : ''} />
                Sell Unused Cards
              </button>

              <button
                type="button"
                onClick={() => handleNav('calculator')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  currentTab === 'calculator'
                    ? 'bg-[#2b1b4d] text-white shadow-xs font-semibold'
                    : 'text-[#9c90b8] hover:text-white hover:bg-[#1a1230]'
                }`}
              >
                <Calculator size={13} className={currentTab === 'calculator' ? 'text-amber-400' : ''} />
                Savings Calculator
              </button>
            </nav>
          </div>

          {/* Right Section: Balance & Account */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {user ? (
              <>
                {/* Balance Pill with quick Add Funds */}
                <div className="flex items-center bg-[#150f28] border border-[#2e204d] rounded-xl p-1 pl-2 sm:pl-3 shadow-xs">
                  <div className="flex flex-col mr-1.5 sm:mr-2.5">
                    <span className="text-[9px] sm:text-[10px] font-mono text-[#8a7da7] leading-none uppercase hidden sm:block">Vault Balance</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-white tracking-tight">
                      ${user.balance.toFixed(2)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.click();
                      onOpenAddFunds();
                    }}
                    className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-[#a78bfa] hover:bg-[#c4b5fd] active:scale-95 text-[#130728] rounded-lg text-xs font-semibold transition-all flex items-center gap-0.5 sm:gap-1 shadow-sm"
                    title="Add Funds to Balance"
                  >
                    <Plus size={12} strokeWidth={2.5} />
                    <span className="text-[11px] sm:text-xs">Top up</span>
                  </button>
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(o => !o)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 pr-1.5 sm:pr-2.5 rounded-xl bg-[#140d25] border border-[#2b1e47] hover:border-[#3e2c65] text-white text-xs font-medium transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 text-slate-950 font-bold flex items-center justify-center text-xs uppercase shadow-xs">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline max-w-[85px] truncate">{user.name}</span>
                    <ChevronDown size={13} className="text-[#8e82ad]" />
                  </button>

                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-24px)] rounded-xl bg-[#160f29] border border-[#372855] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-2 border-b border-[#271c3d] mb-1">
                          <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                          <p className="text-[11px] text-[#9c90b8] truncate font-mono">{user.email}</p>
                          <div className="mt-2 pt-2 border-t border-[#271c3d] flex items-center justify-between text-[11px] font-mono text-emerald-400">
                            <span>Total Saved:</span>
                            <strong>${user.totalSaved.toFixed(2)}</strong>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleNav('vault')}
                          className="w-full text-left px-3 py-2 text-xs text-white hover:bg-[#23173d] rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Layers size={14} className="text-[#a78bfa]" />
                          <span>My Gift Vault ({activeCardsCount})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleNav('history')}
                          className="w-full text-left px-3 py-2 text-xs text-white hover:bg-[#23173d] rounded-lg transition-colors flex items-center gap-2"
                        >
                          <History size={14} className="text-[#a78bfa]" />
                          <span>Order & Deposit History</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            sounds.click();
                            setDropdownOpen(false);
                            onOpenAddFunds();
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-white hover:bg-[#23173d] rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Wallet size={14} className="text-emerald-400" />
                          <span>Deposit Funds</span>
                        </button>

                        <div className="my-1 border-t border-[#271c3d]" />

                        <button
                          type="button"
                          onClick={() => {
                            sounds.click();
                            setDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.click();
                    onOpenAuth();
                  }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#130728] text-xs font-semibold transition-all shadow-md active:scale-95 whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Sign In / Register</span>
                  <span className="sm:hidden">Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Dedicated Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d081b]/95 backdrop-blur-xl border-t border-[#2a1d42] px-1.5 py-1 shadow-[0_-8px_25px_rgba(0,0,0,0.6)]">
        <div className="grid grid-cols-5 items-center justify-items-center">
          <button
            type="button"
            onClick={() => handleNav('marketplace')}
            className={`flex flex-col items-center justify-center w-full py-1.5 rounded-lg text-[10px] transition-colors ${
              currentTab === 'marketplace' ? 'text-[#c4b5fd] font-bold' : 'text-[#85799e] hover:text-[#bbb0d4]'
            }`}
          >
            <Sparkles size={17} className={currentTab === 'marketplace' ? 'text-[#c4b5fd]' : ''} />
            <span className="mt-0.5">Market</span>
          </button>

          <button
            type="button"
            onClick={() => handleNav('vault')}
            className={`flex flex-col items-center justify-center w-full py-1.5 rounded-lg text-[10px] relative transition-colors ${
              currentTab === 'vault' ? 'text-emerald-400 font-bold' : 'text-[#85799e] hover:text-[#bbb0d4]'
            }`}
          >
            <div className="relative">
              <Layers size={17} className={currentTab === 'vault' ? 'text-emerald-400' : ''} />
              {activeCardsCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-mono bg-emerald-500 text-slate-950 font-extrabold leading-none min-w-[14px] text-center">
                  {activeCardsCount}
                </span>
              )}
            </div>
            <span className="mt-0.5">Vault</span>
          </button>

          <button
            type="button"
            onClick={() => handleNav('sell')}
            className={`flex flex-col items-center justify-center w-full py-1.5 rounded-lg text-[10px] transition-colors ${
              currentTab === 'sell' ? 'text-cyan-400 font-bold' : 'text-[#85799e] hover:text-[#bbb0d4]'
            }`}
          >
            <ArrowRightLeft size={17} className={currentTab === 'sell' ? 'text-cyan-400' : ''} />
            <span className="mt-0.5">Sell</span>
          </button>

          <button
            type="button"
            onClick={() => handleNav('calculator')}
            className={`flex flex-col items-center justify-center w-full py-1.5 rounded-lg text-[10px] transition-colors ${
              currentTab === 'calculator' ? 'text-amber-400 font-bold' : 'text-[#85799e] hover:text-[#bbb0d4]'
            }`}
          >
            <Calculator size={17} className={currentTab === 'calculator' ? 'text-amber-400' : ''} />
            <span className="mt-0.5">Savings</span>
          </button>

          <button
            type="button"
            onClick={() => handleNav('history')}
            className={`flex flex-col items-center justify-center w-full py-1.5 rounded-lg text-[10px] transition-colors ${
              currentTab === 'history' ? 'text-purple-300 font-bold' : 'text-[#85799e] hover:text-[#bbb0d4]'
            }`}
          >
            <History size={17} className={currentTab === 'history' ? 'text-purple-300' : ''} />
            <span className="mt-0.5">History</span>
          </button>
        </div>
      </nav>
    </>
  );
};
