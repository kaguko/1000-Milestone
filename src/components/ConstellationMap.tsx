import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, CheckCircle2, Clock, MapPin, Gift, Compass } from 'lucide-react';
import { Milestone } from '../types';
import { DOMAINS } from '../data/domains';
import { getAll1000Milestones, getMilestoneById } from '../data/generatorEngine';
import { sounds } from '../utils/sound';

interface ConstellationMapProps {
  completedMilestoneIds: Set<number>;
  onOpenComplete: (milestone: Milestone) => void;
  onSelectMilestoneForTimer: (milestone: Milestone) => void;
}

export const ConstellationMap: React.FC<ConstellationMapProps> = ({
  completedMilestoneIds,
  onOpenComplete,
  onSelectMilestoneForTimer
}) => {
  const [activeDomainFilter, setActiveDomainFilter] = useState<number | 'all'>('all');
  const [inspectedMilestone, setInspectedMilestone] = useState<Milestone | null>(null);

  const allMilestones = useMemo(() => getAll1000Milestones(), []);

  const displayedMilestones = useMemo(() => {
    if (activeDomainFilter === 'all') return allMilestones;
    return allMilestones.filter((m) => m.domainId === activeDomainFilter);
  }, [allMilestones, activeDomainFilter]);

  const totalCompleted = completedMilestoneIds.size;
  const percentage = ((totalCompleted / 1000) * 100).toFixed(1);

  const handleStarClick = (milestone: Milestone) => {
    setInspectedMilestone(milestone);
    sounds.playTick();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bản Đồ Sao Sài Gòn (1000 Tinh Tú)</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Ma Trận Thiên Hà 1000 Milestone
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-lg">
            Mỗi ngôi sao là một nhiệm vụ 10 phút. Khi hoàn thành, ngôi sao sẽ bừng sáng với vầng hào quang rực rỡ.
          </p>
        </div>

        {/* Global Progress */}
        <div className="flex items-center gap-4 bg-neutral-950 p-4 rounded-2xl border border-neutral-800 self-start md:self-auto">
          <div>
            <div className="text-2xl font-bold text-amber-400 font-mono">
              {totalCompleted} / 1000
            </div>
            <div className="text-[11px] text-neutral-400">
              Đã thắp sáng ({percentage}%)
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-amber-500/30 flex items-center justify-center relative">
            <div 
              className="absolute inset-0 rounded-full border-2 border-amber-400"
              style={{
                clipPath: `polygon(0 0, 100% 0, 100% ${percentage}%, 0 ${percentage}%)`
              }}
            />
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Domain Constellation Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveDomainFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap font-medium transition-colors ${
            activeDomainFilter === 'all'
              ? 'bg-white text-black font-bold'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          Toàn bộ thiên hà (1000 sao)
        </button>

        {DOMAINS.map((d) => (
          <button
            key={d.id}
            onClick={() => setActiveDomainFilter(d.id)}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-medium border transition-colors ${
              activeDomainFilter === d.id
                ? 'bg-neutral-800 text-white font-bold border-neutral-600'
                : 'bg-neutral-950 text-neutral-400 hover:text-white border-neutral-800'
            }`}
            style={{
              borderColor: activeDomainFilter === d.id ? d.color : undefined
            }}
          >
            Chòm #{d.id}: {d.shortName}
          </button>
        ))}
      </div>

      {/* Cosmic Sky Grid Container */}
      <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800/90 relative overflow-hidden shadow-2xl min-h-[420px]">
        {/* Deep space nebula backgrounds */}
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-purple-900/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-sky-900/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="text-[11px] text-neutral-500 font-mono mb-4 flex items-center justify-between">
            <span>Hiển thị {displayedMilestones.length} tinh tú</span>
            <span className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/80" />
                Đã thắp sáng
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                Chưa kích hoạt
              </span>
            </span>
          </div>

          {/* 1000 Star Points Grid */}
          <div className="grid grid-cols-10 sm:grid-cols-20 md:grid-cols-25 lg:grid-cols-40 gap-1.5 sm:gap-2">
            {displayedMilestones.map((m) => {
              const isCompleted = completedMilestoneIds.has(m.id);
              const domain = DOMAINS.find((d) => d.id === m.domainId);
              const isInspected = inspectedMilestone?.id === m.id;

              return (
                <button
                  key={m.id}
                  onClick={() => handleStarClick(m)}
                  title={`#${m.id}: ${m.action}`}
                  className={`relative group aspect-square rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'scale-110 z-10'
                      : 'hover:scale-125 hover:z-20'
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                      isCompleted
                        ? 'bg-amber-400 ring-2 ring-amber-400/50 shadow-md shadow-amber-400'
                        : isInspected
                        ? 'bg-white ring-2 ring-sky-400'
                        : 'bg-neutral-800 hover:bg-neutral-400'
                    }`}
                    style={{
                      backgroundColor: isCompleted
                        ? '#f59e0b'
                        : isInspected
                        ? '#ffffff'
                        : domain?.color
                        ? domain.color + '55'
                        : undefined
                    }}
                  />
                  {/* Subtle hover pulse */}
                  <span className="sr-only">Star #{m.id}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Inspected Milestone Drawer / Floating Card */}
      <AnimatePresence>
        {inspectedMilestone && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="p-6 rounded-3xl bg-neutral-900 border border-neutral-700 shadow-2xl relative"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                  TINH TÚ #{inspectedMilestone.id}
                </span>
                <span className="text-xs text-neutral-400">
                  {inspectedMilestone.ticketTypeId} {inspectedMilestone.ticketTypeName}
                </span>
                {completedMilestoneIds.has(inspectedMilestone.id) && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đã thắp sáng</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectMilestoneForTimer(inspectedMilestone)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bắt đầu 10 phút</span>
                </button>

                <button
                  onClick={() => onOpenComplete(inspectedMilestone)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ghi vào Sheet</span>
                </button>

                <button
                  onClick={() => setInspectedMilestone(null)}
                  className="px-3 py-2 rounded-xl text-neutral-400 hover:text-white text-xs hover:bg-neutral-800"
                >
                  Đóng
                </button>
              </div>
            </div>

            {/* Formula Breakdown */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-[10px] font-bold uppercase text-amber-400 block mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 1. Hành Động 10 Phút
                </span>
                <span className="text-white font-medium">{inspectedMilestone.action}</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-[10px] font-bold uppercase text-sky-400 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> 2. Ở Đâu (Sài Gòn)
                </span>
                <span className="text-white font-medium">{inspectedMilestone.location}</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-[10px] font-bold uppercase text-pink-400 block mb-1 flex items-center gap-1">
                  <Gift className="w-3 h-3" /> 3. Thưởng Biến Đổi
                </span>
                <span className="text-white font-medium">{inspectedMilestone.reward}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
