import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wand2, Sparkles, Loader2, PlusCircle, Check } from 'lucide-react';
import { Domain, Milestone } from '../types';
import { sounds } from '../utils/sound';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDomain: Domain | null;
  onAddCustomMilestones: (milestones: Milestone[]) => void;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  initialDomain,
  onAddCustomMilestones
}) => {
  const [district, setDistrict] = useState('Bình Thạnh / Hàng Xanh');
  const [ticketType, setTicketType] = useState('Hẻm lạ & ẩm thực sinh viên');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedItems, setGeneratedItems] = useState<Milestone[]>([]);
  const [added, setAdded] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGeneratedItems([]);
    setAdded(false);

    try {
      const response = await fetch('/api/generate-milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domainName: initialDomain?.name || 'Khám phá cuộc sống ở trọ Sài Gòn',
          ticketType,
          saigonDistrict: district,
          count,
          currentMaxId: 1000
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khi gọi máy đẻ AI');
      }

      if (data.milestones && Array.isArray(data.milestones)) {
        const parsed: Milestone[] = data.milestones.map((item: any, idx: number) => ({
          id: item.id || 1001 + idx,
          domainId: initialDomain?.id || 1,
          ticketTypeId: 'AI.1',
          ticketTypeName: 'AI Vé Riêng',
          action: item.action || 'Hành động 10 phút',
          location: item.location || 'Sài Gòn',
          reward: item.reward || 'Dopamine mới',
          title: item.title || `[${item.action}] + [${item.location}] + [${item.reward}]`
        }));
        setGeneratedItems(parsed);
        sounds.playReveal();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Không thể tạo milestone. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedItems.length > 0) {
      onAddCustomMilestones(generatedItems);
      setAdded(true);
      sounds.playComplete();
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-neutral-200 shadow-2xl my-6"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-purple-500/15 border border-purple-500/30 text-purple-400 rounded-xl">
              <Wand2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Máy Đẻ AI: Tạo Vé Riêng Cho Khu Trọ Bạn
              </h3>
              <p className="text-xs text-neutral-400">
                Lĩnh vực: {initialDomain?.name || 'Tùy chọn'} • Chuẩn công thức [Hành động 10 phút] + [Ở đâu] + [Thưởng biến đổi]
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">
                  Khu vực / Quận phòng trọ của bạn
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Ví dụ: Gò Vấp, Quận 10 Tô Hiến Thành..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">
                  Chủ đề / Kiểu vé muốn đẻ
                </label>
                <input
                  type="text"
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                  placeholder="Ví dụ: Cơm trưa 20k, Quán nước cóc, Hẻm cụt..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                Số lượng milestone muốn đẻ: <strong>{count} vé</strong>
              </span>
              <div className="flex items-center gap-1.5">
                {[3, 5, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCount(num)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                      count === num
                        ? 'bg-purple-500 text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Máy AI đang suy nghĩ công thức...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Bấm Để Đẻ {count} Vé Cụ Thể</span>
                </>
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mb-4">
              {error}
            </div>
          )}

          {/* Generated Result */}
          {generatedItems.length > 0 && (
            <div className="space-y-3 mb-6">
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center justify-between">
                <span>Vừa Đẻ Thành Công {generatedItems.length} Vé:</span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {generatedItems.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300"
                  >
                    <div className="font-bold text-white mb-1">
                      #{m.id}: {m.title}
                    </div>
                    <div className="text-[11px] text-neutral-400 flex flex-wrap gap-2 mt-1">
                      <span className="text-amber-400">⚡ {m.action}</span>
                      <span className="text-sky-400">📍 {m.location}</span>
                      <span className="text-pink-400">🎁 {m.reward}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleApply}
                disabled={added}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Đã Thêm Vào Hệ Thống!</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Nạp Các Vé Này Vào Bản Đồ Sao & Sheet</span>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
