import React, { useState } from 'react';
import { CheckCircle, Copy, Check, ArrowRight, Gift, Layers, Mail, Sparkles, X } from 'lucide-react';
import { PurchasedCard } from '../types';
import { Barcode } from './Barcode';
import { GiftCardVisual } from './GiftCardVisual';
import { sounds } from '../utils/audio';

interface PurchaseSuccessModalProps {
  card: PurchasedCard;
  onGoToVault: () => void;
  onClose: () => void;
}

export const PurchaseSuccessModal: React.FC<PurchaseSuccessModalProps> = ({
  card,
  onGoToVault,
  onClose,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleCopy = () => {
    sounds.click();
    navigator.clipboard.writeText(card.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendEmail = () => {
    sounds.click();
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-[#180f2d] to-[#120a22] border border-[#3f2a66] rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-lg w-full text-center space-y-4 sm:space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-4 sm:my-8 relative">
        <button
          type="button"
          onClick={() => {
            sounds.click();
            onClose();
          }}
          className="absolute top-4 right-4 text-[#8f82aa] hover:text-white p-1 rounded-lg transition-colors"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Top Celebration Badge */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce mt-1">
          <CheckCircle size={26} />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
            Payment Cleared • Instant Voucher Generated
          </span>
          <h2 className="text-xl sm:text-3xl font-bold text-white font-['Space_Grotesk']">
            {card.isGift ? 'Gift Delivered Successfully!' : 'Your Card is Ready to Spend!'}
          </h2>
          <p className="text-xs text-[#a496be]">
            {card.isGift
              ? `A digital presentation has been dispatched to ${card.recipientEmail}.`
              : 'Your verified balance has been deposited in your Vaultly digital wallet.'}
          </p>
        </div>

        {/* 3D Visual Card Preview */}
        <div className="max-w-xs mx-auto">
          <GiftCardVisual
            name={card.brandName}
            initial={card.initial}
            color={card.color}
            secondaryColor={card.secondaryColor}
            value={card.faceValue}
            code={card.code}
            pin={card.pin}
            interactive={true}
          />
        </div>

        {/* Barcode & Numerical Code Presenter */}
        <Barcode value={card.code} pin={card.pin} />

        {/* Order Details Mini-Receipt */}
        <div className="bg-[#10081e] border border-[#26173d] rounded-2xl p-3.5 text-xs font-mono space-y-1.5 text-left">
          <div className="flex justify-between text-[#9c90b8]">
            <span>Retailer</span>
            <span className="text-white font-medium">{card.brandName}</span>
          </div>
          <div className="flex justify-between text-[#9c90b8]">
            <span>Original Face Value</span>
            <span className="text-white font-medium">${card.faceValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#9c90b8]">
            <span>You Paid</span>
            <span className="text-emerald-400 font-bold">${card.purchasePrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#9c90b8]">
            <span>Total Saved</span>
            <span className="text-emerald-400 font-bold">
              ${(card.faceValue - card.purchasePrice).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => {
              sounds.click();
              onGoToVault();
            }}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#a78bfa] to-[#c4b5fd] text-[#120726] text-xs font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Layers size={15} />
            <span>Open in My Gift Vault</span>
            <ArrowRight size={14} />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 py-2 rounded-xl bg-[#201538] hover:bg-[#2c1d4d] text-white text-xs font-medium border border-[#38265a] transition-colors flex items-center justify-center gap-1.5"
            >
              {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>

            <button
              type="button"
              onClick={handleSendEmail}
              className="flex-1 py-2 rounded-xl bg-[#201538] hover:bg-[#2c1d4d] text-white text-xs font-medium border border-[#38265a] transition-colors flex items-center justify-center gap-1.5"
            >
              {emailSent ? <Check size={13} className="text-emerald-400" /> : <Mail size={13} />}
              <span>{emailSent ? 'Email Sent!' : 'Resend Email'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
