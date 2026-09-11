import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lightbulb, Compass, Zap, FileSpreadsheet, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';

interface WhyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhyModal: React.FC<WhyModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<'lazy' | 'milestones' | 'rules'>('rules');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 text-neutral-200 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Triết Lý & Gốc Rễ Đằng Sau 1000 Vé
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                "Không phải vì siêng — mà là để tối ngủ đỡ lo."
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-wrap items-center gap-2 p-1 rounded-2xl bg-neutral-950 border border-neutral-800 mb-6">
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'rules'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ⏳ Luật 90-10 & 3 Khe Hở
            </button>
            <button
              onClick={() => setActiveTab('lazy')}
              className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'lazy'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🔥 Chữ "Lười" Não SG
            </button>
            <button
              onClick={() => setActiveTab('milestones')}
              className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'milestones'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              📐 1000 Vé vs 10 Vé
            </button>
          </div>

          {activeTab === 'rules' ? (
            <div className="space-y-6">
              {/* Quote */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-sky-500/15 border border-amber-500/30">
                <p className="text-sm sm:text-base text-amber-200 font-medium leading-relaxed italic">
                  "Không phải: <em>'Có đi thì có ảnh hưởng việc học/làm không?'</em><br />
                  Mà là: <strong>'Đi vào lúc nào thì không ảnh hưởng?'</strong>. Vé 10 phút sinh ra để cứu thời gian rìa (giờ lướt TikTok, giờ lo âu), bảo vệ tuyệt đối thời gian sâu."
                </p>
              </div>

              {/* 3 WHYs of Worrying About Delaying Work */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Đào 3 WHY: Nỗi Lo "Đi Lang Thang 10 Phút Có Làm Trễ Việc Không?"
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
                    <span>WHY 1</span>
                    <span>Tại sao đi 10 phút lại sợ ảnh hưởng việc học / việc làm?</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 pl-3 border-l border-amber-500/40">
                    Vì bạn đang nghĩ <strong>thời gian là 1 cục</strong>. Lấy 10 phút đi chơi là mất 10 phút học.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1">
                  <div className="flex items-center gap-2 text-sky-400 text-xs font-bold font-mono">
                    <span>WHY 2</span>
                    <span>Tại sao nghĩ thời gian là 1 cục lại sai khi ở trọ SG?</span>
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-300 pl-3 border-l border-sky-500/40 space-y-1.5">
                    <p>Vì thời gian ở trọ không phải 1 cục. Nó có 2 loại rõ rệt:</p>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-neutral-200">
                      <li><strong>Thời gian sâu:</strong> Não còn pin, học 1 tiếng vô 1 tiếng (thường chỉ có 3-4 tiếng 1 ngày).</li>
                      <li><strong>Thời gian rìa:</strong> Não hết pin, ngồi trước sách 1 tiếng mà chữ không vô. Ở trọ SG thời gian rìa rất nhiều: lúc vừa đi học về mệt, lúc nằm lướt TikTok vì chán, lúc lo cho tương lai không học nổi.</li>
                    </ul>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                    <span>WHY 3</span>
                    <span>Tại sao vé 10 phút lại phải đặt vào thời gian rìa, không phải thời gian sâu?</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 pl-3 border-l border-emerald-500/40">
                    Vì nếu bạn đặt vé vào thời gian sâu thì đúng là nó phá việc học. Nhưng nếu đặt vé vào <strong>thời gian rìa</strong> — là cái thời gian mà dù bạn không đi thì bạn cũng nằm lướt điện thoại vì mệt — thì vé đó <strong>không lấy mất giờ học, nó cứu giờ rìa khỏi bị phí phạm!</strong>
                  </p>
                </div>
              </div>

              {/* 3 Strict Rules */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>3 BỘ LUẬT BẢO VỆ CÔNG VIỆC TRONG HỆ THỐNG</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
                    <div>
                      <div className="text-amber-400 font-bold text-sm mb-1.5">1. Luật 90-10</div>
                      <p className="text-neutral-400 leading-relaxed">
                        1 ngày có 10 đồng pin: <strong>9 đồng cho học / làm việc</strong>. Chỉ 1 đồng cho vé (tối đa 2 vé = 20 phút). Không bao giờ đủ để làm trễ bất cứ việc gì.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
                    <div>
                      <div className="text-sky-400 font-bold text-sm mb-1.5">2. Luật Khe Hở</div>
                      <p className="text-neutral-400 leading-relaxed">
                        Chỉ đi vào 3 khe hở: <em>1) Vừa xong block 90p não đơ</em>; <em>2) Đang ngộp trọ lo tương lai</em>; <em>3) Tối sau 8h</em>. Cấm tuyệt đối đi vào Giờ Sâu!
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
                    <div>
                      <div className="text-pink-400 font-bold text-sm mb-1.5">3. Luật Vé Kép (30%)</div>
                      <p className="text-neutral-400 leading-relaxed">
                        30% vé là <strong>Vé Kép</strong>: vừa đi chơi vừa học/làm (đọc tựa sách ngành, nghe quán cà phê bàn việc). Não tính là đang làm việc, dẹp tan cảm giác tội lỗi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'lazy' ? (
            <div className="space-y-6">
              {/* Core Mantra Quote */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-500/15 border border-amber-500/30">
                <p className="text-sm sm:text-base text-amber-200 font-medium leading-relaxed italic">
                  "Người ta không muốn dùng hệ thống để hết lười. Người ta muốn dùng hệ thống để <strong>được lười mà vẫn thấy mình đang tiến lên 10 phút mỗi ngày</strong>. Chỉ cần ra ngoài 10 phút, dù mua ly nước mía rồi về, tối đó bạn ngủ đỡ lo hơn những hôm nằm cả ngày trong phòng trọ."
                </p>
              </div>

              {/* 4 WHYs of "Lười" */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Đào 4 WHY: Chữ "Lười" Thực Chất Là Gì?
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
                    <span>WHY 1</span>
                    <span>Tại sao nghĩ người ta không làm việc nọ kia là do lười?</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 pl-3 border-l border-amber-500/40">
                    Vì nhìn bề ngoài thì họ chỉ nằm trong phòng trọ lướt điện thoại, không chịu bước ra ngoài.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1">
                  <div className="flex items-center gap-2 text-sky-400 text-xs font-bold font-mono">
                    <span>WHY 2</span>
                    <span>Tại sao nằm trong trọ không làm gì lại bị gán nhãn lười?</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 pl-3 border-l border-sky-500/40">
                    Vì xã hội mặc định "muốn là làm được". Không làm = không muốn = lười biếng.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1">
                  <div className="flex items-center gap-2 text-pink-400 text-xs font-bold font-mono">
                    <span>WHY 3</span>
                    <span>Tại sao định kiến "muốn là làm được" lại sai bét ở SG?</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 pl-3 border-l border-pink-500/40">
                    Vì ở trọ Sài Gòn, muốn đi đâu cũng phải trả giá đắt: 30k tiền xăng, 40°C nắng rát mặt, kẹt xe hít khói, sợ hao tiền phòng trọ. <strong>Giá phải trả lớn hơn hẳn phần thưởng mơ hồ. Não tự tính lỗ</strong> và phát lệnh cho bạn nằm lại. Đó không phải lười, đó là cơ chế sinh học bảo tồn năng lượng!
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                    <span>WHY 4</span>
                    <span>Tại sao não lại tính lỗ?</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 pl-3 border-l border-emerald-500/40">
                    Vì bạn đang bắt não lấy <em>"Mục đích vĩ đại của tương lai 5-10 năm nữa"</em> để trả cho <em>"Chi phí thực tế ngay bây giờ"</em>. Não không mua! Não chỉ chịu mua khi: <strong>Chi phí 10 phút & Thưởng nhìn thấy ngay trong 10 phút.</strong>
                  </p>
                </div>
              </div>

              {/* 3 Real Reasons People Use This System */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  3 Điều Hệ Thống Này Mang Lại (TikTok hay App Kỷ Luật Không Có)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
                    <div>
                      <div className="text-amber-400 font-bold text-sm mb-1.5 flex items-center gap-1.5">
                        <span>1. Quyền Đi Không Cần Lý Do</span>
                      </div>
                      <p className="text-neutral-400 leading-relaxed">
                        Bình thường muốn ra khỏi trọ phải tự bịa lý do: đi học, đi gặp khách. Vé số cho phép bạn: <em>"Ra đầu hẻm đứng 5 phút rồi về"</em>. Não được tha bổng, không bị dằn vặt phí thời gian.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
                    <div>
                      <div className="text-sky-400 font-bold text-sm mb-1.5 flex items-center gap-1.5">
                        <span>2. Thuộc Về Sài Gòn</span>
                      </div>
                      <p className="text-neutral-400 leading-relaxed">
                        Ở trọ lâu người ta thiếu cảm giác thuộc về thành phố. Mỗi vé 10 phút là 1 mẩu chuyện nhỏ: cô bán nước mía, chú bảo vệ, góc công viên. Gom 20 mẩu là thấy mình có liên quan đến SG.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
                    <div>
                      <div className="text-pink-400 font-bold text-sm mb-1.5 flex items-center gap-1.5">
                        <span>3. Dopamine Không Phải Gồng</span>
                      </div>
                      <p className="text-neutral-400 leading-relaxed">
                        Không bắt điểm danh 30 ngày kỷ luật mệt mỏi. Vé bốc ngẫu nhiên như xổ số: vé 0đ thì vui vì đỡ tốn tiền, vé công viên thì vui vì mát. <strong>Phần thưởng đến trước, cố gắng đến sau.</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 3 WHYs for 1000 milestones */}
              <div className="space-y-3">
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
              <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-500/15 border border-amber-500/30">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="font-bold text-sky-400 text-sm mb-1">TẦNG 1: 10 LĨNH VỰC</div>
                  <p className="text-neutral-400">10 cái kén bao bọc cuộc sống ở trọ SG (Đi lại, Ăn uống, Người, Học, Tiền, Sức khỏe, Ở, Chơi, Làm, Ghi).</p>
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
            </div>
          )}

          {/* Footer close */}
          <div className="mt-7 flex justify-end">
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
