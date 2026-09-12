import React, { useState, useEffect, useMemo } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { DailyGacha } from './components/DailyGacha';
import { ConstellationMap } from './components/ConstellationMap';
import { DomainExplorer } from './components/DomainExplorer';
import { GoogleSheetTable } from './components/GoogleSheetTable';
import { WhyModal } from './components/WhyModal';
import { CompleteModal } from './components/CompleteModal';
import { BrakeModal } from './components/BrakeModal';
import { MirrorModal } from './components/MirrorModal';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { SlotScheduler } from './components/SlotScheduler';
import { StabilityBrakes } from './components/StabilityBrakes';
import { BeginnerGuideModal } from './components/BeginnerGuideModal';
import { Milestone, SheetRecord, Domain, MirrorEntry } from './types';
import { getAll1000Milestones, getMilestoneById, mutateMilestone } from './data/generatorEngine';
import { DOMAINS } from './data/domains';
import { sounds } from './utils/sound';

const STORAGE_KEY = 'saigon_1000_milestones_records_v1';
const FIRST_VISIT_KEY = 'saigon_1000_milestones_seen_why_v1';
const MUTATED_KEY = 'saigon_1000_mutated_milestones_v1';
const MIRROR_KEY = 'saigon_1000_mirror_history_v1';

// Seed sample records so the board is lively right away
const INITIAL_RECORDS: SheetRecord[] = [
  {
    id: 152,
    ticketText: '[Vào 1 quán có 2 màu, hỏi chủ quán 1 câu] + [Quán nước ven đường] + [Phát hiện chủ quán cũng cùng quê miền Trung/Tây với mình]',
    feeling: 'Cô chủ quán cùng quê Quảng Ngãi, nói chuyện 5 phút tự nhiên hết nhớ nhà!',
    wantRedo: true,
    completedAt: 'Hôm qua, 17:45',
    cost: '20k',
    hasPeople: true
  },
  {
    id: 1,
    ticketText: '[Đi bộ theo hướng rẽ phải 3 lần liên tiếp] + [Hẻm cụt đường Hoàng Sa / Trường Sa] + [Phát hiện một quán hủ tiếu gõ giấu mình cực thơm ngon]',
    feeling: 'Đầu óc nhẹ bẫng sau 8 tiếng cày máy tính, hủ tiếu 25k ngon bất ngờ.',
    wantRedo: true,
    completedAt: 'Hôm nay, 08:30',
    cost: '0đ',
    hasPeople: false
  },
  {
    id: 701,
    ticketText: '[Gấp chiếc mền và vuốt phẳng ga giường ngay khi thức dậy] + [Chiếc giường ngủ trong phòng trọ] + [Chiến thắng nhỏ đầu tiên trong ngày tạo đà cho chuỗi năng suất cao]',
    feeling: 'Căn phòng trọ 15m² nhìn tươm tất hẳn, tự hào về bản thân.',
    wantRedo: true,
    completedAt: 'Hôm nay, 07:15',
    cost: '0đ',
    hasPeople: false
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('gacha');
  const [records, setRecords] = useState<SheetRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_RECORDS;
  });

  // Mutated milestones dictionary { [id: number]: Milestone }
  const [mutatedMap, setMutatedMap] = useState<Record<number, Milestone>>(() => {
    try {
      const saved = localStorage.getItem(MUTATED_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {};
  });

  // Mirror reflection history
  const [mirrorHistory, setMirrorHistory] = useState<MirrorEntry[]>(() => {
    try {
      const saved = localStorage.getItem(MIRROR_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [currentMilestone, setCurrentMilestone] = useState<Milestone>(() => {
    return getMilestoneById(152); // default to milestone 152
  });

  const [whyModalOpen, setWhyModalOpen] = useState(false);
  const [brakeModalOpen, setBrakeModalOpen] = useState(false);
  const [mirrorModalOpen, setMirrorModalOpen] = useState(false);
  const [completeModalMilestone, setCompleteModalMilestone] = useState<Milestone | null>(null);
  const [aiGeneratorDomain, setAiGeneratorDomain] = useState<Domain | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [extremeFilter, setExtremeFilter] = useState<'normal' | 'exam' | 'no_money' | 'rain'>('normal');
  const [beginnerGuideOpen, setBeginnerGuideOpen] = useState(false);
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('saigon_simple_mode_v1');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleSimpleMode = () => {
    setIsSimpleMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('saigon_simple_mode_v1', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Show why modal on first visit
  useEffect(() => {
    try {
      const seen = localStorage.getItem(FIRST_VISIT_KEY);
      if (!seen) {
        setWhyModalOpen(true);
        localStorage.setItem(FIRST_VISIT_KEY, 'true');
      }
    } catch {
      // ignore
    }
  }, []);

  // Save records to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save records to localStorage', e);
    }
  }, [records]);

  // Save mutated map to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(MUTATED_KEY, JSON.stringify(mutatedMap));
    } catch (e) {
      console.error('Failed to save mutated map', e);
    }
  }, [mutatedMap]);

  // Save mirror history to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(MIRROR_KEY, JSON.stringify(mirrorHistory));
    } catch (e) {
      console.error('Failed to save mirror history', e);
    }
  }, [mirrorHistory]);

  // Set of completed IDs
  const completedMilestoneIds = useMemo(() => {
    return new Set<number>(records.map((r) => r.id));
  }, [records]);

  // All 1000 milestones merged with mutated ones
  const allMilestones = useMemo(() => {
    const list = getAll1000Milestones();
    return list.map((m) => {
      const mutated = mutatedMap[m.id];
      const base = mutated || m;
      const rec = records.find((r) => r.id === base.id);
      return {
        ...base,
        isCompleted: Boolean(rec),
        feeling: rec?.feeling,
        wantRedo: rec?.wantRedo,
        completedAt: rec?.completedAt
      };
    });
  }, [records, mutatedMap]);

  // Handler: save completion
  const handleSaveComplete = (
    id: number, 
    feeling: string, 
    wantRedo: boolean, 
    milestone?: Milestone,
    energyEffect: '+pin' | '-pin' = '+pin',
    guiltFree: boolean = true
  ) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}, ${now.getDate()}/${now.getMonth() + 1}`;
    
    const target = milestone || mutatedMap[id] || getMilestoneById(id);
    const newRecord: SheetRecord = {
      id,
      ticketText: target.title,
      feeling,
      wantRedo,
      completedAt: timeStr,
      cost: target.cost,
      hasPeople: target.hasPeople,
      isDualTicket: target.isDualTicket,
      dualTicketNote: target.dualTicketNote,
      slotRecommendation: target.slotRecommendation,
      isMutated: target.isMutated,
      immediateBenefit: target.immediateBenefit,
      energyEffect,
      guiltFree
    };

    setRecords((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return [newRecord, ...filtered];
    });

    sounds.playComplete();

    // Check if user hit multiple of 20 -> prompt Mirror
    if ((records.length + 1) % 20 === 0) {
      setTimeout(() => {
        setMirrorModalOpen(true);
      }, 800);
    }
  };

  // Handler: Complete Brake ticket (Hôm nay xả)
  const handleCompleteBrake = (brakeMilestone: Milestone, feeling: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}, ${now.getDate()}/${now.getMonth() + 1}`;
    
    const newRecord: SheetRecord = {
      id: brakeMilestone.id,
      ticketText: `[Vé Phanh Khẩn Cấp] ${brakeMilestone.title}`,
      feeling: feeling || 'Đầu óc thanh thản, tự tha thứ cho bản thân vì đã mệt mỏi.',
      wantRedo: true,
      completedAt: timeStr,
      cost: '0đ',
      hasPeople: false,
      isBrake: true,
      energyEffect: '+pin',
      guiltFree: true
    };

    setRecords((prev) => [newRecord, ...prev.filter(r => r.id !== brakeMilestone.id)]);
  };

  // Handler: Mutate / Trash milestone
  const handleMutateMilestone = (m: Milestone) => {
    const evolved = mutateMilestone(m);
    setMutatedMap((prev) => ({
      ...prev,
      [m.id]: evolved
    }));
    if (currentMilestone.id === m.id) {
      setCurrentMilestone(evolved);
    }
  };

  // Handler: Save Mirror Reflection
  const handleSaveReflection = (entry: MirrorEntry) => {
    setMirrorHistory((prev) => [entry, ...prev]);
  };

  // Handler: update record in Sheet
  const handleUpdateRecord = (
    id: number, 
    feeling: string, 
    wantRedo: boolean | null,
    energyEffect?: '+pin' | '-pin',
    guiltFree?: boolean
  ) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { 
        ...r, 
        feeling, 
        wantRedo,
        ...(energyEffect ? { energyEffect } : {}),
        ...(guiltFree !== undefined ? { guiltFree } : {})
      } : r))
    );
  };

  // Handler: delete record from Sheet
  const handleDeleteRecord = (id: number) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // Handler: add custom milestones generated by AI
  const handleAddCustomMilestones = (customList: Milestone[]) => {
    if (customList.length > 0) {
      setCurrentMilestone(customList[0]);
      setActiveTab('gacha');
    }
  };

  // Toggle sound
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sounds.enabled = nextState;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        completedCount={completedMilestoneIds.size}
        onOpenWhy={() => setWhyModalOpen(true)}
        onOpenBrake={() => setBrakeModalOpen(true)}
        onOpenMirror={() => setMirrorModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        isSimpleMode={isSimpleMode}
        onToggleSimpleMode={handleToggleSimpleMode}
        onOpenBeginnerGuide={() => setBeginnerGuideOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'gacha' && (
          <DailyGacha
            currentMilestone={{
              ...(mutatedMap[currentMilestone.id] || currentMilestone),
              isCompleted: completedMilestoneIds.has(currentMilestone.id)
            }}
            onDrawMilestone={setCurrentMilestone}
            onOpenComplete={(m) => setCompleteModalMilestone(m)}
            onOpenBrake={() => setBrakeModalOpen(true)}
            onOpenMirror={() => setMirrorModalOpen(true)}
            onMutateMilestone={handleMutateMilestone}
            records={records}
            onNavigateToSchedule={() => setActiveTab('schedule')}
            onNavigateToStability={() => setActiveTab('stability')}
            extremeFilter={extremeFilter}
            onSetExtremeFilter={setExtremeFilter}
            isSimpleMode={isSimpleMode}
            onOpenBeginnerGuide={() => setBeginnerGuideOpen(true)}
          />
        )}

        {activeTab === 'schedule' && (
          <SlotScheduler
            completedMilestoneIds={completedMilestoneIds}
            onOpenCompleteModal={(m) => setCompleteModalMilestone(m)}
            onOpenWhy={() => setWhyModalOpen(true)}
          />
        )}

        {activeTab === 'stability' && (
          <StabilityBrakes
            records={records}
            allMilestones={allMilestones}
            mirrorHistory={mirrorHistory}
            onOpenBrake={() => setBrakeModalOpen(true)}
            onOpenMirror={() => setMirrorModalOpen(true)}
            onNavigateToSchedule={() => setActiveTab('schedule')}
            onNavigateToSheet={() => setActiveTab('sheet')}
            onNavigateToGachaWithFilter={(filterType) => {
              setExtremeFilter(filterType);
              setActiveTab('gacha');
            }}
            onUpdateRecord={handleUpdateRecord}
          />
        )}

        {activeTab === 'constellation' && (
          <ConstellationMap
            completedMilestoneIds={completedMilestoneIds}
            onOpenComplete={(m) => setCompleteModalMilestone(m)}
            onSelectMilestoneForTimer={(m) => {
              setCurrentMilestone(mutatedMap[m.id] || m);
              setActiveTab('gacha');
            }}
          />
        )}

        {activeTab === 'explorer' && (
          <DomainExplorer
            completedMilestoneIds={completedMilestoneIds}
            onOpenComplete={(m) => setCompleteModalMilestone(m)}
            onSelectMilestoneForTimer={(m) => {
              setCurrentMilestone(mutatedMap[m.id] || m);
              setActiveTab('gacha');
            }}
            onOpenAIGenerator={(domain) => setAiGeneratorDomain(domain)}
          />
        )}

        {activeTab === 'sheet' && (
          <GoogleSheetTable
            records={records}
            allMilestones={allMilestones}
            onUpdateRecord={handleUpdateRecord}
            onDeleteRecord={handleDeleteRecord}
            onOpenCompleteModal={(m) => setCompleteModalMilestone(m)}
            onMutateMilestone={handleMutateMilestone}
            onNavigateToStability={() => setActiveTab('stability')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            MÁY ĐẺ 1000 MILESTONE Ở TRỌ SÀI GÒN • 5 Bộ Phận: Phanh (Xả) • Tiền (0đ/20k/50k) • Gương (20 vé) • Người (10%) • Rác (Tự tiến hóa)
          </p>
          <div className="flex items-center gap-4 text-neutral-400">
            <button
              onClick={() => setBrakeModalOpen(true)}
              className="hover:text-teal-400 text-teal-400 font-medium underline transition-colors"
            >
              Hôm nay xả
            </button>
            <span>•</span>
            <button
              onClick={() => setMirrorModalOpen(true)}
              className="hover:text-indigo-400 text-indigo-400 font-medium underline transition-colors"
            >
              Soi gương (Pattern)
            </button>
            <span>•</span>
            <button
              onClick={() => setWhyModalOpen(true)}
              className="hover:text-amber-400 underline transition-colors"
            >
              Triết lý 3 WHY
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('sheet')}
              className="hover:text-emerald-400 underline transition-colors"
            >
              Bảng Sheet
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <WhyModal
        isOpen={whyModalOpen}
        onClose={() => setWhyModalOpen(false)}
      />

      <BrakeModal
        isOpen={brakeModalOpen}
        onClose={() => setBrakeModalOpen(false)}
        onCompleteBrake={handleCompleteBrake}
      />

      <MirrorModal
        isOpen={mirrorModalOpen}
        onClose={() => setMirrorModalOpen(false)}
        records={records}
        allMilestones={allMilestones}
        mirrorHistory={mirrorHistory}
        onSaveReflection={handleSaveReflection}
      />

      <CompleteModal
        milestone={completeModalMilestone}
        isOpen={Boolean(completeModalMilestone)}
        onClose={() => setCompleteModalMilestone(null)}
        onSave={handleSaveComplete}
      />

      <AIGeneratorModal
        isOpen={Boolean(aiGeneratorDomain)}
        onClose={() => setAiGeneratorDomain(null)}
        initialDomain={aiGeneratorDomain}
        onAddCustomMilestones={handleAddCustomMilestones}
      />

      <BeginnerGuideModal
        isOpen={beginnerGuideOpen}
        onClose={() => setBeginnerGuideOpen(false)}
        isSimpleMode={isSimpleMode}
        onToggleSimpleMode={handleToggleSimpleMode}
        onStartRoll={() => {
          setActiveTab('gacha');
        }}
      />
    </div>
  );
}

