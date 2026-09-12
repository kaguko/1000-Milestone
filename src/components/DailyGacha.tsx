import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Check,
  ShieldAlert,
  Coins,
  Users,
  Trash2,
  Compass,
  AlertTriangle,
  RefreshCw,
  Heart,
  ShieldCheck,
  ArrowRight,
  Zap,
  BookOpen,
  Wallet,
  CloudRain,
  TrendingUp,
  X
} from 'lucide-react';
import { Milestone, MilestoneCost, SheetRecord } from '../types';
import { DOMAINS } from '../data/domains';
import { getMilestoneById, getAll1000Milestones } from '../data/generatorEngine';
import { sounds } from '../utils/sound';

interface DailyGachaProps {
  currentMilestone: Milestone | null;
  onDrawMilestone: (milestone: Milestone) => void;
  onOpenComplete: (milestone: Milestone) => void;
  onOpenBrake: () => void;
  onOpenMirror: () => void;
  onMutateMilestone: (milestone: Milestone) => void;
  records: SheetRecord[];
  onNavigateToSchedule?: () => void;
  onNavigateToStability?: () => void;
  extremeFilter?: 'normal' | 'exam' | 'no_money' | 'rain';
  onSetExtremeFilter?: (f: 'normal' | 'exam' | 'no_money' | 'rain') => void;
  isSimpleMode?: boolean;
  onOpenBeginnerGuide?: () => void;
}

export const DailyGacha: React.FC<DailyGachaProps> = ({
  currentMilestone,
  onDrawMilestone,
  onOpenComplete,
  onOpenBrake,
  onOpenMirror,
  onMutateMilestone,
  records,
  onNavigateToSchedule,
  onNavigateToStability,
  extremeFilter = 'normal',
  onSetExtremeFilter,
  isSimpleMode = false,
  onOpenBeginnerGuide
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [rollingNumber, setRollingNumber] = useState<number>(currentMilestone?.id || 1);
  const [showRuleHint, setShowRuleHint] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTrashConfirm, setShowTrashConfirm] = useState(false);

  // 5 Brakes Count
  const greenLightsCount = useMemo(() => {
    let count = 0;
    // 1. Tiền
    const totalCost = records.reduce((sum, r) => {
      if (r.cost === '20k') return sum + 20000;
      if (r.cost === '50k') return sum + 50000;
      return sum;
    }, 0);
    const count0d = records.filter(r => (r.cost || '0đ') === '0đ').length;
    const p0d = records.length > 0 ? (count0d / records.length) : 1;
    if (records.length === 0 || totalCost <= 50000 || p0d >= 0.6) count++;

    // 2. Pin
    const plusPin = records.filter(r => r.energyEffect !== '-pin').length;
    const pPin = records.length > 0 ? (plusPin / records.length) : 1;
    if (records.length === 0 || pPin >= 0.7) count++;

    // 3. Tội lỗi
    const guiltFree = records.filter(r => r.guiltFree !== false).length;
    const pGuilt = records.length > 0 ? (guiltFree / records.length) : 1;
    if (records.length === 0 || pGuilt >= 0.8) count++;

    // 4. Phanh
    const hasBrake = records.some(r => r.isBrake);
    if (hasBrake) count++;

    // 5. Gương
    count++; // Khi mới bắt đầu hoặc có mirror

    return count;
  }, [records]);

  // Budget & Filter preferences for Gacha
  const [costFilter, setCostFilter] = useState<'all' | '0đ' | '20k' | '50k'>('all');
  const [peopleFilter, setPeopleFilter] = useState<boolean>(false);

  // Calculate completed tickets today for 90-10 rule (Max 2 tickets/day)
  const todayCompletedCount = useMemo(() => {
    return records.filter(r => r.completedAt.includes('Hôm nay')).length;
  }, [records]);

  // 10-Minute Timer state
  const [timeLeft, setTimeLeft] = useState<number>(10 * 60); // 10 mins = 600s
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Calculate 50k tickets used this week
  const fiftyKUsedThisWeek = records.filter(r => r.cost === '50k').length;
  const isBudgetWarning = fiftyKUsedThisWeek >= 2;

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

  // Dopamine Lottery Roll Simulation matching budget & people preferences
  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    resetTimer();

    // Pool of matching IDs
    const all = getAll1000Milestones();
    let candidates = all;

    // Apply Extreme Scenario Testing Filter if active
    if (extremeFilter === 'exam') {
      candidates = candidates.filter(m => (m.cost || '0đ') === '0đ' && (
        m.location?.toLowerCase().includes('trọ') ||
        m.location?.toLowerCase().includes('phòng') ||
        m.location?.toLowerCase().includes('ban công') ||
        m.location?.toLowerCase().includes('cửa sổ') ||
        m.location?.toLowerCase().includes('hẻm')
      ));
    } else if (extremeFilter === 'no_money') {
      candidates = candidates.filter(m => (m.cost || '0đ') === '0đ');
    } else if (extremeFilter === 'rain') {
      candidates = candidates.filter(m => 
        m.location?.toLowerCase().includes('trọ') ||
        m.location?.toLowerCase().includes('phòng') ||
        m.location?.toLowerCase().includes('ban công') ||
        m.location?.toLowerCase().includes('cửa sổ') ||
        m.location?.toLowerCase().includes('hiên') ||
        m.isBrake
      );
    }

    if (costFilter !== 'all' && extremeFilter === 'normal') {
      candidates = candidates.filter(m => m.cost === costFilter);
    }
    if (peopleFilter) {
      candidates = candidates.filter(m => m.hasPeople);
    }

    if (candidates.length === 0) candidates = all;

    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    const targetId = chosen.id;
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
      `#Milestone${currentMilestone.id} (10 phút - ${currentMilestone.cost}): ${currentMilestone.title}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMutate = () => {
    if (!currentMilestone) return;
    onMutateMilestone(currentMilestone);
    setShowTrashConfirm(false);
    sounds.playReveal();
  };

  const currentDomain = currentMilestone
    ? DOMAINS.find((d) => d.id === currentMilestone.domainId)
    : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 5-System Control & Budget Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Phanh: Nút xả */}
        <button
          onClick={onOpenBrake}
          className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/30 hover:bg-teal-900/40 text-left transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                <span>Hôm Nay Mệt? Bấm Nút Xả</span>
              </div>
              <div className="text-[11px] text-teal-400/80">
                Ở yên trong trọ 10 phút, không tội lỗi
              </div>
            </div>
          </div>
        </button>

        {/* 2. Tiền: Ngân sách tuần */}
        <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300">
                Hạn Mức Tuần (Vé 50k)
              </div>
              <div className="text-[11px] text-neutral-400">
                Đã bốc: <strong className="text-amber-400">{fiftyKUsedThisWeek} / 2 vé 50k</strong>
              </div>
            </div>
          </div>
          {isBudgetWarning && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
              Đạt trần 50k
            </span>
          )}
        </div>

        {/* 3. Gương: Manh mối mục đích */}
        <button
          onClick={onOpenMirror}
          className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 hover:bg-indigo-900/40 text-left transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-300">
                Soi Gương Pattern
              </div>
              <div className="text-[11px] text-neutral-400">
                Đã ghi nhận {records.length} dữ liệu thực tế
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* 5 Stability Brakes Quick Check Bar */}
      {onNavigateToStability && (
        <div 
          onClick={onNavigateToStability}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-950 border border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer transition-all flex items-center justify-between group shadow-lg shadow-emerald-950/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>5 Phanh Ổn Định: Hệ Thống Vẫn Sống Dù Mệt & Hết Tiền</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {greenLightsCount}/5 Đèn Xanh
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                Tiền &le; 15% ăn vặt • 7 ngày: +pin &gt; -pin • 80% không tội lỗi • Dám xả 1 lần/tuần • Gương 20 vé
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0 pl-3">
            <span className="hidden sm:inline">Kiểm tra 5 đèn</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Extreme Scenario Active Banner */}
      {extremeFilter !== 'normal' && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-lg transition-all ${
          extremeFilter === 'exam'
            ? 'bg-sky-950/40 border-sky-500/50 text-sky-300'
            : extremeFilter === 'no_money'
            ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
            : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              extremeFilter === 'exam'
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-400'
                : extremeFilter === 'no_money'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
            }`}>
              {extremeFilter === 'exam' && <BookOpen className="w-5 h-5" />}
              {extremeFilter === 'no_money' && <Wallet className="w-5 h-5" />}
              {extremeFilter === 'rain' && <CloudRain className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>
                  {extremeFilter === 'exam' && 'ĐANG BẬT BÀI TEST 3 (KỊCH BẢN A): TUẦN THI / DEADLINE DÍ'}
                  {extremeFilter === 'no_money' && 'ĐANG BẬT BÀI TEST 3 (KỊCH BẢN B): TUẦN HẾT TIỀN (0Đ)'}
                  {extremeFilter === 'rain' && 'ĐANG BẬT BÀI TEST 3 (KỊCH BẢN C): TUẦN MƯA SG'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-900 border border-neutral-700 text-white">
                  ĐANG ÉP TẢI
                </span>
              </div>
              <div className="text-[11px] text-neutral-300 mt-0.5">
                {extremeFilter === 'exam' && 'Đã khoá vé đi xa. Bốc Gacha chỉ ra vé 0đ trong hẻm hoặc phòng trọ để không cướp giờ học.'}
                {extremeFilter === 'no_money' && 'Đã khoá vé 20k/50k. Chỉ bốc vé 0đ để hệ thống không gãy vì viêm màng túi.'}
                {extremeFilter === 'rain' && 'Trời mưa không ra ngoài được. Chỉ ra vé ngắm mưa trong trọ/ban công hoặc phanh xả.'}
              </div>
            </div>
          </div>

          <button
            onClick={() => onSetExtremeFilter && onSetExtremeFilter('normal')}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-semibold flex items-center gap-1 shrink-0"
            title="Tắt chế độ test để quay lại bốc vé bình thường"
          >
            <X className="w-3.5 h-3.5" />
            <span>Tắt Test</span>
          </button>
        </div>
      )}

      {/* Beginner Welcome Banner: Foolproof & Clear */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-black flex items-center justify-center font-black text-lg shrink-0 shadow-md shadow-amber-500/30">
            1-2-3
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black text-white">
                Dành cho bạn mới hoặc không rành công nghệ:
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Chỉ cần 3 bước mộc mạc
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
              <strong>Bước 1:</strong> Bấm nút cam <em>[BỐC VÉ 10 PHÚT]</em> &rarr; <strong>Bước 2:</strong> Cất điện thoại, đi làm việc đó 10 phút ngoài đời &rarr; <strong>Bước 3:</strong> Về bấm nút xanh <em>[ĐÃ LÀM XONG]</em>. (Nếu hôm nay mệt quá thì bấm <em>[Phanh Xả]</em> nghỉ ngơi).
            </p>
          </div>
        </div>

        {onOpenBeginnerGuide && (
          <button
            onClick={onOpenBeginnerGuide}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <span>👉 Xem hướng dẫn 30s</span>
          </button>
        )}
      </div>

      {/* Mindset Banner */}
      <div className="px-4 py-2.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
        <span className="italic">
          💡 "Chỉ cần 10 phút — dù chỉ đi mua ly nước mía rồi về, tối đó bạn ngủ đỡ lo hơn những hôm nằm cả ngày."
        </span>
        <span className="hidden sm:inline text-[11px] text-amber-400/90 font-medium">
          Không phải để hết lười, mà là để đỡ lo.
        </span>
      </div>

      {/* 90-10 Rule & Energy Status Banner */}
      {!isSimpleMode && (
        <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  Luật 90-10: 9 Đồng Cho Học/Làm — 1 Đồng Cho Vé
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Đã dùng {todayCompletedCount}/2 vé hôm nay
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                1 ngày tối đa 2 vé (20 phút) nhét vào 3 khe hở. Không bao giờ làm trễ giờ học sâu.
              </p>
            </div>
          </div>

          {onNavigateToSchedule && (
            <button
              onClick={onNavigateToSchedule}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Phân Bổ 3 Khe Hở</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Top Banner / The Machine Card */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900/90 border border-neutral-800 p-6 sm:p-8 backdrop-blur shadow-2xl">
        {/* Ambient background glow */}
        <div 
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: currentDomain?.color || '#f59e0b' }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSimpleMode ? 'Hũ Bốc Thăm May Mắn 10 Phút' : 'Hàm =RANDBETWEEN(1, 1000)'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isSimpleMode ? 'Rút Thăm Việc Nhỏ Hôm Nay' : 'Bốc Vé Dopamine Hôm Nay'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md leading-relaxed">
              {isSimpleMode 
                ? 'Bấm nút bốc vé bên cạnh. Máy chọn việc gì làm nấy đúng 10 phút. Không thích thì bấm bốc lại!' 
                : 'Luật bất di bất dịch: Bốc trúng vé nào làm nấy trong 10 phút. Não không cần phân vân, không sợ phí tiền vì có bộ lọc ngân sách!'}
            </p>

            {/* Budget & People Filter bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <div className="text-xs text-neutral-400 font-semibold mr-1">Túi tiền:</div>
              <button
                onClick={() => setCostFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  costFilter === 'all'
                    ? 'bg-white text-black font-bold'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                Mọi ví
              </button>
              <button
                onClick={() => setCostFilter('0đ')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  costFilter === '0đ'
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                🪙 0đ (Cuối tháng)
              </button>
              <button
                onClick={() => setCostFilter('20k')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  costFilter === '20k'
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                🧃 20k (Tiền lẻ)
              </button>
              <button
                onClick={() => setCostFilter('50k')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  costFilter === '50k'
                    ? 'bg-purple-500 text-white font-bold'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                🍲 50k (Đại gia)
              </button>

              <button
                onClick={() => setPeopleFilter(!peopleFilter)}
                className={`ml-1 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  peopleFilter
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Chống cô đơn (Có người)</span>
              </button>
            </div>
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
          key={currentMilestone.id + (currentMilestone.isMutated ? '-mutated' : '')}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 relative overflow-hidden shadow-xl"
        >
          {/* Top category tags & 5-System badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-neutral-800">
            <div className="flex flex-wrap items-center gap-2">
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
              
              {/* Cost Badge */}
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                currentMilestone.cost === '0đ'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : currentMilestone.cost === '20k'
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : 'bg-purple-500/15 border-purple-500/30 text-purple-400'
              }`}>
                🪙 Chi phí: {currentMilestone.cost}
              </span>

              {/* People Badge */}
              {currentMilestone.hasPeople && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-pink-500/15 border border-pink-500/30 text-pink-300 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>👥 Có Người / Chống Cô Đơn</span>
                </span>
              )}

              {/* Mutated / Evolutionary Badge */}
              {currentMilestone.isMutated && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-sky-500/15 border border-sky-500/30 text-sky-300 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  <span>Đã Tự Tiến Hóa</span>
                </span>
              )}

              {currentMilestone.isBrake && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-teal-500/15 border border-teal-500/30 text-teal-300">
                  🛑 Vé Phanh Khẩn Cấp
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Hệ thống Dọn Rác: Mutate button */}
              <button
                onClick={() => setShowTrashConfirm(true)}
                className="px-2.5 py-1 text-xs text-neutral-400 hover:text-rose-400 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center gap-1 transition-colors border border-transparent hover:border-rose-500/30"
                title="Vé này chán? Bấm để đẻ vé mới thay thế"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vé này chán? Đổi vé</span>
              </button>

              <button
                onClick={handleCopyText}
                className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center gap-1 transition-colors"
                title="Sao chép tên nhiệm vụ"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
              </button>

              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-neutral-950 text-neutral-400 border border-neutral-800">
                #{currentMilestone.id}
              </span>
            </div>
          </div>

          {/* Confirm Dialog for Mutating/Trashing */}
          {showTrashConfirm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="my-3 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  <strong>Hệ Thống Dọn Rác:</strong> Vứt vé này vào sọt rác và lập tức đẻ ra 1 vé mới toanh thay thế vào vị trí #{currentMilestone.id}?
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTrashConfirm(false)}
                  className="px-3 py-1 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
                >
                  Giữ lại
                </button>
                <button
                  onClick={handleMutate}
                  className="px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold"
                >
                  Đẻ vé mới ngay!
                </button>
              </div>
            </motion.div>
          )}

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

          {/* LÀM XONG ĐƯỢC GÌ NGAY (Phần thưởng tức thì để não không tính lỗ) */}
          <div className="my-4 p-4 sm:p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 relative overflow-hidden">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Làm xong ĐƯỢC GÌ NGAY trong 10 phút tới? (Não thấy LỜI mới chịu đi)</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-emerald-200 leading-relaxed">
              👉 {currentMilestone.immediateBenefit || currentMilestone.reward}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-emerald-400/90 font-medium">
              <span className="px-2 py-0.5 rounded-md bg-emerald-900/40 border border-emerald-500/20">
                🪙 Chi phí: {currentMilestone.cost} (an toàn ngân sách)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-900/40 border border-emerald-500/20">
                🛡️ Không sợ bị chê rảnh (có máy bốc vé che chắn)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-900/40 border border-emerald-500/20">
                🌙 Tối ngủ hết cảm giác tội lỗi
              </span>
            </div>
          </div>

          {/* VÉ KÉP (DUAL-PURPOSE TICKET) - 30% HỆ THỐNG */}
          {currentMilestone.isDualTicket && (
            <div className="my-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-sky-950/40 border border-indigo-500/40 relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  <span>⚡ Vé Kép: Vừa Xả Hơi Vừa Tiến Bộ Học / Làm</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Luật Vé Kép (30%)
                </span>
              </div>
              <p className="text-sm font-semibold text-indigo-100 leading-relaxed">
                💡 {currentMilestone.dualTicketNote}
              </p>
              <div className="mt-2 text-[11px] text-indigo-300/80">
                ✨ <em>Bộ não ghi nhận đây là hoạt động tích cực cho tương lai — hết sạch 100% cảm giác tội lỗi vì "đi lang thang"!</em>
              </div>
            </div>
          )}

          {/* GỢI Ý 3 KHE HỞ AN TOÀN (LUẬT KHE HỞ) */}
          <div className="my-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0 font-mono text-sm font-bold">
                {currentMilestone.slotRecommendation === 'khe1' ? '⚡ K1' : currentMilestone.slotRecommendation === 'khe2' ? '💨 K2' : '🌙 K3'}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>
                    {currentMilestone.slotRecommendation === 'khe1' 
                      ? 'Nên đi ở Khe Hở 1: Ngay sau khi xong block 90 phút (Xả đơ não)'
                      : currentMilestone.slotRecommendation === 'khe2'
                      ? 'Nên đi ở Khe Hở 2: Lúc đang ngộp phòng trọ lo tương lai (Cắt hoảng loạn)'
                      : 'Nên đi ở Khe Hở 3: Buổi tối sau 8h (Thay thế 1h lướt TikTok vô thức)'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  🛡️ Tuyệt đối không đi vào Giờ Sâu (3-4 tiếng não sung sức). Đặt vé vào giờ rìa để bảo toàn năng lượng.
                </p>
              </div>
            </div>

            {onNavigateToSchedule && (
              <button
                onClick={onNavigateToSchedule}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 flex items-center gap-1.5 transition-colors shrink-0"
              >
                <span>Xem lịch tuần</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
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
              <strong>Nhắc nhở Luật 5 Hệ Thống:</strong>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li><strong>Phanh:</strong> Hôm nào mệt mỏi cứ bấm nút Xả, không việc gì phải gượng ép.</li>
                <li><strong>Tiền:</strong> Giữ luật tối đa 2 vé 50k/tuần để bảo vệ tài chính ở trọ.</li>
                <li><strong>Người:</strong> Bốc vé có người để chống cô đơn và làm quen với nhịp sống thành phố.</li>
                <li><strong>Rác:</strong> Vé nào chán bấm ngay nút đổi vé để danh sách tự tiến hóa!</li>
              </ul>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};
