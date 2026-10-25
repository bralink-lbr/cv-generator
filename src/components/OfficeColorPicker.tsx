import React from 'react';
import { PastelPalette } from '../types/resume';
import { CURATED_CV_PALETTES } from '../constants/palettes';
import { Check, Palette } from 'lucide-react';

interface OfficeColorPickerProps {
  selectedPalette: PastelPalette;
  onSelectPalette: (palette: PastelPalette) => void;
}

export const OfficeColorPicker: React.FC<OfficeColorPickerProps> = ({
  selectedPalette,
  onSelectPalette,
}) => {
  return (
    <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-purple-600" />
          <span>10 Pilihan Warna Terbaik untuk CV Creative</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-medium">Aktif:</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50">
            <span
              className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
              style={{ backgroundColor: selectedPalette.primary }}
            />
            <span className="text-[11px] font-semibold text-slate-700">
              {selectedPalette.name.split('(')[0].replace(/^\d+\.\s*/, '').trim()}
            </span>
          </div>
        </div>
      </div>

      <p className="text-[11.5px] text-slate-500">
        Pilih 1 dari 10 warna profesional di bawah ini. Format warna teruji tajam, kontras, dan 100% aman untuk didownload ke PDF:
      </p>

      {/* 10 Curated Color Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
        {CURATED_CV_PALETTES.map((pal) => {
          const isSelected = selectedPalette.id === pal.id || selectedPalette.primary.toLowerCase() === pal.primary.toLowerCase();
          const shortName = pal.name.split('(')[0].replace(/^\d+\.\s*/, '').trim();
          const subtitle = pal.name.includes('(') ? pal.name.split('(')[1].replace(')', '') : '';

          return (
            <button
              key={pal.id}
              type="button"
              onClick={() => onSelectPalette(pal)}
              className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col gap-1.5 group cursor-pointer ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/30 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-5 h-5 rounded-lg shadow-2xs border border-black/10 shrink-0"
                    style={{ backgroundColor: pal.primary }}
                  />
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: pal.secondary }}
                    title="Aksen pendukung"
                  />
                </div>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>

              <div>
                <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                  {shortName}
                </div>
                <div className="text-[10px] text-slate-500 truncate" title={subtitle}>
                  {subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
