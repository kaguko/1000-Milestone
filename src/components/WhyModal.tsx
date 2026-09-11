import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lightbulb, Compass, Zap, FileSpreadsheet, ShieldAlert, ArrowRight } from 'lucide-react';

interface WhyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhyModal: React.FC<WhyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 text-neutral-200 shadow-2xl my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Triết Lý & Đào 3 Câu Hỏi "WHY"
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Gốc rễ của hệ thống máy đẻ 1000 milestone ở trọ Sài Gòn
              </p>
            </div>
          </div>

          {/* 3 WHYs */}
          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-1">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-xs">WHY 1</span>
                <span>Tại sao bạn muốn 1000 milestone mà không phải 10?</span>
              </div>
              <p className="text-sm text-neutral-300 pl-4 border-l-2 border-neutral-700 mt-2">
                Vì 10 milestone thì cảm giác không đủ an toàn, sợ sót. 1000 cái cho cảm giác là mình đã bao phủ hết mọi ngóc ngách, không còn lo cho tương lai nữa.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800">
              <div className="flex items-center gap-2 text-sky-400 text-sm font-semibold mb-1">
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-xs">WHY 2</span>
                <span>Tại sao phải bao phủ hết mới hết lo?</span>
              </div>
              <p className="text-sm text-neutral-300 pl-4 border-l-2 border-neutral-700 mt-2">
                Vì khi ở trọ ở SG, mọi thứ đều mơ hồ. Bạn nghĩ nếu có 1000 bước nhỏ rõ ràng thì chỉ cần đi theo là xong, không cần phải tự nghĩ mục đích nữa.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800">
              <div className="flex items-center gap-2 text-pink-400 text-sm font-semibold mb-1">
                <span className="px-2 py-0.5 rounded bg-pink-500/20 text-xs">WHY 3</span>
                <span>Tại sao lại không muốn tự nghĩ mục đích?</span>
              </div>
              <p className="text-sm text-neutral-300 pl-4 border-l-2 border-neutral-700 mt-2">
                Vì tự nghĩ mục đích rất mệt và dễ sai. Có sẵn 1000 bước thì chỉ cần làm theo, não đỡ phải quyết định.
              </p>
            </div>
          </div>

          {/* Root insight callout */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-500/15 border border-amber-500/30 mb-8">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
                  KẾT LUẬN GỐC RỄ
                </h4>
                <p className="text-sm sm:text-base text-white mt-1 font-medium">
                  Bạn không cần 1000 milestone tĩnh để ngồi gõ tay đến cái thứ 37 rồi bỏ cuộc. Bạn cần{' '}
                  <span className="text-amber-400 font-bold underline decoration-amber-400/50">
                    1 hệ thống không bao giờ phải tự nghĩ nên làm gì tiếp theo
                  </span>
                  . 1000 chỉ là con số bạn nghĩ sẽ cho bạn cảm giác an toàn đó.
                </p>
              </div>
            </div>
          </div>

          {/* 3 Pillars of the System */}
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-3">
            3 Tầng Kiến Trúc Của Máy Đẻ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-xs">
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="font-bold text-sky-400 text-sm mb-1">TẦNG 1: 10 LĨNH VỰC</div>
              <p className="text-neutral-400">10 cái kén mục đích bao bọc cuộc sống ở trọ SG (Đi lại, Ăn uống, Người, Học, Tiền, Sức khỏe, Ở, Chơi, Làm, Ghi).</p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="font-bold text-pink-400 text-sm mb-1">TẦNG 2: 100 LOẠI VÉ</div>
              <p className="text-neutral-400">Mỗi lĩnh vực chia nhỏ thành 10 loại vé hành động 10 phút cụ thể (10 x 10 = 100 loại vé).</p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="font-bold text-amber-400 text-sm mb-1">TẦNG 3: 1000 MILESTONE</div>
              <p className="text-neutral-400">Công thức đẻ: [Hành động 10 phút] + [Ở đâu tại SG] + [Thưởng biến đổi Dopamine]. 100 loại x 10 = 1000 cái!</p>
            </div>
          </div>

          {/* 3 Rules of Management */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs sm:text-sm space-y-2">
            <div className="font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              3 Luật Quản Lý Để Không Chết Ngộp:
            </div>
            <p className="text-neutral-400">
              <strong className="text-neutral-200">1. File duy nhất:</strong> Bảng 4 cột: ID | Vé 10 phút | Cảm giác sau khi làm | Muốn làm lại không?
            </p>
            <p className="text-neutral-400">
              <strong className="text-neutral-200">2. Luật Dopamine:</strong> Mỗi ngày bốc 1 milestone duy nhất bằng <code className="text-amber-400 bg-neutral-900 px-1 py-0.5 rounded">=RANDBETWEEN(1,1000)</code>. Bốc trúng gì làm nấy, không được chọn! Cuốn như TikTok.
            </p>
            <p className="text-neutral-400">
              <strong className="text-neutral-200">3. Luật không bao giờ hết:</strong> Làm xong chỉ đánh dấu ngày làm, không xóa. Luôn có cái tiếp theo để bốc mà não không cần nghĩ.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Đã hiểu - Bắt đầu bốc vé</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
