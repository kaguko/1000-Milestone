import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-neutral-200 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">
                  MILESTONE #{milestone.id}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-semibold">
                  {milestone.cost || '0đ'}
                </span>
                {milestone.hasPeople && (
                  <span className="text-xs px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-semibold flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>Có người</span>
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                Ghi Cảm Giác Vào Nhật Ký 4 Cột
              </h3>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 mb-5 space-y-1.5">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Cột 3: Cảm giác sau khi làm */}
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Cảm giác sau khi làm (Cột 3)
              </label>
              <textarea
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                placeholder="Ví dụ: Thấy đầu óc nhẹ nhõm, bớt suy nghĩ luẩn quẩn..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                autoFocus
              />

              {/* Quick suggestions */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {QUICK_FEELINGS.map((item, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setFeeling(item)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
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
                Muốn làm lại không? (Cột 4)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setWantRedo(true)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
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
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
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
                    className={`py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all ${
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
                    className={`py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all ${
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
                    className={`py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all ${
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
                    className={`py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all ${
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

            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors shadow-lg shadow-amber-500/20"
              >
                Lưu vào Sheet & Nhận Dopamine
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
