import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Gift,
  User,
  ShieldCheck,
  Clock,
  Sparkles,
  Check,
  AlertCircle,
  Tag,
  Info,
  Minus,
  Plus,
} from 'lucide-react';
import { Brand, UserAccount } from '../types';
import { GiftCardVisual } from './GiftCardVisual';
import { sounds } from '../utils/audio';

interface CardDetailViewProps {
  brand: Brand;
  user: UserAccount | null;
  onBack: () => void;
  onPurchase: (details: {
    brand: Brand;
    denomination: number;
    quantity: number;
    totalPayable: number;
    isGift: boolean;
    recipientName?: string;
    recipientEmail?: string;
    giftMessage?: string;
    giftTheme?: string;
  }) => void;
  onOpenAddFunds: () => void;
  onOpenAuth: () => void;
}

const GIFT_THEMES = [
  { id: 'midnight', name: 'Luxury Midnight', color: '#6366f1' },
  { id: 'emerald', name: 'Emerald Sparkle', color: '#10b981' },
  { id: 'sunset', name: 'Golden Sunset', color: '#f59e0b' },
  { id: 'rose', name: 'Rose Celebration', color: '#ec4899' },
];

export const CardDetailView: React.FC<CardDetailViewProps> = ({
  brand,
  user,
  onBack,
  onPurchase,
  onOpenAddFunds,
  onOpenAuth,
}) => {
  const [denomination, setDenomination] = useState<number>(brand.denominations[1] || brand.denominations[0] || 50);
  const [customDenom, setCustomDenom] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  
  // Gifting state
  const [isGift, setIsGift] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [giftMessage, setGiftMessage] = useState('Enjoy this gift card on me!');
  const [selectedTheme, setSelectedTheme] = useState('midnight');

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  // Active denomination value
  const activeDenom = isCustom ? (parseFloat(customDenom) || 0) : denomination;
  const faceValueTotal = activeDenom * quantity;
  const standardDiscountAmount = faceValueTotal * (brand.discount / 100);
  const promoDiscountAmount = promoApplied ? (faceValueTotal >= 50 ? 10 : 5) : 0;
  const finalPayable = Math.max(0, faceValueTotal - standardDiscountAmount - promoDiscountAmount);
  const totalSaved = standardDiscountAmount + promoDiscountAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'VAULT10') {
      sounds.success();
      setPromoApplied(true);
      setPromoError('');
    } else {
      sounds.click();
      setPromoError('Invalid promo code. Try "VAULT10" for $10 off!');
    }
  };

  const handleCheckout = () => {
    sounds.click();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (activeDenom < 10) {
      alert('Minimum denomination is $10.');
      return;
    }
    if (isGift && (!recipientName || !recipientEmail)) {
      alert('Please fill out the recipient name and email for your gift.');
      return;
    }
    if (user.balance < finalPayable) {
      onOpenAddFunds();
      return;
    }

    onPurchase({
      brand,
      denomination: activeDenom,
      quantity,
      totalPayable: finalPayable,
      isGift,
      recipientName: isGift ? recipientName : undefined,
      recipientEmail: isGift ? recipientEmail : undefined,
      giftMessage: isGift ? giftMessage : undefined,
      giftTheme: isGift ? selectedTheme : undefined,
    });
  };

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => {
          sounds.click();
          onBack();
        }}
        className="inline-flex items-center gap-2 text-xs font-mono text-[#9c90b8] hover:text-white mb-4 sm:mb-6 p-1 rounded-lg transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to marketplace</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
        {/* Left Column: Visual Gift Card & Guarantees */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <GiftCardVisual
              name={brand.name}
              initial={brand.initial}
              color={brand.color}
              secondaryColor={brand.secondaryColor}
              value={activeDenom || 50}
              deliveryType={brand.deliveryType}
              interactive={true}
            />
            <p className="text-[11px] text-center font-mono text-[#8a7ba8]">
              💡 Tap or click card to flip and preview back security code
            </p>
          </div>

          {/* Guarantee Badges */}
          <div className="rounded-2xl bg-[#140d25] border border-[#2c1e48] p-3.5 sm:p-4 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="text-emerald-400 shrink-0 mt-0.5" size={17} />
              <div>
                <h4 className="text-xs font-bold text-white">1-Year Balance Guarantee</h4>
                <p className="text-[11px] text-[#9c90b8] leading-relaxed">
                  Every card on Vaultly is verified in real-time. If there is ever an issue with card balance, we replace or refund 100%.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="text-cyan-400 shrink-0 mt-0.5" size={17} />
              <div>
                <h4 className="text-xs font-bold text-white">Instant Automated Delivery</h4>
                <p className="text-[11px] text-[#9c90b8] leading-relaxed">
                  Delivery is immediate: generated barcodes, codes, and PINs arrive in your Vaultly wallet and registered email within 60s.
                </p>
              </div>
            </div>
          </div>

          {/* Terms info */}
          <div className="rounded-xl bg-[#11091f] border border-[#23173a] p-3 text-[11px] text-[#8c80a8] space-y-1">
            <span className="font-semibold text-zinc-300 block">Retailer Terms:</span>
            <p>{brand.terms}</p>
          </div>
        </div>

        {/* Right Column: Order Configuration */}
        <div className="lg:col-span-7 bg-[#140d25] border border-[#2e204c] rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-8 space-y-4 sm:space-y-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-semibold bg-[#22163d] text-[#c4b5fd] border border-[#3b2762] uppercase">
                {brand.category}
              </span>
              <h1 className="text-xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white mt-1.5 truncate">
                {brand.name} Gift Card
              </h1>
              <p className="text-xs text-[#9c90b8] mt-1 line-clamp-2">{brand.blurb}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-mono text-xs sm:text-base font-bold text-emerald-400 bg-emerald-950/60 px-2.5 sm:px-3 py-1 rounded-xl border border-emerald-800/50 block">
                {brand.discount}% OFF
              </span>
              <span className="text-[10px] text-[#8e82ad] font-mono mt-0.5 block">Live discount</span>
            </div>
          </div>

          {/* Denominations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-medium">Card Denomination</span>
              <span className="font-mono text-[11px] text-[#9c90b8]">USD</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2">
              {brand.denominations.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    sounds.click();
                    setIsCustom(false);
                    setDenomination(d);
                  }}
                  className={`py-2 sm:py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all ${
                    !isCustom && denomination === d
                      ? 'bg-[#a78bfa] text-[#110624] shadow-md scale-[1.02]'
                      : 'bg-[#1b1230] border border-[#30214e] text-[#d1c7e6] hover:bg-[#251941] hover:text-white'
                  }`}
                >
                  ${d}
                </button>
              ))}
            </div>

            {/* Custom Denomination toggle */}
            <div className="pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                <input
                  type="number"
                  placeholder="Custom amount (e.g. 75)"
                  min="10"
                  max="1000"
                  value={customDenom}
                  onChange={e => {
                    setIsCustom(true);
                    setCustomDenom(e.target.value);
                  }}
                  onFocus={() => setIsCustom(true)}
                  className={`w-full sm:w-48 px-3 py-1.5 rounded-lg bg-[#1a112f] border text-xs font-mono text-white placeholder-[#6d6089] focus:outline-none ${
                    isCustom ? 'border-[#a78bfa] ring-1 ring-[#a78bfa]' : 'border-[#30214e]'
                  }`}
                />
                <span className="text-[11px] text-[#8a7da7]">Min $10 — Max $1,000</span>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between py-2.5 sm:py-3 border-y border-[#261c3c]">
            <span className="text-xs font-medium text-white">Quantity</span>
            <div className="flex items-center gap-2 sm:gap-3 bg-[#1b1230] border border-[#332354] rounded-xl px-2 py-1">
              <button
                type="button"
                onClick={() => {
                  sounds.click();
                  setQuantity(q => Math.max(1, q - 1));
                }}
                className="w-7 h-7 rounded-lg hover:bg-[#281b45] text-white flex items-center justify-center transition-colors"
                disabled={quantity <= 1}
              >
                <Minus size={13} />
              </button>
              <span className="font-mono font-bold text-sm text-white w-6 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => {
                  sounds.click();
                  setQuantity(q => Math.min(10, q + 1));
                }}
                className="w-7 h-7 rounded-lg hover:bg-[#281b45] text-white flex items-center justify-center transition-colors"
                disabled={quantity >= 10}
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          {/* Purpose: Myself vs Digital Gift */}
          <div className="space-y-2.5 sm:space-y-3">
            <span className="text-xs font-medium text-white block">Purchase Type</span>
            <div className="grid grid-cols-2 gap-2 bg-[#1b1230] p-1 rounded-xl border border-[#2d1e4d]">
              <button
                type="button"
                onClick={() => {
                  sounds.click();
                  setIsGift(false);
                }}
                className={`py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                  !isGift ? 'bg-[#311f56] text-white font-semibold shadow-xs' : 'text-[#9c90b8] hover:text-white'
                }`}
              >
                <User size={13} />
                <span>For Myself</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.click();
                  setIsGift(true);
                }}
                className={`py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                  isGift ? 'bg-[#311f56] text-white font-semibold shadow-xs' : 'text-[#9c90b8] hover:text-white'
                }`}
              >
                <Gift size={13} className={isGift ? 'text-pink-400' : ''} />
                <span>Send as Gift 🎁</span>
              </button>
            </div>

            {/* If Send as Gift is toggled */}
            {isGift && (
              <div className="space-y-3 p-3.5 sm:p-4 rounded-2xl bg-[#19102c] border border-[#3b2762] animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="block text-[11px] text-[#9c90b8] mb-1">Recipient Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah Connor"
                      value={recipientName}
                      onChange={e => setRecipientName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#130b24] border border-[#332252] rounded-lg text-xs text-white placeholder-[#685b84] focus:outline-none focus:border-[#a78bfa]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#9c90b8] mb-1">Recipient Email</label>
                    <input
                      type="email"
                      placeholder="sarah@example.com"
                      value={recipientEmail}
                      onChange={e => setRecipientEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-[#130b24] border border-[#332252] rounded-lg text-xs text-white placeholder-[#685b84] focus:outline-none focus:border-[#a78bfa]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#9c90b8] mb-1">Personal Message</label>
                  <textarea
                    rows={2}
                    value={giftMessage}
                    onChange={e => setGiftMessage(e.target.value)}
                    placeholder="Write a warm note..."
                    className="w-full px-3 py-2 bg-[#130b24] border border-[#332252] rounded-lg text-xs text-white placeholder-[#685b84] focus:outline-none focus:border-[#a78bfa]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#9c90b8] mb-1">Gift Presentation Theme</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                    {GIFT_THEMES.map(theme => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`p-1.5 sm:p-2 rounded-lg text-[10px] sm:text-[11px] border font-medium flex items-center gap-1.5 transition-all ${
                          selectedTheme === theme.id
                            ? 'bg-[#291b4b] border-[#a78bfa] text-white shadow-xs'
                            : 'bg-[#140c24] border-[#2f1f4f] text-[#8e81ad] hover:text-white'
                        }`}
                      >
                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0" style={{ backgroundColor: theme.color }} />
                        <span className="truncate">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Promo code */}
          <form onSubmit={handleApplyPromo} className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7f719e]" />
                <input
                  type="text"
                  placeholder="Promo Code ('VAULT10')"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                  className="w-full pl-8 pr-3 py-2 bg-[#180f2d] border border-[#31204f] rounded-xl text-xs font-mono text-white uppercase placeholder-[#685986] focus:outline-none focus:border-[#a78bfa]"
                />
              </div>
              <button
                type="submit"
                disabled={promoApplied || !promoCode}
                className="px-3 py-2 bg-[#281845] hover:bg-[#382361] disabled:opacity-50 text-[#c4b5fd] text-xs font-mono font-semibold rounded-xl border border-[#3f276b] transition-colors shrink-0"
              >
                {promoApplied ? 'Applied' : 'Apply'}
              </button>
            </div>
            {promoApplied && (
              <p className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <Check size={12} /> Extra $10 discount applied successfully!
              </p>
            )}
            {promoError && (
              <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                <AlertCircle size={12} /> {promoError}
              </p>
            )}
          </form>

          {/* Price Breakdown */}
          <div className="rounded-2xl bg-[#120a21] border border-[#271b3e] p-3.5 sm:p-4 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-[#9c90b8]">
              <span>Face Value ({quantity} × ${activeDenom.toFixed(2)})</span>
              <span className="text-white font-medium">${faceValueTotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-emerald-400">
              <span>Vaultly Discount ({brand.discount}%)</span>
              <span>-${standardDiscountAmount.toFixed(2)}</span>
            </div>

            {promoApplied && (
              <div className="flex items-center justify-between text-emerald-400">
                <span>Promo Code (VAULT10)</span>
                <span>-${promoDiscountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-[#26193e] flex items-center justify-between text-sm">
              <span className="font-bold text-white font-['Space_Grotesk'] text-sm sm:text-base">Total Due</span>
              <div className="text-right">
                <span className="font-bold text-white text-lg sm:text-xl">${finalPayable.toFixed(2)}</span>
                <span className="block text-[10px] text-emerald-400">
                  You save ${totalSaved.toFixed(2)} ({(faceValueTotal > 0 ? (totalSaved / faceValueTotal) * 100 : 0).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Balance status & Action */}
          <div className="space-y-3">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#180f2d] border border-[#2d1d4d] text-xs font-mono">
                <span className="text-[#9c90b8]">Your Vault Balance:</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${user.balance >= finalPayable ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${user.balance.toFixed(2)}
                  </span>
                  {user.balance < finalPayable && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.click();
                        onOpenAddFunds();
                      }}
                      className="text-[11px] text-[#a78bfa] underline hover:text-[#c4b5fd]"
                    >
                      Top up ${(finalPayable - user.balance).toFixed(2)}
                    </button>
                  )}
                </div>
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#a78bfa] to-[#c084fc] hover:from-[#c4b5fd] hover:to-[#d8b4fe] active:scale-[0.99] text-[#120726] font-bold text-sm tracking-wide shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag size={18} strokeWidth={2.2} />
              <span>
                {user
                  ? user.balance >= finalPayable
                    ? `Complete Order • $${finalPayable.toFixed(2)}`
                    : `Add Funds & Buy • $${finalPayable.toFixed(2)}`
                  : `Sign In to Buy • $${finalPayable.toFixed(2)}`}
              </span>
            </button>

            <p className="text-[11px] text-center text-[#7a6d96]">
              Instant digital delivery. By purchasing, you agree to Vaultly’s 1-Year Guarantee terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
