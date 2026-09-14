import React, { useState } from 'react';
import { Copy, Check, Maximize2, QrCode } from 'lucide-react';
import { sounds } from '../utils/audio';

interface BarcodeProps {
  value: string;
  pin?: string;
  showDetails?: boolean;
}

export const Barcode: React.FC<BarcodeProps> = ({ value, pin, showDetails = true }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [viewMode, setViewMode] = useState<'barcode' | 'qr'>('barcode');
  const [expanded, setExpanded] = useState(false);

  const copy = (text: string, isPin = false) => {
    sounds.click();
    navigator.clipboard.writeText(text);
    if (isPin) {
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Generate deterministic bar widths from string
  const bars = React.useMemo(() => {
    const chars = value.replace(/[^A-Za-z0-9]/g, '');
    const result: number[] = [];
    for (let i = 0; i < chars.length; i++) {
      const code = chars.charCodeAt(i);
      result.push((code % 3) + 1);
      result.push(((code >> 1) % 2) + 1);
      result.push(((code >> 2) % 3) + 1);
      result.push(1);
    }
    return result.slice(0, 48);
  }, [value]);

  return (
    <div className="bg-[#130d22] border border-[#2e2346] rounded-xl p-3.5 text-center relative overflow-hidden">
      {/* View Switcher Header */}
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#251b3a] text-xs">
        <div className="flex items-center gap-1.5 text-[#9c90b8]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] tracking-wide text-emerald-400 uppercase">Valid In-Store & Online</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => { sounds.click(); setViewMode(v => v === 'barcode' ? 'qr' : 'barcode'); }}
            className="px-2 py-0.5 rounded text-[11px] font-mono text-[#b383f7] hover:bg-[#201538] transition-colors flex items-center gap-1"
          >
            <QrCode size={12} />
            {viewMode === 'barcode' ? 'Show QR' : 'Show Barcode'}
          </button>
          <button
            type="button"
            onClick={() => { sounds.click(); setExpanded(true); }}
            className="p-1 rounded text-[#9c90b8] hover:text-white hover:bg-[#201538] transition-colors"
            title="Expand for Cashier"
          >
            <Maximize2 size={12} />
          </button>
        </div>
      </div>

      {/* Barcode or QR Display */}
      {viewMode === 'barcode' ? (
        <div className="bg-white rounded-lg p-2.5 flex flex-col items-center justify-center shadow-inner">
          <svg className="w-full h-12" preserveAspectRatio="none" viewBox={`0 0 ${bars.length * 4} 48`}>
            {bars.map((w, idx) => {
              const x = idx * 4;
              const isBar = idx % 2 === 0;
              return isBar ? (
                <rect key={idx} x={x} y="0" width={w} height="48" fill="#0b0813" />
              ) : null;
            })}
          </svg>
          <span className="font-mono text-[11px] font-semibold text-slate-800 tracking-widest mt-1">
            {value}
          </span>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-3 flex flex-col items-center justify-center">
          <div className="w-28 h-28 grid grid-cols-6 gap-1 p-1 bg-white border border-slate-300">
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                className={`${(i % 2 === 0 || i % 7 === 0 || (i > 20 && i % 3 === 0)) ? 'bg-slate-950' : 'bg-white'} rounded-xs`}
              />
            ))}
          </div>
          <span className="font-mono text-[10px] text-slate-600 mt-1">Scan with any standard register camera</span>
        </div>
      )}

      {/* Numerical Code and PIN with Copy */}
      {showDetails && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
          <div className="bg-[#0b0813] border border-[#271d3c] rounded-lg p-2 flex items-center justify-between">
            <div className="min-w-0 pr-1">
              <span className="block text-[10px] text-[#8e82ad] uppercase tracking-wider">Voucher Code</span>
              <span className="font-mono text-xs font-semibold text-white truncate block">{value}</span>
            </div>
            <button
              type="button"
              onClick={() => copy(value, false)}
              className="p-1.5 rounded-md hover:bg-[#251a3f] text-[#b383f7] transition-colors shrink-0"
              title="Copy Code"
            >
              {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>

          {pin ? (
            <div className="bg-[#0b0813] border border-[#271d3c] rounded-lg p-2 flex items-center justify-between">
              <div>
                <span className="block text-[10px] text-[#8e82ad] uppercase tracking-wider">Security PIN</span>
                <span className="font-mono text-xs font-semibold text-white block">{pin}</span>
              </div>
              <button
                type="button"
                onClick={() => copy(pin, true)}
                className="p-1.5 rounded-md hover:bg-[#251a3f] text-[#b383f7] transition-colors shrink-0"
                title="Copy PIN"
              >
                {copiedPin ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* Expanded Modal for Cashier Scanning */}
      {expanded && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-lg text-slate-900 mb-1">Present at Checkout</h3>
            <p className="text-xs text-slate-500 mb-4">Hold screen towards barcode reader or self-checkout scanner.</p>
            
            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 mb-4">
              <svg className="w-full h-24" preserveAspectRatio="none" viewBox={`0 0 ${bars.length * 4} 48`}>
                {bars.map((w, idx) => (
                  idx % 2 === 0 ? <rect key={idx} x={idx * 4} y="0" width={w} height="48" fill="#000" /> : null
                ))}
              </svg>
              <div className="font-mono text-base font-bold text-slate-950 mt-2 tracking-widest">{value}</div>
              {pin && <div className="font-mono text-sm text-slate-600 mt-1">PIN: <strong className="text-slate-900">{pin}</strong></div>}
            </div>

            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="w-full py-2.5 bg-slate-950 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              Done Scanning
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
