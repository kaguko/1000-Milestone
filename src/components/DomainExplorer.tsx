import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Gift, 
  Copy, 
  Check, 
  Wand2, 
  ChevronRight,
  Layers,
  Filter
} from 'lucide-react';
import { Milestone, Domain } from '../types';
import { DOMAINS, TICKET_TYPES } from '../data/domains';
import { get100MilestonesForDomain, getAll1000Milestones } from '../data/generatorEngine';
import { sounds } from '../utils/sound';

interface DomainExplorerProps {
  completedMilestoneIds: Set<number>;
  onOpenComplete: (milestone: Milestone) => void;
  onSelectMilestoneForTimer: (milestone: Milestone) => void;
  onOpenAIGenerator: (domain: Domain) => void;
}

export const DomainExplorer: React.FC<DomainExplorerProps> = ({
  completedMilestoneIds,
  onOpenComplete,
  onSelectMilestoneForTimer,
  onOpenAIGenerator
}) => {
  const [selectedDomainId, setSelectedDomainId] = useState<number>(1);
  const [selectedTicketFilter, setSelectedTicketFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const selectedDomain = useMemo(
    () => DOMAINS.find((d) => d.id === selectedDomainId) || DOMAINS[0],
    [selectedDomainId]
  );

  // Tickets belonging to current domain
  const currentTicketTypes = useMemo(
    () => TICKET_TYPES.filter((t) => t.domainId === selectedDomainId),
    [selectedDomainId]
  );

  // The 100 milestones for current domain
  const domainMilestones = useMemo(
    () => get100MilestonesForDomain(selectedDomainId),
    [selectedDomainId]
  );

  // Filtered milestones
  const filteredMilestones = useMemo(() => {
    return domainMilestones.filter((m) => {
      // Filter by ticket type
      if (selectedTicketFilter !== 'all' && m.ticketTypeId !== selectedTicketFilter) {
        return false;
      }
      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.title.toLowerCase().includes(q) ||
          m.action.toLowerCase().includes(q) ||
          m.location.toLowerCase().includes(q) ||
          m.reward.toLowerCase().includes(q) ||
          String(m.id).includes(q)
        );
      }
      return true;
    });
  }, [domainMilestones, selectedTicketFilter, searchQuery]);

  const handleCopy = (m: Milestone) => {
    navigator.clipboard.writeText(`#Milestone${m.id}: ${m.title}`);
    setCopiedId(m.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const domainCompletedCount = useMemo(() => {
    const startId = (selectedDomainId - 1) * 100 + 1;
    const endId = selectedDomainId * 100;
    let count = 0;
    for (let id = startId; id <= endId; id++) {
      if (completedMilestoneIds.has(id)) count++;
    }
    return count;
  }, [selectedDomainId, completedMilestoneIds]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Title & Domain Switcher */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase">
              <Layers className="w-3.5 h-3.5" />
              <span>Máy Đẻ 100 Milestone Theo Lĩnh Vực</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Chọn Lĩnh Vực Để Máy Đẻ 100 Milestone
            </h2>
          </div>

          <button
            onClick={() => onOpenAIGenerator(selectedDomain)}
            className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            <Wand2 className="w-4 h-4 text-purple-400" />
            <span>AI Đẻ Vé Cho Quận / Trọ Của Bạn</span>
          </button>
        </div>

        {/* 10 Domain Tabs Carousel / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {DOMAINS.map((domain) => {
            const isSelected = domain.id === selectedDomainId;
            return (
              <button
                key={domain.id}
                onClick={() => {
                  setSelectedDomainId(domain.id);
                  setSelectedTicketFilter('all');
                  sounds.playTick();
                }}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-neutral-900 border-neutral-700 shadow-lg ring-1'
                    : 'bg-neutral-950/70 border-neutral-800/80 text-neutral-400 hover:border-neutral-700'
                }`}
                style={{
                  boxShadow: isSelected ? `0 4px 20px ${domain.accentBg}` : undefined,
                  borderColor: isSelected ? domain.color : undefined
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[11px] font-mono px-1.5 py-0.5 rounded font-bold"
                    style={{
                      backgroundColor: domain.accentBg,
                      color: domain.color
                    }}
                  >
                    #{domain.id}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    100 vé
                  </span>
                </div>
                <div className="mt-2 font-bold text-xs text-white truncate">
                  {domain.shortName}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Domain Banner */}
      <div 
        className="p-6 rounded-3xl border relative overflow-hidden bg-neutral-900"
        style={{ borderColor: selectedDomain.color + '40' }}
      >
        <div 
          className="absolute -right-16 -bottom-16 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: selectedDomain.color }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span 
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-block"
              style={{
                backgroundColor: selectedDomain.accentBg,
                borderColor: selectedDomain.color,
                color: selectedDomain.color
              }}
            >
              Lĩnh Vực {selectedDomain.id} / 10
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {selectedDomain.name}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
              {selectedDomain.tagline} • {selectedDomain.description}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800">
            <div className="text-center px-2">
              <div className="text-lg font-bold text-amber-400 font-mono">
                {domainCompletedCount} / 100
              </div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                Đã thắp sáng
              </div>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div className="text-center px-2">
              <div className="text-lg font-bold text-sky-400 font-mono">
                #{(selectedDomainId - 1) * 100 + 1} - #{selectedDomainId * 100}
              </div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                Dải Milestone ID
              </div>
            </div>
          </div>
        </div>

        {/* Filter bar & Search */}
        <div className="mt-6 pt-5 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Ticket sub-type filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedTicketFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs whitespace-nowrap transition-colors ${
                selectedTicketFilter === 'all'
                  ? 'bg-white text-black font-bold'
                  : 'bg-neutral-800 text-neutral-300 hover:text-white'
              }`}
            >
              Tất cả 100 vé
            </button>
            {currentTicketTypes.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicketFilter(t.id)}
                className={`px-3 py-1 rounded-xl text-xs whitespace-nowrap transition-colors ${
                  selectedTicketFilter === t.id
                    ? 'bg-white text-black font-bold'
                    : 'bg-neutral-800 text-neutral-300 hover:text-white'
                }`}
              >
                {t.id}: {t.name}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm quán, hẻm, hành động..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 100 Milestones List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredMilestones.map((m) => {
          const isCompleted = completedMilestoneIds.has(m.id);

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isCompleted
                  ? 'bg-neutral-900/60 border-emerald-500/40 shadow-sm'
                  : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-amber-400 font-bold">
                      #{m.id}
                    </span>
                    <span className="text-xs font-medium text-neutral-400">
                      {m.ticketTypeId} {m.ticketTypeName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(m)}
                      className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
                      title="Sao chép"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {isCompleted && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Đã làm</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Formula breakdown */}
                <div className="space-y-1.5 text-xs text-neutral-300">
                  <div className="flex items-start gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-neutral-400">Hành động:</strong> {m.action}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-neutral-400">Ở đâu:</strong> {m.location}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-neutral-400">Thưởng:</strong> {m.reward}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom action buttons */}
              <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectMilestoneForTimer(m)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bắt đầu 10 phút</span>
                </button>

                <button
                  onClick={() => onOpenComplete(m)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1.5 ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isCompleted ? 'Chỉnh sửa cảm giác' : 'Ghi vào Sheet'}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredMilestones.length === 0 && (
        <div className="p-12 text-center text-neutral-500 rounded-3xl bg-neutral-900/50 border border-neutral-800">
          Không tìm thấy milestone nào phù hợp với bộ lọc tìm kiếm.
        </div>
      )}
    </div>
  );
};
