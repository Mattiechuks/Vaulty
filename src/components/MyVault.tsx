import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  ExternalLink,
  Gift,
  DollarSign,
  Trash2,
  ArrowRight,
  Eye,
  Check,
} from 'lucide-react';
import { PurchasedCard } from '../types';
import { Barcode } from './Barcode';
import { GiftCardVisual } from './GiftCardVisual';
import { sounds } from '../utils/audio';

interface MyVaultProps {
  cards: PurchasedCard[];
  onUpdateCardBalance: (cardId: string, newBalance: number) => void;
  onToggleRedeemed: (cardId: string) => void;
  onExploreMarketplace: () => void;
}

export const MyVault: React.FC<MyVaultProps> = ({
  cards,
  onUpdateCardBalance,
  onToggleRedeemed,
  onExploreMarketplace,
}) => {
  const [filter, setFilter] = useState<'active' | 'redeemed' | 'gifts'>('active');
  const [search, setSearch] = useState('');
  const [selectedCardForSpend, setSelectedCardForSpend] = useState<PurchasedCard | null>(null);
  const [spendAmount, setSpendAmount] = useState<string>('');
  const [previewGiftModal, setPreviewGiftModal] = useState<PurchasedCard | null>(null);

  const filteredCards = cards.filter(card => {
    const matchSearch = card.brandName.toLowerCase().includes(search.toLowerCase()) || card.code.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'active') return !card.redeemed;
    if (filter === 'redeemed') return card.redeemed;
    if (filter === 'gifts') return card.isGift;
    return true;
  });

  const totalVaultValue = cards
    .filter(c => !c.redeemed)
    .reduce((sum, c) => sum + c.currentBalance, 0);

  const handleApplySpend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCardForSpend) return;
    const spent = parseFloat(spendAmount);
    if (isNaN(spent) || spent <= 0) return;

    sounds.click();
    const newBal = Math.max(0, selectedCardForSpend.currentBalance - spent);
    onUpdateCardBalance(selectedCardForSpend.id, newBal);
    if (newBal === 0) {
      onToggleRedeemed(selectedCardForSpend.id);
    }
    setSelectedCardForSpend(null);
    setSpendAmount('');
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-8">
      {/* Header and Summary stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 bg-gradient-to-r from-[#170f2b] to-[#120a22] border border-[#2e204c] rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-8 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Live Digital Wallet
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
            My Gift Vault
          </h1>
          <p className="text-xs sm:text-sm text-[#9c90b8]">
            Present your cards directly at checkout via barcode, or paste codes into online checkouts.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#1e1336] border border-[#3b2762] rounded-2xl p-3.5 sm:p-4 self-start md:self-auto">
          <div>
            <span className="block text-[10px] font-mono text-[#8a7da7] uppercase tracking-wider">
              Available Vault Value
            </span>
            <span className="text-xl sm:text-3xl font-mono font-bold text-white">
              ${totalVaultValue.toFixed(2)}
            </span>
          </div>
          <div className="h-9 sm:h-10 w-[1px] bg-[#362458]" />
          <div>
            <span className="block text-[10px] font-mono text-[#8a7da7] uppercase tracking-wider">
              Active Cards
            </span>
            <span className="text-lg sm:text-2xl font-mono font-bold text-emerald-400">
              {cards.filter(c => !c.redeemed).length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center gap-1.5 bg-[#140d25] p-1 rounded-xl border border-[#2b1f48] overflow-x-auto scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-1">
          <button
            type="button"
            onClick={() => { sounds.click(); setFilter('active'); }}
            className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === 'active' ? 'bg-[#2b1b4d] text-white font-semibold' : 'text-[#9c90b8] hover:text-white'
            }`}
          >
            Active Cards ({cards.filter(c => !c.redeemed).length})
          </button>
          <button
            type="button"
            onClick={() => { sounds.click(); setFilter('gifts'); }}
            className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === 'gifts' ? 'bg-[#2b1b4d] text-white font-semibold' : 'text-[#9c90b8] hover:text-white'
            }`}
          >
            Gifts ({cards.filter(c => c.isGift).length})
          </button>
          <button
            type="button"
            onClick={() => { sounds.click(); setFilter('redeemed'); }}
            className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === 'redeemed' ? 'bg-[#2b1b4d] text-white font-semibold' : 'text-[#9c90b8] hover:text-white'
            }`}
          >
            Redeemed ({cards.filter(c => c.redeemed).length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7f729d]" />
          <input
            type="text"
            placeholder="Search my cards..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#130c24] border border-[#2d1e4a] rounded-xl text-xs text-white placeholder-[#685984] focus:outline-none focus:border-[#a78bfa]"
          />
        </div>
      </div>

      {/* Cards List / Grid */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredCards.map(card => {
            const isFullySpent = card.currentBalance <= 0 || card.redeemed;

            return (
              <div
                key={card.id}
                className={`rounded-2xl sm:rounded-3xl border transition-all p-3.5 sm:p-6 space-y-3 sm:space-y-4 ${
                  isFullySpent
                    ? 'bg-[#110a1f]/80 border-[#23173a] opacity-70'
                    : 'bg-[#150e28] border-[#312150] shadow-xl hover:border-[#4c347b]'
                }`}
              >
                {/* Top status bar */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: card.color }}
                    />
                    <span className="font-['Space_Grotesk'] font-bold text-white text-sm sm:text-base truncate">
                      {card.brandName}
                    </span>
                    {card.isGift && (
                      <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1 shrink-0">
                        <Gift size={11} /> For {card.recipientName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] sm:text-[11px] font-mono text-[#9c90b8]">
                      Purchased {new Date(card.purchasedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Card Visual & Balance Meter */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center">
                  <div className="sm:col-span-6">
                    <GiftCardVisual
                      name={card.brandName}
                      initial={card.initial}
                      color={card.color}
                      secondaryColor={card.secondaryColor}
                      value={card.currentBalance}
                      code={card.code}
                      pin={card.pin}
                      interactive={true}
                    />
                  </div>

                  <div className="sm:col-span-6 space-y-2.5 sm:space-y-3">
                    <div className="bg-[#11091f] border border-[#271940] rounded-xl sm:rounded-2xl p-3 sm:p-3.5 space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono text-[#9c90b8]">
                        <span>Remaining Balance</span>
                        <span className="text-white font-bold text-sm sm:text-base font-mono">
                          ${card.currentBalance.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#25173d] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (card.currentBalance / card.faceValue) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#7b6e96] pt-0.5">
                        <span>Face: ${card.faceValue.toFixed(2)}</span>
                        <span>Cost: ${card.purchasePrice.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Spend or Gift action */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {!card.redeemed && (
                        <button
                          type="button"
                          onClick={() => {
                            sounds.click();
                            setSelectedCardForSpend(card);
                          }}
                          className="flex-1 py-1.5 px-2 bg-[#251740] hover:bg-[#322055] text-white text-xs font-semibold rounded-lg border border-[#3b2762] transition-colors flex items-center justify-center gap-1"
                        >
                          <DollarSign size={12} className="text-emerald-400" />
                          <span>Deduct</span>
                        </button>
                      )}

                      {card.isGift && (
                        <button
                          type="button"
                          onClick={() => {
                            sounds.click();
                            setPreviewGiftModal(card);
                          }}
                          className="py-1.5 px-2.5 bg-[#3a1d47] hover:bg-[#4d275e] text-pink-200 text-xs font-semibold rounded-lg border border-[#63297a] transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye size={12} />
                          <span>Gift</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          sounds.click();
                          onToggleRedeemed(card.id);
                        }}
                        className={`py-1.5 px-2.5 sm:px-3 rounded-lg text-xs font-medium border transition-colors shrink-0 ${
                          card.redeemed
                            ? 'bg-[#181126] border-[#30214c] text-emerald-400 hover:bg-[#201733]'
                            : 'bg-[#181126] border-[#30214c] text-[#9c90b8] hover:text-white hover:bg-[#201733]'
                        }`}
                      >
                        {card.redeemed ? 'Unmark' : 'Mark Used'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instant Barcode & In-Store Presenter */}
                <Barcode value={card.code} pin={card.pin} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-[#140d25] border border-[#2b1f48] p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#22163b] border border-[#36245b] text-[#a78bfa] flex items-center justify-center mx-auto shadow-inner">
            <Layers size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
              Your gift vault is empty
            </h3>
            <p className="text-xs text-[#9c90b8] leading-relaxed">
              Explore 60+ verified brands with instant digital delivery and live discounts up to 11%.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.click();
              onExploreMarketplace();
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-[#a78bfa] to-[#c4b5fd] text-[#120726] rounded-xl text-xs font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            Browse Marketplace
          </button>
        </div>
      )}

      {/* Deduct Spend Modal */}
      {selectedCardForSpend && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#180f2d] border border-[#39265e] rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
              Log In-Store or Web Spend
            </h3>
            <p className="text-xs text-[#9c90b8]">
              Did you use part of your <strong>{selectedCardForSpend.brandName}</strong> card? Record the amount deducted.
            </p>

            <form onSubmit={handleApplySpend} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#9c90b8] mb-1">Amount Spent (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white font-mono">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={selectedCardForSpend.currentBalance}
                    placeholder="25.00"
                    value={spendAmount}
                    onChange={e => setSpendAmount(e.target.value)}
                    autoFocus
                    className="w-full pl-8 pr-3 py-2 bg-[#120a22] border border-[#332152] rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#a78bfa]"
                  />
                </div>
                <span className="text-[10px] text-[#7d7099] mt-1 block font-mono">
                  Current balance: ${selectedCardForSpend.currentBalance.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCardForSpend(null)}
                  className="flex-1 py-2 rounded-xl bg-[#22163b] text-[#9c90b8] text-xs font-medium hover:bg-[#2d1d4d] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#a78bfa] text-[#120726] text-xs font-bold hover:bg-[#c4b5fd] transition-colors"
                >
                  Update Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gift Card Greeting Preview Modal */}
      {previewGiftModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#1b1030] to-[#120921] border border-[#442c70] rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center justify-center mx-auto">
              <Gift size={24} />
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-pink-400">Digital Gift Presentation</span>
              <h3 className="text-xl font-bold text-white font-['Space_Grotesk'] mt-1">
                For {previewGiftModal.recipientName}
              </h3>
              <p className="text-xs text-[#a597bf]">{previewGiftModal.recipientEmail}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#140b24] border border-[#2b1c47] text-left">
              <p className="text-xs text-zinc-300 italic">"{previewGiftModal.giftMessage}"</p>
            </div>

            <GiftCardVisual
              name={previewGiftModal.brandName}
              initial={previewGiftModal.initial}
              color={previewGiftModal.color}
              secondaryColor={previewGiftModal.secondaryColor}
              value={previewGiftModal.faceValue}
              code={previewGiftModal.code}
              pin={previewGiftModal.pin}
              interactive={true}
            />

            <button
              type="button"
              onClick={() => setPreviewGiftModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#261845] hover:bg-[#34225d] text-white text-xs font-semibold transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
