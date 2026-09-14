import React, { useState } from 'react';
import { History, ArrowDownLeft, ArrowUpRight, ArrowLeft, Search, Tag, Wallet } from 'lucide-react';
import { Transaction } from '../types';
import { sounds } from '../utils/audio';

interface HistoryViewProps {
  transactions: Transaction[];
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ transactions, onBack }) => {
  const [filter, setFilter] = useState<'all' | 'purchase' | 'deposit' | 'sell'>('all');
  const [search, setSearch] = useState('');

  const filtered = transactions.filter(t => {
    const matchType = filter === 'all' || t.type === filter;
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.brandName && t.brandName.toLowerCase().includes(search.toLowerCase())) ||
      (t.code && t.code.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchSearch;
  });

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      <button
        type="button"
        onClick={() => {
          sounds.click();
          onBack();
        }}
        className="inline-flex items-center gap-2 text-xs font-mono text-[#9c90b8] hover:text-white p-1 rounded-lg transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to marketplace</span>
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
            Activity & Receipts
          </h1>
          <p className="text-xs text-[#9c90b8] mt-0.5">
            Audit history of all card purchases, wallet top-ups, and card liquidations.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <div className="flex items-center gap-1 bg-[#140d25] p-1 rounded-xl border border-[#2d1e48] shrink-0">
            {(['all', 'purchase', 'deposit', 'sell'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  sounds.click();
                  setFilter(tab);
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap ${
                  filter === tab ? 'bg-[#2b1b4d] text-white font-semibold' : 'text-[#9c90b8] hover:text-white'
                }`}
              >
                {tab === 'all' ? 'All Activity' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="rounded-2xl border border-[#2b1f48] bg-[#140d25] overflow-hidden shadow-xl">
          <div className="divide-y divide-[#23173a]">
            {filtered.map(item => {
              const isPositive = item.amount > 0;

              return (
                <div key={item.id} className="p-3.5 sm:p-5 flex items-center justify-between gap-3 hover:bg-[#19102c] transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        item.type === 'purchase'
                          ? 'bg-purple-500/15 text-[#c4b5fd] border border-purple-500/30'
                          : item.type === 'deposit'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {item.type === 'purchase' ? (
                        <ArrowUpRight size={16} />
                      ) : item.type === 'deposit' ? (
                        <ArrowDownLeft size={16} />
                      ) : (
                        <Tag size={16} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white font-['Space_Grotesk'] truncate">
                        {item.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] sm:text-[11px] text-[#8e81aa] font-mono mt-0.5">
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        {item.code && (
                          <>
                            <span>•</span>
                            <span className="text-[#c4b5fd] truncate max-w-[90px] sm:max-w-[120px]">{item.code}</span>
                          </>
                        )}
                        {item.discountAmount ? (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold">
                              Saved ${item.discountAmount.toFixed(2)}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono shrink-0 pl-2">
                    <span
                      className={`text-xs sm:text-base font-bold ${
                        isPositive ? 'text-emerald-400' : 'text-white'
                      }`}
                    >
                      {isPositive ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
                    </span>
                    {item.faceValue && (
                      <span className="block text-[9px] sm:text-[10px] text-[#82749e]">
                        Face: ${item.faceValue.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl bg-[#140d25] border border-[#2b1f48] p-8 space-y-2">
          <p className="text-sm text-white font-medium">No activity records found.</p>
          <p className="text-xs text-[#9c90b8]">Any purchases or deposits will appear here with timestamped receipts.</p>
        </div>
      )}
    </div>
  );
};
