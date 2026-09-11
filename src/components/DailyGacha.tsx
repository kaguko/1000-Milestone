import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Dices, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Gift, 
  AlertCircle,
  Share2,
  Check
} from 'lucide-react';
import { Milestone } from '../types';
import { DOMAINS } from '../data/domains';
import { getMilestoneById } from '../data/generatorEngine';
import { sounds } from '../utils/sound';

interface DailyGachaProps {
  currentMilestone: Milestone | null;
  onDrawMilestone: (milestone: Milestone) => void;
  onOpenComplete: (milestone: Milestone) => void;
}

export const DailyGacha: React.FC<DailyGachaProps> = ({
  currentMilestone,
  onDrawMilestone,
  onOpenComplete
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [rollingNumber, setRollingNumber] = useState<number>(currentMilestone?.id || 1);
  const [showRuleHint, setShowRuleHint] = useState(false);
  const [copied, setCopied] = useState(false);

  // 10-Minute Timer state
  const [timeLeft, setTimeLeft] = useState<number>(10 * 60); // 10 mins = 600s
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            sounds.playTimerDone();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(10 * 60);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Dopamine Lottery Roll Simulation
  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    resetTimer();

    const targetId = Math.floor(Math.random() * 1000) + 1;
    let iterations = 0;
    const maxIterations = 24;

    const interval = setInterval(() => {
      iterations++;
      const randomDisplay = Math.floor(Math.random() * 1000) + 1;
      setRollingNumber(randomDisplay);
      sounds.playTick();

      if (iterations >= maxIterations) {
        clearInterval(interval);
        setRollingNumber(targetId);
        setIsRolling(false);
        const selected = getMilestoneById(targetId);
        onDrawMilestone(selected);
        sounds.playReveal();
      }
    }, 60);
  };

  const handleCopyText = () => {
    if (!currentMilestone) return;
    navigator.clipboard.writeText(
      `#Milestone${currentMilestone.id} (10 phút): ${currentMilestone.title}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentDomain = currentMilestone
    ? DOMAINS.find((d) => d.id === currentMilestone.domainId)
    : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner / The Machine Card */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900/90 border border-neutral-800 p-6 sm:p-8 backdrop-blur shadow-2xl">
        {/* Ambient background glow */}
        <div 
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: currentDomain?.color || '#f59e0b' }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hàm =RANDBETWEEN(1, 1000)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bốc Vé Dopamine Hôm Nay
            </h2>
            <p className="text-sm text-neutral-400 max-w-md">
              Luật bất di bất dịch: Bốc trúng vé nào làm nấy trong 10 phút. Não không cần phân vân, không cần tự tìm mục đích!
            </p>
          </div>

          {/* Big Action Button & Rolling Number */}
          <div className="flex flex-col items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRoll}
              disabled={isRolling}
              className={`relative px-8 py-4 rounded-2xl font-bold text-base sm:text-lg flex items-center gap-3 shadow-xl transition-all cursor-pointer ${
                isRolling
                  ? 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-amber-500/25'
              }`}
            >
              <Dices className={`w-6 h-6 ${isRolling ? 'animate-spin' : ''}`} />
              <span>{isRolling ? 'Đang quay vé...' : 'BỐC VÉ 10 PHÚT'}</span>
            </motion.button>

            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span>Mã vé hiện tại:</span>
              <span className="text-amber-400 font-bold bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 text-sm">
                #{String(rollingNumber).padStart(4, '0')} / 1000
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Showcase Card */}
      {currentMilestone && (
        <motion.div
          key={currentMilestone.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 relative overflow-hidden shadow-xl"
        >
          {/* Top category tags */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span 
                className="px-3 py-1 rounded-full text-xs font-semibold border"
                style={{
                  backgroundColor: currentDomain?.accentBg,
                  borderColor: currentDomain?.color,
                  color: currentDomain?.color
                }}
              >
                TẦNG 1: {currentDomain?.name}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                TẦNG 2: {currentMilestone.ticketTypeId} {currentMilestone.ticketTypeName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyText}
                className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center gap-1 transition-colors"
                title="Sao chép tên nhiệm vụ"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
              </button>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-neutral-950 text-neutral-400 border border-neutral-800">
                Vé #{currentMilestone.id}
              </span>
            </div>
          </div>

          {/* Formula Breakdown Tags */}
          <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Box 1: Action */}
            <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>1. Hành Động 10 Phút</span>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">
                {currentMilestone.action}
              </p>
            </div>

            {/* Box 2: Location */}
            <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80">
              <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>2. Ở Đâu (Sài Gòn)</span>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">
                {currentMilestone.location}
              </p>
            </div>

            {/* Box 3: Reward */}
            <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80">
              <div className="flex items-center gap-1.5 text-pink-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                <Gift className="w-3.5 h-3.5" />
                <span>3. Thưởng Biến Đổi</span>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">
                {currentMilestone.reward}
              </p>
            </div>
          </div>

          {/* Full mission sentence */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 text-sm text-neutral-300">
            <span className="text-xs uppercase font-bold text-neutral-500 block mb-1">
              Câu Lệnh Đầy Đủ Của Máy:
            </span>
            <span className="text-white font-medium text-base">
              "{currentMilestone.title}"
            </span>
          </div>

          {/* 10-Minute Countdown Clock & Execution Bar */}
          <div className="mt-6 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Timer controls */}
            <div className="flex items-center gap-3">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-white px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800">
                {formatTimer(timeLeft)}
              </div>

              <button
                onClick={toggleTimer}
                className={`p-3 rounded-xl font-bold flex items-center justify-center transition-colors ${
                  isTimerRunning
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
                title={isTimerRunning ? 'Tạm dừng' : 'Bắt đầu 10 phút'}
              >
                {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              <button
                onClick={resetTimer}
                className="p-3 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
                title="Đặt lại 10:00"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Complete logging button */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => onOpenComplete(currentMilestone)}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  currentMilestone.isCompleted
                    ? 'bg-emerald-600/30 border border-emerald-500 text-emerald-300'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {currentMilestone.isCompleted ? 'Đã ghi nhận vào Sheet' : 'Đã làm xong! Ghi nhật ký'}
                </span>
              </button>

              <button
                onClick={() => setShowRuleHint(!showRuleHint)}
                className="p-3 rounded-xl bg-neutral-800/80 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800"
                title="Luật bốc vé"
              >
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Rule hint tooltip */}
          {showRuleHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200"
            >
              <strong>Nhắc nhở Luật Dopamine:</strong> Mỗi ngày chỉ nên bốc 1 vé duy nhất và làm ngay trong 10 phút. Nếu bạn cứ bốc đi bốc lại để chọn việc mình thích thì não sẽ lại rơi vào bẫy 'phải suy nghĩ và lựa chọn'.
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};
