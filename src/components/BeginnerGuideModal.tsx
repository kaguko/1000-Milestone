import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Dices, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Wallet, 
  HeartHandshake, 
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  ArrowRight,
  Smile
} from 'lucide-react';
import { sounds } from '../utils/sound';

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSimpleMode: boolean;
  onToggleSimpleMode: () => void;
  onStartRoll: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({
  isOpen,
  onClose,
  isSimpleMode,
  onToggleSimpleMode,
  onStartRoll
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-neutral-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 text-neutral-200 shadow-2xl my-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
            title="Đóng hướng dẫn"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black shrink-0 shadow-lg shadow-amber-500/20">
              <Smile className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider mb-1">
                Dành Riêng Cho Bạn Mới & Người Không Rành Công Nghệ
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Đừng Lo! Bạn Chỉ Cần Nhớ Đúng 3 Nút Này
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 leading-relaxed">
                Thấy web nhiều chữ và nhiều nút quá đúng không? <strong>Quên hết mấy nút phức tạp đi!</strong> Coi web này như một cái <span className="text-amber-300 font-semibold">Hũ Rút Thăm May Mắn 10 Phút</span> ở phòng trọ.
              </p>
            </div>
          </div>

          {/* 3 BƯỚC CƠM BÌNH DÂN (SIÊU DỄ) */}
          <div className="space-y-4 mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              👉 Quy trình 3 bước mỗi ngày (Tốn chưa tới 30 giây bấm máy):
            </div>

            {/* Bước 1 */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-start gap-3.5 hover:border-amber-500/40 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-black font-black flex items-center justify-center shrink-0 text-base">
                1
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Bấm nút to nhất: [BỐC VÉ 10 PHÚT]
                  </h3>
                  <Dices className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  Máy sẽ bốc ngẫu nhiên cho bạn 1 việc nhỏ xíu (ví dụ: <em>Ra đầu hẻm uống ly nước mía</em>, hoặc <em>Lau mặt bằng nước mát rồi ngắm trời</em>).
                </p>
                <div className="mt-2 text-[11px] text-amber-300/90 bg-amber-950/30 p-2 rounded-lg border border-amber-500/20">
                  💡 <strong>Mẹo:</strong> Không thích việc đó? Bấm bốc lại cái khác! Hết tiền thì bấm chọn ô <strong>🪙 0đ</strong>. Không tốn xu nào.
                </div>
              </div>
            </div>

            {/* Bước 2 */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-start gap-3.5 hover:border-sky-500/40 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-sky-500 text-black font-black flex items-center justify-center shrink-0 text-base">
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Cất điện thoại, đi làm đúng 10 phút
                  </h3>
                  <Clock className="w-4 h-4 text-sky-400" />
                </div>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  Không cần mở app khi đang đi. Xách dép đi làm đúng 10 phút để đầu óc xả hết mệt mỏi sau một ngày học tập, làm việc ngột ngạt ở phòng trọ.
                </p>
              </div>
            </div>

            {/* Bước 3 */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-start gap-3.5 hover:border-emerald-500/40 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-black font-black flex items-center justify-center shrink-0 text-base">
                3
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Về bấm nút xanh [ĐÃ LÀM XONG]
                  </h3>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  Gõ 1 dòng cảm xúc (ví dụ: <em>"Nước mía mát quá"</em>, <em>"Đầu óc đỡ căng thẳng"</em>) rồi bấm Lưu. Web sẽ tự nhớ giùm bạn. Tối đó đi ngủ sẽ thấy lòng nhẹ nhõm, không bị cắn rứt vì lãng phí cả ngày!
                </p>
              </div>
            </div>
          </div>

          {/* PHANH XẢ HƠI (ĐẶC QUYỀN KHI QUÁ MỆT) */}
          <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/40 mb-6">
            <div className="flex items-center gap-2 text-teal-300 text-xs sm:text-sm font-bold mb-1">
              <ShieldAlert className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Nếu hôm nay đi học về đuối quá, không muốn bước chân ra ngoài thì sao?</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              👉 Cứ bấm nút <strong className="text-teal-300">[Phanh (Xả)]</strong> ngay góc trên cùng. Hệ thống cho phép bạn nằm yên trên giường 10 phút nghe tiếng quạt quay, hoàn thành nhiệm vụ mà không cần làm gì cả. <strong>Không được tự trách bản thân!</strong>
            </p>
          </div>

          {/* 3 ĐIỀU AN TÂM (CHO NGƯỜI SỢ CÔNG NGHỆ) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-center">
              <div className="text-base mb-1">🆓</div>
              <div className="text-xs font-bold text-white">100% Miễn Phí</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Không đăng ký thẻ, không tài khoản lằng nhằng</div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-center">
              <div className="text-base mb-1">🛡️</div>
              <div className="text-xs font-bold text-white">Không Sợ Bấm Lỗi</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Cứ bấm thử thoải mái, không có nút nào làm hư máy</div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-center">
              <div className="text-base mb-1">🛑</div>
              <div className="text-xs font-bold text-white">Không Bị Ép</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Mỗi ngày chỉ cần 1 việc 10 phút là xong chỉ tiêu</div>
            </div>
          </div>

          {/* CHẾ ĐỘ SIÊU DỄ (SIMPLE MODE TOGGLE) */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Chế Độ Tối Giản (Siêu Dễ)</span>
                {isSimpleMode && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    ĐANG BẬT
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Ẩn bớt các tab phức tạp (Bản đồ sao, Phòng Lab, Google Sheet...), chỉ để lại đúng 1 màn hình bốc vé to rõ ràng.
              </p>
            </div>

            <button
              onClick={() => {
                onToggleSimpleMode();
                sounds.playTick();
              }}
              className={`p-2 rounded-xl flex items-center gap-2 font-bold text-xs transition-colors shrink-0 ${
                isSimpleMode
                  ? 'bg-emerald-500 text-black'
                  : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
              }`}
            >
              {isSimpleMode ? <ToggleRight className="w-6 h-6 text-black" /> : <ToggleLeft className="w-6 h-6 text-neutral-400" />}
              <span>{isSimpleMode ? 'Tắt' : 'Bật ngay'}</span>
            </button>
          </div>

          {/* Bottom Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-800">
            <div className="text-xs text-neutral-400 italic">
              "Mấy cái tab khác chừng nào rảnh thì bấm coi chơi, không coi cũng chẳng sao!"
            </div>

            <button
              onClick={() => {
                onClose();
                onStartRoll();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>Đã hiểu, dẫn tui đi bốc vé liền!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
