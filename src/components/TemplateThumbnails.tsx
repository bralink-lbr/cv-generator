import React from 'react';
import { CreativeTemplateType, PastelPalette } from '../types/resume';
import { Check, CheckCircle2 } from 'lucide-react';

interface TemplateThumbnailsProps {
  selected: CreativeTemplateType;
  onSelect: (type: CreativeTemplateType) => void;
  palette: PastelPalette;
}

export const TemplateThumbnails: React.FC<TemplateThumbnailsProps> = ({
  selected,
  onSelect,
  palette,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Pilih Model Template Creative:
        </label>
        <span className="text-[11px] text-slate-500">
          Klik thumbnail untuk memilih
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Thumbnail Card 1: Creative 1 (Left Sidebar) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelect('creative1')}
          onKeyDown={(e) => e.key === 'Enter' && onSelect('creative1')}
          className={`cursor-pointer rounded-xl border-2 transition-all p-3 bg-white flex flex-col justify-between text-left group hover:shadow-md ${
            selected === 'creative1'
              ? 'border-blue-600 ring-2 ring-blue-500/30 shadow-md bg-blue-50/20'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          {/* Mini Visual Preview Canvas */}
          <div className="w-full h-36 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex shadow-inner mb-2.5">
            {/* Left Sidebar Mockup */}
            <div
              className="w-[36%] h-full p-2 flex flex-col items-center gap-1.5 transition-colors"
              style={{ backgroundColor: palette.sidebarBg }}
            >
              <div className="w-6 h-6 rounded-full bg-white/80 border border-white mt-1 shadow-xs" />
              <div className="w-10 h-1 bg-white/70 rounded-full" />
              <div className="w-8 h-1 bg-white/50 rounded-full" />
              <div className="w-full h-[0.5px] bg-white/20 my-0.5" />
              <div className="w-full space-y-1 px-1">
                <div className="w-7 h-1 bg-white/80 rounded" />
                <div className="w-full h-0.5 bg-white/50 rounded" />
                <div className="w-5/6 h-0.5 bg-white/50 rounded" />
                <div className="w-4/5 h-0.5 bg-white/50 rounded" />
              </div>
            </div>

            {/* Right Main Mockup */}
            <div className="w-[64%] h-full p-2.5 bg-white flex flex-col justify-between">
              <div>
                <div
                  className="w-16 h-2 rounded font-black mb-1 transition-colors"
                  style={{ backgroundColor: palette.primary }}
                />
                <div className="w-24 h-1 bg-slate-400 rounded mb-2" />
                <div className="space-y-1">
                  <div className="w-12 h-1 bg-slate-600 rounded" />
                  <div className="w-full h-0.5 bg-slate-300 rounded" />
                  <div className="w-11/12 h-0.5 bg-slate-300 rounded" />
                </div>
              </div>
              <div className="space-y-1 pt-1 border-t border-slate-100">
                <div className="w-14 h-1 bg-slate-600 rounded" />
                <div className="w-full h-0.5 bg-slate-300 rounded" />
                <div className="w-4/5 h-0.5 bg-slate-300 rounded" />
              </div>
            </div>
          </div>

          {/* Card Info & Tick Button */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                Creative 1 (Left Sidebar)
              </div>
              <div className="text-[11px] text-slate-500">
                Foto bulat & kontak di kolom kiri pastel
              </div>
            </div>

            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selected === 'creative1'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
              }`}
            >
              {selected === 'creative1' ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Terpilih</span>
                </>
              ) : (
                <span>Pilih</span>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail Card 2: Creative 2 (Top Banner Header) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelect('creative2')}
          onKeyDown={(e) => e.key === 'Enter' && onSelect('creative2')}
          className={`cursor-pointer rounded-xl border-2 transition-all p-3 bg-white flex flex-col justify-between text-left group hover:shadow-md ${
            selected === 'creative2'
              ? 'border-blue-600 ring-2 ring-blue-500/30 shadow-md bg-blue-50/20'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          {/* Mini Visual Preview Canvas */}
          <div className="w-full h-36 bg-white rounded-lg overflow-hidden border border-slate-200 flex flex-col shadow-inner mb-2.5">
            {/* Top Banner Mockup */}
            <div
              className="w-full h-[38%] p-1.5 flex flex-col items-center justify-center transition-colors shadow-2xs"
              style={{ backgroundColor: palette.primary }}
            >
              <div className="w-6 h-6 rounded-full bg-white border border-white shadow-xs -mb-0.5" />
              <div className="w-14 h-1.5 bg-white rounded mt-1" />
              <div className="w-20 h-0.5 bg-white/70 rounded mt-0.5" />
            </div>

            {/* Bottom 2-Column Mockup */}
            <div className="w-full h-[62%] p-2 bg-white grid grid-cols-12 gap-1.5">
              <div className="col-span-5 space-y-1">
                <div
                  className="w-full h-1.5 rounded transition-colors"
                  style={{ backgroundColor: palette.sidebarBg }}
                />
                <div className="w-full h-0.5 bg-slate-300 rounded" />
                <div className="w-5/6 h-0.5 bg-slate-300 rounded" />
                <div
                  className="w-full h-1.5 rounded mt-1.5 transition-colors"
                  style={{ backgroundColor: palette.sidebarBg }}
                />
                <div className="w-4/5 h-0.5 bg-slate-300 rounded" />
              </div>
              <div className="col-span-7 space-y-1">
                <div
                  className="w-full h-1.5 rounded transition-colors"
                  style={{ backgroundColor: palette.sidebarBg }}
                />
                <div className="w-full h-0.5 bg-slate-300 rounded" />
                <div className="w-11/12 h-0.5 bg-slate-300 rounded" />
                <div
                  className="w-full h-1.5 rounded mt-1.5 transition-colors"
                  style={{ backgroundColor: palette.sidebarBg }}
                />
                <div className="w-4/5 h-0.5 bg-slate-300 rounded" />
              </div>
            </div>
          </div>

          {/* Card Info & Tick Button */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                Creative 2 (Top Banner)
              </div>
              <div className="text-[11px] text-slate-500">
                Banner atas & pembagian 2 kolom seimbang
              </div>
            </div>

            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selected === 'creative2'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
              }`}
            >
              {selected === 'creative2' ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Terpilih</span>
                </>
              ) : (
                <span>Pilih</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
