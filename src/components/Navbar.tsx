import React from 'react';
import { 
  Dices, 
  Sparkles, 
  Layers, 
  FileSpreadsheet, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Flame,
  Star
} from 'lucide-react';
import { sounds } from '../utils/sound';

export type TabType = 'gacha' | 'constellation' | 'explorer' | 'sheet';

interface NavbarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  completedCount: number;
  onOpenWhy: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  completedCount,
  onOpenWhy,
  soundEnabled,
  onToggleSound
}) => {
  return (
    <header className="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        {/* Top row */}
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center text-amber-400 font-black text-lg">
                1K
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-white text-base sm:text-lg tracking-tight">
                  MÁY ĐẺ 1000 MILESTONE
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  Ở Trọ Sài Gòn
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">
                Hệ thống 10 phút xóa sạch cảm giác mông lung
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Progress Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-white font-mono font-bold">{completedCount}</span>
              <span className="text-neutral-500">/ 1000 đã sáng</span>
            </div>

            {/* Why Modal Trigger */}
            <button
              onClick={onOpenWhy}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Đào 3 WHY</span>
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={onToggleSound}
              className="p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors"
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-neutral-600" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              onSelectTab('gacha');
              sounds.playTick();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'gacha'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Dices className="w-4 h-4" />
            <span>Bốc Vé Hôm Nay</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('constellation');
              sounds.playTick();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'constellation'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Bản Đồ Sao (1000)</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('explorer');
              sounds.playTick();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'explorer'
                ? 'bg-sky-500 text-black shadow-md shadow-sky-500/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Máy Đẻ 100 Vé</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('sheet');
              sounds.playTick();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'sheet'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Bảng 4 Cột Kiểu Sheet</span>
          </button>
        </div>
      </div>
    </header>
  );
};
