import React, { useState } from 'react';
import { Calculator, Sparkles, ArrowRight, TrendingUp, DollarSign } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SavingsCalculatorProps {
  onBrowseCategory: () => void;
}

export const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({ onBrowseCategory }) => {
  const [groceries, setGroceries] = useState(400); // Fennel Market 4.5%
  const [coffeeDining, setCoffeeDining] = useState(150); // Cinder / AeroDine 5.5%
  const [techGaming, setTechGaming] = useState(120); // Pixel / Highbeam 8%
  const [travel, setTravel] = useState(800); // Ridgeline 7.5% per year

  // Calculate monthly savings
  const monthlyGrocerySave = groceries * 0.045;
  const monthlyDiningSave = coffeeDining * 0.055;
  const monthlyTechSave = techGaming * 0.08;
  const annualTravelSave = travel * 0.075;

  const totalMonthlySavings = monthlyGrocerySave + monthlyDiningSave + monthlyTechSave;
  const totalAnnualSavings = totalMonthlySavings * 12 + annualTravelSave;

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2.5 sm:space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] sm:text-xs font-mono text-amber-300">
          <Calculator size={13} />
          <span>Interactive Routine Spend Simulator</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
          How Much Could You Save?
        </h1>
        <p className="text-xs sm:text-sm text-[#9c90b8]">
          Adjust your regular monthly habits to see how paying via discounted Vaultly vouchers adds up to hundreds in pocketed cash every year.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-stretch">
        {/* Sliders Column */}
        <div className="lg:col-span-7 bg-[#140d25] border border-[#2e1f4b] rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-8 space-y-5 sm:space-y-6 shadow-xl">
          {/* Slider 1: Groceries */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Monthly Groceries & Essentials</span>
              <span className="font-mono text-xs font-bold text-emerald-400">${groceries}/mo</span>
            </div>
            <input
              type="range"
              min="50"
              max="1200"
              step="25"
              value={groceries}
              onChange={e => setGroceries(Number(e.target.value))}
              className="w-full accent-[#a78bfa] h-2 bg-[#25183f] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#7b6d96]">
              <span>$50</span>
              <span>Avg save: ${(monthlyGrocerySave * 12).toFixed(0)}/yr</span>
              <span>$1,200</span>
            </div>
          </div>

          {/* Slider 2: Coffee & Dining */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Coffee, Bakeries & Delivery</span>
              <span className="font-mono text-xs font-bold text-amber-400">${coffeeDining}/mo</span>
            </div>
            <input
              type="range"
              min="20"
              max="600"
              step="10"
              value={coffeeDining}
              onChange={e => setCoffeeDining(Number(e.target.value))}
              className="w-full accent-[#a78bfa] h-2 bg-[#25183f] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#7b6d96]">
              <span>$20</span>
              <span>Avg save: ${(monthlyDiningSave * 12).toFixed(0)}/yr</span>
              <span>$600</span>
            </div>
          </div>

          {/* Slider 3: Tech & Gaming */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Tech, Subscriptions & Games</span>
              <span className="font-mono text-xs font-bold text-cyan-400">${techGaming}/mo</span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={techGaming}
              onChange={e => setTechGaming(Number(e.target.value))}
              className="w-full accent-[#a78bfa] h-2 bg-[#25183f] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#7b6d96]">
              <span>$20</span>
              <span>Avg save: ${(monthlyTechSave * 12).toFixed(0)}/yr</span>
              <span>$500</span>
            </div>
          </div>

          {/* Slider 4: Travel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Annual Travel & Flights</span>
              <span className="font-mono text-xs font-bold text-indigo-400">${travel}/yr</span>
            </div>
            <input
              type="range"
              min="100"
              max="3500"
              step="50"
              value={travel}
              onChange={e => setTravel(Number(e.target.value))}
              className="w-full accent-[#a78bfa] h-2 bg-[#25183f] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#7b6d96]">
              <span>$100</span>
              <span>Avg save: ${annualTravelSave.toFixed(0)}/yr</span>
              <span>$3,500</span>
            </div>
          </div>
        </div>

        {/* Projection Results Column */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#1c1133] to-[#120a22] border border-[#3c2962] rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-8 flex flex-col justify-between space-y-5 sm:space-y-6 shadow-2xl">
          <div className="space-y-3 sm:space-y-4">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
              Projected Annual Savings
            </span>

            <div>
              <div className="text-3xl sm:text-5xl font-mono font-bold text-white tracking-tight">
                ${totalAnnualSavings.toFixed(0)}
                <span className="text-sm sm:text-base text-[#9c90b8] font-normal"> / year</span>
              </div>
              <p className="text-xs text-emerald-400 mt-1 font-mono">
                ≈ ${totalMonthlySavings.toFixed(2)} saved every single month
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#140b24] border border-[#2b1b48] space-y-1.5 sm:space-y-2 text-xs">
              <span className="text-[#a798c2] font-semibold block">What you gain:</span>
              <p className="text-zinc-300 leading-relaxed">
                Paying with discounted gift cards instead of your standard debit card is like receiving an instant guaranteed <strong>6.8% return</strong> on living expenses with zero market risk.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.click();
              onBrowseCategory();
            }}
            className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-[#a78bfa] to-[#c4b5fd] text-[#120726] font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
          >
            <span>Start Saving on Brands You Love</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
