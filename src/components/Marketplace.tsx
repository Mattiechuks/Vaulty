import React, { useState, useMemo } from 'react';
import {
  Search,
  Zap,
  TrendingUp,
  ShieldCheck,
  Clock,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Tag,
  Star,
  Sparkles,
} from 'lucide-react';
import { Brand } from '../types';
import { BRANDS, CATEGORIES } from '../data/brands';
import { sounds } from '../utils/audio';

interface MarketplaceProps {
  onSelectBrand: (brand: Brand) => void;
  onOpenSell: () => void;
  onOpenCalculator: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  onSelectBrand,
  onOpenSell,
  onOpenCalculator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'discount-desc' | 'discount-asc' | 'name' | 'rating'>('discount-desc');

  // Flash deal spotlight brand
  const flashBrand = useMemo(() => BRANDS.find(b => b.flashDeal) || BRANDS[0], []);

  // Filtered & Sorted brands
  const filteredBrands = useMemo(() => {
    return BRANDS.filter(b => {
      const matchSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.blurb.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'All' || b.category === selectedCategory;
      return matchSearch && matchCat;
    }).sort((a, b) => {
      if (sortBy === 'discount-desc') return b.discount - a.discount;
      if (sortBy === 'discount-asc') return a.discount - b.discount;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#180f2d] to-[#100a1f] border border-[#31224d] p-4 sm:p-7 lg:p-10 shadow-2xl">
        {/* Glow orb */}
        <div className="absolute -top-24 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[#2a1b49] border border-[#442c75] text-[11px] sm:text-xs font-medium text-[#d8b4fe]">
              <Zap size={12} className="text-amber-300 shrink-0" />
              <span className="truncate">Verified Secondary Exchange • Instant Codes</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] text-white tracking-tight leading-tight">
              Real gift cards,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d8b4fe] to-[#38bdf8]">
                always below face value.
              </span>
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-[#a99cbf] max-w-xl leading-relaxed">
              Unlock live discounted codes from 60+ top retailers. Delivered to your digital vault and email in under 60 seconds with our 1-year balance protection guarantee.
            </p>

            {/* Quick CTAs & Value points */}
            <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono text-[#c4b5fd]">
              <div className="flex items-center gap-1.5 bg-[#1f1538] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-[#37265f]">
                <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                <span>1-Year Balance Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1f1538] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-[#37265f]">
                <Clock size={13} className="text-cyan-400 shrink-0" />
                <span>Instant Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1f1538] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-[#37265f]">
                <Tag size={13} className="text-amber-400 shrink-0" />
                <span>Save up to 11%</span>
              </div>
            </div>
          </div>

          {/* Featured Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#140c24] border border-[#362758] rounded-2xl p-3.5 sm:p-5 shadow-xl relative group">
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                    <Zap size={10} className="fill-rose-400" />
                    Deal of the Day
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#9c90b8]">Expires in 4h 18m</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                    {flashBrand.discount}% OFF
                  </span>
                </div>
              </div>

              {/* Realistic card mini preview */}
              <div
                className="w-full aspect-[2/1] sm:aspect-[1.8/1] rounded-xl p-3 sm:p-4 flex flex-col justify-between text-white shadow-lg relative overflow-hidden transition-transform group-hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${flashBrand.color}, ${flashBrand.secondaryColor})`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-['Space_Grotesk'] font-bold text-base sm:text-lg truncate">{flashBrand.name}</span>
                  <span className="text-[10px] sm:text-xs font-mono bg-black/30 px-2 py-0.5 rounded backdrop-blur-sm">
                    eCode
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase font-mono text-white/70 block">Sample $100 Card</span>
                    <span className="font-mono font-bold text-lg sm:text-xl">${(100 * (1 - flashBrand.discount / 100)).toFixed(2)}</span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-medium text-amber-200">Save ${(100 * (flashBrand.discount / 100)).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-[#9c90b8] line-clamp-1">{flashBrand.blurb}</p>
                <button
                  type="button"
                  onClick={() => {
                    sounds.click();
                    onSelectBrand(flashBrand);
                  }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#130728] text-xs font-bold rounded-lg shrink-0 transition-colors flex items-center gap-1 shadow-md"
                >
                  <span>Claim Deal</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quick Action Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => {
            sounds.click();
            onOpenSell();
          }}
          className="text-left bg-gradient-to-r from-[#170f29] to-[#1e1335] border border-[#30214f] hover:border-[#4d357a] p-3.5 sm:p-4 rounded-2xl transition-all group flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <TrendingUp size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                Have an unused card? Cash out instantly
              </h2>
              <p className="text-[11px] sm:text-xs text-[#9c90b8] line-clamp-1 sm:line-clamp-none">
                Get an instant quote and receive up to 92% in cash or Vaultly credits.
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#9c90b8] group-hover:translate-x-1 transition-transform shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.click();
            onOpenCalculator();
          }}
          className="text-left bg-gradient-to-r from-[#170f29] to-[#1e1335] border border-[#30214f] hover:border-[#4d357a] p-3.5 sm:p-4 rounded-2xl transition-all group flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Sparkles size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                Calculate your yearly savings
              </h2>
              <p className="text-[11px] sm:text-xs text-[#9c90b8] line-clamp-1 sm:line-clamp-none">
                See how much you save on groceries, coffee, flights, and games every month.
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#9c90b8] group-hover:translate-x-1 transition-transform shrink-0" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d7099]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 60+ retailers (e.g. Fennel, Marlow, Steam)..."
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-[#130c24] border border-[#2e204d] rounded-xl text-xs sm:text-sm text-white placeholder-[#6d6188] focus:outline-none focus:border-[#a78bfa] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8e82ad] hover:text-white px-1.5 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center justify-between sm:justify-start gap-2 bg-[#130c24] border border-[#2e204d] rounded-xl px-3 py-2 text-xs text-[#9c90b8]">
            <div className="flex items-center gap-1.5">
              <ArrowUpDown size={13} className="text-[#a78bfa]" />
              <span className="font-mono text-[11px] sm:text-xs">Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent text-white focus:outline-none font-medium cursor-pointer text-xs"
            >
              <option value="discount-desc" className="bg-[#140c25]">Highest Discount</option>
              <option value="discount-asc" className="bg-[#140c25]">Lowest Discount</option>
              <option value="rating" className="bg-[#140c25]">Top Rated</option>
              <option value="name" className="bg-[#140c25]">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Category Pills - Edge-to-edge scrollable on mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                sounds.click();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#a78bfa] text-[#120726] font-semibold shadow-md'
                  : 'bg-[#140d25] border border-[#2d2049] text-[#9c90b8] hover:text-white hover:border-[#422e6b]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Retailers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
        {filteredBrands.map(brand => {
          return (
            <div
              key={brand.id}
              onClick={() => {
                sounds.click();
                onSelectBrand(brand);
              }}
              className="group cursor-pointer rounded-2xl bg-[#140d25] border border-[#2d204a] hover:border-[#4c357a] hover:shadow-xl hover:shadow-purple-950/30 transition-all p-3.5 sm:p-4 flex flex-col justify-between"
            >
              {/* Card Face Representation */}
              <div>
                <div
                  className="w-full aspect-[2/1] sm:aspect-[1.9/1] rounded-xl p-3 flex flex-col justify-between text-white relative overflow-hidden transition-transform duration-200 group-hover:-translate-y-0.5 shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${brand.color}EE, ${brand.secondaryColor})`,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xs sm:text-sm border border-white/30">
                      {brand.initial}
                    </div>
                    {brand.flashDeal && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-400 text-slate-950 shadow-xs flex items-center gap-0.5">
                        <Zap size={9} fill="currentColor" /> FLASH
                      </span>
                    )}
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-mono text-white/70 block uppercase">
                        {brand.category}
                      </span>
                      <span className="font-['Space_Grotesk'] font-bold text-xs sm:text-sm tracking-tight text-white truncate block max-w-[130px] sm:max-w-[140px]">
                        {brand.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[11px] sm:text-xs font-bold text-white bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
                        {brand.discount}% OFF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#d2b3ff] transition-colors truncate">
                      {brand.name}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-300 text-xs">
                      <Star size={11} fill="currentColor" />
                      <span className="font-mono text-[10px] sm:text-[11px] text-zinc-300">{brand.rating}</span>
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#9c90b8] line-clamp-2 leading-relaxed">
                    {brand.blurb}
                  </p>
                </div>
              </div>

              {/* Bottom Denominations & Action */}
              <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#23183a] flex items-center justify-between">
                <div className="flex items-center gap-1 overflow-hidden">
                  {brand.denominations.slice(0, 3).map(d => (
                    <span
                      key={d}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#1d1433] text-[#b3a4d0] border border-[#2d1e4e]"
                    >
                      ${d}
                    </span>
                  ))}
                  {brand.denominations.length > 3 && (
                    <span className="text-[10px] font-mono text-[#7e7199]">
                      +{brand.denominations.length - 3}
                    </span>
                  )}
                </div>

                <span className="text-xs font-semibold text-[#a78bfa] group-hover:text-[#d2b3ff] flex items-center gap-0.5 shrink-0 ml-2">
                  View <ChevronRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBrands.length === 0 && (
        <div className="py-16 text-center rounded-2xl bg-[#140d25] border border-[#2b1f45] p-8 space-y-3">
          <p className="text-base text-white font-medium">No retailers found matching "{searchQuery}"</p>
          <p className="text-xs text-[#9c90b8]">
            Try checking for spelling, browsing other categories, or clearing your search filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-2 px-4 py-2 bg-[#a78bfa] text-[#120726] rounded-xl text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
