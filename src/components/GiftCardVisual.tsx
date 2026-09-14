import React, { useState } from 'react';
import { Sparkles, RotateCw, ShieldCheck, CreditCard, Lock } from 'lucide-react';
import { sounds } from '../utils/audio';

interface GiftCardVisualProps {
  name: string;
  initial: string;
  color: string;
  secondaryColor?: string;
  value: number;
  code?: string;
  pin?: string;
  deliveryType?: string;
  interactive?: boolean;
}

export const GiftCardVisual: React.FC<GiftCardVisualProps> = ({
  name,
  initial,
  color,
  secondaryColor,
  value,
  code = 'VAULT-XXXX-XXXX',
  pin = '••••',
  deliveryType = 'Instant eCode',
  interactive = true,
}) => {
  const [flipped, setFlipped] = useState(false);
  const [pinRevealed, setPinRevealed] = useState(false);

  const toggleFlip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sounds.flip();
    setFlipped(f => !f);
  };

  const secColor = secondaryColor || '#140c20';

  return (
    <div className="relative w-full aspect-[1.6/1] select-none perspective-[1000px] group cursor-pointer" onClick={() => interactive && toggleFlip()}>
      {/* Flip Button overlay - placed safely inside corner to prevent horizontal overflow */}
      {interactive && (
        <button
          type="button"
          onClick={toggleFlip}
          aria-label="Flip card"
          className="absolute top-2.5 right-2.5 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1c1233]/85 backdrop-blur-md border border-[#443366] text-[#d2b3ff] shadow-lg flex items-center justify-center hover:bg-[#2b1c4c] hover:scale-105 active:scale-95 transition-all"
          title="Flip Card"
        >
          <RotateCw size={12} className={`transition-transform duration-500 ${flipped ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* 3D Container */}
      <div
        className={`w-full h-full duration-500 transform-gpu preserve-3d transition-transform relative rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT OF CARD */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl p-3.5 sm:p-5 md:p-6 flex flex-col justify-between overflow-hidden border border-white/15"
          style={{
            background: `radial-gradient(circle at 85% 15%, ${color}DD 0%, ${secColor} 80%)`,
          }}
        >
          {/* Subtle noise / holographic sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/15 pointer-events-none" />
          
          {/* Top Bar: Brand & Micro-chip */}
          <div className="relative z-10 flex items-start justify-between pr-7 sm:pr-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-sm sm:text-lg text-white shadow-md border border-white/25 backdrop-blur-md shrink-0"
                style={{ backgroundColor: `${color}99` }}
              >
                {initial}
              </div>
              <div className="min-w-0">
                <h3 className="text-white font-bold text-sm sm:text-lg md:text-xl tracking-tight drop-shadow-sm font-['Space_Grotesk'] leading-tight truncate">
                  {name}
                </h3>
                <span className="text-[9px] sm:text-[11px] font-mono tracking-wider text-white/75 uppercase block truncate">
                  {deliveryType}
                </span>
              </div>
            </div>

            {/* Simulated Smart EMV Chip */}
            <div className="w-7 h-5 sm:w-9 sm:h-7 rounded bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300/40 p-0.5 sm:p-1 flex flex-col justify-between shadow-xs opacity-90 shrink-0 ml-2">
              <div className="w-full h-[1.5px] bg-amber-700/40" />
              <div className="w-full h-[1.5px] bg-amber-700/40" />
              <div className="w-full h-[1.5px] bg-amber-700/40" />
            </div>
          </div>

          {/* Middle holographic seal */}
          <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] font-mono text-emerald-300 font-medium whitespace-nowrap">
              <ShieldCheck size={11} className="text-emerald-400 shrink-0" />
              <span>GUARANTEED • 100% VERIFIED</span>
            </div>
          </div>

          {/* Bottom row: Value & Wordmark */}
          <div className="relative z-10 flex items-end justify-between pt-1.5 sm:pt-2 border-t border-white/15">
            <div>
              <span className="text-[9px] sm:text-[10px] font-mono text-white/70 uppercase tracking-widest block">Face Value</span>
              <div className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-white tracking-tight drop-shadow">
                ${value.toFixed(2)}
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-white/80 font-medium">
              <Sparkles size={12} className="text-amber-300 animate-pulse" />
              <span className="font-['Space_Grotesk'] tracking-wider text-white">Vaultly</span>
            </div>
          </div>
        </div>

        {/* BACK OF CARD */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-[#120c1f] border border-[#3b2b5c] flex flex-col justify-between overflow-hidden shadow-2xl"
        >
          {/* Magnetic Stripe */}
          <div className="w-full h-7 sm:h-9 bg-black/95 mt-3 sm:mt-4 flex items-center px-3 sm:px-4">
            <span className="font-mono text-[7px] sm:text-[8px] text-zinc-500 tracking-widest uppercase truncate">
              AUTHENTIC SECURE DIGITAL CARDS BY VAULTLY VOUCHER NETWORK
            </span>
          </div>

          {/* Barcode & Scratch-off PIN area */}
          <div className="px-3.5 sm:px-5 py-1.5 sm:py-2 space-y-1.5 sm:space-y-2">
            <div className="bg-white rounded p-1 sm:p-1.5 flex flex-col items-center justify-center shadow-xs">
              <div className="w-full h-6 sm:h-8 flex items-center justify-center gap-0.5">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-full bg-black"
                    style={{ width: `${(i % 3 === 0 ? 3 : (i % 2 === 0 ? 1.5 : 1))}px` }}
                  />
                ))}
              </div>
              <span className="font-mono text-[8px] sm:text-[9px] text-zinc-800 tracking-widest truncate max-w-full">{code}</span>
            </div>

            <div className="flex items-center justify-between bg-[#19112a] border border-[#2e204d] rounded-lg px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs">
              <span className="text-[#9c90b8] font-mono text-[10px] sm:text-[11px]">Security PIN</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.click();
                  setPinRevealed(r => !r);
                }}
                className="font-mono text-[10px] sm:text-[11px] font-semibold text-[#b383f7] hover:text-[#d2b3ff] flex items-center gap-1.5"
              >
                {pinRevealed ? pin : 'Reveal PIN'}
                <Lock size={11} />
              </button>
            </div>
          </div>

          {/* Legal Fineprint */}
          <div className="px-3.5 sm:px-5 pb-2.5 sm:pb-3 pt-1 border-t border-[#251b3a] flex items-center justify-between text-[8px] sm:text-[9px] text-[#71658e] font-mono">
            <span className="truncate">Care: 1-800-VAULTLY</span>
            <span className="truncate ml-2">NO EXPIRATION • 100% VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
