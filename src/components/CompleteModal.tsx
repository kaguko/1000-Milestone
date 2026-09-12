import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowLeft,
  CheckCircle2, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles, 
  Coins, 
  Users, 
  Zap,
  BatteryCharging,
  BatteryLow,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { Milestone } from '../types';

interface CompleteModalProps {
  milestone: Milestone | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    id: number, 
    feeling: string, 
    wantRedo: boolean, 
    milestone?: Milestone,
    energyEffect?: '+pin' | '-pin',
    guiltFree?: boolean
  ) => void;
}

const QUICK_FEELINGS = [
  'Đầu óc nhẹ bẫng, đỡ mông lung',
  'Ấm bụng và thấy trân trọng',
  'Hơi ngại lúc đầu nhưng làm xong rất sướng',
  'Căn phòng thơm và thoáng hơn hẳn',
  'Giải tỏa hoàn toàn cơn nhức mắt vì màn hình',
  'Thấy Sài Gòn thật dễ thương',
  'Bình an và muốn ngủ một giấc thật ngon'
];

export const CompleteModal: React.FC<CompleteModalProps> = ({
  milestone,
  isOpen,
  onClose,
  onSave
}) => {
  const [feeling, setFeeling] = useState('');
  const [wantRedo, setWantRedo] = useState<boolean>(true);
  const [energyEffect, setEnergyEffect] = useState<'+pin' | '-pin'>('+pin');
  const [guiltFree, setGuiltFree] = useState<boolean>(true);

  // Allow closing with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !milestone) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      milestone.id, 
      feeling || 'Đã hoàn thành 10 phút!', 
      wantRedo, 
      milestone,
      energyEffect,
      guiltFree
    );
    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-neutral-900 border border-neutral-700/80 rounded-3xl text-neutral-200 shadow-2xl my-auto max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Sticky Header with prominent Back / Exit button */}
          <div className="p-4 sm:px-6 sm:py-4 bg-neutral-950/95 border-b border-neutral-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-neutral-700 transition-colors shadow-sm cursor-pointer"
                title="Quay lại màn hình chính (hoặc bấm Esc)"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400" />
                <span>Quay Lại (Thoát Ra)</span>
              </button>
              
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                  #{milestone.id}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-medium">
                  {milestone.cost || '0đ'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-medium hidden md:inline">
                Nhật Ký 4 Cột
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
                title="Đóng (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Header / Milestone Info */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl shrink-0 mt-0.5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap sm:hidden mb-1">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                    #{milestone.id}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-medium">
                    {milestone.cost || '0đ'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  Đã làm xong việc 10 phút!
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Lưu lại 1 dòng cảm xúc để tối ngủ nhẹ lòng.
                </p>
              </div>
            </div>

            {/* Nhiệm vụ vừa làm */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-1.5">
              <div>
                <strong className="text-white block mb-0.5">Nhiệm vụ vừa làm:</strong>
                <span className="text-neutral-300 leading-relaxed">{milestone.title}</span>
              </div>
              {milestone.isDualTicket && (
                <div className="p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 font-medium leading-relaxed flex items-start gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Vé Kép:</strong> {milestone.dualTicketNote || 'Vừa xả hơi vừa tiến bộ học/làm việc'}</span>
                </div>
              )}
              {milestone.immediateBenefit && (
                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-medium leading-relaxed flex items-start gap-1.5">
                  <span>🎁</span>
                  <span><strong>Đã nhận được NGAY:</strong> {milestone.immediateBenefit}</span>
                </div>
              )}
            </div>

            {/* Cột 3: Cảm giác sau khi làm */}
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Cảm giác sau khi làm (Cột 3)</span>
              </label>
              <textarea
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                placeholder="Ví dụ: Thấy đầu óc nhẹ nhõm, bớt suy nghĩ luẩn quẩn..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 leading-relaxed"
                autoFocus
              />

              {/* Quick suggestions */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {QUICK_FEELINGS.map((item, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setFeeling(item)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer border border-neutral-700/50"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Cột 4: Muốn làm lại không? */}
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-400 mb-2 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Muốn làm lại không? (Cột 4)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setWantRedo(true)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    wantRedo === true
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Có (Rất cuốn)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWantRedo(false)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    wantRedo === false
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>Không (Trải nghiệm 1 lần)</span>
                </button>
              </div>
            </div>

            {/* 5 PHANH KIỂM ĐỊNH: ĐO PIN & TỘI LỖI */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Kiểm định 5 Đèn Ổn Định (Đo Năng Lượng & Tội Lỗi)</span>
              </div>

              {/* Pin Check (+pin / -pin) */}
              <div>
                <span className="text-xs text-neutral-300 font-medium block mb-1.5">
                  1. Sau khi đi về, bạn thấy khỏe hơn hay mệt hơn lúc nằm trong trọ?
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEnergyEffect('+pin')}
                    className={`py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      energyEffect === '+pin'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <BatteryCharging className="w-4 h-4 text-emerald-400" />
                    <span>🔋 +pin (Khỏe ra, nạp lại)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnergyEffect('-pin')}
                    className={`py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      energyEffect === '-pin'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <BatteryLow className="w-4 h-4 text-rose-400" />
                    <span>🪫 -pin (Mệt hơn, rút pin)</span>
                  </button>
                </div>
              </div>

              {/* Guilt Check (Không / Có) */}
              <div>
                <span className="text-xs text-neutral-300 font-medium block mb-1.5">
                  2. Đi vào khe hở này, bạn có thấy tội lỗi vì "đáng lẽ phải học" không?
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setGuiltFree(true)}
                    className={`py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      guiltFree === true
                        ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-sky-400" />
                    <span>🛡️ Không (Đúng khe rìa)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuiltFree(false)}
                    className={`py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      guiltFree === false
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>⚠️ Có (Lấn vào giờ sâu)</span>
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Sticky Footer: Always visible on any screen height */}
          <div className="p-4 sm:px-6 bg-neutral-950/95 border-t border-neutral-800 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700/60"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Hủy / Quay Lại</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                handleSubmit(e as any);
              }}
              className="px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Lưu Vào Sổ & Xong</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

