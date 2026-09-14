import React, { useState } from 'react';
import { X, Plus, Wallet, ShieldCheck, Check } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AddFundsModalProps {
  onClose: () => void;
  onAdd: (amount: number) => void;
  currentBalance: number;
}

const PRESETS = [25, 50, 100, 200, 500];

export const AddFundsModal: React.FC<AddFundsModalProps> = ({
  onClose,
  onAdd,
  currentBalance,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);

  const finalAmount = isCustom ? (parseFloat(customAmount) || 0) : selectedPreset;

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) return;

    sounds.click();
    setIsDepositing(true);

    setTimeout(() => {
      sounds.success();
      setIsDepositing(false);
      onAdd(finalAmount);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#160e28] border border-[#37265c] rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-md w-full max-h-[95vh] overflow-y-auto relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={() => {
            sounds.click();
            onClose();
          }}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 text-[#8f82aa] hover:text-white p-1 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-[#c4b5fd] flex items-center justify-center shrink-0">
            <Wallet size={20} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk']">
              Add Vault Funds
            </h3>
            <p className="text-xs text-[#9c90b8]">Instant balance reload with zero payment fees.</p>
          </div>
        </div>

        {/* Current Balance Tag */}
        <div className="bg-[#10081e] border border-[#26173d] rounded-xl p-3 mb-4 flex items-center justify-between text-xs font-mono">
          <span className="text-[#8c7fa7]">Current Balance:</span>
          <span className="font-bold text-white text-sm">${currentBalance.toFixed(2)}</span>
        </div>

        <form onSubmit={handleDeposit} className="space-y-3.5 sm:space-y-4">
          <div>
            <label className="block text-xs font-medium text-white mb-2">Select Deposit Amount</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2">
              {PRESETS.map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    sounds.click();
                    setIsCustom(false);
                    setSelectedPreset(amt);
                  }}
                  className={`py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                    !isCustom && selectedPreset === amt
                      ? 'bg-[#a78bfa] text-[#120726] shadow-sm'
                      : 'bg-[#1e1336] border border-[#332252] text-[#ccc2e0] hover:bg-[#281a45]'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white mb-1.5">Or enter custom amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white font-mono text-sm">$</span>
              <input
                type="number"
                min="5"
                max="2500"
                step="5"
                placeholder="Custom (e.g. 150)"
                value={customAmount}
                onChange={e => {
                  setIsCustom(true);
                  setCustomAmount(e.target.value);
                }}
                onFocus={() => setIsCustom(true)}
                className={`w-full pl-8 pr-3 py-2.5 bg-[#120921] border rounded-xl text-sm font-mono text-white placeholder-[#6c5d88] focus:outline-none ${
                  isCustom ? 'border-[#a78bfa] ring-1 ring-[#a78bfa]' : 'border-[#2d1d4a]'
                }`}
              />
            </div>
          </div>

          {/* Guarantee fineprint */}
          <div className="flex items-center gap-2 text-[11px] text-[#8c7ea7] pt-1">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            <span>Simulated instant test deposit. No real credit card charged.</span>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#201436] hover:bg-[#2b1b48] text-xs font-medium text-[#9c90b8] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDepositing || finalAmount <= 0}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#a78bfa] to-[#c4b5fd] text-[#120726] text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isDepositing ? (
                <span>Adding Funds...</span>
              ) : (
                <>
                  <Plus size={14} strokeWidth={2.5} />
                  <span>Add ${finalAmount.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
