import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Copy, 
  Download, 
  Check, 
  Trash2, 
  ThumbsUp, 
  ThumbsDown, 
  Plus, 
  ExternalLink,
  Sparkles,
  Edit2,
  Users,
  Coins,
  RefreshCw,
  Zap,
  Clock,
  BatteryCharging,
  BatteryLow,
  ShieldCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { SheetRecord, Milestone, MilestoneCost } from '../types';
import { sounds } from '../utils/sound';

interface GoogleSheetTableProps {
  records: SheetRecord[];
  allMilestones: Milestone[];
  onUpdateRecord: (
    id: number, 
    feeling: string, 
    wantRedo: boolean | null,
    energyEffect?: '+pin' | '-pin',
    guiltFree?: boolean
  ) => void;
  onDeleteRecord: (id: number) => void;
  onOpenCompleteModal: (milestone: Milestone) => void;
  onMutateMilestone?: (milestone: Milestone) => void;
  onNavigateToStability?: () => void;
}

export const GoogleSheetTable: React.FC<GoogleSheetTableProps> = ({
  records,
  allMilestones,
  onUpdateRecord,
  onDeleteRecord,
  onOpenCompleteModal,
  onMutateMilestone,
  onNavigateToStability
}) => {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'completed' | 'wantRedo'>('all');
  const [costFilter, setCostFilter] = useState<'all' | '0đ' | '20k' | '50k'>('all');
  const [peopleFilter, setPeopleFilter] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFeelingText, setEditFeelingText] = useState('');

  // Map of completed record by ID
  const recordMap = useMemo(() => {
    const map = new Map<number, SheetRecord>();
    records.forEach((r) => map.set(r.id, r));
    return map;
  }, [records]);

  // Filtered display list
  const filteredList = useMemo(() => {
    let list = allMilestones;

    if (filterMode === 'completed') {
      list = list.filter((m) => recordMap.has(m.id));
    } else if (filterMode === 'wantRedo') {
      list = list.filter((m) => {
        const rec = recordMap.get(m.id);
        return rec && rec.wantRedo === true;
      });
    }

    if (costFilter !== 'all') {
      list = list.filter((m) => m.cost === costFilter);
    }

    if (peopleFilter) {
      list = list.filter((m) => m.hasPeople);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) => {
        const rec = recordMap.get(m.id);
        return (
          String(m.id).includes(q) ||
          m.title.toLowerCase().includes(q) ||
          (m.immediateBenefit && m.immediateBenefit.toLowerCase().includes(q)) ||
          (m.cost && m.cost.toLowerCase().includes(q)) ||
          (rec?.feeling && rec.feeling.toLowerCase().includes(q))
        );
      });
    }

    return list;
  }, [allMilestones, recordMap, filterMode, costFilter, peopleFilter, search]);

  // Copy to clipboard as TSV for direct paste into Google Sheets
  const handleCopyTSV = () => {
    const headers = [
      'ID', 
      'Vé 10 phút', 
      'Được gì NGAY trong 10 phút?', 
      'Chi phí', 
      'Có người?', 
      'Pin (+/-)', 
      'Tội lỗi?', 
      'Cảm giác sau khi làm', 
      'Muốn làm lại không?', 
      'Ngày hoàn thành'
    ];
    const rows = allMilestones.map((m) => {
      const rec = recordMap.get(m.id);
      return [
        m.id,
        `"${m.title.replace(/"/g, '""')}"`,
        `"${(m.immediateBenefit || m.reward || '').replace(/"/g, '""')}"`,
        m.cost || '0đ',
        m.hasPeople ? 'Có' : 'Không',
        rec ? (rec.energyEffect || '+pin') : '',
        rec ? (rec.guiltFree === false ? 'Có' : 'Không') : '',
        `"${(rec?.feeling || '').replace(/"/g, '""')}"`,
        rec ? (rec.wantRedo ? 'Có' : 'Không') : '',
        rec?.completedAt || ''
      ].join('\t');
    });

    const tsvContent = [headers.join('\t'), ...rows].join('\n');
    navigator.clipboard.writeText(tsvContent);
    setCopied(true);
    sounds.playReveal();
    setTimeout(() => setCopied(false), 2500);
  };

  // Download CSV
  const handleDownloadCSV = () => {
    const headers = [
      'ID', 
      'Vé 10 phút', 
      'Được gì NGAY trong 10 phút?', 
      'Chi phí', 
      'Có người?', 
      'Pin (+/-)', 
      'Tội lỗi?', 
      'Cảm giác sau khi làm', 
      'Muốn làm lại không?', 
      'Ngày hoàn thành'
    ];
    const rows = allMilestones.map((m) => {
      const rec = recordMap.get(m.id);
      return [
        m.id,
        `"${m.title.replace(/"/g, '""')}"`,
        `"${(m.immediateBenefit || m.reward || '').replace(/"/g, '""')}"`,
        m.cost || '0đ',
        m.hasPeople ? 'Có' : 'Không',
        rec ? (rec.energyEffect || '+pin') : '',
        rec ? (rec.guiltFree === false ? 'Có' : 'Không') : '',
        `"${(rec?.feeling || '').replace(/"/g, '""')}"`,
        rec ? (rec.wantRedo ? 'Có' : 'Không') : '',
        rec?.completedAt || ''
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `1000_milestone_sai_gon_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartEdit = (rec: SheetRecord) => {
    setEditingId(rec.id);
    setEditFeelingText(rec.feeling);
  };

  const handleSaveEdit = (id: number) => {
    const rec = recordMap.get(id);
    if (rec) {
      onUpdateRecord(id, editFeelingText, rec.wantRedo);
    }
    setEditingId(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Table Header & Philosophy callout */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Chuẩn 4 Cột + Tích hợp 5 Bộ Phận</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Bảng Quản Lý Google Sheet (1000 Dòng)
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-lg">
            Đúng theo tôn chỉ: "Đừng dùng Notion màu mè, Sheet mới sống được với 1000 dòng tại phòng trọ."
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyTSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            title="Sao chép toàn bộ để dán thẳng vào Google Sheet (Ctrl + V)"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã copy! Bấm Ctrl+V vào Sheet' : 'Copy sang Google Sheet'}</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs sm:text-sm flex items-center gap-2 border border-neutral-700 transition-colors"
            title="Tải về máy file CSV"
          >
            <Download className="w-4 h-4 text-neutral-400" />
            <span>Tải CSV</span>
          </button>

          {onNavigateToStability && (
            <button
              onClick={onNavigateToStability}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs sm:text-sm flex items-center gap-2 border border-emerald-500/40 transition-colors"
              title="Xem bảng kiểm định 5 Phanh Ổn Định"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>5 Đèn Ổn Định</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filterMode === 'all'
                  ? 'bg-white text-black'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              Tất cả 1000 dòng
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                filterMode === 'completed'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <span>Đã làm ({records.length})</span>
            </button>
            <button
              onClick={() => setFilterMode('wantRedo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                filterMode === 'wantRedo'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <ThumbsUp className="w-3 h-3" />
              <span>Muốn làm lại</span>
            </button>

            {/* Cost Filters */}
            <div className="h-4 w-px bg-neutral-800 mx-1 hidden sm:block" />

            <button
              onClick={() => setCostFilter(costFilter === '0đ' ? 'all' : '0đ')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                costFilter === '0đ'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              0đ
            </button>
            <button
              onClick={() => setCostFilter(costFilter === '20k' ? 'all' : '20k')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                costFilter === '20k'
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              20k
            </button>
            <button
              onClick={() => setCostFilter(costFilter === '50k' ? 'all' : '50k')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                costFilter === '50k'
                  ? 'bg-purple-500 text-white font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              50k
            </button>

            <button
              onClick={() => setPeopleFilter(!peopleFilter)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                peopleFilter
                  ? 'bg-pink-500 text-white font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Có người</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo ID, vé, chi phí, cảm giác..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* The 4-Column Table */}
      <div className="rounded-3xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-xl">
        <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            {/* Sticky Header */}
            <thead className="sticky top-0 z-20 bg-neutral-900 text-neutral-400 border-b border-neutral-800 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-20 text-center font-bold text-amber-400">
                  Cột 1: ID
                </th>
                <th className="py-3 px-4 min-w-[280px] font-bold text-sky-400">
                  Cột 2: Vé 10 Phút & Hệ Thống
                </th>
                <th className="py-3 px-4 min-w-[230px] font-bold text-amber-300">
                  Cột 3: Được Gì NGAY 10 Phút Tới?
                </th>
                <th className="py-3 px-3 w-28 text-center font-bold text-emerald-400">
                  Pin (+/-)
                </th>
                <th className="py-3 px-3 w-28 text-center font-bold text-sky-400">
                  Tội Lỗi?
                </th>
                <th className="py-3 px-4 min-w-[220px] font-bold text-emerald-400">
                  Cột 4: Cảm Giác Sau Khi Làm
                </th>
                <th className="py-3 px-4 w-36 text-center font-bold text-pink-400">
                  Cột 5: Muốn Làm Lại?
                </th>
                <th className="py-3 px-4 w-28 text-right font-bold text-neutral-500">
                  Thao Tác
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-neutral-900 font-sans">
              {filteredList.slice(0, 150).map((m) => {
                const rec = recordMap.get(m.id);
                const isCompleted = Boolean(rec);
                const isEditing = editingId === m.id;

                return (
                  <tr
                    key={m.id}
                    className={`hover:bg-neutral-900/60 transition-colors ${
                      isCompleted ? 'bg-neutral-900/30' : ''
                    }`}
                  >
                    {/* Cột 1: ID */}
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded ${
                        isCompleted ? 'bg-amber-500/20 text-amber-400' : 'text-neutral-500'
                      }`}>
                        #{m.id}
                      </span>
                    </td>

                    {/* Cột 2: Vé 10 phút & Hệ thống tags */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-neutral-200 leading-relaxed flex items-start gap-2">
                        <span>{m.title}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        {/* Chi phí */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          m.cost === '0đ'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : m.cost === '20k'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                            : 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                        }`}>
                          {m.cost}
                        </span>

                        {/* Vé kép */}
                        {m.isDualTicket && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1" title={m.dualTicketNote}>
                            <Zap className="w-2.5 h-2.5 text-indigo-400" />
                            <span>Vé Kép</span>
                          </span>
                        )}

                        {/* Khe Hở */}
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-amber-400" />
                          <span>{m.slotRecommendation === 'khe1' ? 'Khe 1' : m.slotRecommendation === 'khe2' ? 'Khe 2' : 'Khe 3'}</span>
                        </span>

                        {/* Có người */}
                        {m.hasPeople && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-pink-500/15 text-pink-300 border border-pink-500/20 flex items-center gap-1">
                            <Users className="w-2.5 h-2.5" />
                            <span>Có người</span>
                          </span>
                        )}

                        {/* Tự tiến hóa */}
                        {m.isMutated && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/15 text-sky-300 border border-sky-500/20 flex items-center gap-1">
                            <RefreshCw className="w-2.5 h-2.5" />
                            <span>Đã tiến hóa</span>
                          </span>
                        )}

                        <span className="text-[10px] text-neutral-500">
                          Lĩnh vực #{m.domainId} • Loại {m.ticketTypeId}
                        </span>
                      </div>
                    </td>

                    {/* Cột 3: Được gì NGAY 10 phút tới */}
                    <td className="py-3 px-4">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed font-medium">
                        🎁 {m.immediateBenefit || m.reward}
                      </div>
                    </td>

                    {/* Cột: Pin (+/-) */}
                    <td className="py-3 px-3 text-center">
                      {rec ? (
                        <button
                          onClick={() => {
                            const nextVal = rec.energyEffect === '-pin' ? '+pin' : '-pin';
                            onUpdateRecord(m.id, rec.feeling, rec.wantRedo, nextVal, rec.guiltFree);
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                            rec.energyEffect === '-pin'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                          title="Bấm để chuyển +pin / -pin"
                        >
                          {rec.energyEffect === '-pin' ? (
                            <>
                              <BatteryLow className="w-3 h-3 text-rose-400" />
                              <span>-pin</span>
                            </>
                          ) : (
                            <>
                              <BatteryCharging className="w-3 h-3 text-emerald-400" />
                              <span>+pin</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-neutral-600">--</span>
                      )}
                    </td>

                    {/* Cột: Tội Lỗi (Không / Có) */}
                    <td className="py-3 px-3 text-center">
                      {rec ? (
                        <button
                          onClick={() => {
                            const nextVal = rec.guiltFree === false ? true : false;
                            onUpdateRecord(m.id, rec.feeling, rec.wantRedo, rec.energyEffect, nextVal);
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                            rec.guiltFree === false
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          }`}
                          title="Bấm để đổi Không tội lỗi / Có tội lỗi"
                        >
                          {rec.guiltFree === false ? (
                            <>
                              <ShieldAlert className="w-3 h-3 text-amber-400" />
                              <span>Có</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3 h-3 text-sky-400" />
                              <span>Không</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-neutral-600">--</span>
                      )}
                    </td>

                    {/* Cột 4: Cảm giác sau khi làm */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editFeelingText}
                            onChange={(e) => setEditFeelingText(e.target.value)}
                            className="w-full px-2 py-1 rounded bg-neutral-900 border border-neutral-700 text-white text-xs"
                            placeholder="Ghi cảm giác..."
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(m.id)}
                            className="px-2 py-1 bg-emerald-500 text-black font-bold rounded text-xs"
                          >
                            Lưu
                          </button>
                        </div>
                      ) : rec ? (
                        <div className="flex items-center justify-between group">
                          <span className="text-emerald-300 italic">
                            "{rec.feeling || 'Đã xong'}"
                          </span>
                          <button
                            onClick={() => handleStartEdit(rec)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-white"
                            title="Sửa cảm giác"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-neutral-600">-- chưa làm --</span>
                      )}
                    </td>

                    {/* Cột 4: Muốn làm lại không? */}
                    <td className="py-3 px-4 text-center">
                      {rec ? (
                        <button
                          onClick={() => onUpdateRecord(m.id, rec.feeling, !rec.wantRedo)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            rec.wantRedo === true
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                          title="Bấm để đổi Có / Không"
                        >
                          {rec.wantRedo ? (
                            <>
                              <ThumbsUp className="w-3 h-3" />
                              <span>Có</span>
                            </>
                          ) : (
                            <>
                              <ThumbsDown className="w-3 h-3" />
                              <span>Không</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-neutral-600">--</span>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Dọn Rác & Đổi vé */}
                        {onMutateMilestone && !isCompleted && (
                          <button
                            onClick={() => onMutateMilestone(m)}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition-colors"
                            title="Vé này chán? Đổi vé mới vào vị trí này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {isCompleted ? (
                          <button
                            onClick={() => onDeleteRecord(m.id)}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition-colors"
                            title="Hủy đánh dấu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onOpenCompleteModal(m)}
                            className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-medium text-[11px] transition-colors"
                          >
                            Đánh dấu
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredList.length > 150 && (
          <div className="p-3 text-center text-xs text-neutral-500 bg-neutral-950 border-t border-neutral-900">
            Hiển thị 150 / {filteredList.length} dòng để tối ưu mượt mà. Dùng thanh tìm kiếm ở trên để tra cứu bất kỳ ID nào từ #1 đến #1000!
          </div>
        )}
      </div>
    </div>
  );
};
