import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Heart, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { Milestone } from '../types';

interface CompleteModalProps {
  milestone: Milestone | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, feeling: string, wantRedo: boolean) => void;
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

  if (!isOpen || !milestone) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(milestone.id, feeling || 'Đã hoàn thành 10 phút!', wantRedo);
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
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">
                MILESTONE #{milestone.id}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Ghi Cảm Giác Vào Nhật Ký 4 Cột
              </h3>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 mb-5">
            <strong className="text-white block mb-1">Nhiệm vụ vừa làm:</strong>
            {milestone.title}
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
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
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
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                    wantRedo === false
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>Không (Trải nghiệm 1 lần là đủ)</span>
                </button>
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
