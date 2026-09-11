import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Coins, 
  BatteryCharging, 
  BatteryLow, 
  Smile, 
  Frown, 
  PauseCircle, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Clock,
  Compass,
  TrendingUp,
  Activity
} from 'lucide-react';
import { SheetRecord, Milestone, MirrorEntry } from '../types';
import { sounds } from '../utils/sound';
import { StressTestLab } from './StressTestLab';

interface StabilityBrakesProps {
  records: SheetRecord[];
  allMilestones: Milestone[];
  mirrorHistory: MirrorEntry[];
  onOpenBrake: () => void;
  onOpenMirror: () => void;
  onNavigateToSchedule: () => void;
  onNavigateToSheet: () => void;
  onNavigateToGachaWithFilter?: (filterType: 'exam' | 'no_money' | 'rain') => void;
  defaultViewMode?: 'brakes' | 'stress_test';
  onUpdateRecord: (
    id: number, 
    feeling: string, 
    wantRedo: boolean | null, 
    energyEffect?: '+pin' | '-pin', 
    guiltFree?: boolean
  ) => void;
}

export const StabilityBrakes: React.FC<StabilityBrakesProps> = ({
  records,
  allMilestones,
  mirrorHistory,
  onOpenBrake,
  onOpenMirror,
  onNavigateToSchedule,
  onNavigateToSheet,
  onNavigateToGachaWithFilter,
  defaultViewMode = 'brakes',
  onUpdateRecord
}) => {
  const [viewMode, setViewMode] = useState<'brakes' | 'stress_test'>(defaultViewMode);
  const [copiedSheet, setCopiedSheet] = useState(false);

  // 1. Phanh Tiền
  const moneyStats = useMemo(() => {
    let totalCost = 0;
    let count0d = 0;
    let count20k = 0;
    let count50k = 0;

    records.forEach(r => {
      const c = r.cost || '0đ';
      if (c === '0đ') {
        count0d++;
      } else if (c === '20k') {
        count20k++;
        totalCost += 20000;
      } else if (c === '50k') {
        count50k++;
        totalCost += 50000;
      }
    });

    const percent0d = records.length > 0 ? Math.round((count0d / records.length) * 100) : 100;
    // Ngưỡng ổn định: Chi phí tuần không quá 50k (hoặc % vé 0đ >= 60%)
    const isGreen = records.length === 0 || totalCost <= 50000 || percent0d >= 60;

    return {
      totalCost,
      count0d,
      count20k,
      count50k,
      percent0d,
      isGreen
    };
  }, [records]);

  // 2. Phanh Năng Lượng (+pin / -pin)
  const energyStats = useMemo(() => {
    let plusPin = 0;
    let minusPin = 0;

    records.forEach(r => {
      if (r.energyEffect === '-pin') {
        minusPin++;
      } else {
        // Mặc định hoặc +pin
        plusPin++;
      }
    });

    const total = records.length;
    const plusPercent = total > 0 ? Math.round((plusPin / total) * 100) : 100;
    // Ngưỡng ổn định: +pin > -pin (>= 70%)
    const isGreen = total === 0 || plusPercent >= 70;
    const isYellow = plusPercent >= 50 && plusPercent < 70;

    return {
      plusPin,
      minusPin,
      plusPercent,
      isGreen,
      isYellow
    };
  }, [records]);

  // 3. Phanh Tội Lỗi (Không tội lỗi vs Có tội lỗi)
  const guiltStats = useMemo(() => {
    let guiltFreeCount = 0;
    let guiltyCount = 0;

    records.forEach(r => {
      if (r.guiltFree === false) {
        guiltyCount++;
      } else {
        // Mặc định là không tội lỗi
        guiltFreeCount++;
      }
    });

    const total = records.length;
    const guiltFreePercent = total > 0 ? Math.round((guiltFreeCount / total) * 100) : 100;
    // Ngưỡng ổn định: >= 80% Không tội lỗi
    const isGreen = total === 0 || guiltFreePercent >= 80;

    return {
      guiltFreeCount,
      guiltyCount,
      guiltFreePercent,
      isGreen
    };
  }, [records]);

  // 4. Phanh Hệ Thống Cho Phép Lười (Đã bấm Hôm Nay Xả ít nhất 1 lần)
  const brakeStats = useMemo(() => {
    const brakeRecords = records.filter(r => r.isBrake === true);
    const count = brakeRecords.length;
    // Ngưỡng ổn định: Đã từng bấm xả ít nhất 1 lần khi mệt
    const isGreen = count >= 1;

    return {
      count,
      isGreen
    };
  }, [records]);

  // 5. Phanh Gương (Sau mỗi 20 vé có ra được 1 manh mối pattern không?)
  const mirrorStats = useMemo(() => {
    const totalDone = records.length;
    const requiredPatterns = Math.floor(totalDone / 20);
    const patternsCount = mirrorHistory.length;

    // Nếu chưa đủ 20 vé: hệ thống đang ủ dữ liệu -> Xanh
    // Nếu >= 20 vé: số pattern phải >= requiredPatterns
    const isGreen = totalDone < 20 ? true : patternsCount >= 1;
    const nextMilestone = (Math.floor(totalDone / 20) + 1) * 20;

    return {
      totalDone,
      requiredPatterns,
      patternsCount,
      isGreen,
      nextMilestone
    };
  }, [records, mirrorHistory]);

  // Tổng hợp số đèn xanh (0 to 5)
  const greenCount = useMemo(() => {
    let count = 0;
    if (moneyStats.isGreen) count++;
    if (energyStats.isGreen) count++;
    if (guiltStats.isGreen) count++;
    if (brakeStats.isGreen) count++;
    if (mirrorStats.isGreen) count++;
    return count;
  }, [moneyStats, energyStats, guiltStats, brakeStats, mirrorStats]);

  const isSystemStable = greenCount === 5;

  // Copy Bảng 5 Đèn kèm Công thức vào Clipboard
  const handleCopySheetFormula = () => {
    const content = [
      'BẢNG KIỂM ĐỊNH 5 ĐÈN ỔN ĐỊNH CHO HỆ THỐNG 1000 VÉ PHÒNG TRỌ SÀI GÒN',
      'Triết lý: Ổn định không phải là làm đều mỗi ngày. Ổn định là khi bạn mệt, hết tiền, bận thi mà hệ thống vẫn không chết.',
      '',
      ['STT', 'Tên Phanh Ổn Định', 'Cách Đo Đạc', 'Công Thức Google Sheet', 'Số Liệu Thực Tế', 'Ngưỡng Ổn Định', 'Trạng Thái Đèn', 'Chẩn Đoán & Sửa Chữa'].join('\t'),
      [
        '1',
        'Ổn Định Tiền (Không sạt nghiệp)',
        'Cộng chi phí các vé tuần qua (0đ/20k/50k)',
        '=SUM(D2:D100)',
        `${moneyStats.totalCost.toLocaleString('vi-VN')} đ (Vé 0đ: ${moneyStats.percent0d}%)`,
        '<= 50.000đ/tuần hoặc >= 60% vé 0đ',
        moneyStats.isGreen ? '🟢 XANH' : '🔴 ĐỎ',
        moneyStats.isGreen ? 'An toàn cho ví phòng trọ' : 'Chuyển sang lọc toàn bộ vé 0đ trong 7 ngày tới'
      ].join('\t'),
      [
        '2',
        'Ổn Định Năng Lượng (Không kiệt sức)',
        'Tỉ lệ vé +pin so với -pin sau khi đi về',
        '=COUNTIF(F2:F100, "+pin") / COUNTA(F2:F100)',
        `+pin: ${energyStats.plusPin} vé | -pin: ${energyStats.minusPin} vé (${energyStats.plusPercent}%)`,
        'Số vé +pin > -pin (>= 70% sạc pin)',
        energyStats.isGreen ? '🟢 XANH' : (energyStats.isYellow ? '🟡 VÀNG' : '🔴 ĐỎ'),
        energyStats.isGreen ? 'Vé đang giúp nạp pin cho giờ học' : 'Vé quá nặng (nắng/xa trọ). Bấm Đột biến sang vé xả cơ tại chỗ'
      ].join('\t'),
      [
        '3',
        'Ổn Định Tội Lỗi (Không dằn vặt)',
        'Tỉ lệ vé "Không tội lỗi" vì đi đúng khe hở',
        '=COUNTIF(G2:G100, "Không") / COUNTA(G2:G100)',
        `Không tội lỗi: ${guiltStats.guiltFreePercent}% (${guiltStats.guiltFreeCount}/${records.length})`,
        '>= 80% Không tội lỗi',
        guiltStats.isGreen ? '🟢 XANH' : '🔴 ĐỎ',
        guiltStats.isGreen ? 'Vé đi đúng 3 khe rìa, không cướp giờ sâu' : 'Bốc vé sai giờ! Dời vé vào 3 khe hở (sau 90p học, lúc ngộp trọ, sau 20h)'
      ].join('\t'),
      [
        '4',
        'Ổn Định Phanh (Cho phép bạn lười)',
        'Số lần bấm "Hôm nay xả" khi mệt/thi cử',
        '=COUNTIF(B2:B100, "*Phanh*")',
        `${brakeStats.count} lần kích hoạt phanh`,
        '>= 1 lần (dám lười, không sợ đứt streak)',
        brakeStats.isGreen ? '🟢 XANH' : '🔴 ĐỎ',
        brakeStats.isGreen ? 'Hệ thống sống được cả khi lười' : 'Bạn đang gồng! Hãy bấm "Hôm Nay Xả" để xả hơi 10 phút không phán xét'
      ].join('\t'),
      [
        '5',
        'Ổn Định Gương (Manh mối mục đích)',
        'Cứ 20 vé có tìm ra 1 pattern dòng chảy không?',
        '=INT(COUNTA(A2:A100) / 20)',
        `${records.length} vé đã làm | ${mirrorStats.patternsCount} pattern đúc kết`,
        'Cứ 20 vé ra 1 pattern (hoặc < 20 vé đang ủ)',
        mirrorStats.isGreen ? '🟢 XANH' : '🔴 ĐỎ',
        mirrorStats.isGreen ? 'Đang tích lũy manh mối tương lai' : 'Mở tab Soi Gương để tìm hoạt động làm bạn quên mất thời gian'
      ].join('\t'),
      '',
      `KẾT LUẬN CHUNG: ${greenCount}/5 ĐÈN XANH -> ${isSystemStable ? '🟢 HỆ THỐNG ỔN ĐỊNH TUYỆT ĐỐI! SẴN SÀNG CHẠY TIẾP LÊN 100 VÉ.' : '🔴 CÓ ĐÈN CẦN SỬA: CHỈ SỬA ĐÚNG ĐÈN ĐỎ, KHÔNG SỬA CẢ 1000 VÉ!'}`
    ].join('\n');

    navigator.clipboard.writeText(content);
    setCopiedSheet(true);
    sounds.playComplete();
    setTimeout(() => setCopiedSheet(false), 3000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Banner: Master Stability Status */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden transition-all ${
        isSystemStable 
          ? 'bg-gradient-to-br from-emerald-950/70 via-neutral-900 to-neutral-950 border-emerald-500/40' 
          : 'bg-gradient-to-br from-amber-950/60 via-neutral-900 to-neutral-950 border-amber-500/40'
      }`}>
        {/* Glow */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isSystemStable ? 'bg-emerald-500' : 'bg-amber-500'
        }`} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border flex items-center gap-1.5 ${
                isSystemStable 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Kiểm Định 5 Phanh Ổn Định • Ở Trọ SG</span>
              </span>
              <span className="text-xs font-mono text-neutral-400">
                {greenCount}/5 Đèn Xanh
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isSystemStable ? (
                <span className="text-emerald-400 flex items-center gap-2">
                  <span>5 Đèn Đều Xanh: Hệ Thống Cực Kỳ Ổn Định!</span>
                </span>
              ) : (
                <span className="text-amber-300 flex items-center gap-2">
                  <span>Đang Có {5 - greenCount} Đèn Cần Hiệu Chỉnh</span>
                </span>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-2xl leading-relaxed">
              <strong>Ổn định không phải là làm đều mỗi ngày.</strong> Ổn định là khi bạn mệt, hết tiền, bận thi mà hệ thống vẫn không chết. 
              {isSystemStable 
                ? ' Cả 5 phanh đều đang bảo vệ bạn hoàn hảo: không sạt nghiệp, không kiệt sức, không tội lỗi, dám lười, và có mục đích. Sẵn sàng mở rộng lên 100 vé!'
                : ' Đừng lo lắng và tuyệt đối không sửa cả 1000 vé! Chỉ cần nhìn đèn nào đỏ và sửa đúng đúng đèn đó.'}
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={handleCopySheetFormula}
              className="px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              title="Sao chép bảng 5 đèn và công thức kiểm tra vào Google Sheet"
            >
              {copiedSheet ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSheet ? 'Đã Copy Bảng Vào Clipboard!' : 'Copy Bảng 5 Đèn Vào Sheet'}</span>
            </button>

            <button
              onClick={onNavigateToSheet}
              className="px-4 py-2.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Xem Dữ Liệu Chi Tiết Trong Sheet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Status mini bar */}
        <div className="mt-6 pt-5 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full shrink-0 ${moneyStats.isGreen ? 'bg-emerald-400 shadow-md shadow-emerald-400/50' : 'bg-rose-500 shadow-md shadow-rose-500/50'}`} />
            <div className="truncate">
              <div className="text-[10px] text-neutral-400 uppercase font-bold">1. Phanh Tiền</div>
              <div className="text-xs font-bold text-white truncate">{moneyStats.isGreen ? 'Xanh' : 'Đỏ (Quá 50k)'}</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full shrink-0 ${energyStats.isGreen ? 'bg-emerald-400 shadow-md shadow-emerald-400/50' : (energyStats.isYellow ? 'bg-amber-400' : 'bg-rose-500')}`} />
            <div className="truncate">
              <div className="text-[10px] text-neutral-400 uppercase font-bold">2. Phanh Pin</div>
              <div className="text-xs font-bold text-white truncate">{energyStats.plusPercent}% sạc pin</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full shrink-0 ${guiltStats.isGreen ? 'bg-emerald-400 shadow-md shadow-emerald-400/50' : 'bg-rose-500'}`} />
            <div className="truncate">
              <div className="text-[10px] text-neutral-400 uppercase font-bold">3. Phanh Tội Lỗi</div>
              <div className="text-xs font-bold text-white truncate">{guiltStats.guiltFreePercent}% An tâm</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full shrink-0 ${brakeStats.isGreen ? 'bg-emerald-400 shadow-md shadow-emerald-400/50' : 'bg-amber-400'}`} />
            <div className="truncate">
              <div className="text-[10px] text-neutral-400 uppercase font-bold">4. Phanh Dám Lười</div>
              <div className="text-xs font-bold text-white truncate">{brakeStats.isGreen ? 'Xanh (Đã xả)' : 'Vàng (Chưa xả)'}</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center gap-2 col-span-2 sm:col-span-1">
            <span className={`w-3 h-3 rounded-full shrink-0 ${mirrorStats.isGreen ? 'bg-emerald-400 shadow-md shadow-emerald-400/50' : 'bg-rose-500'}`} />
            <div className="truncate">
              <div className="text-[10px] text-neutral-400 uppercase font-bold">5. Phanh Gương</div>
              <div className="text-xs font-bold text-white truncate">{mirrorStats.isGreen ? 'Xanh (Có pattern)' : 'Đỏ (Cần soi)'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle: 5 Phanh vs Phòng Lab 3 Bài Test Chịu Tải */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-neutral-900/90 rounded-2xl border border-neutral-800 shadow-lg">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setViewMode('brakes');
              sounds.playTick();
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              viewMode === 'brakes'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>5 Phanh Ổn Định (5 Đèn Xanh)</span>
          </button>

          <button
            onClick={() => {
              setViewMode('stress_test');
              sounds.playTick();
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              viewMode === 'stress_test'
                ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Phòng Lab 3 Bài Test Chịu Tải (Test Người)</span>
          </button>
        </div>

        <div className="text-xs text-neutral-400 font-mono pr-2 hidden sm:block">
          {viewMode === 'brakes' ? 'Đang soi 5 phanh an toàn' : 'Test ngâm 21 ngày • Test tải • 3 Kịch bản SG'}
        </div>
      </div>

      {viewMode === 'stress_test' ? (
        <StressTestLab 
          records={records}
          allMilestones={allMilestones}
          onOpenBrake={onOpenBrake}
          onNavigateToGachaWithFilter={onNavigateToGachaWithFilter}
        />
      ) : (
        <>
          {/* 5 PHANH CHI TIẾT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. ỔN ĐỊNH TIỀN */}
        <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">1. Ổn Định Tiền (Không Sạt Nghiệp)</h3>
                  <span className="text-[11px] text-neutral-400">Ở trọ SG, tiền là thứ làm hệ thống chết nhanh nhất</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono border ${
                moneyStats.isGreen 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {moneyStats.isGreen ? '🟢 XANH' : '🔴 ĐỎ'}
              </span>
            </div>

            <div className="space-y-2.5 my-4 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs">
              <div className="flex justify-between items-center text-neutral-300">
                <span>Tổng chi phí vé đã làm:</span>
                <strong className="text-amber-400 font-mono text-sm">{moneyStats.totalCost.toLocaleString('vi-VN')} đ</strong>
              </div>
              <div className="flex justify-between items-center text-neutral-300">
                <span>Tỉ lệ vé 0 đồng:</span>
                <strong className="text-white font-mono">{moneyStats.percent0d}% ({moneyStats.count0d}/{records.length} vé)</strong>
              </div>
              <div className="flex justify-between items-center text-neutral-400 text-[11px] pt-1 border-t border-neutral-900">
                <span>Ngưỡng ổn định:</span>
                <span>Không quá 15% tiền ăn vặt (&le; 50k/tuần hoặc vé 0đ &ge; 60%)</span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {moneyStats.isGreen ? (
                <span className="text-emerald-300">
                  ✅ <strong>Đạt chuẩn:</strong> Bạn không bị áp lực tài chính. Vé 10 phút không làm bạn phải nhịn bữa cơm nào.
                </span>
              ) : (
                <span className="text-rose-300">
                  ⚠️ <strong>Cảnh báo:</strong> Tổng tiền vé vượt quá ngưỡng an toàn. Hệ thống đang ép bạn chọn giữa "đi vé" và "ăn uống". 
                  <strong> Cách sửa:</strong> Chọn lọc chỉ đi các vé 0đ trong 7 ngày tới!
                </span>
              )}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-500">Sheet: =SUM(D:D)</span>
            <button
              onClick={onNavigateToSheet}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
            >
              Lọc vé 0đ trong Sheet
            </button>
          </div>
        </div>

        {/* 2. ỔN ĐỊNH NĂNG LƯỢNG */}
        <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <BatteryCharging className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">2. Ổn Định Năng Lượng (Không Kiệt Sức)</h3>
                  <span className="text-[11px] text-neutral-400">Vé sinh ra để sạc pin cho giờ học, không phải để rút pin</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono border ${
                energyStats.isGreen 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : (energyStats.isYellow ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40')
              }`}>
                {energyStats.isGreen ? '🟢 XANH' : (energyStats.isYellow ? '🟡 VÀNG' : '🔴 ĐỎ')}
              </span>
            </div>

            <div className="space-y-2.5 my-4 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs">
              <div className="flex justify-between items-center text-neutral-300">
                <span>Số vé Sạc Pin (+pin):</span>
                <strong className="text-emerald-400 font-mono text-sm">{energyStats.plusPin} vé ({energyStats.plusPercent}%)</strong>
              </div>
              <div className="flex justify-between items-center text-neutral-300">
                <span>Số vé Rút Pin (-pin):</span>
                <strong className="text-rose-400 font-mono">{energyStats.minusPin} vé</strong>
              </div>
              <div className="flex justify-between items-center text-neutral-400 text-[11px] pt-1 border-t border-neutral-900">
                <span>Ngưỡng ổn định:</span>
                <span>Số vé +pin phải nhiều hơn -pin (Lý tưởng &ge; 70%)</span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {energyStats.isGreen ? (
                <span className="text-emerald-300">
                  ✅ <strong>Đạt chuẩn:</strong> Sau khi đi vé về, não bạn khỏe hơn lúc nằm trọ đơ người. Sạc pin thành công!
                </span>
              ) : (
                <span className="text-rose-300">
                  ⚠️ <strong>Cảnh báo:</strong> Có nhiều vé làm bạn mệt hơn. Có thể vé quá xa, trời quá nắng.
                  <strong> Cách sửa:</strong> Bấm Đột Biến rác hoặc chọn vé tĩnh (ngồi ngắm cây, giãn cơ ở phòng trọ).
                </span>
              )}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-500">Ghi sau mỗi vé: +pin / -pin</span>
            <span className="text-xs text-neutral-400">Tick trực tiếp khi lưu vé</span>
          </div>
        </div>

        {/* 3. ỔN ĐỊNH TỘI LỖI */}
        <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">3. Ổn Định Tội Lỗi (Không Dằn Vặt)</h3>
                  <span className="text-[11px] text-neutral-400">Tội lỗi là thứ giết dopamine nhanh nhất</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono border ${
                guiltStats.isGreen 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {guiltStats.isGreen ? '🟢 XANH' : '🔴 ĐỎ'}
              </span>
            </div>

            <div className="space-y-2.5 my-4 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs">
              <div className="flex justify-between items-center text-neutral-300">
                <span>Tỉ lệ Không Tội Lỗi:</span>
                <strong className="text-sky-400 font-mono text-sm">{guiltStats.guiltFreePercent}% ({guiltStats.guiltFreeCount} vé)</strong>
              </div>
              <div className="flex justify-between items-center text-neutral-300">
                <span>Số vé cảm thấy Có Tội Lỗi:</span>
                <strong className="text-amber-400 font-mono">{guiltStats.guiltyCount} vé</strong>
              </div>
              <div className="flex justify-between items-center text-neutral-400 text-[11px] pt-1 border-t border-neutral-900">
                <span>Ngưỡng ổn định:</span>
                <span>Ít nhất 80% vé phải hoàn toàn KHÔNG tội lỗi</span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {guiltStats.isGreen ? (
                <span className="text-emerald-300">
                  ✅ <strong>Đạt chuẩn:</strong> Bạn đang đi vé đúng 3 khe rìa. Bạn hiểu rõ vé 10 phút là liều thuốc cứu não chứ không phải trốn học.
                </span>
              ) : (
                <span className="text-rose-300">
                  ⚠️ <strong>Cảnh báo:</strong> Bạn đang thấy tội lỗi vì bốc vé sai giờ, lấn vào Giờ Sâu (3-4 tiếng học sung sức).
                  <strong> Cách sửa:</strong> Khóa chặt Giờ Sâu, chỉ bốc vé vào 3 khe hở (sau 90p học, ngộp trọ, hoặc sau 20h tối).
                </span>
              )}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-500">Mục tiêu: &ge; 80% Không tội lỗi</span>
            <button
              onClick={onNavigateToSchedule}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors flex items-center gap-1"
            >
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Chỉnh Lịch 3 Khe Hở</span>
            </button>
          </div>
        </div>

        {/* 4. ỔN ĐỊNH PHANH */}
        <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
                  <PauseCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">4. Ổn Định Phanh (Cho Phép Bạn Lười)</h3>
                  <span className="text-[11px] text-neutral-400">Hệ thống ổn định là hệ thống sống được cả khi bạn lười</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono border ${
                brakeStats.isGreen 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {brakeStats.isGreen ? '🟢 XANH' : '🟡 CHƯA XẢ'}
              </span>
            </div>

            <div className="space-y-2.5 my-4 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs">
              <div className="flex justify-between items-center text-neutral-300">
                <span>Số lần kích hoạt "Hôm Nay Xả":</span>
                <strong className="text-teal-400 font-mono text-sm">{brakeStats.count} lần</strong>
              </div>
              <div className="flex justify-between items-center text-neutral-300">
                <span>Trạng thái phán xét:</span>
                <strong className="text-white">Không chửi bới, không phạt streak</strong>
              </div>
              <div className="flex justify-between items-center text-neutral-400 text-[11px] pt-1 border-t border-neutral-900">
                <span>Ngưỡng ổn định:</span>
                <span>Phải dám bấm xả ít nhất 1 lần khi mệt (không sợ gãy chuỗi)</span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {brakeStats.isGreen ? (
                <span className="text-emerald-300">
                  ✅ <strong>Đạt chuẩn:</strong> Bạn đã dám bấm xả khi mệt. Hệ thống không tạo ra áp lực vô hình và không bắt bạn gồng mình.
                </span>
              ) : (
                <span className="text-amber-300">
                  ⚠️ <strong>Cảnh báo:</strong> Bạn chưa bao giờ dám bấm xả! Nếu sợ đứt chuỗi mà cắn răng làm, hệ thống đang biến thành áp lực.
                  <strong> Cách sửa:</strong> Hãy bấm nút "Hôm Nay Xả" bên dưới để test phanh khẩn cấp ngay.
                </span>
              )}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-500">Phanh bảo vệ tinh thần</span>
            <button
              onClick={onOpenBrake}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 transition-colors flex items-center gap-1"
            >
              <PauseCircle className="w-3 h-3" />
              <span>Bấm Hôm Nay Xả (Test Phanh)</span>
            </button>
          </div>
        </div>

        {/* 5. ỔN ĐỊNH GƯƠNG */}
        <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between shadow-lg md:col-span-2">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">5. Ổn Định Gương (Manh Mối Mục Đích Từ 20 Vé)</h3>
                  <span className="text-[11px] text-neutral-400">Sau mỗi 20 vé, phải trả lời được: "Vé nào làm mình quên mất thời gian nhất?"</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono border ${
                mirrorStats.isGreen 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {mirrorStats.isGreen ? '🟢 XANH' : '🔴 ĐỎ'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs">
              <div>
                <span className="text-neutral-400 block text-[11px]">Tiến độ tích lũy vé:</span>
                <strong className="text-white font-mono text-sm">{records.length} / {mirrorStats.nextMilestone} vé</strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Số Pattern Đúc Kết Được:</span>
                <strong className="text-purple-400 font-mono text-sm">{mirrorStats.patternsCount} pattern</strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Ngưỡng ổn định:</span>
                <strong className="text-neutral-300">Cứ 20 vé ra 1 manh mối flow</strong>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {mirrorStats.isGreen ? (
                <span className="text-emerald-300">
                  ✅ <strong>Đạt chuẩn:</strong> {records.length < 20 
                    ? `Bạn đã làm ${records.length}/20 vé. Dữ liệu đang tích lũy an toàn, đến vé thứ 20 hệ thống sẽ mở gương soi manh mối.`
                    : `Đã có ${mirrorStats.patternsCount} pattern được đúc kết. Bạn không hề đi lang thang vô bổ mà đang định hình mục đích nhỏ!`
                  }
                </span>
              ) : (
                <span className="text-rose-300">
                  ⚠️ <strong>Cảnh báo:</strong> Bạn đã làm hơn 20 vé nhưng chưa mở note 3 dòng để tìm pattern dòng chảy. Có nguy cơ biến thành đi lang thang.
                  <strong> Cách sửa:</strong> Bấm "Mở Soi Gương 20 Vé" để chọn ra vé làm bạn quên thời gian nhất và rút ra manh mối!
                </span>
              )}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-500">Tránh đi lang thang vô định</span>
            <button
              onClick={onOpenMirror}
              className="text-xs font-semibold px-4 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-bold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mở Soi Gương 20 Vé</span>
            </button>
          </div>
        </div>
      </div>

      {/* BẢNG MÔ PHỎNG GOOGLE SHEET 5 ĐÈN */}
      <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold block mb-1">
              Google Sheet Template • Bảng Kiểm Định Tự Động
            </span>
            <h3 className="text-lg font-bold text-white">
              Bảng 5 Đèn Tự Động Tính Toán Khi Copy Vào Google Sheet
            </h3>
            <p className="text-xs text-neutral-400">
              Bạn chỉ cần tick +pin / -pin mỗi ngày ở 4 cột chính, bảng này trên Sheet sẽ tự động nhảy XANH / ĐỎ!
            </p>
          </div>

          <button
            onClick={handleCopySheetFormula}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
          >
            {copiedSheet ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSheet ? 'Đã Copy Toàn Bộ Bảng!' : 'Copy Bảng & Công Thức'}</span>
          </button>
        </div>

        {/* Simulated Sheet Table */}
        <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-950">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-mono">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Tên Phanh</th>
                <th className="py-3 px-4">Công Thức Google Sheet</th>
                <th className="py-3 px-4">Số Liệu Của Bạn</th>
                <th className="py-3 px-4">Ngưỡng An Toàn</th>
                <th className="py-3 px-4">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 font-mono text-neutral-300">
              <tr className="hover:bg-neutral-900/40">
                <td className="py-2.5 px-4 font-bold">1</td>
                <td className="py-2.5 px-4 font-semibold text-white font-sans">Ổn định Tiền</td>
                <td className="py-2.5 px-4 text-amber-400">=SUM(D:D)</td>
                <td className="py-2.5 px-4 text-white font-bold">{moneyStats.totalCost.toLocaleString('vi-VN')} đ ({moneyStats.percent0d}% 0đ)</td>
                <td className="py-2.5 px-4 text-neutral-400">&le; 50.000đ / tuần</td>
                <td className="py-2.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${moneyStats.isGreen ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                    {moneyStats.isGreen ? '🟢 XANH' : '🔴 ĐỎ'}
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-neutral-900/40">
                <td className="py-2.5 px-4 font-bold">2</td>
                <td className="py-2.5 px-4 font-semibold text-white font-sans">Ổn định Năng lượng</td>
                <td className="py-2.5 px-4 text-amber-400">=COUNTIF(F:F,"+pin")/COUNTA(F:F)</td>
                <td className="py-2.5 px-4 text-white font-bold">{energyStats.plusPercent}% Sạc Pin (+{energyStats.plusPin} / -{energyStats.minusPin})</td>
                <td className="py-2.5 px-4 text-neutral-400">+pin &gt; -pin (&ge; 70%)</td>
                <td className="py-2.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${energyStats.isGreen ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                    {energyStats.isGreen ? '🟢 XANH' : '🔴 ĐỎ'}
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-neutral-900/40">
                <td className="py-2.5 px-4 font-bold">3</td>
                <td className="py-2.5 px-4 font-semibold text-white font-sans">Ổn định Tội lỗi</td>
                <td className="py-2.5 px-4 text-amber-400">=COUNTIF(G:G,"Không")/COUNTA(G:G)</td>
                <td className="py-2.5 px-4 text-white font-bold">{guiltStats.guiltFreePercent}% Không tội lỗi</td>
                <td className="py-2.5 px-4 text-neutral-400">&ge; 80% Không tội lỗi</td>
                <td className="py-2.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${guiltStats.isGreen ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                    {guiltStats.isGreen ? '🟢 XANH' : '🔴 ĐỎ'}
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-neutral-900/40">
                <td className="py-2.5 px-4 font-bold">4</td>
                <td className="py-2.5 px-4 font-semibold text-white font-sans">Ổn định Phanh</td>
                <td className="py-2.5 px-4 text-amber-400">=COUNTIF(B:B,"*Phanh*")</td>
                <td className="py-2.5 px-4 text-white font-bold">{brakeStats.count} lần dám xả</td>
                <td className="py-2.5 px-4 text-neutral-400">&ge; 1 lần (dám lười)</td>
                <td className="py-2.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${brakeStats.isGreen ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                    {brakeStats.isGreen ? '🟢 XANH' : '🟡 CHƯA XẢ'}
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-neutral-900/40">
                <td className="py-2.5 px-4 font-bold">5</td>
                <td className="py-2.5 px-4 font-semibold text-white font-sans">Ổn định Gương</td>
                <td className="py-2.5 px-4 text-amber-400">=INT(COUNTA(A:A)/20)</td>
                <td className="py-2.5 px-4 text-white font-bold">{mirrorStats.patternsCount} pattern ({records.length} vé)</td>
                <td className="py-2.5 px-4 text-neutral-400">Cứ 20 vé ra 1 pattern</td>
                <td className="py-2.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${mirrorStats.isGreen ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                    {mirrorStats.isGreen ? '🟢 XANH' : '🔴 ĐỎ'}
                  </span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-neutral-900 font-bold text-white text-xs border-t border-neutral-800">
                <td colSpan={5} className="py-3 px-4 font-sans">
                  KẾT LUẬN TOÀN HỆ THỐNG: {isSystemStable ? '🟢 5/5 ĐÈN XANH — HỆ THỐNG CỰC KỲ ỔN ĐỊNH' : `🔴 ${5 - greenCount} ĐÈN ĐỎ — CẦN HIỆU CHỈNH ĐÚNG ĐÈN ĐỎ`}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${isSystemStable ? 'bg-emerald-500 text-black' : 'bg-amber-500 text-black'}`}>
                    {isSystemStable ? 'ỔN ĐỊNH' : 'CẦN CHỈNH'}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  )}
</div>
  );
};
