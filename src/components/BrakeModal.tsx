import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Coffee, 
  Wind, 
  Heart, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Moon,
  Sparkles
} from 'lucide-react';
import { Milestone } from '../types';
import { BRAKE_TICKETS } from '../data/generatorEngine';
import { sounds } from '../utils/sound';

interface BrakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteBrake: (milestone: Milestone, feeling: string) => void;
}

export const BrakeModal: React.FC<BrakeModalProps> = ({
  isOpen,
  onClose,
  onCompleteBrake
}) => {
  const [ticketIndex, setTicketIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [feeling, setFeeling] = useState('Đầu óc nhẹ hẳn, tự tha thứ cho bản thân vì đã mệt mỏi.');
  const [completed, setCompleted] = useState(false);

  const currentBrakeTemplate = BRAKE_TICKETS[ticketIndex % BRAKE_TICKETS.length];

  const currentBrakeMilestone: Milestone = {
    ...currentBrakeTemplate,
    id: 9990 + (ticketIndex % BRAKE_TICKETS.length),
    isCompleted: false
  };

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      sounds.playComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleComplete = () => {
    onCompleteBrake(currentBrakeMilestone, feeling);
    setCompleted(true);
    sounds.playComplete();
    setTimeout(() => {
      setCompleted(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl bg-neutral-900 border border-teal-500/30 rounded-3xl p-6 sm:p-7 text-neutral-200 shadow-2xl shadow-teal-500/10 my-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="p-3 bg-teal-500/15 border border-teal-500/30 text-teal-400 rounded-2xl">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 text-[11px] font-mono mb-1 border border-teal-500/20">
                <Moon className="w-3 h-3" />
                <span>Hệ Thống Phanh • Hợp Pháp Nghỉ Ngơi</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Hôm Nay Cho Phép Mình Xả Hơi
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                "Hệ thống không có phanh thì não sẽ tự đạp đổ hệ thống."
              </p>
            </div>
          </div>

          {/* Philosophy Banner */}
          <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/20 text-xs text-teal-200 mb-5 leading-relaxed flex items-start gap-2.5">
            <Heart className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <strong>Bạn không cần phải đi đâu hôm nay.</strong> Ở trọ có những ngày mưa dầm, người rã rời hoặc túi cạn tiền. Đây là vé được hệ thống cấp phép để bạn ở yên 10 phút mà không có bất kỳ sự dằn vặt nào.
            </div>
          </div>

          {/* Brake Ticket Card */}
          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 mb-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-teal-400 font-bold">
                Vé Phanh Khẩn Cấp #{ticketIndex + 1}
              </span>
              <button
                onClick={() => {
                  setTicketIndex((prev) => prev + 1);
                  sounds.playTick();
                }}
                className="text-[11px] text-neutral-400 hover:text-white underline"
              >
                Đổi vé xả khác
              </button>
            </div>

            <div className="text-sm sm:text-base font-semibold text-white leading-relaxed">
              {currentBrakeMilestone.action}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="text-sky-400">📍</span>
                <span>{currentBrakeMilestone.location}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="text-teal-400">🛡️ Chi phí:</span>
                <span className="font-mono font-bold text-teal-300">0đ (Không tốn 1 xu)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-teal-300/90 italic">
              🎁 Thưởng: {currentBrakeMilestone.reward}
            </div>
          </div>

          {/* 10-Minute Relaxation Timer */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center gap-3 mb-5">
            <div className="text-xs text-neutral-400 font-mono uppercase tracking-widest flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>Thời Gian Nằm Thở / Nghỉ Ngơi</span>
            </div>

            <div className="text-4xl sm:text-5xl font-mono font-black text-teal-300 tracking-wider">
              {formattedTime}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => {
                  setIsRunning(!isRunning);
                  sounds.playTick();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isRunning
                    ? 'bg-amber-500 text-black hover:bg-amber-400'
                    : 'bg-teal-500 text-black hover:bg-teal-400 shadow-md shadow-teal-500/20'
                }`}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-black" />}
                <span>{isRunning ? 'Tạm Dừng' : 'Bắt Đầu 10 Phút Nghỉ'}</span>
              </button>

              <button
                onClick={() => {
                  setIsRunning(false);
                  setTimeLeft(600);
                  sounds.playTick();
                }}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800"
                title="Đặt lại 10 phút"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Reflection input */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Cảm giác sau 10 phút nghỉ ngơi:
            </label>
            <input
              type="text"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-teal-500"
              placeholder="Ghi lại cảm giác..."
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
            >
              Đóng
            </button>

            <button
              onClick={handleComplete}
              disabled={completed}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all"
            >
              {completed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã Hoàn Thành Nghỉ Ngơi!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Đã Nghỉ Xong (Lưu Vào Sheet)</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
