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
  Edit2
} from 'lucide-react';
import { SheetRecord, Milestone } from '../types';
import { sounds } from '../utils/sound';

interface GoogleSheetTableProps {
  records: SheetRecord[];
  allMilestones: Milestone[];
  onUpdateRecord: (id: number, feeling: string, wantRedo: boolean | null) => void;
  onDeleteRecord: (id: number) => void;
  onOpenCompleteModal: (milestone: Milestone) => void;
}

export const GoogleSheetTable: React.FC<GoogleSheetTableProps> = ({
  records,
  allMilestones,
  onUpdateRecord,
  onDeleteRecord,
  onOpenCompleteModal
}) => {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'completed' | 'wantRedo'>('all');
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

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) => {
        const rec = recordMap.get(m.id);
        return (
          String(m.id).includes(q) ||
          m.title.toLowerCase().includes(q) ||
          (rec?.feeling && rec.feeling.toLowerCase().includes(q))
        );
      });
    }

    return list;
  }, [allMilestones, recordMap, filterMode, search]);

  // Copy to clipboard as TSV for direct paste into Google Sheets
  const handleCopyTSV = () => {
    const headers = ['ID', 'Vé 10 phút', 'Cảm giác sau khi làm', 'Muốn làm lại không?', 'Ngày hoàn thành'];
    const rows = allMilestones.map((m) => {
      const rec = recordMap.get(m.id);
      return [
        m.id,
        `"${m.title.replace(/"/g, '""')}"`,
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
    const headers = ['ID', 'Vé 10 phút', 'Cảm giác sau khi làm', 'Muốn làm lại không?', 'Ngày hoàn thành'];
    const rows = allMilestones.map((m) => {
      const rec = recordMap.get(m.id);
      return [
        m.id,
        `"${m.title.replace(/"/g, '""')}"`,
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
            <span>File Duy Nhất Chuẩn 4 Cột</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Bảng Quản Lý 4 Cột Kiểu Google Sheet
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-lg">
            Đúng theo tôn chỉ: "Đừng dùng Notion màu mè, Sheet mới sống được với 1000 dòng."
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
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
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
                ? 'bg-emerald-500 text-black'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <span>Đã làm ({records.length})</span>
          </button>
          <button
            onClick={() => setFilterMode('wantRedo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              filterMode === 'wantRedo'
                ? 'bg-rose-500 text-white'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <ThumbsUp className="w-3 h-3" />
            <span>Muốn làm lại</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo ID, vé, cảm giác..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
          />
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
                <th className="py-3 px-4 min-w-[320px] font-bold text-sky-400">
                  Cột 2: Vé 10 Phút
                </th>
                <th className="py-3 px-4 min-w-[240px] font-bold text-emerald-400">
                  Cột 3: Cảm Giác Sau Khi Làm
                </th>
                <th className="py-3 px-4 w-40 text-center font-bold text-pink-400">
                  Cột 4: Muốn Làm Lại?
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

                    {/* Cột 2: Vé 10 phút */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-neutral-200 leading-relaxed">
                        {m.title}
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">
                        Lĩnh vực #{m.domainId} • Loại {m.ticketTypeId}
                      </div>
                    </td>

                    {/* Cột 3: Cảm giác sau khi làm */}
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
                          Đánh dấu xong
                        </button>
                      )}
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
