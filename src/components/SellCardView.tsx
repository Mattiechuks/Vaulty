import React, { useState } from 'react';
import {
  ArrowRightLeft,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { BRANDS } from '../data/brands';
import { UserAccount } from '../types';
import { sounds } from '../utils/audio';

interface SellCardViewProps {
  user: UserAccount | null;
  onOpenAuth: () => void;
  onSellComplete: (payoutAmount: number, brandName: string, faceValue: number) => void;
  onBack: () => void;
}

export const SellCardView: React.FC<SellCardViewProps> = ({
  user,
  onOpenAuth,
  onSellComplete,
  onBack,
}) => {
  const [selectedBrandId, setSelectedBrandId] = useState(BRANDS[0].id);
  const [balance, setBalance] = useState<string>('100');
  const [cardCode, setCardCode] = useState('');
  const [cardPin, setCardPin] = useState('');
  const [payoutOption, setPayoutOption] = useState<'vault' | 'cash'>('vault');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successData, setSuccessData] = useState<{ amount: number; brand: string } | null>(null);

  const selectedBrand = BRANDS.find(b => b.id === selectedBrandId) || BRANDS[0];
  const numBalance = parseFloat(balance) || 0;

  // Vaultly offers: 92% for Vaultly balance, 87% for cash
  const vaultPayout = numBalance * 0.92;
  const cashPayout = numBalance * 0.87;
  const activePayout = payoutOption === 'vault' ? vaultPayout : cashPayout;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (numBalance < 10) {
      alert('Minimum balance to cash out is $10.00');
      return;
    }
    if (!cardCode || !cardPin) {
      alert('Please provide the card number and security PIN to verify.');
      return;
    }

    setIsProcessing(true);
    sounds.flip();

    // Realistic verification simulation
    setTimeout(() => {
      setIsProcessing(false);
      sounds.success();
      setSuccessData({ amount: activePayout, brand: selectedBrand.name });
      onSellComplete(activePayout, selectedBrand.name, numBalance);
    }, 1200);
  };

  if (successData) {
    return (
      <div className="relative z-10 max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 size={32} />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
            Card Verified & Cashed Out
          </span>
          <h2 className="text-3xl font-bold text-white font-['Space_Grotesk']">
            +${successData.amount.toFixed(2)} Credited!
          </h2>
          <p className="text-sm text-[#9c90b8]">
            Your unused {successData.brand} card was verified. The funds have been instantly added to your Vaultly balance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            sounds.click();
            onBack();
          }}
          className="px-6 py-2.5 rounded-xl bg-[#a78bfa] text-[#120726] font-bold text-xs hover:bg-[#c4b5fd] transition-colors"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2.5 sm:space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] sm:text-xs font-mono text-cyan-300">
          <ArrowRightLeft size={13} />
          <span>Secondary Card Liquidation Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
          Sell Your Unused Gift Cards
        </h1>
        <p className="text-xs sm:text-sm text-[#9c90b8]">
          Have gift cards collecting dust? Turn them into instant Vaultly credit or cash out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-[#140d25] border border-[#2c1e48] rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-8 space-y-4 sm:space-y-5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Retailer */}
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                1. Select Retailer
              </label>
              <select
                value={selectedBrandId}
                onChange={e => setSelectedBrandId(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1a112f] border border-[#332152] rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#a78bfa] cursor-pointer"
              >
                {BRANDS.map(b => (
                  <option key={b.id} value={b.id} className="bg-[#140d25]">
                    {b.name} ({b.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Card Balance */}
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                2. Remaining Card Balance (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white font-mono text-sm">$</span>
                <input
                  type="number"
                  min="10"
                  max="2000"
                  step="0.01"
                  value={balance}
                  onChange={e => setBalance(e.target.value)}
                  placeholder="100.00"
                  className="w-full pl-8 pr-3 py-2.5 bg-[#1a112f] border border-[#332152] rounded-xl text-sm font-mono text-white placeholder-[#685984] focus:outline-none focus:border-[#a78bfa]"
                />
              </div>
              <span className="text-[10px] text-[#83769e] mt-1 block">
                Must be an authentic balance. We run automated verification before crediting.
              </span>
            </div>

            {/* Step 3: Card Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-white mb-1.5">Card Number / Code</label>
                <input
                  type="text"
                  placeholder="e.g. 6032-9482-1049"
                  value={cardCode}
                  onChange={e => setCardCode(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#1a112f] border border-[#332152] rounded-xl text-xs font-mono text-white placeholder-[#685984] focus:outline-none focus:border-[#a78bfa]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white mb-1.5">Security PIN / CVV</label>
                <input
                  type="password"
                  placeholder="••••"
                  value={cardPin}
                  onChange={e => setCardPin(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#1a112f] border border-[#332152] rounded-xl text-xs font-mono text-white placeholder-[#685984] focus:outline-none focus:border-[#a78bfa]"
                />
              </div>
            </div>

            {/* Step 4: Payout Choice */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-medium text-white">
                3. Choose Payout Destination
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sounds.click();
                    setPayoutOption('vault');
                  }}
                  className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all ${
                    payoutOption === 'vault'
                      ? 'bg-[#291a4c] border-[#a78bfa] shadow-md'
                      : 'bg-[#18102a] border-[#2f204c] hover:bg-[#201538]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">Vaultly Credit</span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                      92% Payout
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-mono font-bold text-[#d2b3ff] block">
                    ${vaultPayout.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-[#9c90b8]">+5% Bonus vs Bank Cashout</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.click();
                    setPayoutOption('cash');
                  }}
                  className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all ${
                    payoutOption === 'cash'
                      ? 'bg-[#291a4c] border-[#a78bfa] shadow-md'
                      : 'bg-[#18102a] border-[#2f204c] hover:bg-[#201538]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">Direct Cashout</span>
                    <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-bold">
                      87% Payout
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-mono font-bold text-zinc-200 block">
                    ${cashPayout.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-[#9c90b8]">ACH Bank transfer</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
            >
              {isProcessing ? (
                <span>Verifying Card Credentials...</span>
              ) : (
                <>
                  <span>Accept Offer & Cash Out ${activePayout.toFixed(2)}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Valuation & Trust Column */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          <div className="rounded-2xl sm:rounded-3xl bg-[#170f2b] border border-[#312150] p-4 sm:p-6 space-y-3 sm:space-y-4">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Live Valuation Summary
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-[#9c90b8]">
                <span>Retailer:</span>
                <span className="text-white font-medium">{selectedBrand.name}</span>
              </div>
              <div className="flex items-center justify-between text-[#9c90b8]">
                <span>Original Face Value:</span>
                <span className="text-white font-medium">${numBalance.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-cyan-400">
                <span>Offer Rate:</span>
                <span>{payoutOption === 'vault' ? '92% (Vaultly Credit)' : '87% (Cash)'}</span>
              </div>
              <div className="pt-2 border-t border-[#271940] flex items-center justify-between text-sm">
                <span className="font-bold text-white">Instant Payout:</span>
                <span className="font-bold text-lg sm:text-xl text-emerald-400">${activePayout.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#120a21] border border-[#26173d] p-3.5 sm:p-4 space-y-3 text-xs text-[#9c90b8]">
            <div className="flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Bank-Grade Verification</span>
                <span>We ping retailer clearinghouse servers via 256-bit TLS to verify balance before payout.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Lock size={18} className="text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Zero Risk to Seller</span>
                <span>Once approved and transferred, funds are 100% guaranteed in your balance.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
