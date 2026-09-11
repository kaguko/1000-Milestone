import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  BatteryCharging, 
  BatteryLow, 
  Coins, 
  CloudRain, 
  BookOpen, 
  Wallet, 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  ArrowRight,
  TrendingUp,
  Zap,
  Coffee,
  Clock
} from 'lucide-react';
import { SoakTestDayRecord, LoadTestDayRecord, Milestone, SheetRecord } from '../types';
import { sounds } from '../utils/sound';

interface StressTestLabProps {
  records: SheetRecord[];
  allMilestones: Milestone[];
  onOpenBrake: () => void;
  onNavigateToGachaWithFilter?: (filterType: 'exam' | 'no_money' | 'rain') => void;
}

const STORAGE_KEY_SOAK = 'sg1000_soak_test_records_v1';
const STORAGE_KEY_LOAD = 'sg1000_load_test_records_v1';

export const StressTestLab: React.FC<StressTestLabProps> = ({
  records,
  allMilestones,
  onOpenBrake,
  onNavigateToGachaWithFilter
}) => {
  const [activeTestTab, setActiveTestTab] = useState<'soak' | 'load' | 'extreme' | 'template'>('soak');
  const [copiedSheet, setCopiedSheet] = useState(false);
  const [copiedFormulas, setCopiedFormulas] = useState(false);

  // ==========================================
  // BÀI 1: TEST NGÂM 21 NGÀY (Soak Test)
  // ==========================================
  const [soakRecords, setSoakRecords] = useState<SoakTestDayRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOAK);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    // Khởi tạo 21 ngày rỗng
    return Array.from({ length: 21 }, (_, i) => ({
      day: i + 1,
      cost: (i === 0 ? '0đ' : '') as '0đ' | '20k' | '50k' | '',
      pin: (i === 0 ? '+pin' : '') as '+pin' | '-pin' | '',
      guilt: (i === 0 ? 'Không' : '') as 'Không' | 'Có' | '',
      wantRedoTomorrow: (i === 0 ? 'Có' : '') as 'Có' | 'Không' | '',
      usedBrake: false,
      milestoneTitle: ''
    }));
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SOAK, JSON.stringify(soakRecords));
    } catch {
      // ignore
    }
  }, [soakRecords]);

  // Phân tích điều kiện FAIL Bài 1
  const soakAnalysis = useMemo(() => {
    let fail1 = false; // 3 ngày liên tiếp "-pin"
    let fail1Consecutive = 0;
    let maxMinusPinConsecutive = 0;

    let fail2 = false; // 3 ngày liên tiếp "Có tội lỗi"
    let fail2Consecutive = 0;
    let maxGuiltConsecutive = 0;

    let brakeUsedCount = 0;
    let completedDaysCount = 0;

    for (let i = 0; i < soakRecords.length; i++) {
      const r = soakRecords[i];
      const isFilled = r.cost !== '' && r.pin !== '' && r.guilt !== '' && r.wantRedoTomorrow !== '';
      if (isFilled) {
        completedDaysCount++;
      }

      if (r.usedBrake) {
        brakeUsedCount++;
      }

      // Check Pin
      if (r.pin === '-pin') {
        fail1Consecutive++;
        if (fail1Consecutive > maxMinusPinConsecutive) maxMinusPinConsecutive = fail1Consecutive;
        if (fail1Consecutive >= 3) fail1 = true;
      } else if (r.pin === '+pin') {
        fail1Consecutive = 0;
      }

      // Check Guilt
      if (r.guilt === 'Có') {
        fail2Consecutive++;
        if (fail2Consecutive > maxGuiltConsecutive) maxGuiltConsecutive = fail2Consecutive;
        if (fail2Consecutive >= 3) fail2 = true;
      } else if (r.guilt === 'Không') {
        fail2Consecutive = 0;
      }
    }

    // Fail 3: Khi đã hoàn thành cả 21 ngày mà không dùng phanh lần nào
    const fail3 = completedDaysCount >= 21 && brakeUsedCount === 0;

    const hasAnyFail = fail1 || fail2 || fail3;
    const isPass = completedDaysCount >= 21 && !hasAnyFail;

    return {
      completedDaysCount,
      brakeUsedCount,
      fail1,
      maxMinusPinConsecutive,
      fail2,
      maxGuiltConsecutive,
      fail3,
      hasAnyFail,
      isPass
    };
  }, [soakRecords]);

  const updateSoakDay = (
    dayIndex: number, 
    field: keyof SoakTestDayRecord, 
    value: any
  ) => {
    setSoakRecords(prev => {
      const next = [...prev];
      next[dayIndex] = {
        ...next[dayIndex],
        [field]: value
      };
      return next;
    });
    sounds.playTick();
  };

  const handleFillSampleSoak = () => {
    // Mẫu 21 ngày thực tế lành mạnh ở trọ SG
    const sample: SoakTestDayRecord[] = [
      { day: 1, cost: '0đ', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Uống 1 cốc nước ấm ban công nhìn trời' },
      { day: 2, cost: '0đ', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Đi bộ ra đầu hẻm mua bánh mì' },
      { day: 3, cost: '20k', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Cà phê vỉa hè nghe tiếng còi xe' },
      { day: 4, cost: '0đ', pin: '-pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Leo 5 tầng cầu thang trọ' },
      { day: 5, cost: '0đ', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Đứng góc cua hẻm ngửi mùi hoa sữa' },
      { day: 6, cost: '0đ', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: true, milestoneTitle: 'Ở yên trong trọ 10 phút không làm gì (PHANH XẢ)' },
      { day: 7, cost: '20k', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Mua 1 que kem ngồi xem xe buýt' },
      { day: 8, cost: '0đ', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Xem bà bán bún riêu xắt đậu hũ' },
      { day: 9, cost: '0đ', pin: '-pin', guilt: 'Có', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Đi bộ trưa nắng gắt' },
      { day: 10, cost: '0đ', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Nhặt 1 chiếc lá bàng rơi' },
      { day: 11, cost: '0đ', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Nghe tiếng ve sầu công viên' },
      { day: 12, cost: '20k', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Trà đá nói chuyện chú xe ôm' },
      { day: 13, cost: '0đ', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: true, milestoneTitle: 'Nằm thở nhìn trần nhà trọ (PHANH XẢ)' },
      { day: 14, cost: '0đ', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Chụp hình vệt nắng xiên hẻm' },
      { day: 15, cost: '0đ', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Đứng cầu vượt nhìn dòng xe' },
      { day: 16, cost: '0đ', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Xem tiệm hớt tóc bấm kéo' },
      { day: 17, cost: '20k', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Ăn bịch bánh tráng trộn 10k' },
      { day: 18, cost: '0đ', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Vuốt ve con mèo tam thể đầu hẻm' },
      { day: 19, cost: '0đ', pin: '-pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Chạy vội trời đổ mưa' },
      { day: 20, cost: '0đ', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Ngồi hiên nhà trú mưa nghe sấm' },
      { day: 21, cost: '0đ', pin: '+pin', guilt: 'Không', wantRedoTomorrow: 'Có', usedBrake: false, milestoneTitle: 'Nhìn lại 21 ngày trọ thân thương' },
    ];
    setSoakRecords(sample);
    sounds.playComplete();
  };

  const handleResetSoak = () => {
    const empty: SoakTestDayRecord[] = Array.from({ length: 21 }, (_, i) => ({
      day: i + 1,
      cost: '',
      pin: '',
      guilt: '',
      wantRedoTomorrow: '',
      usedBrake: false,
      milestoneTitle: ''
    }));
    setSoakRecords(empty);
    sounds.playTick();
  };

  // ==========================================
  // BÀI 2: TEST TẢI (Load Test - 1 Tuần)
  // ==========================================
  const defaultLoadRecords: LoadTestDayRecord[] = [
    { dayId: 't2', dayName: 'Thứ 2', loadTier: 'Nhẹ (1 vé)', targetTickets: 1, actualTickets: 1, costTotal: 0, wantRedoTomorrow: 'Có' },
    { dayId: 't3', dayName: 'Thứ 3', loadTier: 'Nhẹ (1 vé)', targetTickets: 1, actualTickets: 1, costTotal: 20000, wantRedoTomorrow: 'Có' },
    { dayId: 't4', dayName: 'Thứ 4', loadTier: 'Trung bình (2 vé)', targetTickets: 2, actualTickets: 2, costTotal: 20000, wantRedoTomorrow: 'Có' },
    { dayId: 't5', dayName: 'Thứ 5', loadTier: 'Trung bình (2 vé)', targetTickets: 2, actualTickets: 2, costTotal: 20000, wantRedoTomorrow: 'Có' },
    { dayId: 't6', dayName: 'Thứ 6', loadTier: 'Nặng (3 vé)', targetTickets: 3, actualTickets: 3, costTotal: 40000, wantRedoTomorrow: 'Có' },
    { dayId: 't7', dayName: 'Thứ 7', loadTier: 'Nặng (3 vé)', targetTickets: 3, actualTickets: 3, costTotal: 20000, wantRedoTomorrow: 'Không' },
  ];

  const [loadRecords, setLoadRecords] = useState<LoadTestDayRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOAD);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return defaultLoadRecords;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOAD, JSON.stringify(loadRecords));
    } catch {
      // ignore
    }
  }, [loadRecords]);

  const updateLoadDay = (index: number, field: keyof LoadTestDayRecord, val: any) => {
    setLoadRecords(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
    sounds.playTick();
  };

  // Phân tích sức chịu tải tối đa Bài 2
  const loadAnalysis = useMemo(() => {
    const totalWeeklyCost = loadRecords.reduce((sum, r) => sum + (r.costTotal || 0), 0);
    
    // Check mức 2 vé (Thứ 4, Thứ 5)
    const t4 = loadRecords[2];
    const t5 = loadRecords[3];
    const failAt2Tickets = (t4?.wantRedoTomorrow === 'Không' && t5?.wantRedoTomorrow === 'Không');

    // Check mức 3 vé (Thứ 6, Thứ 7)
    const t6 = loadRecords[4];
    const t7 = loadRecords[5];
    const failAt3Tickets = (t6?.wantRedoTomorrow === 'Không' && t7?.wantRedoTomorrow === 'Không');
    const moneyBrokenAt3 = totalWeeklyCost > 50000;

    let maxSafeCapacity = '1 vé / ngày';
    let diagnosis = 'Sức chịu tải an toàn: 1 vé / ngày. Đây là con số vàng giúp bạn đi được 3 năm an toàn mà không bao giờ cháy!';
    let badgeColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';

    if (failAt2Tickets) {
      maxSafeCapacity = '1 vé / ngày';
      diagnosis = 'GÃY Ở MỨC 2 VÉ: Bạn trả lời "Không muốn làm tiếp" 2 ngày liên tiếp ở mức 2 vé/ngày. Con số chịu tải tối đa của bạn chính xác là 1 vé/ngày. Tuyệt đối đừng cố gồng 2 vé!';
      badgeColor = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    } else if (moneyBrokenAt3) {
      maxSafeCapacity = '2 vé / ngày (bị gãy vì tiền ở mức 3 vé)';
      diagnosis = `GÃY VÌ TIỀN Ở MỨC 3 VÉ: Tổng tiền tuần (${totalWeeklyCost.toLocaleString('vi-VN')}đ) vượt quá 15% ăn vặt (50k). Bạn gãy vì ngân sách chứ không phải vì lười! Cần lọc chặt vé 0đ nếu muốn nâng số vé.`;
      badgeColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    } else if (failAt3Tickets) {
      maxSafeCapacity = '2 vé / ngày';
      diagnosis = 'GÃY Ở MỨC 3 VÉ: Mức 3 vé/ngày làm bạn kiệt sức. Sức chịu tải hoàn hảo của bạn là 2 vé/ngày (1 vé buổi trưa, 1 vé chiều muộn).';
      badgeColor = 'text-sky-400 border-sky-500/30 bg-sky-500/10';
    } else {
      maxSafeCapacity = '2 - 3 vé / ngày (Sức tải cao)';
      diagnosis = 'BẠN ĐẠT SỨC CHỊU TẢI XUẤT SẮC: Vẫn giữ được năng lượng và ngân sách an toàn ở cả 3 mức tải!';
      badgeColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    }

    return {
      totalWeeklyCost,
      failAt2Tickets,
      failAt3Tickets,
      moneyBrokenAt3,
      maxSafeCapacity,
      diagnosis,
      badgeColor
    };
  }, [loadRecords]);

  // ==========================================
  // BÀI 3: TEST KHẮC NGHIỆT (3 Kịch bản SG)
  // ==========================================
  const extremeStats = useMemo(() => {
    const total0dTickets = allMilestones.filter(m => (m.cost || '0đ') === '0đ').length;
    const percent0d = Math.round((total0dTickets / allMilestones.length) * 100);
    const roomTickets = allMilestones.filter(m => 
      m.location?.toLowerCase().includes('trọ') || 
      m.location?.toLowerCase().includes('phòng') ||
      m.location?.toLowerCase().includes('ban công') ||
      m.location?.toLowerCase().includes('cửa sổ') ||
      m.location?.toLowerCase().includes('hẻm')
    ).length;

    return {
      total0dTickets,
      percent0d,
      roomTickets
    };
  }, [allMilestones]);

  // ==========================================
  // EXPORT SHEETS / COPY TEMPLATE
  // ==========================================
  const generateGoogleSheetsTemplateTSV = () => {
    let tsv = '';

    // Sheet 1: Test Ngâm 21 Ngày
    tsv += '=== BÀI 1: TEST NGÂM - TEST ỔN ĐỊNH 21 NGÀY (1 VÉ / NGÀY) ===\n';
    tsv += 'Ngày\tVé 10 Phút\tTiền (0đ/20k/50k)\tPin (+pin/-pin)\tTội Lỗi (Không/Có)\tMuốn Làm Tiếp? (Có/Không)\tPhanh Xả?\tTrạng Thái Fail\n';
    soakRecords.forEach(r => {
      tsv += `Ngày ${r.day}\t${r.milestoneTitle || 'Vé 10 phút'}\t${r.cost || '0đ'}\t${r.pin || '+pin'}\t${r.guilt || 'Không'}\t${r.wantRedoTomorrow || 'Có'}\t${r.usedBrake ? 'CÓ (XẢ)' : 'Không'}\t=IF(AND(D${r.day+2}="-pin",D${r.day+1}="-pin",D${r.day}="-pin"),"FAIL 1: 3 NGÀY -PIN",IF(AND(E${r.day+2}="Có",E${r.day+1}="Có",E${r.day}="Có"),"FAIL 2: 3 NGÀY TỘI LỖI","OK"))\n`;
    });

    tsv += '\n=== CÔNG THỨC KIỂM TRA BÀI 1 TỰ ĐỘNG BÁO FAIL TRONG GOOGLE SHEET ===\n';
    tsv += 'Tiêu chí FAIL\tCông thức Google Sheet\tÝ nghĩa\n';
    tsv += 'FAIL 1: 3 ngày liên tiếp -pin\t=IF(MAX(FREQUENCY(IF(D3:D23="-pin",ROW(D3:D23)),IF(D3:D23<>"-pin",ROW(D3:D23))))>=3,"🔴 FAIL 1: Vé quá nặng","🟢 PASS")\tBáo đỏ khi vé rút pin 3 ngày liền\n';
    tsv += 'FAIL 2: 3 ngày liên tiếp tội lỗi\t=IF(MAX(FREQUENCY(IF(E3:E23="Có",ROW(E3:E23)),IF(E3:E23<>"Có",ROW(E3:E23))))>=3,"🔴 FAIL 2: Cướp giờ học","🟢 PASS")\tBáo đỏ khi vé cướp giờ học 3 ngày liền\n';
    tsv += 'FAIL 3: Không dám phanh xả\t=IF(COUNTIF(G3:G23,"*CÓ*")=0,"🔴 FAIL 3: Không có phanh an toàn","🟢 PASS")\tBáo đỏ nếu 21 ngày không xả lần nào\n';

    tsv += '\n\n=== BÀI 2: TEST TẢI - TĂNG SỐ VÉ LÊN TRONG 1 TUẦN ===\n';
    tsv += 'Thứ\tMức Tải\tSố Vé Mục Tiêu\tSố Vé Thực Tế\tTổng Tiền (VNĐ)\tNgày Mai Còn Muốn Bốc? (Có/Không)\tĐiểm Gãy Chịu Tải\n';
    loadRecords.forEach(r => {
      tsv += `${r.dayName}\t${r.loadTier}\t${r.targetTickets}\t${r.actualTickets}\t${r.costTotal}\t${r.wantRedoTomorrow}\t=IF(F${tsv.split('\n').length}="Không","⚠️ CẢNH BÁO QUÁ TẢI","🟢 AN TOÀN")\n`;
    });

    tsv += '\n=== CÔNG THỨC XÁC ĐỊNH SỨC TẢI TỐI ĐA TRONG SHEET ===\n';
    tsv += 'Sức chịu tải tối đa\t=IF(AND(F5="Không",F6="Không"),"1 VÉ / NGÀY (Max)",IF(SUM(E3:E8)>50000,"GÃY VÌ TIỀN (>50k)",IF(AND(F7="Không",F8="Không"),"2 VÉ / NGÀY","3 VÉ / NGÀY")))\n';

    tsv += '\n\n=== BÀI 3: TEST 3 KỊCH BẢN KHẮC NGHIỆT Ở TRỌ SÀI GÒN ===\n';
    tsv += 'Kịch bản\tCách Test Trong Sheet\tTiêu chí PASS\tKết quả kho vé hiện tại\n';
    tsv += 'A. Tuần Thi / Deadline\tSet filter: Chỉ vé 0đ & vé trong hẻm/trọ\tBốc 7 ngày không thấy tội lỗi\tCó ' + extremeStats.roomTickets + ' vé hẻm/trọ\n';
    tsv += 'B. Tuần Hết Tiền\tSet filter: 100% vé 0đ\tCòn vé 0đ để bốc cả tuần\tCó ' + extremeStats.total0dTickets + ' vé 0đ (' + extremeStats.percent0d + '% kho)\n';
    tsv += 'C. Tuần Mưa SG\tVé trong nhà trọ & Phanh xả 10 phút\tMưa không bị ép ra đường\tPhanh Xả Sẵn Sàng 100%\n';

    return tsv;
  };

  const handleCopySheetTemplate = () => {
    const tsv = generateGoogleSheetsTemplateTSV();
    navigator.clipboard.writeText(tsv).then(() => {
      setCopiedSheet(true);
      sounds.playReveal();
      setTimeout(() => setCopiedSheet(false), 2500);
    });
  };

  const handleDownloadCSV = () => {
    const tsv = generateGoogleSheetsTemplateTSV();
    const blob = new Blob([tsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'SG1000_3_Stress_Tests_Stability_Load.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    sounds.playComplete();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top Banner: Mindset Test Ổn Định & Chịu Tải */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">
                    Thực Chiến Người Dùng
                  </span>
                  <span className="text-xs text-neutral-400">Không phải test app — Test chính bạn</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                  Phòng Lab Test Ổn Định & Chịu Tải (3 Bài Test)
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySheetTemplate}
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-700/80"
                title="Sao chép toàn bộ bảng test 3 bài vào Clipboard để dán thẳng vào Google Sheets"
              >
                {copiedSheet ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-neutral-400" />}
                <span>{copiedSheet ? 'Đã Copy Sheet Test' : 'Copy Sheet Test'}</span>
              </button>

              <button
                onClick={handleDownloadCSV}
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-700/80"
                title="Tải file CSV Sheet test mẫu"
              >
                <Download className="w-4 h-4 text-neutral-400" />
                <span className="hidden sm:inline">Tải CSV</span>
              </button>
            </div>
          </div>

          {/* 2 Định nghĩa vàng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-neutral-800/80">
            <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white uppercase text-[11px] tracking-wide text-sky-300">
                  Ổn Định = Sống Sót Qua 21 Ngày Liên Tiếp
                </div>
                <div className="text-neutral-400 mt-1 leading-relaxed">
                  Chạy đúng 1 vé/ngày trong 21 ngày mà không làm bạn bỏ cuộc dù gặp mưa, hết tiền, kẹt xe hay bận thi ở trọ Sài Gòn.
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white uppercase text-[11px] tracking-wide text-amber-300">
                  Chịu Tải = Tìm Ra Điểm Gãy Khi Tăng Vé
                </div>
                <div className="text-neutral-400 mt-1 leading-relaxed">
                  Tăng dần từ 1 vé &rarr; 2 vé &rarr; 3 vé/ngày để xem bạn gãy vì mệt hay gãy vì tiền. Biết chính xác sức tải an toàn của mình.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation cho 3 bài test + sheet template */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-neutral-800">
        <button
          onClick={() => {
            setActiveTestTab('soak');
            sounds.playTick();
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTestTab === 'soak'
              ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-400/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Bài 1: Test Ngâm 21 Ngày</span>
          {soakAnalysis.hasAnyFail && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
          {soakAnalysis.isPass && (
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
          )}
        </button>

        <button
          onClick={() => {
            setActiveTestTab('load');
            sounds.playTick();
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTestTab === 'load'
              ? 'bg-amber-400 text-black font-bold shadow-md shadow-amber-400/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Bài 2: Test Tải (1 &rarr; 3 Vé)</span>
        </button>

        <button
          onClick={() => {
            setActiveTestTab('extreme');
            sounds.playTick();
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTestTab === 'extreme'
              ? 'bg-sky-400 text-black font-bold shadow-md shadow-sky-400/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <CloudRain className="w-4 h-4" />
          <span>Bài 3: Mưa, Thi, Hết Tiền</span>
        </button>

        <button
          onClick={() => {
            setActiveTestTab('template');
            sounds.playTick();
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTestTab === 'template'
              ? 'bg-purple-400 text-black font-bold shadow-md shadow-purple-400/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Mẫu Sheet & Công Thức Tự Động</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* BÀI 1: TEST NGÂM 21 NGÀY                                  */}
      {/* ========================================================= */}
      {activeTestTab === 'soak' && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Status Bar / Diagnosis */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            soakAnalysis.hasAnyFail 
              ? 'bg-rose-950/30 border-rose-500/50 text-rose-300' 
              : soakAnalysis.isPass
              ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
              : 'bg-neutral-900/90 border-neutral-800 text-neutral-300'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {soakAnalysis.hasAnyFail ? (
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                ) : soakAnalysis.isPass ? (
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>
                      {soakAnalysis.hasAnyFail
                        ? 'PHÁT HIỆN ĐIỂM GÃY ỔN ĐỊNH'
                        : soakAnalysis.isPass
                        ? '🟢 HỆ THỐNG ĐÃ PASS BÀI 1: ỔN ĐỊNH 21 NGÀY'
                        : `Đang Test Ngâm: Đã điền ${soakAnalysis.completedDaysCount}/21 ngày`}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                      Phanh xả: {soakAnalysis.brakeUsedCount} lần
                    </span>
                  </div>
                  <div className="text-xs mt-1 text-neutral-400">
                    {soakAnalysis.fail1 && (
                      <span className="text-rose-400 font-semibold block">
                        • FAIL 1: Có 3 ngày liên tiếp ghi "-pin" &rarr; Vé quá nặng, bạn đang kiệt sức!
                      </span>
                    )}
                    {soakAnalysis.fail2 && (
                      <span className="text-rose-400 font-semibold block">
                        • FAIL 2: Có 3 ngày liên tiếp ghi "Có tội lỗi" &rarr; Vé đang cướp giờ học / việc làm!
                      </span>
                    )}
                    {soakAnalysis.fail3 && (
                      <span className="text-rose-400 font-semibold block">
                        • FAIL 3: 21 ngày không bấm nút "Hôm nay xả" lần nào &rarr; Hệ thống đang tạo áp lực, thiếu phanh an toàn!
                      </span>
                    )}
                    {!soakAnalysis.hasAnyFail && !soakAnalysis.isPass && (
                      <span>Quy tắc: Đúng 1 vé/ngày, không làm 2 vé cho nhanh. Mỗi ngày tick 4 chỉ số bên dưới.</span>
                    )}
                    {soakAnalysis.isPass && (
                      <span className="text-emerald-300">
                        Tuyệt vời! Hệ thống sống sót trọn vẹn qua đời sống thật ở Sài Gòn mà không dính bất kỳ điểm gãy nào. Đủ điều kiện sang Bài 2!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleFillSampleSoak}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1 border border-neutral-700"
                  title="Điền dữ liệu mẫu 21 ngày thực tế ở SG để xem cơ chế báo FAIL"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Điền Mẫu 21 Ngày</span>
                </button>

                <button
                  onClick={handleResetSoak}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 text-xs font-semibold flex items-center gap-1 border border-neutral-700"
                  title="Xoá làm lại từ đầu"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quy chuẩn 3 Điều Kiện FAIL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className={`p-3.5 rounded-2xl border text-xs transition-colors ${
              soakAnalysis.fail1 ? 'bg-rose-950/40 border-rose-500/60' : 'bg-neutral-900/60 border-neutral-800'
            }`}>
              <div className="flex items-center gap-2 font-bold text-white mb-1">
                <BatteryLow className={`w-4 h-4 ${soakAnalysis.fail1 ? 'text-rose-400' : 'text-amber-400'}`} />
                <span>FAIL 1: 3 Ngày Liên Tiếp -pin</span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Chuỗi -pin dài nhất: <strong className="text-white">{soakAnalysis.maxMinusPinConsecutive} ngày</strong>. Nếu &ge; 3 ngày tức là vé quá nặng, hệ thống đang làm bạn hao pin thay vì sạc pin.
              </p>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs transition-colors ${
              soakAnalysis.fail2 ? 'bg-rose-950/40 border-rose-500/60' : 'bg-neutral-900/60 border-neutral-800'
            }`}>
              <div className="flex items-center gap-2 font-bold text-white mb-1">
                <AlertTriangle className={`w-4 h-4 ${soakAnalysis.fail2 ? 'text-rose-400' : 'text-amber-400'}`} />
                <span>FAIL 2: 3 Ngày Có Tội Lỗi</span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Chuỗi tội lỗi dài nhất: <strong className="text-white">{soakAnalysis.maxGuiltConsecutive} ngày</strong>. Nếu &ge; 3 ngày tức là vé cướp giờ deadline, cần nhét vé vào 3 khe hở 10 phút.
              </p>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs transition-colors ${
              soakAnalysis.fail3 ? 'bg-rose-950/40 border-rose-500/60' : 'bg-neutral-900/60 border-neutral-800'
            }`}>
              <div className="flex items-center gap-2 font-bold text-white mb-1">
                <Coffee className={`w-4 h-4 ${soakAnalysis.fail3 ? 'text-rose-400' : 'text-emerald-400'}`} />
                <span>FAIL 3: Không Có Phanh Xả</span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Đã xả: <strong className="text-white">{soakAnalysis.brakeUsedCount} lần</strong>. 21 ngày mà không dám bấm nút "Hôm nay xả" lần nào tức là bạn đang gồng mình, sớm muộn cũng bỏ cuộc.
              </p>
            </div>
          </div>

          {/* Bảng 21 Ngày Tương Tác Nhanh */}
          <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">Bảng Ghi 4 Số / Ngày (21 Ngày Liên Tiếp)</h2>
                <p className="text-xs text-neutral-400">Bấm trực tiếp vào các ô để đổi trạng thái nhanh. Dữ liệu được lưu tự động.</p>
              </div>
              <button
                onClick={onOpenBrake}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Bấm Nút Xả Hôm Nay</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-neutral-950 text-neutral-400 border-b border-neutral-800 font-mono">
                    <th className="py-3 px-3 w-14 text-center font-bold">Ngày</th>
                    <th className="py-3 px-3 min-w-[200px] font-bold text-neutral-300">Vé Đã Bốc / Hành Động</th>
                    <th className="py-3 px-3 w-28 text-center font-bold text-amber-400">1. Tiền</th>
                    <th className="py-3 px-3 w-28 text-center font-bold text-emerald-400">2. Pin</th>
                    <th className="py-3 px-3 w-28 text-center font-bold text-sky-400">3. Tội Lỗi?</th>
                    <th className="py-3 px-3 w-32 text-center font-bold text-purple-400">4. Mai Làm Tiếp?</th>
                    <th className="py-3 px-3 w-24 text-center font-bold text-neutral-300">Phanh Xả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {soakRecords.map((r, idx) => {
                    const isMinusPinStreak = idx >= 2 && 
                      soakRecords[idx].pin === '-pin' && 
                      soakRecords[idx-1].pin === '-pin' && 
                      soakRecords[idx-2].pin === '-pin';

                    const isGuiltStreak = idx >= 2 && 
                      soakRecords[idx].guilt === 'Có' && 
                      soakRecords[idx-1].guilt === 'Có' && 
                      soakRecords[idx-2].guilt === 'Có';

                    return (
                      <tr 
                        key={r.day}
                        className={`transition-colors hover:bg-neutral-800/40 ${
                          isMinusPinStreak || isGuiltStreak ? 'bg-rose-950/20' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-neutral-300">
                          N{r.day}
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={r.milestoneTitle || ''}
                            onChange={(e) => updateSoakDay(idx, 'milestoneTitle', e.target.value)}
                            placeholder={`Vé ngày ${r.day}...`}
                            className="w-full bg-transparent text-white focus:outline-none border-b border-transparent focus:border-neutral-600 pb-0.5 text-xs placeholder:text-neutral-600"
                          />
                        </td>
                        {/* 1. Tiền */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => {
                              const next = r.cost === '' ? '0đ' : r.cost === '0đ' ? '20k' : r.cost === '20k' ? '50k' : '0đ';
                              updateSoakDay(idx, 'cost', next);
                            }}
                            className={`px-2.5 py-1 rounded-full font-mono font-bold text-[11px] transition-all ${
                              r.cost === '0đ'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : r.cost === '20k'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : r.cost === '50k'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                            }`}
                          >
                            {r.cost || 'chọn'}
                          </button>
                        </td>

                        {/* 2. Pin */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => {
                              const next = r.pin === '+pin' ? '-pin' : '+pin';
                              updateSoakDay(idx, 'pin', next);
                            }}
                            className={`px-2.5 py-1 rounded-full font-mono font-bold text-[11px] inline-flex items-center gap-1 transition-all ${
                              r.pin === '+pin'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : r.pin === '-pin'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                            }`}
                          >
                            {r.pin === '+pin' && <BatteryCharging className="w-3 h-3 text-emerald-400" />}
                            {r.pin === '-pin' && <BatteryLow className="w-3 h-3 text-rose-400" />}
                            <span>{r.pin || 'chọn'}</span>
                          </button>
                        </td>

                        {/* 3. Tội lỗi */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => {
                              const next = r.guilt === 'Không' ? 'Có' : 'Không';
                              updateSoakDay(idx, 'guilt', next);
                            }}
                            className={`px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1 transition-all ${
                              r.guilt === 'Không'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : r.guilt === 'Có'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                            }`}
                          >
                            <span>{r.guilt ? (r.guilt === 'Không' ? 'Không' : 'Có lỗi') : 'chọn'}</span>
                          </button>
                        </td>

                        {/* 4. Muốn làm tiếp ngày mai? */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => {
                              const next = r.wantRedoTomorrow === 'Có' ? 'Không' : 'Có';
                              updateSoakDay(idx, 'wantRedoTomorrow', next);
                            }}
                            className={`px-2.5 py-1 rounded-full font-bold text-[11px] transition-all ${
                              r.wantRedoTomorrow === 'Có'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : r.wantRedoTomorrow === 'Không'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                            }`}
                          >
                            {r.wantRedoTomorrow ? (r.wantRedoTomorrow === 'Có' ? 'Có muốn' : 'Hết muốn') : 'chọn'}
                          </button>
                        </td>

                        {/* Phanh Xả */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => updateSoakDay(idx, 'usedBrake', !r.usedBrake)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                              r.usedBrake
                                ? 'bg-emerald-500 text-black shadow-sm'
                                : 'bg-neutral-800 text-neutral-500 hover:text-neutral-300'
                            }`}
                            title="Đánh dấu ngày này đã dùng phanh hôm nay xả"
                          >
                            {r.usedBrake ? 'ĐÃ XẢ' : '--'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* BÀI 2: TEST TẢI (STRESS LOAD TEST)                        */}
      {/* ========================================================= */}
      {activeTestTab === 'load' && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Diagnostic Result Box */}
          <div className={`p-5 rounded-2xl border ${loadAnalysis.badgeColor}`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-neutral-400">
                  Kết Quả Chẩn Đoán Sức Chịu Tải Tối Đa
                </div>
                <div className="text-lg font-black text-white mt-0.5">
                  Sức Chịu Tải An Toàn: <span className="text-amber-400">{loadAnalysis.maxSafeCapacity}</span>
                </div>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  {loadAnalysis.diagnosis}
                </p>
                <div className="text-[11px] text-neutral-400 mt-2 font-mono">
                  Tổng chi phí tuần test tải: <span className="text-white font-bold">{loadAnalysis.totalWeeklyCost.toLocaleString('vi-VN')} đ</span> (Ngưỡng an toàn &le; 50.000đ/tuần)
                </div>
              </div>
            </div>
          </div>

          {/* Quy trình Test 3 Mức Tải */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-emerald-400">Thứ 2 - Thứ 3</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">1 Vé / Ngày</span>
              </div>
              <h3 className="text-sm font-bold text-white">Tải Nhẹ</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Làm quen với nhịp điệu. Đảm bảo bạn bắt đầu tuần mới bằng sự thư thả tuyệt đối.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-sky-400">Thứ 4 - Thứ 5</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-300 font-bold">2 Vé / Ngày</span>
              </div>
              <h3 className="text-sm font-bold text-white">Tải Trung Bình</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Nếu ở mức này mà trả lời "Không muốn làm tiếp" 2 ngày liền &rarr; Điểm gãy của bạn là 1 vé/ngày!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-purple-400">Thứ 6 - Thứ 7</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-bold">3 Vé / Ngày</span>
              </div>
              <h3 className="text-sm font-bold text-white">Tải Nặng</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Nếu tiền tuần vượt 50k &rarr; Gãy vì tiền, không phải vì lười. Cần kiểm soát chi phí vé.
              </p>
            </div>
          </div>

          {/* Bảng tương tác Test Tải 1 Tuần */}
          <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-neutral-800">
              <h3 className="text-sm font-bold text-white">Bảng Test Tải 6 Ngày Trong Tuần</h3>
              <p className="text-xs text-neutral-400">Cuối mỗi ngày trả lời câu hỏi cốt lõi: "Ngày mai còn muốn bốc vé nữa không?"</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-neutral-950 text-neutral-400 border-b border-neutral-800 font-mono">
                    <th className="py-3 px-4 font-bold">Thứ</th>
                    <th className="py-3 px-4 font-bold text-neutral-300">Mức Tải</th>
                    <th className="py-3 px-3 text-center font-bold text-sky-400">Vé Mục Tiêu</th>
                    <th className="py-3 px-3 text-center font-bold text-white">Vé Thực Tế</th>
                    <th className="py-3 px-4 text-center font-bold text-amber-400">Tiền Hôm Nay (VNĐ)</th>
                    <th className="py-3 px-4 text-center font-bold text-purple-400">Mai Còn Muốn Bốc?</th>
                    <th className="py-3 px-4 font-bold text-neutral-300">Đánh Giá Tải</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {loadRecords.map((r, idx) => (
                    <tr key={r.dayId} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white font-mono">{r.dayName}</td>
                      <td className="py-3 px-4 text-neutral-300 font-medium">{r.loadTier}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-sky-400">{r.targetTickets} vé</td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={r.actualTickets}
                          onChange={(e) => updateLoadDay(idx, 'actualTickets', parseInt(e.target.value) || 0)}
                          className="w-14 text-center py-1 rounded bg-neutral-950 border border-neutral-700 text-white font-mono font-bold"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          step="10000"
                          value={r.costTotal}
                          onChange={(e) => updateLoadDay(idx, 'costTotal', parseInt(e.target.value) || 0)}
                          className="w-24 text-center py-1 rounded bg-neutral-950 border border-neutral-700 text-amber-300 font-mono font-bold"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            const next = r.wantRedoTomorrow === 'Có' ? 'Không' : 'Có';
                            updateLoadDay(idx, 'wantRedoTomorrow', next);
                          }}
                          className={`px-3 py-1 rounded-full font-bold text-xs transition-all ${
                            r.wantRedoTomorrow === 'Có'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {r.wantRedoTomorrow === 'Có' ? '🟢 Có, còn muốn' : '🔴 Hết muốn'}
                        </button>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {r.wantRedoTomorrow === 'Không' ? (
                          <span className="text-rose-400 font-bold">⚠️ Quá Tải</span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">An toàn</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* BÀI 3: TEST KHẮC NGHIỆT (3 KỊCH BẢN SG)                   */}
      {/* ========================================================= */}
      {activeTestTab === 'extreme' && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 leading-relaxed">
            <strong className="text-white">Tại sao hệ thống ở trọ Sài Gòn hay gãy?</strong> Không phải vì bạn lười, mà vì 3 biến số bất khả kháng: <strong>Mưa ngập</strong>, <strong>Deadline dí</strong>, và <strong>Hết tiền</strong>. Bật thử 3 kịch bản dưới đây để kiểm định xem hệ thống 1000 vé có nâng đỡ bạn qua được không.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Kịch bản A: Tuần Thi */}
            <div className="p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 flex flex-col justify-between hover:border-sky-500/40 transition-colors shadow-lg">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-mono text-sky-400 font-bold uppercase tracking-wider">Kịch Bản A</div>
                <h3 className="text-base font-bold text-white mt-0.5">Tuần Thi & Deadline Dí</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Cấm tiệt các vé đi xa hay khám phá mất thì giờ. Chỉ cho bốc vé 0đ trong hẻm hoặc ngay phòng trọ.
                </p>
                <div className="mt-3 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300">
                  Kho vé hiện có: <strong className="text-sky-300">{extremeStats.roomTickets} vé</strong> trong phòng trọ & hẻm ngắn.
                </div>
              </div>

              <button
                onClick={() => onNavigateToGachaWithFilter && onNavigateToGachaWithFilter('exam')}
                className="mt-5 w-full py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Bật Gacha Chế Độ Tuần Thi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Kịch bản B: Tuần Hết Tiền */}
            <div className="p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 flex flex-col justify-between hover:border-amber-500/40 transition-colors shadow-lg">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">Kịch Bản B</div>
                <h3 className="text-base font-bold text-white mt-0.5">Tuần Hết Tiền (Cuối Tháng)</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Tự động khoá mọi vé 20k và 50k. Chỉ bốc vé 0đ (uống nước ban công, nghe tiếng chuông chùa, ngửi hoa sữa).
                </p>
                <div className="mt-3 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300">
                  Kho vé 0đ: <strong className="text-amber-300">{extremeStats.total0dTickets} vé</strong> ({extremeStats.percent0d}% toàn bộ kho).
                </div>
              </div>

              <button
                onClick={() => onNavigateToGachaWithFilter && onNavigateToGachaWithFilter('no_money')}
                className="mt-5 w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Bật Gacha Chế Độ 0đ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Kịch bản C: Tuần Mưa SG */}
            <div className="p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 flex flex-col justify-between hover:border-emerald-500/40 transition-colors shadow-lg">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3">
                  <CloudRain className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Kịch Bản C</div>
                <h3 className="text-base font-bold text-white mt-0.5">Tuần Mưa Dầm Dề Sài Gòn</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Đường ngập, trời mưa to không dắt xe ra được. Kích hoạt vé "Ở yên trong trọ 10 phút ngắm mưa" hoặc bấm Nút Xả.
                </p>
                <div className="mt-3 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300">
                  Phanh Xả Khẩn Cấp: <strong className="text-emerald-300">Luôn sẵn sàng 24/7</strong>
                </div>
              </div>

              <button
                onClick={() => onNavigateToGachaWithFilter && onNavigateToGachaWithFilter('rain')}
                className="mt-5 w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Bật Gacha Chế Độ Mưa SG</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* GOOGLE SHEET TEST MẪU (AUTOMATED TEMPLATE & FORMULAS)     */}
      {/* ========================================================= */}
      {activeTestTab === 'template' && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Google Sheet Test Mẫu (Đầy Đủ Công Thức Tự Động Báo FAIL)</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Chỉ cần bấm "Sao Chép Sheet Mẫu" và nhấn <code className="text-amber-300 font-bold">Ctrl + V</code> (Cmd + V) vào Google Sheets mới của bạn.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySheetTemplate}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedSheet ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSheet ? 'Đã Sao Chép Vào Clipboard' : 'Sao Chép Bảng Test Mẫu'}</span>
                </button>
              </div>
            </div>

            {/* Trực quan hoá bảng Sheet Mẫu */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 font-mono text-xs space-y-4">
              <div>
                <div className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                  <span>BẢNG 1: 4 CỘT BẮT BUỘC TICK MỖI NGÀY TRONG GOOGLE SHEET</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border border-neutral-800 divide-y divide-neutral-800">
                    <thead className="bg-neutral-900 text-neutral-400">
                      <tr>
                        <th className="p-2 border-r border-neutral-800">Cột A: Ngày</th>
                        <th className="p-2 border-r border-neutral-800">Cột B: Tên Vé</th>
                        <th className="p-2 border-r border-neutral-800 text-amber-300">Cột C: Tiền</th>
                        <th className="p-2 border-r border-neutral-800 text-emerald-300">Cột D: Pin</th>
                        <th className="p-2 border-r border-neutral-800 text-sky-300">Cột E: Tội Lỗi</th>
                        <th className="p-2 border-r border-neutral-800 text-purple-300">Cột F: Mai Làm Tiếp</th>
                        <th className="p-2 text-rose-300">Cột G: Công Thức Báo FAIL</th>
                      </tr>
                    </thead>
                    <tbody className="text-neutral-300 divide-y divide-neutral-800/60">
                      <tr>
                        <td className="p-2 border-r border-neutral-800">Ngày 1</td>
                        <td className="p-2 border-r border-neutral-800">Uống nước ban công</td>
                        <td className="p-2 border-r border-neutral-800 font-bold text-amber-300">0đ</td>
                        <td className="p-2 border-r border-neutral-800 font-bold text-emerald-300">+pin</td>
                        <td className="p-2 border-r border-neutral-800 font-bold text-sky-300">Không</td>
                        <td className="p-2 border-r border-neutral-800 font-bold text-purple-300">Có</td>
                        <td className="p-2 text-neutral-500">=IF(AND(D2="-pin",D3="-pin",D4="-pin"),"FAIL 1","OK")</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-neutral-800">...</td>
                        <td className="p-2 border-r border-neutral-800">...</td>
                        <td className="p-2 border-r border-neutral-800">...</td>
                        <td className="p-2 border-r border-neutral-800">...</td>
                        <td className="p-2 border-r border-neutral-800">...</td>
                        <td className="p-2 border-r border-neutral-800">...</td>
                        <td className="p-2 text-neutral-500">...</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-neutral-800">Ngày 21</td>
                        <td className="p-2 border-r border-neutral-800">Nhìn lại 21 ngày trọ</td>
                        <td className="p-2 border-r border-neutral-800 font-bold text-amber-300">0đ</td>
                        <td className="p-2 border-r border-neutral-800 font-bold text-emerald-300">+pin</td>
                        <td className="p-2 border-r border-neutral-800 font-bold text-sky-300">Không</td>
                        <td className="p-2 border-r border-neutral-800 font-bold text-purple-300">Có</td>
                        <td className="p-2 text-emerald-400 font-bold">🟢 ĐẠT ỔN ĐỊNH 21 NGÀY</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bảng công thức báo FAIL */}
              <div className="pt-3 border-t border-neutral-800">
                <div className="text-white font-bold mb-2">CÔNG THỨC SHEET CÓ SẴN TRONG BỘ TEMPLATE:</div>
                <ul className="space-y-2 text-neutral-400">
                  <li className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0">• FAIL 1:</span>
                    <div>
                      <code className="text-amber-300">=IF(COUNTIF(D2:D22,"-pin")&gt;10,"🔴 Vé quá nặng","🟢 Pin tốt")</code>
                      <p className="text-[11px] text-neutral-500 mt-0.5">Tự động phát hiện khi số ngày rút pin quá nhiều</p>
                    </div>
                  </li>
                  <li className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0">• FAIL 2:</span>
                    <div>
                      <code className="text-amber-300">=IF(COUNTIF(E2:E22,"Có")&gt;4,"🔴 Cướp giờ học","🟢 Yên tâm")</code>
                      <p className="text-[11px] text-neutral-500 mt-0.5">Tự động phát hiện khi bạn thấy tội lỗi quá 4 lần</p>
                    </div>
                  </li>
                  <li className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0">• FAIL 3:</span>
                    <div>
                      <code className="text-amber-300">=IF(COUNTIF(B2:B22,"*Xả*")=0,"🔴 Thiếu phanh an toàn","🟢 Đã dám lười")</code>
                      <p className="text-[11px] text-neutral-500 mt-0.5">Bắt buộc phải có ít nhất 1 lần bấm Nút Xả</p>
                    </div>
                  </li>
                  <li className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">• SỨC TẢI:</span>
                    <div>
                      <code className="text-amber-300">=IF(AND(F5="Không",F6="Không"),"1 VÉ / NGÀY","2-3 VÉ / NGÀY")</code>
                      <p className="text-[11px] text-neutral-500 mt-0.5">Tự động kết luận sức chịu tải tối đa của bạn</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
