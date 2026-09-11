import { Domain, TicketType } from '../types';

export const DOMAINS: Domain[] = [
  {
    id: 1,
    name: 'Đi lại / Khám phá',
    shortName: 'Đi lại',
    iconName: 'Compass',
    color: '#38bdf8', // sky-400
    accentBg: 'rgba(56, 189, 248, 0.15)',
    tagline: 'Mở rộng bán kính phòng trọ ra khắp phố phường',
    description: 'Chống cảm giác bí bách 4 bức tường bằng các vi-hành trình 10 phút quanh Sài Gòn.'
  },
  {
    id: 2,
    name: 'Ăn uống / Nấu ăn',
    shortName: 'Ăn uống',
    iconName: 'Utensils',
    color: '#f97316', // orange-500
    accentBg: 'rgba(249, 115, 22, 0.15)',
    tagline: 'Cứu chiếc bụng đói của người ở trọ với chi phí rẻ',
    description: 'Khám phá ẩm thực vỉa hè SG và các mẹo nấu nướng siêu tốc không bừa bộn.'
  },
  {
    id: 3,
    name: 'Người / Nói chuyện',
    shortName: 'Con người',
    iconName: 'Users',
    color: '#ec4899', // pink-500
    accentBg: 'rgba(236, 72, 153, 0.15)',
    tagline: 'Phá vỡ sự cô độc giữa đô thị 10 triệu dân',
    description: 'Vi-kết nối xã hội 10 phút: chủ trọ, bác xe ôm, cô bán xôi, bạn bè cũ.'
  },
  {
    id: 4,
    name: 'Học / Kỹ năng',
    shortName: 'Học tập',
    iconName: 'BookOpen',
    color: '#8b5cf6', // purple-500
    accentBg: 'rgba(139, 92, 246, 0.15)',
    tagline: 'Nâng cấp nhận thức từng block 10 phút không ngán',
    description: 'Không cần học khóa học dài dằng dặc, chỉ 10 phút thu hoạch 1 mẩu tri thức sắc bén.'
  },
  {
    id: 5,
    name: 'Tiền / Tiết kiệm',
    shortName: 'Tiền bạc',
    iconName: 'Coins',
    color: '#eab308', // yellow-500
    accentBg: 'rgba(234, 179, 8, 0.15)',
    tagline: 'Chấm dứt nỗi sợ viêm màng túi cuối tháng',
    description: 'Kiểm soát tài chính phòng trọ nhẹ tênh, tích lũy từng đồng lẻ và thử thách 0 đồng.'
  },
  {
    id: 6,
    name: 'Sức khỏe / Vận động',
    shortName: 'Sức khỏe',
    iconName: 'Activity',
    color: '#10b981', // emerald-500
    accentBg: 'rgba(16, 185, 129, 0.15)',
    tagline: 'Tái nạp năng lượng sau một ngày cày ải',
    description: 'Các bài giãn cơ, hít thở, uống nước và vận động ngắn cứu vớt lưng và cổ vai gáy.'
  },
  {
    id: 7,
    name: 'Ở / Dọn trọ',
    shortName: 'Dọn trọ',
    iconName: 'Home',
    color: '#06b6d4', // cyan-500
    accentBg: 'rgba(6, 182, 212, 0.15)',
    tagline: 'Biến 15m² trọ chật chội thành ốc đảo bình yên',
    description: 'Micro-declutter: 10 phút dọn một góc nhỏ, đổi lại không gian thở sạch sẽ và thơm mát.'
  },
  {
    id: 8,
    name: 'Chơi / Giải trí rẻ',
    shortName: 'Giải trí',
    iconName: 'Sparkles',
    color: '#a855f7', // purple-400
    accentBg: 'rgba(168, 85, 247, 0.15)',
    tagline: 'Thưởng thức Sài Gòn với giá 0 đồng đến 20k',
    description: 'Bờ kè gió lộng, công viên rợp bóng, ngắm hoàng hôn và những niềm vui mộc mạc.'
  },
  {
    id: 9,
    name: 'Làm / Kiếm thêm',
    shortName: 'Sự nghiệp',
    iconName: 'Briefcase',
    color: '#3b82f6', // blue-500
    accentBg: 'rgba(59, 130, 246, 0.15)',
    tagline: 'Từng bước nhỏ tích lũy cơ hội nghề nghiệp',
    description: 'Chỉnh 1 dòng CV, dọn hộp thư, tìm 3 việc freelance, học 1 prompt kiếm tiền.'
  },
  {
    id: 10,
    name: 'Ghi / Nhìn lại',
    shortName: 'Nhìn lại',
    iconName: 'PenTool',
    color: '#f43f5e', // rose-500
    accentBg: 'rgba(244, 63, 94, 0.15)',
    tagline: 'Đối thoại với nội tâm, định vị lại chính mình',
    description: '3 dòng biết ơn, 1 khoảnh khắc mưa rào, chấm điểm ngày để não không còn hoang mang.'
  }
];

// 10 domains x 10 ticket types = 100 ticket types
export const TICKET_TYPES: TicketType[] = [
  // Lĩnh vực 1: Đi lại / Khám phá
  { id: '1.1', domainId: 1, name: 'Đi bộ', description: 'Rảo bước không vội vã trong bán kính 500m' },
  { id: '1.2', domainId: 1, name: 'Xe buýt', description: 'Lên 1 tuyến xe buýt ngắm đường phố qua khung kính' },
  { id: '1.3', domainId: 1, name: 'Đi chợ', description: 'Ghé vào một khu chợ cóc / chợ dân sinh lân cận' },
  { id: '1.4', domainId: 1, name: 'Công viên', description: 'Hít khí trời dưới những vòm cây cổ thụ râm mát' },
  { id: '1.5', domainId: 1, name: 'Quán xá mới', description: 'Khám phá quán cà phê hoặc tiệm ăn chưa từng vào' },
  { id: '1.6', domainId: 1, name: 'Hẻm lạ', description: 'Rẽ vào một con hẻm ngoằn ngoèo chưa từng đặt chân' },
  { id: '1.7', domainId: 1, name: 'Bảo tàng / Triển lãm free', description: 'Chiêm ngưỡng một góc nghệ thuật hoặc di tích lịch sử' },
  { id: '1.8', domainId: 1, name: 'Cầu / Bờ kênh', description: 'Đứng hứng gió trên thành cầu hoặc bờ kênh Nhiêu Lộc / Tàu Hủ' },
  { id: '1.9', domainId: 1, name: 'Chùa / Nhà thờ', description: 'Cảm nhận không gian thanh tịnh tĩnh lặng giữa đô thị' },
  { id: '1.10', domainId: 1, name: 'Đi không đích đến', description: 'Đi theo sự máng bảo của trực giác trong 10 phút' },

  // Lĩnh vực 2: Ăn uống / Nấu ăn
  { id: '2.1', domainId: 2, name: 'Món lạ 20k - 30k', description: 'Thử một món ăn lề đường có mức giá sinh viên' },
  { id: '2.2', domainId: 2, name: 'Tự nấu 1 nồi nhanh', description: 'Nấu một món đơn giản với chiếc nồi cơm điện / chảo nhỏ' },
  { id: '2.3', domainId: 2, name: 'Quán vỉa hè lâu năm', description: 'Ngồi ghế nhựa quán ăn đã bán trên 10 năm ở góc phố' },
  { id: '2.4', domainId: 2, name: 'Mua nguyên liệu chợ chiều', description: 'Săn bó rau quả giảm giá lúc tan tầm' },
  { id: '2.5', domainId: 2, name: 'Nước sâm / Rau má vỉa hè', description: 'Làm một ly nước mát thanh lọc cái nóng oi ả' },
  { id: '2.6', domainId: 2, name: 'Nêm nếm gia vị mới', description: 'Thử thêm một chút bơ, tiêu, ớt hoặc xì dầu theo cách khác' },
  { id: '2.7', domainId: 2, name: 'Ăn chậm không điện thoại', description: 'Tập trung 100% giác quan vào từng miếng nhai' },
  { id: '2.8', domainId: 2, name: 'Trái cây gọt sẵn xe đẩy', description: 'Mua 1 bịch xoài lắc, ổi, mận 15k chấm muối tôm' },
  { id: '2.9', domainId: 2, name: 'Pha nước uống mang đi', description: 'Tự pha bình trà đá, chanh sả hoặc cà phê trước khi ra ngoài' },
  { id: '2.10', domainId: 2, name: 'Bánh mì góc ngã tư', description: 'Thưởng thức ổ bánh mì giòn rụm đặc trưng Sài Gòn' },

  // Lĩnh vực 3: Người / Nói chuyện
  { id: '3.1', domainId: 3, name: 'Chào cô chú chủ trọ / hàng xóm', description: 'Một câu chào kèm nụ cười tươi thân thiện' },
  { id: '3.2', domainId: 3, name: 'Nói chuyện với tài xế xe ôm / grab', description: 'Hỏi thăm quê quán hoặc chuyện chạy xe hôm nay' },
  { id: '3.3', domainId: 3, name: 'Hỏi thăm người bán dạo', description: 'Trò chuyện nhẹ nhàng với cô chú bán vé số / ve chai' },
  { id: '3.4', domainId: 3, name: 'Nhắn tin hỏi thăm bạn cũ', description: 'Gửi 1 tin nhắn chân tình cho người lâu rồi chưa nói chuyện' },
  { id: '3.5', domainId: 3, name: 'Gọi điện 10 phút về nhà', description: 'Alo cho ba mẹ hoặc người thân nghe giọng quen thuộc' },
  { id: '3.6', domainId: 3, name: 'Cảm ơn nhân viên thu ngân / bảo vệ', description: 'Nói lời cảm ơn nhìn thẳng vào mắt kèm nụ cười' },
  { id: '3.7', domainId: 3, name: 'Lắng nghe chuyện bàn bên', description: 'Ngồi im lặng cảm nhận lát cắt cuộc sống của người khác' },
  { id: '3.8', domainId: 3, name: 'Giúp đỡ một việc nhỏ 2 phút', description: 'Dắt phụ chiếc xe, nhặt đồ rơi, giữ cửa cho ai đó' },
  { id: '3.9', domainId: 3, name: 'Khen chân thành một người lạ', description: 'Khen chiếc nón bảo hiểm đẹp, áo xinh, hoặc thái độ dễ thương' },
  { id: '3.10', domainId: 3, name: 'Hỏi xin lời khuyên người lớn', description: 'Hỏi kinh nghiệm sinh sống từ người từng trải' },

  // Lĩnh vực 4: Học / Kỹ năng
  { id: '4.1', domainId: 4, name: 'Đọc 5 trang sách giấy', description: 'Tách biệt màn hình số, chạm tay vào trang giấy' },
  { id: '4.2', domainId: 4, name: 'Học 3 từ vựng ngoại ngữ mới', description: 'Ghi nhớ 3 từ áp dụng ngay vào cuộc sống' },
  { id: '4.3', domainId: 4, name: 'Xem video giải thích cơ chế', description: 'Hiểu bản chất cách một thứ vận hành trong đời sống' },
  { id: '4.4', domainId: 4, name: 'Luyện gõ phím 10 ngón', description: '10 phút test tốc độ gõ trên monkeytype / 10fastfingers' },
  { id: '4.5', domainId: 4, name: 'Thử phím tắt công nghệ mới', description: 'Cài đặt hoặc thực hành 3 phím tắt tăng năng suất' },
  { id: '4.6', domainId: 4, name: 'Tóm tắt bài viết vào 3 gạch', description: 'Rèn luyện tư duy cô đọng bản chất thông tin' },
  { id: '4.7', domainId: 4, name: 'Học mẹo Excel / Google Sheet', description: 'Nắm vững một hàm hoặc thủ thuật bảng tính hữu dụng' },
  { id: '4.8', domainId: 4, name: 'Vẽ nháp sơ đồ tư duy', description: 'Dùng bút phác họa các ý tưởng đang rối trong đầu' },
  { id: '4.9', domainId: 4, name: 'Nghe đoạn podcast ngắn', description: 'Tiếp nhận góc nhìn mới mẻ từ các chuyên gia' },
  { id: '4.10', domainId: 4, name: 'Tìm hiểu cách sửa đồ vật hỏng', description: 'Xem video mẹo tự sửa quạt, bóng đèn, phích cắm phòng trọ' },

  // Lĩnh vực 5: Tiền / Tiết kiệm
  { id: '5.1', domainId: 5, name: 'Ghi chép chi tiêu hôm nay', description: 'Điền chính xác các khoản đã móc ví trong ngày' },
  { id: '5.2', domainId: 5, name: 'Hủy dịch vụ không dùng', description: 'Hủy 1 app trừ tiền tự động hoặc gói cước thừa thãi' },
  { id: '5.3', domainId: 5, name: 'Nhặt tiền lẻ bỏ hũ tích lũy', description: 'Tập hợp tất cả tiền 1k, 2k, 5k vào một chiếc lọ' },
  { id: '5.4', domainId: 5, name: 'Kiểm tra tài khoản bình tĩnh', description: 'Đối mặt với số dư hiện tại mà không tự trách mình' },
  { id: '5.5', domainId: 5, name: 'So sánh giá đồ cần mua', description: 'Tìm 3 shop khác nhau để chọn mức giá tối ưu nhất' },
  { id: '5.6', domainId: 5, name: 'Nấu bữa cơm dưới 25k', description: 'Thử thách dinh dưỡng tiết kiệm tối đa cho sinh viên' },
  { id: '5.7', domainId: 5, name: 'Đổi tiền chẵn lấy tiền lẻ', description: 'Chuẩn bị sẵn xấp tiền nhỏ để mua đồ lề đường' },
  { id: '5.8', domainId: 5, name: 'Thử thách 0 đồng cho buổi tối', description: 'Một buổi tối hoàn toàn không phát sinh bất kỳ chi phí nào' },
  { id: '5.9', domainId: 5, name: 'Đọc 1 nguyên lý tài chính', description: 'Tìm hiểu quy tắc 50/30/20 hoặc lãi kép' },
  { id: '5.10', domainId: 5, name: 'Kiểm kê đồ đạc có giá trị', description: 'Ghi lại danh mục tài sản để biết mình đang có những gì' },

  // Lĩnh vực 6: Sức khỏe / Vận động
  { id: '6.1', domainId: 6, name: 'Uống ly nước ấm 300ml', description: 'Cung cấp nước ngay khi ngủ dậy hoặc lúc mệt mỏi' },
  { id: '6.2', domainId: 6, name: 'Hít đất hoặc Squat 20 cái', description: 'Đốt cháy năng lượng tích tụ và đánh thức cơ bắp' },
  { id: '6.3', domainId: 6, name: 'Giãn cơ cổ vai gáy', description: 'Thả lỏng các đốt sống sau hàng giờ ngồi dán mắt vào màn hình' },
  { id: '6.4', domainId: 6, name: 'Đi thang bộ thay vì thang máy', description: 'Tập luyện tim mạch tự nhiên khi lên xuống phòng trọ' },
  { id: '6.5', domainId: 6, name: 'Hít thở sâu nhịp 4-7-8', description: 'Hạ nhịp tim và làm dịu hệ thần kinh đang căng thẳng' },
  { id: '6.6', domainId: 6, name: 'Rửa mặt nước mát massage', description: 'Làm sạch bụi bặm đường phố Sài Gòn và sảng khoái tinh thần' },
  { id: '6.7', domainId: 6, name: 'Quy tắc 20-20-20 cho mắt', description: 'Nhìn xa 6 mét trong 20 giây để bảo vệ thị lực' },
  { id: '6.8', domainId: 6, name: 'Đi bộ quanh khu trọ', description: 'Bước đi thả lỏng không cầm điện thoại quanh khu dân cư' },
  { id: '6.9', domainId: 6, name: 'Ăn 1 củ khoai / trái chuối', description: 'Bổ sung kali và chất xơ tự nhiên thay cho đồ ăn nhanh' },
  { id: '6.10', domainId: 6, name: 'Tắm sớm trước 21h', description: 'Bảo vệ sức khỏe và giúp giấc ngủ sâu hơn' },

  // Lĩnh vực 7: Ở / Dọn trọ
  { id: '7.1', domainId: 7, name: 'Gấp mền gối phẳng phiu', description: 'Tạo chiến thắng đầu tiên trong ngày ngay trên chiếc giường trọ' },
  { id: '7.2', domainId: 7, name: 'Lau mặt bàn học / làm việc', description: 'Lau sạch bụi mịn Sài Gòn trả lại mặt bàn sáng sủa' },
  { id: '7.3', domainId: 7, name: 'Quét sạch một góc sàn', description: 'Dọn sạch tóc rụng và bụi ở góc trọ' },
  { id: '7.4', domainId: 7, name: 'Vứt 3 món rác / đồ cũ', description: 'Ném ngay những bọc nilon, vỏ hộp, biên lai không cần thiết' },
  { id: '7.5', domainId: 7, name: 'Xếp lại giá dép trước cửa', description: 'Kê ngay ngắn từng đôi giày dép tạo cảm giác gọn gàng' },
  { id: '7.6', domainId: 7, name: 'Mở toang cửa sổ đón gió trời', description: 'Để không khí tự nhiên lưu thông xua tan mùi ẩm mốc' },
  { id: '7.7', domainId: 7, name: 'Xịt thơm / tinh dầu sả chanh', description: 'Tạo mùi hương thư giãn xua đuổi muỗi và côn trùng' },
  { id: '7.8', domainId: 7, name: 'Thay vỏ gối sạch', description: 'Đặt lưng xuống chiếc gối thơm mùi nắng giặt mới' },
  { id: '7.9', domainId: 7, name: 'Rửa sạch toàn bộ chén đũa đọng', description: 'Không để chiếc chén nào ngâm qua đêm trong bồn' },
  { id: '7.10', domainId: 7, name: 'Dọn gọn dây sạc, ổ cắm', description: 'Cuộn gọn đống dây nhợ lòng thòng gây rối mắt và nguy hiểm' },

  // Lĩnh vực 8: Chơi / Giải trí rẻ
  { id: '8.1', domainId: 8, name: 'Ngồi bệt bờ kè ngắm gió', description: 'Tận hưởng gió mát rượi kênh Nhiêu Lộc / kênh Tàu Hủ' },
  { id: '8.2', domainId: 8, name: 'Nghe trọn 1 bài nhạc cũ', description: 'Nhắm mắt đắm chìm trong giai điệu mà không bấm next' },
  { id: '8.3', domainId: 8, name: 'Chụp 3 góc ảnh từ cửa sổ', description: 'Bắt trọn ánh nắng, dây điện chằng chịt hoặc góc phố' },
  { id: '8.4', domainId: 8, name: 'Lượn tiệm sách cũ đường Trần Nhân Tôn', description: 'Hít hà mùi sách xưa và tìm cuốn truyện 10k' },
  { id: '8.5', domainId: 8, name: 'Ngắm đèn đường bật sáng lúc 18h', description: 'Chứng kiến khoảnh khắc thành phố chuyển mình sang đêm' },
  { id: '8.6', domainId: 8, name: 'Xem người ta câu cá bờ kênh', description: 'Quan sát sự kiên nhẫn tĩnh lặng của những người câu cá' },
  { id: '8.7', domainId: 8, name: 'Thử món ăn vặt tuổi thơ 10k', description: 'Bò bía ngọt, kẹo chỉ hoặc bánh tráng nướng lề đường' },
  { id: '8.8', domainId: 8, name: 'Ngắm dòng người giờ tan tầm', description: 'Thấy ai ai cũng đang nỗ lực mưu sinh tại thành phố này' },
  { id: '8.9', domainId: 8, name: 'Ngồi ghế đá công viên Tao Đàn', description: 'Nghe tiếng chim hót và ngắm các cụ già tập dưỡng sinh' },
  { id: '8.10', domainId: 8, name: 'Vẽ bậy nguệch ngoạc lên giấy', description: 'Không phán xét xấu đẹp, để tay tự do vẽ nguệch ngoạc xả stress' },

  // Lĩnh vực 9: Làm / Kiếm thêm
  { id: '9.1', domainId: 9, name: 'Cập nhật 1 gạch đầu dòng CV', description: 'Thêm một kỹ năng hoặc dự án nhỏ vào hồ sơ xin việc' },
  { id: '9.2', domainId: 9, name: 'Tìm 3 tin tuyển dụng freelance', description: 'Lướt các nhóm xem thị trường đang cần kỹ năng gì' },
  { id: '9.3', domainId: 9, name: 'Dọn dẹp màn hình máy tính desktop', description: 'Xóa bớt file tạm, gom thư mục lại cho thoáng mắt' },
  { id: '9.4', domainId: 9, name: 'Viết nháp 1 email quan trọng', description: 'Gõ ra những điều muốn gửi mà trước giờ còn ngập ngừng' },
  { id: '9.5', domainId: 9, name: 'Nghiên cứu 1 mô hình kiếm tiền nhỏ', description: 'Tìm hiểu cách affiliate, bán đồ cũ hoặc nhận việc làm thêm' },
  { id: '9.6', domainId: 9, name: 'Lên 3 việc cốt lõi cho ngày mai', description: 'Định hình ngày mai để thức dậy không bị mơ hồ' },
  { id: '9.7', domainId: 9, name: 'Đọc 1 bài chia sẻ bài học nghề', description: 'Học kinh nghiệm xương máu từ người đi trước trong ngành' },
  { id: '9.8', domainId: 9, name: 'Học 1 câu lệnh prompt AI thông minh', description: 'Tối ưu hóa cách ra lệnh để AI làm việc phụ mình' },
  { id: '9.9', domainId: 9, name: 'Dọn hòm thư Gmail về 0 inbox', description: 'Xóa thư rác quảng cáo, hủy đăng ký nhận tin rác' },
  { id: '9.10', domainId: 9, name: 'Ghi lại 1 ý tưởng kiếm thêm nhỏ', description: 'Phác thảo ý tưởng bán món đồ thủ công hoặc dịch vụ mini' },

  // Lĩnh vực 10: Ghi / Nhìn lại
  { id: '10.1', domainId: 10, name: 'Ghi 3 điều biết ơn hôm nay', description: 'Nhận ra những ân huệ nhỏ bé vẫn đang che chở cho mình' },
  { id: '10.2', domainId: 10, name: 'Khoảnh khắc vui nhất trong ngày', description: 'Ghi lại 1 nụ cười hoặc cảm giác dễ chịu đã qua' },
  { id: '10.3', domainId: 10, name: 'Nhật ký 5 dòng về 1 người đã gặp', description: 'Lưu giữ bóng hình của một người lướt qua cuộc đời bạn' },
  { id: '10.4', domainId: 10, name: 'Cảm xúc ngắm mưa rào Sài Gòn', description: 'Nghe tiếng mưa lộp độp trên mái tôn phòng trọ' },
  { id: '10.5', domainId: 10, name: 'Đánh giá mức pin năng lượng', description: 'Tự chấm điểm thể chất và tâm trí từ 1 đến 10' },
  { id: '10.6', domainId: 10, name: 'Gửi vài dòng cho mình năm trước', description: 'Thấy mình đã kiên cường vượt qua chặng đường dài thế nào' },
  { id: '10.7', domainId: 10, name: '1 bài học từ sai lầm nhỏ', description: 'Chuyển hóa sự bực bội thành kinh nghiệm quý báu' },
  { id: '10.8', domainId: 10, name: 'Ghi lại góc quán thân thương', description: 'Mô tả quán ăn quen nơi bạn hay ngồi ăn một mình' },
  { id: '10.9', domainId: 10, name: 'Chấm sao cho ngày hôm nay', description: 'Đóng lại một ngày và chuẩn bị tâm thế cho ngày mới' },
  { id: '10.10', domainId: 10, name: 'Ngồi im 10 phút tĩnh lặng tuyệt đối', description: 'Không điện thoại, không nhạc, chỉ có hơi thở và bạn' }
];
