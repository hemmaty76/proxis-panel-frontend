import {
  Key,
  Copy,
  Check
} from 'lucide-react';
import type { AccountLayoutProps } from './types';

export default function DefaultAccountLayout({
  accountData,
  copiedKey,
  handleCopy,
  translateKey
}: AccountLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Product description if exists */}
      {accountData.product_description && (
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 print-box print-border">
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            {accountData.product_description}
          </p>
        </div>
      )}

      {/* Public Fields */}
      {Object.keys(accountData.public_fields).length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 block mr-1">مشخصات عمومی:</span>
          <div className="space-y-2">
            {Object.entries(accountData.public_fields).map(([key, val]) => (
              <div key={key} dir="ltr" className="flex justify-between items-center bg-slate-950/40 border border-slate-850 p-3.5 rounded-xl text-xs print-box print-border">
                <span className="text-slate-550 font-semibold font-sans">{translateKey(key)}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-bold font-mono">{String(val)}</span>
                  <button
                    onClick={() => handleCopy(String(val), `public-${key}`)}
                    className={`text-slate-500 hover:text-slate-300 p-1.5 rounded hover:bg-slate-800 transition-colors no-print ${copiedKey === `public-${key}` ? 'text-emerald-400' : ''}`}
                    title="کپی"
                  >
                    {copiedKey === `public-${key}` ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Private Fields */}
      <div className="space-y-3.5">
        <span className="text-xs font-bold text-slate-400 block mr-1 flex items-center gap-1.5">
          <Key size={14} className="text-indigo-400 no-print" />
          اطلاعات ورود به اکانت:
        </span>
        
        {Object.entries(accountData.private_fields).map(([key, val]) => {
          const fieldId = `private-${key}`;
          return (
            <div key={key} className="space-y-1 text-right">
              <span className="text-[11px] font-bold text-slate-400 mr-1">{translateKey(key)}</span>
              <div className="flex items-center justify-between gap-2 bg-slate-950/40 border border-slate-800/80 p-3.5 rounded-xl text-xs font-mono" dir="ltr">
                <span className="text-slate-200 font-extrabold truncate select-all">
                  {String(val)}
                </span>
                <button
                  onClick={() => handleCopy(String(val), fieldId)}
                  className={`p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors no-print ${copiedKey === fieldId ? 'text-emerald-400' : ''}`}
                >
                  {copiedKey === fieldId ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
