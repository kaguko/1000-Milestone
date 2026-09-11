import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  Zap, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  Briefcase, 
  GraduationCap, 
  Coffee, 
  Moon, 
  Sun, 
  Flame, 
  BookOpen,
  HelpCircle,
  Shuffle
} from 'lucide-react';
import { Milestone, DeepTimeSettings, WeeklySlotAssignment } from '../types';
import { getMilestoneById, getAll1000Milestones } from '../data/generatorEngine';
import { sounds } from '../utils/sound';

interface SlotSchedulerProps {
  completedMilestoneIds: Set<number>;
  onOpenCompleteModal: (milestone: Milestone) => void;
  onOpenWhy: () => void;
}

const DEFAULT_SETTINGS: DeepTimeSettings = {
  deepBlock1Start: '08:30',
  deepBlock1End: '11:30',
  deepBlock2Start: '14:00',
  deepBlock2End: '17:00',
  userField: 'Công việc / Học tập'
};

const PRESETS = [
  {
    name: 'Sinh viên lên lớp',
    desc: 'Sáng lên giảng đường, chiều tự học tại trọ',
    settings: {
      deepBlock1Start: '08:00',
      deepBlock1End: '11:30',
      deepBlock2Start: '14:30',
      deepBlock2End: '17:30',
      userField: 'Đại học / Chuyên ngành'
    }
  },
  {
    name: 'Dân văn phòng / Thực tập',
    desc: 'Giờ hành chính 9h - 18h, tối nghỉ ngơi',
    settings: {
      deepBlock1Start: '09:30',
      deepBlock1End: '12:00',
      deepBlock2Start: '14:30',
      deepBlock2End: '17:30',
      userField: 'Công việc văn phòng'
    }
  },
  {
    name: 'Freelancer / Cày tối',
    desc: 'Chiều làm việc, tối tập trung cao độ',
    settings: {
      deepBlock1Start: '14:00',
      deepBlock1End: '17:00',
      deepBlock2Start: '19:30',
      deepBlock2End: '22:30',
      userField: 'Freelance / Lập trình / Thiết kế'
    }
  },
  {
    name: 'Ôn thi nước rút / Đồ án',
    desc: 'Sáng 3 tiếng, tối 3 tiếng cao độ',
    settings: {
      deepBlock1Start: '08:30',
      deepBlock1End: '11:30',
      deepBlock2Start: '19:00',
      deepBlock2End: '22:00',
      userField: 'Ôn thi chứng chỉ / Đồ án tốt nghiệp'
    }
  }
];

const DAYS_OF_WEEK = [
  { day: 1, name: 'Thứ Hai' },
  { day: 2, name: 'Thứ Ba' },
  { day: 3, name: 'Thứ Tư' },
  { day: 4, name: 'Thứ Năm' },
  { day: 5, name: 'Thứ Sáu' },
  { day: 6, name: 'Thứ Bảy' },
  { day: 7, name: 'Chủ Nhật' }
];

export const SlotScheduler: React.FC<SlotSchedulerProps> = ({
  completedMilestoneIds,
  onOpenCompleteModal,
  onOpenWhy
}) => {
  // Load settings from localStorage
  const [settings, setSettings] = useState<DeepTimeSettings>(() => {
    try {
      const saved = localStorage.getItem('saigon_deep_time_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  });

  // Weekly plan (7 days)
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklySlotAssignment[]>(() => {
    try {
      const saved = localStorage.getItem('saigon_weekly_slot_plan');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return generateDefaultWeek(settings);
  });

  // Save settings
  const handleSaveSettings = (newSettings: DeepTimeSettings) => {
    setSettings(newSettings);
    localStorage.setItem('saigon_deep_time_settings', JSON.stringify(newSettings));
    const newPlan = generateDefaultWeek(newSettings);
    setWeeklyPlan(newPlan);
    localStorage.setItem('saigon_weekly_slot_plan', JSON.stringify(newPlan));
    sounds.playComplete();
  };

  function generateDefaultWeek(st: DeepTimeSettings): WeeklySlotAssignment[] {
    const all = getAll1000Milestones();
    // Deterministically select 7 diverse milestones: 3 dual tickets (vé kép), 4 normal
    const duals = all.filter(m => m.isDualTicket);
    const nonDuals = all.filter(m => !m.isDualTicket);

    const slotTypes: ('khe1' | 'khe2' | 'khe3')[] = [
      'khe1', // T2: Sau block 90p sáng
      'khe2', // T3: Ngộp phòng trọ chiều
      'khe3', // T4: Tối sau 8h diệt lướt TikTok
      'khe1', // T5: Sau block học
      'khe2', // T6: Chiều giải phóng ngột ngạt
      'khe3', // T7: Tối thư giãn Sài Gòn
      'khe3'  // CN: Tối sạc lại pin cho tuần mới
    ];

    return DAYS_OF_WEEK.map((d, index) => {
      const isDualDay = index === 0 || index === 2 || index === 4; // 3 days with dual tickets (~40%)
      const pool = isDualDay ? duals : nonDuals;
      const chosen = pool[(index * 137 + 42) % pool.length];
      const slot = slotTypes[index];

      let suggestedTime = '';
      if (slot === 'khe1') {
        suggestedTime = `${st.deepBlock1End} (Ngay sau Giờ Sâu 1)`;
      } else if (slot === 'khe2') {
        suggestedTime = '17:15 (Lúc ngột ngạt phòng trọ)';
      } else {
        suggestedTime = '20:30 (Thay thế 1h lướt TikTok tối)';
      }

      return {
        dayOfWeek: d.day,
        dayName: d.name,
        milestoneId: chosen.id,
        slotType: slot,
        suggestedTime
      };
    });
  }

  const handleShuffleTicket = (dayIndex: number) => {
    sounds.playTick();
    const all = getAll1000Milestones();
    const current = weeklyPlan[dayIndex];
    const randomSeed = Math.floor(Math.random() * 1000) + 1;
    const newMilestone = all[randomSeed % all.length];

    const updated = [...weeklyPlan];
    updated[dayIndex] = {
      ...current,
      milestoneId: newMilestone.id
    };
    setWeeklyPlan(updated);
    localStorage.setItem('saigon_weekly_slot_plan', JSON.stringify(updated));
  };

  const handleRegenerateAll = () => {
    sounds.playReveal();
    const newPlan = generateDefaultWeek(settings);
    setWeeklyPlan(newPlan);
    localStorage.setItem('saigon_weekly_slot_plan', JSON.stringify(newPlan));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Banner: Core Law & Philosophy */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Luật 90-10 & Luật Khe Hở</span>
            </div>

            <button
              onClick={onOpenWhy}
              className="text-xs text-neutral-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Đọc sâu 3 WHY câu lo trễ việc</span>
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug mb-3">
            Bảo Vệ Giờ Học Sâu — Nhét Vé Vào 3 Khe Hở
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-3xl mb-6">
            <strong className="text-amber-400">Thời gian ở trọ không phải một cục.</strong> Bạn có <strong className="text-white">Giờ Sâu</strong> (não còn pin, học 1 tiếng vô 1 tiếng) và <strong className="text-white">Giờ Rìa</strong> (não hết pin, dù không đi cũng nằm lướt TikTok hoặc lo sợ tương lai). Vé 10 phút <strong className="text-emerald-400 underline decoration-emerald-400/50">chỉ được đặt vào Giờ Rìa để cứu giờ lướt vô thức</strong>, tuyệt đối cấm đụng vào Giờ Sâu!
          </p>

          {/* 3 Core Rules Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wide mb-1">
                <Flame className="w-4 h-4" />
                <span>1. LUẬT 90-10</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                1 ngày có 10 đồng pin: <strong>9 đồng cho học/làm việc</strong>, chỉ <strong>1 đồng (tối đa 2 vé = 20 phút)</strong> cho vé. Không bao giờ đủ để làm trễ việc gì.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wide mb-1">
                <Clock className="w-4 h-4" />
                <span>2. LUẬT KHE HỞ</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Chỉ đi vào <strong>3 khe hở</strong>: Vừa xong block 90p não đơ • Đang ngộp trọ lo tương lai • Tối sau 8h thay giờ lướt TikTok.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800">
              <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wide mb-1">
                <Zap className="w-4 h-4" />
                <span>3. LUẬT VÉ KÉP (30%)</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                30% vé là <strong>Vé Kép</strong>: vừa ra ngoài hóng gió vừa để ý tựa sách ngành / quan sát nghề nghiệp. <strong>Não tính là có học, hết sạch tội lỗi!</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Part 1: Configure Your 2 Deep Time Blocks */}
      <div className="p-6 sm:p-7 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Bước 1: Khai Báo 2 Khung Giờ Sâu Của Bạn</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Cài đặt 2 khung giờ bạn cần sự tập trung cao độ nhất
            </h3>
          </div>

          <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
            🛡️ Vùng cấm bốc vé để bảo vệ năng lượng
          </span>
        </div>

        {/* Presets buttons */}
        <div>
          <span className="text-xs text-neutral-400 font-medium block mb-2">
            Chọn nhanh lịch sinh hoạt tương đồng:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESETS.map((p, idx) => {
              const isSelected = 
                settings.deepBlock1Start === p.settings.deepBlock1Start &&
                settings.deepBlock2Start === p.settings.deepBlock2Start;
              return (
                <button
                  key={idx}
                  onClick={() => handleSaveSettings(p.settings)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected 
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300' 
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-bold text-xs text-white mb-0.5">{p.name}</div>
                  <div className="text-[11px] text-neutral-400 line-clamp-1">{p.desc}</div>
                  <div className="mt-2 text-[10px] font-mono text-neutral-500 flex items-center gap-2">
                    <span>{p.settings.deepBlock1Start}-{p.settings.deepBlock1End}</span>
                    <span>•</span>
                    <span>{p.settings.deepBlock2Start}-{p.settings.deepBlock2End}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800/80">
          {/* Deep Block 1 */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-sky-400">
              <Sun className="w-4 h-4" />
              <span>Khung Giờ Sâu 1 (Sáng / Đầu ngày)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Bắt đầu</label>
                <input
                  type="time"
                  value={settings.deepBlock1Start}
                  onChange={(e) => handleSaveSettings({ ...settings, deepBlock1Start: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Kết thúc</label>
                <input
                  type="time"
                  value={settings.deepBlock1End}
                  onChange={(e) => handleSaveSettings({ ...settings, deepBlock1End: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <p className="text-[11px] text-neutral-400">
              👉 Sau {settings.deepBlock1End} là <strong className="text-sky-300">Khe Hở 1 (Xả đơ não)</strong>: Đi 10 phút hóng gió để não hồi phục.
            </p>
          </div>

          {/* Deep Block 2 */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
              <Moon className="w-4 h-4" />
              <span>Khung Giờ Sâu 2 (Chiều / Tối)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Bắt đầu</label>
                <input
                  type="time"
                  value={settings.deepBlock2Start}
                  onChange={(e) => handleSaveSettings({ ...settings, deepBlock2Start: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Kết thúc</label>
                <input
                  type="time"
                  value={settings.deepBlock2End}
                  onChange={(e) => handleSaveSettings({ ...settings, deepBlock2End: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <p className="text-[11px] text-neutral-400">
              👉 Sau {settings.deepBlock2End} là <strong className="text-amber-300">Khe Hở 3 (Sau 8h tối)</strong>: Cứu 1 tiếng lướt TikTok bằng 10 phút tản bộ.
            </p>
          </div>
        </div>

        {/* 24H Timeline Strip Visualization */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-400 mb-2">
            <span>BẢN ĐỒ BẢO VỆ 24 GIỜ:</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-rose-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/80" /> Giờ Sâu (CẤM BỐC VÉ)
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80" /> 3 Khe Hở An Toàn
              </span>
            </div>
          </div>

          <div className="relative h-9 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden flex text-[10px] font-mono">
            {/* 0h - 8h ngủ */}
            <div className="w-[30%] bg-neutral-950 flex items-center justify-center text-neutral-600 border-r border-neutral-800">
              Ngủ / Nạp Pin
            </div>
            {/* Block 1 Giờ Sâu */}
            <div className="w-[18%] bg-rose-950/60 border-r border-rose-500/30 flex items-center justify-center text-rose-300 font-bold">
              Giờ Sâu 1
            </div>
            {/* Khe 1 */}
            <div className="w-[7%] bg-emerald-950/70 border-r border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold animate-pulse">
              Khe 1
            </div>
            {/* Ăn trưa / Giờ Sâu 2 */}
            <div className="w-[20%] bg-rose-950/60 border-r border-rose-500/30 flex items-center justify-center text-rose-300 font-bold">
              Giờ Sâu 2
            </div>
            {/* Khe 2 */}
            <div className="w-[7%] bg-purple-950/70 border-r border-purple-500/40 flex items-center justify-center text-purple-300 font-bold">
              Khe 2
            </div>
            {/* Khe 3 (Tối) */}
            <div className="w-[18%] bg-amber-950/70 flex items-center justify-center text-amber-300 font-bold">
              Khe 3 (Tối)
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: 7-Day Weekly Allocation in the 3 Edge Slots */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>Bước 2: Lịch Phân Bổ 7 Vé Tuần Này Vào Đúng 3 Khe Hở</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              7 Vé Đã Định Vị Vào Thời Gian Rìa — Không Đụng 1 Phút Giờ Học
            </h3>
          </div>

          <button
            onClick={handleRegenerateAll}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Phân Bổ Lại Tuần Này</span>
          </button>
        </div>

        {/* 7 Days Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weeklyPlan.map((item, index) => {
            const milestone = getMilestoneById(item.milestoneId);
            const isCompleted = completedMilestoneIds.has(milestone.id);

            // Slot badge text and styling
            let slotBadge = {
              title: 'KHE 1: VỪA XONG BLOCK 90P',
              sub: 'Xả đơ não, hồi phục dopamine',
              color: 'text-sky-300 bg-sky-950/50 border-sky-500/30'
            };
            if (item.slotType === 'khe2') {
              slotBadge = {
                title: 'KHE 2: ĐANG NGỘP PHÒNG TRỌ',
                sub: 'Cắt cơn hoảng loạn tương lai',
                color: 'text-purple-300 bg-purple-950/50 border-purple-500/30'
              };
            } else if (item.slotType === 'khe3') {
              slotBadge = {
                title: 'KHE 3: SAU 8H TỐI',
                sub: 'Thay thế 1h lướt TikTok vô thức',
                color: 'text-amber-300 bg-amber-950/50 border-amber-500/30'
              };
            }

            return (
              <motion.div
                key={item.dayOfWeek}
                layout
                className={`p-5 rounded-3xl border transition-all ${
                  isCompleted 
                    ? 'bg-neutral-950/60 border-emerald-500/40 opacity-80' 
                    : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700 shadow-lg'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-bold text-white font-mono">
                      {item.dayName}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-wider ${slotBadge.color}`}>
                      {slotBadge.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleShuffleTicket(index)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                      title="Đổi vé khác cho ngày này"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Đã làm
                      </span>
                    ) : (
                      <button
                        onClick={() => onOpenCompleteModal(milestone)}
                        className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-sm"
                      >
                        Làm vé này
                      </button>
                    )}
                  </div>
                </div>

                {/* Timing Suggestion */}
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-3 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Khung giờ nên đi: <strong className="text-neutral-200">{item.suggestedTime}</strong></span>
                </div>

                {/* Dual Ticket Badge if applicable */}
                {milestone.isDualTicket && (
                  <div className="mb-3 p-2.5 rounded-xl bg-gradient-to-r from-sky-950/50 via-indigo-950/50 to-purple-950/50 border border-indigo-500/30">
                    <div className="flex items-center gap-1.5 text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                      <Zap className="w-3.5 h-3.5 text-indigo-400" />
                      <span>⚡ VÉ KÉP: VỪA XẢ HƠI VỪA TIẾN BỘ NGHỀ NGHIỆP</span>
                    </div>
                    <p className="text-xs text-indigo-200/90 leading-relaxed font-medium">
                      💡 {milestone.dualTicketNote}
                    </p>
                  </div>
                )}

                {/* Ticket Details */}
                <div className="space-y-2">
                  <div className="text-sm font-bold text-white leading-relaxed">
                    #{milestone.id}: {milestone.title}
                  </div>

                  {/* Immediate Benefit */}
                  <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs leading-relaxed">
                    🎁 <strong>Làm xong được ngay:</strong> {milestone.immediateBenefit || milestone.reward}
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-400">
                    <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-amber-300 font-mono">
                      {milestone.cost}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">
                      {milestone.hasPeople ? '👥 Có người' : '🧘 Một mình'}
                    </span>
                    <span className="text-neutral-500">
                      • {slotBadge.sub}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
