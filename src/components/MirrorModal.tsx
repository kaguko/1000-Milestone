import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Compass, 
  Sparkles, 
  Clock, 
  Flame, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  HeartHandshake,
  Coins,
  History,
  Lightbulb
} from 'lucide-react';
import { Milestone, SheetRecord, MirrorEntry } from '../types';
import { sounds } from '../utils/sound';

interface MirrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: SheetRecord[];
  allMilestones: Milestone[];
  mirrorHistory: MirrorEntry[];
  onSaveReflection: (entry: MirrorEntry) => void;
}

export const MirrorModal: React.FC<MirrorModalProps> = ({
  isOpen,
  onClose,
  records,
  allMilestones,
  mirrorHistory,
  onSaveReflection
}) => {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<number | null>(null);
  const [reflectionNote, setReflectionNote] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Completed milestones lookup
  const completedMilestones = useMemo(() => {
    const map = new Map<number, SheetRecord>();
    records.forEach(r => map.set(r.id, r));
    return allMilestones
      .filter(m => map.has(m.id))
      .map(m => ({
        ...m,
        record: map.get(m.id)!
      }));
  }, [records, allMilestones]);

  const completedCount = completedMilestones.length;
  const nextCheckpoint = Math.max(20, Math.ceil(completedCount / 20) * 20);
  const currentCycleProgress = completedCount % 20;

  // Domain frequency pattern calculation
  const domainStats = useMemo(() => {
    const counts: Record<number, number> = {};
    let redoCount = 0;
    let peopleCount = 0;
    let zeroCostCount = 0;

    completedMilestones.forEach(m => {
      counts[m.domainId] = (counts[m.domainId] || 0) + 1;
      if (m.record.wantRedo) redoCount++;
      if (m.hasPeople) peopleCount++;
      if (m.cost === '0đ') zeroCostCount++;
    });

    const sortedDomains = Object.entries(counts)
      .map(([dId, count]) => ({ domainId: Number(dId), count }))
      .sort((a, b) => b.count - a.count);

    return {
      sortedDomains,
      redoCount,
      peopleCount,
      zeroCostCount,
      total: completedCount || 1
    };
  }, [completedMilestones, completedCount]);

  // Derive synthesized insight
  const derivedInsight = useMemo(() => {
    if (completedCount === 0) {
      return "Hãy hoàn thành ít nhất vài vé 10 phút để chiếc gương bắt đầu nhận diện hoa văn tính cách của bạn.";
    }

    const topDomain = domainStats.sortedDomains[0]?.domainId;
    let domainTheme = "khám phá phố phường và không gian sống bình dị";
    if (topDomain === 1) domainTheme = "chuyển động trên đường phố, tìm kiếm ngõ ngách lạ và không khí thoáng đãng";
    if (topDomain === 2) domainTheme = "hương vị ẩm thực vỉa hè Sài Gòn và những bữa ăn tự nấu ấm áp";
    if (topDomain === 3) domainTheme = "sự kết nối chân thành với người lao động và bạn bè xung quanh";
    if (topDomain === 5) domainTheme = "sự an tâm về kiểm soát dòng tiền và thói quen tích lũy từng đồng lẻ";
    if (topDomain === 7) domainTheme = "không gian phòng trọ ngăn nắp, yên tĩnh và khả năng tự chăm sóc thân tâm";

    const peopleRatio = Math.round((domainStats.peopleCount / domainStats.total) * 100);
    const zeroRatio = Math.round((domainStats.zeroCostCount / domainStats.total) * 100);

    return `Pattern của bạn cho thấy năng lượng hồi sinh mạnh nhất khi tập trung vào ${domainTheme}. Bạn cảm thấy thảnh thơi nhất với các hoạt động 0đ (${zeroRatio}% số vé) và ${peopleRatio > 25 ? 'thực sự được sưởi ấm khi tiếp xúc với con người' : 'nạp pin sâu sắc trong những khoảnh khắc tĩnh lặng riêng tư'}.`;
  }, [domainStats, completedCount]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!selectedMilestoneId) return;

    const newEntry: MirrorEntry = {
      completedMilestoneCount: completedCount,
      flowMilestoneId: selectedMilestoneId,
      reflectionNote: reflectionNote.trim(),
      createdAt: new Date().toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      patternInsight: derivedInsight
    };

    onSaveReflection(newEntry);
    setSavedSuccess(true);
    sounds.playComplete();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-7 text-neutral-200 shadow-2xl my-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-3.5 mb-6">
            <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400 rounded-2xl">
              <Compass className="w-7 h-7" />
            </div>
            <div className="pr-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[11px] font-mono mb-1 border border-indigo-500/20">
                <Sparkles className="w-3 h-3" />
                <span>Hệ Thống Soi Gương • Chu kỳ 20 vé</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Từ 1000 Dữ Liệu Thực Tế Tìm Manh Mối Mục Đích
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 leading-relaxed">
                "Mục đích không thể tìm bằng cách ngồi ôm đầu suy nghĩ ở phòng trọ. Nó chỉ lộ ra khi bạn soi lại pattern của những lúc bạn quên mất thời gian."
              </p>
            </div>
          </div>

          {/* 20-Milestone Checkpoint Bar */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 mb-6">
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-neutral-300">
                  Tiến độ chu kỳ: <strong className="text-amber-400 font-mono">{completedCount}</strong> / {nextCheckpoint} vé
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 font-mono">
                {20 - (completedCount % 20 === 0 && completedCount > 0 ? 0 : completedCount % 20)} vé nữa tới kỳ soi gương tiếp theo
              </span>
            </div>
            
            <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${Math.min(100, ((completedCount % 20 || 20) / 20) * 100)}%` }}
              />
            </div>
          </div>

          {/* The Single Core Question */}
          <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 mb-6">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Lightbulb className="w-4 h-4" />
              <span>Câu hỏi duy nhất của gương</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2">
              "Trong các vé vừa làm, vé nào khiến bạn quên mất thời gian (Flow State) nhất?"
            </h3>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Chọn một vé mà bạn làm xong thấy nhẹ nhõm, không bị phân tâm, cảm thấy cuộc sống ở trọ đáng yêu hơn:
            </p>

            {completedMilestones.length === 0 ? (
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-dashed border-neutral-800 text-center text-xs text-neutral-500">
                Bạn chưa hoàn thành vé nào. Hãy bốc vé 10 phút đầu tiên và bấm hoàn thành để mở khóa soi gương!
              </div>
            ) : (
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {completedMilestones.map((m) => {
                  const isSelected = selectedMilestoneId === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedMilestoneId(m.id);
                        sounds.playTick();
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-md'
                          : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800/80'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-amber-400">#{m.id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">
                            {m.cost}
                          </span>
                          {m.hasPeople && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300">
                              👥 Có người
                            </span>
                          )}
                        </div>
                        <p className="truncate font-medium text-neutral-200">{m.title}</p>
                        {m.record.feeling && (
                          <p className="text-[11px] text-emerald-400 italic mt-0.5 truncate">
                            "{m.record.feeling}"
                          </p>
                        )}
                      </div>

                      <div className="shrink-0">
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-neutral-700" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Note input */}
            {selectedMilestoneId && (
              <div className="mt-4 pt-4 border-t border-indigo-500/20">
                <label className="block text-xs font-semibold text-indigo-200 mb-1.5">
                  Tại sao vé này lại cuốn hút bạn đến vậy? (Manh mối dòng chảy cá nhân)
                </label>
                <textarea
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  placeholder="Ví dụ: Lúc ngồi bờ kè ngắm gió tự nhiên não không còn nghĩ đến deadline nữa; hoặc lúc nói chuyện với cô bán xôi cảm thấy mình không hề lẻ loi..."
                  className="w-full p-3 rounded-xl bg-neutral-950 border border-indigo-500/30 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-indigo-400"
                  rows={2}
                />
              </div>
            )}
          </div>

          {/* Synthesized Pattern Card */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 mb-6">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Manh Mối Xu Hướng Từ Dữ Liệu Thật</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              {derivedInsight}
            </p>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-neutral-900 text-center">
              <div className="p-2 rounded-lg bg-neutral-900/50">
                <div className="text-[10px] text-neutral-500">Tỷ lệ muốn làm lại</div>
                <div className="text-sm font-mono font-bold text-emerald-400">
                  {Math.round((domainStats.redoCount / domainStats.total) * 100)}%
                </div>
              </div>
              <div className="p-2 rounded-lg bg-neutral-900/50">
                <div className="text-[10px] text-neutral-500">Vé 0 đồng cứu ví</div>
                <div className="text-sm font-mono font-bold text-amber-400">
                  {Math.round((domainStats.zeroCostCount / domainStats.total) * 100)}%
                </div>
              </div>
              <div className="p-2 rounded-lg bg-neutral-900/50">
                <div className="text-[10px] text-neutral-500">Vé kết nối người</div>
                <div className="text-sm font-mono font-bold text-pink-400">
                  {Math.round((domainStats.peopleCount / domainStats.total) * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
            >
              Để Sau
            </button>

            <button
              onClick={handleSave}
              disabled={!selectedMilestoneId || savedSuccess}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-40"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã Khắc Ghi Vào Manh Mối Mục Đích!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Khắc Ghi Manh Mối Này</span>
                </>
              )}
            </button>
          </div>

          {/* Mirror history log if any */}
          {mirrorHistory.length > 0 && (
            <div className="mt-6 pt-5 border-t border-neutral-800">
              <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-semibold mb-3">
                <History className="w-3.5 h-3.5" />
                <span>Nhật ký các lần soi gương trước:</span>
              </div>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {mirrorHistory.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-neutral-950 text-xs border border-neutral-800/80">
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
                      <span>Mốc {item.completedMilestoneCount} vé</span>
                      <span>{item.createdAt}</span>
                    </div>
                    <p className="text-indigo-300 font-medium">
                      Vé trôi thời gian nhất: #{item.flowMilestoneId}
                    </p>
                    {item.reflectionNote && (
                      <p className="text-neutral-400 italic mt-0.5">"{item.reflectionNote}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
