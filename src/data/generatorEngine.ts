import { Milestone } from '../types';
import { DOMAINS, TICKET_TYPES } from './domains';

// Variations for creating realistic, dopamine-infused 10-minute micro-actions in Saigon
interface TicketVariant {
  actions: string[];
  locations: string[];
  rewards: string[];
}

// Map template variations tailored for each of the 10 domains
const DOMAIN_TEMPLATES: Record<number, {
  actions: string[];
  locations: string[];
  rewards: string[];
}> = {
  1: { // Đi lại / Khám phá
    actions: [
      'Đi bộ theo hướng rẽ phải 3 lần liên tiếp',
      'Đứng trên thành cầu hứng gió mát trong 10 phút',
      'Lên xe buýt đi đúng 2 trạm rồi xuống tản bộ',
      'Bước vào con hẻm sâu nhất gần phòng trọ',
      'Vào một quán nước có chữ cái đầu là C hoặc T',
      'Ghé một ngôi chùa cổ hoặc nhà thờ vắng người',
      'Đứng đếm 20 chiếc xe máy chở đồ cồng kềnh',
      'Đi tìm một bức tường có hình vẽ graffiti hoặc rêu phong',
      'Rảo bước quanh khu chợ dân sinh lúc tan tầm',
      'Đi dọc bờ kè không đeo tai nghe để nghe âm thanh phố'
    ],
    locations: [
      'Hẻm cụt đường Hoàng Sa / Trường Sa',
      'Bến xe buýt gần phòng trọ nhất',
      'Cầu Mống / Cầu Thị Nghè / Cầu chữ Y',
      'Công viên Gia Định / Lê Văn Tám / Tao Đàn',
      'Khu hẻm ẩm thực người Hoa Quận 5',
      'Đoạn đường một chiều gần ngã tư đông đúc',
      'Khu chợ cóc sau lưng trường đại học',
      'Góc vỉa hè dưới tán cây dầu cổ thụ',
      'Hẻm ray xe lửa Phú Nhuận / Bình Thạnh',
      'Quanh khu trọ trong bán kính 300 mét'
    ],
    rewards: [
      'Phát hiện một quán hủ tiếu gõ giấu mình cực thơm ngon',
      'Cảm giác lồng ngực nhẹ bẫng sau cả ngày ngột ngạt trong phòng',
      'Bắt gặp một bức ảnh ánh sáng hoàng hôn xuyên qua kẽ lá tuyệt đẹp',
      'Nhận ra Sài Gòn luôn có những ngách bình yên khó tin',
      'Tâm trí xả sạch cơn nhức đầu do nhìn màn hình vi tính',
      'Tìm thấy góc ngồi hóng mát bí mật cho những ngày buồn',
      'Cảm giác như vừa hoàn thành một chuyến vi hành khám phá mới mẻ',
      'Nhìn thấy nụ cười hiền hậu của một cô bán gánh nước',
      'Tập trung vào bước chân giúp giải tỏa bớt lo âu tương lai',
      'Thưởng thức làn gió sông xua tan hoàn toàn cái oi bức'
    ]
  },
  2: { // Ăn uống / Nấu ăn
    actions: [
      'Mua một ly nước mía hoặc rau má đậu xanh 10k',
      'Nấu nhanh một tô mì gói bỏ thêm 1 quả trứng lòng đào và hành',
      'Ghé xe đẩy mua bịch trái cây gọt sẵn chấm muối tôm',
      'Ăn 1 ổ bánh mì pate trứng vỉa hè không bấm điện thoại',
      'Thử một loại xốt nêm mới chưa từng dùng trước đây',
      'Ghé quán chè cổ điển gọi món chè lạ nhất trên menu',
      'Tự pha một bình nước chanh mật ong hoặc sả gừng ấm',
      'Mua 1 lạng thịt băm và nắm rau muống chợ chiều tự nấu canh',
      'Ngồi quán vỉa hè nhâm nhi dĩa bánh tráng cuốn sốt me',
      'Ăn chậm từng muỗng cơm, nhai đủ 20 lần mỗi ngụm'
    ],
    locations: [
      'Xe nước sâm góc ngã tư đông đúc',
      'Căn bếp nhỏ kê góc ban công phòng trọ',
      'Gánh hàng rong trước cổng trường tiểu học',
      'Tiệm hủ tiếu mì người Hoa nước lèo trong veo',
      'Quán bánh mì bì / heo quay lề đường',
      'Chợ dân sinh giờ dọn hàng 18h30',
      'Quán nước giải khát vỉa hè bình dân',
      'Bàn ăn xếp gọn gàng trong căn phòng 15m²',
      'Tiệm xôi mặn bọc lá chuối đầu hẻm',
      'Xe trà dâu / trà tắc ven bờ kênh'
    ],
    rewards: [
      'Cảm giác ấm bụng và tràn trề năng lượng chỉ với 20k',
      'Tự hào vì bữa ăn do chính tay mình chăm chút gọn gàng',
      'Vị giác bùng nổ với món gia vị kết hợp mới lạ',
      'Cắt đứt thói quen cắm mặt vào điện thoại khi ăn',
      'Tiết kiệm được 40k tiền đặt đồ ăn qua app giao hàng',
      'Được cô chủ quán múc thêm cho chút nước xốt đậm đà',
      'Cơ thể nhẹ nhõm hơn hẳn nhờ uống ly nước thảo mộc lành mát',
      'Tận hưởng trọn vẹn hương vị mộc mạc thơm phức của gạo mới',
      'Nụ cười thân ái từ bà cụ bán xôi khiến lòng ấm áp',
      'Cảm giác được vỗ về chiếc bụng sau một ngày dài cày cuốc'
    ]
  },
  3: { // Người / Nói chuyện
    actions: [
      'Gặp bác bảo vệ hoặc cô chủ trọ, cười tươi và chào một câu',
      'Nói chuyện phiếm 2 câu với chú tài xế Grab / xe ôm',
      'Nhắn tin hỏi thăm 1 người bạn cũ lâu ngày không tương tác',
      'Alo 10 phút về nhà cho bố mẹ hoặc người thân',
      'Cảm ơn bạn thu ngân siêu thị và nhìn thẳng vào mắt mỉm cười',
      'Nhặt giúp đồ đánh rơi hoặc dắt phụ chiếc xe cho người bên cạnh',
      'Khen chân thành một chi tiết đẹp ở người đối diện',
      'Hỏi thăm cô bán vé số dạo quê ở tỉnh nào vào Sài Gòn',
      'Lắng nghe chăm chú câu chuyện của bạn cùng phòng mà không ngắt lời',
      'Ngồi im tại quán cà phê lắng nghe âm vang cuộc sống xung quanh'
    ],
    locations: [
      'Cổng nhà xe phòng trọ chung',
      'Góc đón xe công nghệ ngã tư đường',
      'Quầy thanh toán bách hóa xanh / Circle K',
      'Hành lang tầng trọ hoặc ban công phơi đồ',
      'Băng ghế chờ trạm xe buýt',
      'Quán trà đá vỉa hè',
      'Cửa hàng tạp hóa nhỏ đầu hẻm',
      'Bên góc cửa sổ nhìn xuống đường phố',
      'Bãi gửi xe chung cư mini',
      'Góc ban công lúc chập choạng tối'
    ],
    rewards: [
      'Nhận lại nụ cười rạng rỡ bất ngờ làm tan biến mệt mỏi',
      'Nhận ra mình không hề cô độc giữa thành phố tấp nập này',
      'Giọng nói của người thân sạc đầy 100% pin tinh thần',
      'Kết nối lại một tình bạn đẹp tưởng chừng đã dần phai nhạt',
      'Cảm giác làm được một điều tử tế nhỏ làm lòng thanh thản',
      'Được nghe một góc nhìn cuộc đời đầy trải nghiệm và thú vị',
      'Bác chủ trọ bỗng trở nên dễ gần và nhiệt tình hơn hẳn',
      'Giải tỏa bớt cảm giác ngại giao tiếp (social anxiety)',
      'Học được bài học kiên cường từ câu chuyện mưu sinh của người khác',
      'Một hạt mầm bình an nảy nở trong tâm hồn'
    ]
  },
  4: { // Học / Kỹ năng
    actions: [
      'Lật mở cuốn sách giấy đọc chăm chú đúng 5 trang',
      'Luyện gõ phím 10 ngón tốc độ trong 10 phút',
      'Ghi nhớ 3 từ vựng hoặc thành ngữ mới và đặt câu ngay',
      'Xem 1 video ngắn phân tích cơ chế hoạt động của một sự vật',
      'Tóm tắt bài viết hay vừa đọc vào 3 gạch đầu dòng cô đọng',
      'Học một phím tắt máy tính mới giúp tăng tốc độ làm việc',
      'Tìm hiểu một hàm Excel / Google Sheet xịn xò',
      'Phác thảo sơ đồ tư duy bằng bút chì cho một dự định',
      'Nghe 1 đoạn podcast phân tích tâm lý hoặc phát triển bản thân',
      'Tìm hiểu cách tháo lắp hoặc khắc phục 1 thiết bị gia dụng hỏng'
    ],
    locations: [
      'Bàn học cạnh cửa sổ ngập nắng',
      'Góc bàn làm việc gọn gàng vừa lau',
      'Góc quán cà phê sách tĩnh lặng',
      'Chiếc ghế xếp quen thuộc trong phòng',
      'Thư viện công cộng hoặc nhà sách Phương Nam',
      'Băng ghế đá dưới bóng cây xanh',
      'Giường trọ kê sát vách tường sạch sẽ',
      'Góc ban công thoáng gió mát',
      'Quán cà phê 24h yên tĩnh',
      'Mặt bàn kê chiếc đèn vàng ấm cúng'
    ],
    rewards: [
      'Tự hào vì não bộ vừa tiếp nạp thêm một tri thức giá trị',
      'Tốc độ gõ phím tăng vọt, thao tác mượt mà chuẩn xác',
      'Khai mở một góc nhìn hoàn toàn mới lạ về vấn đề cũ',
      'Cảm giác thông thái và tự tin hơn trong các cuộc trao đổi',
      'Bộ não được giải phóng khỏi trạng thái lướt video ngắn vô thức',
      'Sở hữu một công cụ mới giúp giải quyết công việc nhanh gấp đôi',
      'Thấy bản thân mỗi ngày một sắc bén và tiến bộ rõ rệt',
      'Tự tay hiểu được cơ chế vận hành của đồ vật xung quanh',
      'Sự tập trung sâu (deep focus) mang lại cảm giác thành tựu lớn',
      'Xóa tan cảm giác dậm chân tại chỗ của tuổi trẻ'
    ]
  },
  5: { // Tiền / Tiết kiệm
    actions: [
      'Mở sổ tay ghi chép đầy đủ chi tiêu phát sinh trong ngày',
      'Tập hợp tất cả tiền lẻ 1k, 2k, 5k bỏ vào chiếc hũ tích lũy',
      'Rà soát và bấm hủy 1 gói cước hoặc dịch vụ tự động trừ tiền',
      'Mở app ngân hàng nhìn thẳng vào số dư với tâm thế điềm tĩnh',
      'So sánh giá một món đồ muốn mua trên 3 trang thương mại',
      'Tự chuẩn bị một bữa ăn no đủ với ngân sách dưới 25k',
      'Đặt mục tiêu thử thách chi tiêu 0 đồng cho tối nay',
      'Đọc và hiểu bản chất của quy tắc phân bổ tài chính 50/30/20',
      'Lọc ra 1 món đồ không dùng nữa để đăng thanh lý thu hồi vốn',
      'Đếm lại tổng tiền mặt và tài sản hiện có trong tay'
    ],
    locations: [
      'Bàn học với cuốn sổ tay tài chính',
      'Chiếc ví tiền da sờn nhưng ngăn nắp',
      'Màn hình app ngân hàng trên điện thoại',
      'Chợ sinh viên bán đồ tươi rẻ',
      'Căn phòng trọ thân thương',
      'Góc hũ tiết kiệm đặt đầu tủ',
      'Bàn ăn với bữa cơm tự nấu ấm lòng',
      'Bàn làm việc với bảng tính theo dõi dòng tiền',
      'Góc tủ quần áo chuẩn bị đồ thanh lý',
      'Khu vực kiểm đếm chi tiêu cuối ngày'
    ],
    rewards: [
      'Cảm giác an tâm, kiểm soát hoàn toàn được vận mệnh tài chính',
      'Chiếc hũ tiền lẻ đầy lên từng ngày là minh chứng của tính kiên trì',
      'Tiết kiệm ngay được vài trăm ngàn tiền dịch vụ vô bổ hàng tháng',
      'Xóa bỏ nỗi sợ hãi mơ hồ về tiền bạc bằng những con số rõ ràng',
      'Tránh được bẫy mua sắm bốc đồng nhờ quy tắc trì hoãn 10 phút',
      'Cảm giác chiến thắng khi hoàn thành thử thách 0 đồng rực rỡ',
      'Có được tầm nhìn dài hạn và lộ trình tự do tài chính rõ nét',
      'Thu về một khoản tiền nhỏ từ đồ cũ tưởng chừng bỏ xó',
      'Học được cách trân trọng từng đồng mồ hôi công sức làm ra',
      'Tâm trí bình thản ngủ ngon không còn lo lắng'
    ]
  },
  6: { // Sức khỏe / Vận động
    actions: [
      'Uống một ly nước lọc ấm 300ml từng ngụm chậm rãi',
      'Hít đất hoặc squat đúng kỹ thuật 20 cái liên tục',
      'Thực hiện bài giãn cơ cổ, vai, gáy và lưng dưới trong 10 phút',
      'Đi thang bộ lên xuống phòng trọ thay vì đứng chờ thang máy',
      'Nhắm mắt hít thở sâu theo nhịp 4-7-8 để điều hòa nhịp tim',
      'Rửa mặt bằng nước mát và massage nhẹ nhàng vùng mắt',
      'Thực hiện quy tắc 20-20-20: nhìn vật thể xa 6m để mắt nghỉ',
      'Rảo bộ thả lỏng 1 vòng quanh khu trọ hít thở khí trời',
      'Ăn một quả chuối hoặc củ khoai bổ sung năng lượng tự nhiên',
      'Chuẩn bị nước ấm và đi tắm sớm trước 21h tối'
    ],
    locations: [
      'Góc sàn phòng trọ sạch sẽ',
      'Cầu thang bộ khu nhà trọ',
      'Bồn rửa mặt với làn nước mát lành',
      'Ban công hóng gió nhìn ra chân trời',
      'Con đường nội bộ râm mát khu dân cư',
      'Chiếc giường êm ái với gối thẳng thớm',
      'Góc phòng tắm sáng sủa',
      'Bàn làm việc với cốc nước đầy',
      'Khung cửa sổ nhìn ra ngọn cây xanh',
      'Khoảng sân thượng lộng gió'
    ],
    rewards: [
      'Các đốt sống kêu tách một tiếng giòn giã, cơn mỏi vai gáy biến mất',
      'Máu huyết lưu thông rần rần, cả người bừng tỉnh sinh lực',
      'Đôi mắt bớt khô rát, thị lực sáng rõ trở lại tức thì',
      'Nhịp tim chậm lại, cơn cáu gắt căng thẳng tự động tiêu tan',
      'Làn da mát mẻ sạch bụi đường, tinh thần sảng khoái tối đa',
      'Cảm nhận cơ bắp săn chắc và cơ thể ngày một khỏe khoắn',
      'Dễ dàng chìm vào giấc ngủ sâu và êm dịu lúc đêm về',
      'Hệ tiêu hóa êm ái hơn nhờ cốc nước ấm khởi đầu ngày mới',
      'Xây dựng được thói quen kỷ luật thể chất mà không tốn 1 xu',
      'Tự hào vì đã biết chăm sóc ngôi đền thân thể của chính mình'
    ]
  },
  7: { // Ở / Dọn trọ
    actions: [
      'Gấp chiếc mền và vuốt phẳng ga giường ngay khi thức dậy',
      'Dùng khăn ẩm lau sạch bụi mịn trên mặt bàn làm việc',
      'Quét sạch tóc rụng và bụi bặm ở 4 góc phòng trọ',
      'Thu gom và vứt ngay 3 món đồ cũ, rác hoặc vỏ hộp không dùng',
      'Xếp lại hàng giày dép trước cửa phòng ngay ngắn theo hàng',
      'Mở toang toàn bộ cửa sổ đón làn gió đối lưu xua tan mùi ẩm',
      'Xịt chút tinh dầu sả chanh hoặc đặt vỏ cam khử mùi phòng',
      'Tháo vỏ gối mang đi ngâm giặt để tối nằm thơm phức',
      'Rửa sạch bóng toàn bộ chén đũa còn đọng trong bồn rửa',
      'Gom các loại dây sạc, cáp máy tính cuộn lại gọn gàng'
    ],
    locations: [
      'Chiếc giường ngủ trong phòng trọ',
      'Mặt bàn học kê sát vách',
      'Sàn gạch bông phòng trọ',
      'Kệ để giày dép trước lối vào',
      'Khung cửa sổ đón gió ban mai',
      'Bồn rửa chén góc phòng bếp nhỏ',
      'Góc bàn làm việc đầy dây cáp điện',
      'Tủ quần áo xếp theo ngăn',
      'Sọt rác nhỏ cạnh bàn',
      'Khoảng không gian 15-20m² thân thuộc'
    ],
    rewards: [
      'Căn phòng bỗng chốc thoáng đãng, thơm tho như một ốc đảo bình yên',
      'Mắt nhìn thấy sự trật tự giúp não bộ lập tức ngừng trạng thái hỗn loạn',
      'Chiến thắng nhỏ đầu tiên trong ngày tạo đà cho chuỗi năng suất cao',
      'Cảm giác bước chân trần lên nền gạch sạch bóng cực kỳ sướng',
      'Không còn cảm giác ngột ngạt, bức bối mỗi khi mở cửa bước vào phòng',
      'Mùi hương tinh dầu tự nhiên xua đuổi muỗi và tạo cảm hứng thư giãn',
      'Đặt đầu xuống gối thơm tho mang lại giấc ngủ ngọt ngào',
      'Không gian làm việc sáng bừng thúc đẩy cảm hứng sáng tạo',
      'Tự hào biến căn phòng thuê đơn sơ thành tổ ấm đáng sống',
      'Cắt đứt hoàn toàn thói quen trì hoãn bừa bộn'
    ]
  },
  8: { // Chơi / Giải trí rẻ
    actions: [
      'Ngồi bệt bên bờ kè nhìn dòng nước lững lờ và đón gió chiều',
      'Bật trọn vẹn 1 bài hát yêu thích, nhắm mắt nghe không bấm next',
      'Cầm điện thoại bắt trọn 3 góc ảnh thú vị ngay từ ô cửa sổ trọ',
      'Ghé tiệm sách cũ đường Trần Nhân Tôn lật giở những trang ố vàng',
      'Đứng chờ khoảnh khắc đèn đường đồng loạt bật sáng lúc 18h',
      'Đứng nhìn người ta buông cần câu cá bên bờ kênh Nhiêu Lộc',
      'Thưởng thức 1 món quà vặt tuổi thơ 10k: bò bía ngọt hoặc bánh tráng',
      'Ngồi sau xe máy hoặc đạp xe chậm rãi ngắm phố phường lên đèn',
      'Ngồi trên băng ghế đá công viên ngắm các cụ già tập thái cực quyền',
      'Lấy giấy nháp vẽ nguệch ngoạc những nét vẽ tự do không cần đẹp'
    ],
    locations: [
      'Bờ kè kênh Nhiêu Lộc đoạn cầu Kiệu / cầu Bông',
      'Ghế đá dưới tán cây cổ thụ công viên Tao Đàn',
      'Ô cửa sổ phòng trọ nhìn ra mái ngói rêu phong',
      'Phố sách cũ đường Trần Nhân Tôn Quận 5',
      'Góc ngã tư Pasteur - Nguyễn Thị Minh Khai',
      'Cầu đi bộ Ánh Sao hoặc cầu Mống lộng gió',
      'Bậc thềm Bưu điện Thành phố / Nhà thờ Đức Bà',
      'Xe bán bò bía ngọt trước cổng trường',
      'Băng ghế dài trạm xe buýt Hàm Nghi',
      'Góc ban công ngắm nhìn những đàn chim bay về tổ'
    ],
    rewards: [
      'Thấy tâm hồn được tưới mát mà chẳng tốn một đồng xu nào',
      'Âm nhạc chân thực chạm tới từng tế bào cảm xúc bị lãng quên',
      'Có được một bức ảnh nghệ thuật đầy chiều sâu về Sài Gòn',
      'Mùi sách cũ mang lại sự hoài niệm và tĩnh lặng sâu sắc',
      'Khoảnh khắc đèn vàng bừng sáng khiến tim bỗng đập rộn ràng',
      'Học được sự kiên nhẫn và phong thái ung dung từ những bác câu cá',
      'Vị ngọt bùi của món ăn tuổi thơ khơi lại ký ức trong trẻo',
      'Phố xá rực rỡ sắc màu biến thành một bức tranh sống động',
      'Cảm giác xả stress tuyệt vời khi bàn tay tự do sáng tạo',
      'Tìm lại được sự hồn nhiên vốn có giữa guồng quay bộn bề'
    ]
  },
  9: { // Làm / Kiếm thêm
    actions: [
      'Mở bản CV ra, bổ sung hoặc chuốt lại 1 dòng mô tả thành tích',
      'Lướt các hội nhóm tìm và lưu lại 3 tin tuyển dụng freelance phù hợp',
      'Dọn dẹp các biểu tượng bừa bộn trên màn hình máy tính Desktop',
      'Viết nháp một email đề xuất hoặc thư xin việc quan trọng',
      'Đọc tìm hiểu 1 cách thức kiếm tiền thụ động hoặc làm thêm thiết thực',
      'Viết ra đúng 3 đầu việc quan trọng nhất phải hoàn thành vào ngày mai',
      'Đọc một bài viết chia sẻ kinh nghiệm xử lý khủng hoảng nghề nghiệp',
      'Thực hành thử nghiệm 1 câu lệnh prompt AI phục vụ công việc',
      'Dọn sạch hòm thư điện tử, xóa sạch các email rác và quảng cáo',
      'Ghi nhanh vào sổ 1 ý tưởng sản phẩm hoặc dịch vụ mini có thể làm'
    ],
    locations: [
      'Bàn làm việc với chiếc laptop sáng đèn',
      'Góc quán cà phê phong cách tối giản',
      'Bàn trà ban công thoáng đãng',
      'Thư viện tầng trệt chung cư',
      'Bàn học có ánh sáng đèn học dịu mắt',
      'Màn hình quản lý dự án cá nhân',
      'Sổ tay lập kế hoạch đặt ngay ngắn',
      'Hộp thư đến Gmail trên máy tính',
      'Trang cá nhân LinkedIn đang được tút tát',
      'Không gian làm việc yên ắng đêm muộn'
    ],
    rewards: [
      'Hồ sơ năng lực ngày càng sắc nét, sẵn sàng đón nhận cơ hội mới',
      'Nắm bắt được nhu cầu thực tế của thị trường để định hướng nâng cấp',
      'Màn hình Desktop tinh gọn mang lại cảm giác nhẹ nhõm tức thì',
      'Dũng cảm vượt qua nỗi sợ để gửi đi thông điệp quan trọng',
      'Phát hiện thêm một nguồn thu nhập tiềm năng trong tương lai gần',
      'Thức dậy vào sáng mai với mục tiêu rõ như pha lê, không loay hoay',
      'Trang bị thêm một mẹo nghề nghiệp giúp tránh được cạm bẫy công sở',
      'Thao tác AI nhanh như chớp giúp giải phóng 50% thời gian cày cuốc',
      'Hộp thư 0 inbox đem lại cảm giác tự do vô cùng khoan khoái',
      'Ý tưởng nhỏ nhen nhóm niềm hy vọng về sự tự chủ công việc'
    ]
  },
  10: { // Ghi / Nhìn lại
    actions: [
      'Viết ra 3 điều giản dị mà bạn cảm thấy biết ơn trong ngày hôm nay',
      'Trả lời câu hỏi: Khoảnh khắc nào hôm nay làm mình mỉm cười?',
      'Viết nhật ký 5 dòng mô tả chân dung một người bạn vô tình gặp',
      'Ghi lại những cảm xúc chân thật khi lắng nghe tiếng mưa rào Sài Gòn',
      'Tự chấm điểm năng lượng thể chất và tinh thần từ thang 1 đến 10',
      'Viết một lá thư ngắn 3 câu nhắn nhủ tới chính mình của năm ngoái',
      'Ghi lại một sai lầm nhỏ vừa mắc phải cùng bài học rút ra',
      'Mô tả lại mùi hương hoặc thanh âm của góc quán bạn vừa ghé',
      'Chấm điểm từ 1 đến 5 sao cho ngày hôm nay và viết 1 lý do vì sao',
      'Ngồi im lặng tuyệt đối 10 phút, chỉ theo dõi luồng gió hít vào thở ra'
    ],
    locations: [
      'Trang sổ tay gối đầu giường',
      'Bàn học dưới ánh đèn vàng ấm',
      'Bên khung cửa kính vương hạt mưa',
      'Ban công tầng thượng nhìn về phía tòa tháp Landmark',
      'Góc nệm nhỏ êm ái trước khi ngủ',
      'Góc quán cà phê quen thuộc buổi xế chiều',
      'Băng ghế đá dưới tán hoa giấy',
      'Bên chén trà ấm bốc khói',
      'Bàn trà nhỏ kê cạnh cửa sổ',
      'Khoảng lặng tĩnh mịch giữa đêm Sài Gòn'
    ],
    rewards: [
      'Cảm giác ấm áp lan tỏa khắp lồng ngực vì nhận ra mình vẫn may mắn',
      'Ký ức đẹp được lưu giữ mãi mãi thay vì trôi tuột vào quên lãng',
      'Thấu cảm sâu sắc hơn với số phận và nhịp sống của người xung quanh',
      'Cơn mưa Sài Gòn gột rửa sạch những muộn phiền tích tụ bấy lâu',
      'Lắng nghe cơ thể để biết khi nào cần nghỉ ngơi phục hồi',
      'Nhận ra mình đã trưởng thành và mạnh mẽ hơn quá khứ rất nhiều',
      'Tha thứ cho sự không hoàn hảo của bản thân để bước tiếp nhẹ nhàng',
      'Tâm hồn trở nên tinh tế, biết rung động trước những điều bình dị',
      'Đóng lại một ngày trọn vẹn trong sự bình an và biết ơn',
      'Tâm trí tĩnh lặng như mặt hồ không một gợn sóng'
    ]
  }
};

// Deterministically generate a milestone for any ID from 1 to 1000
export function getMilestoneById(id: number): Milestone {
  const safeId = Math.max(1, Math.min(1000, id));
  // Domain 1 to 10
  const domainIndex = Math.floor((safeId - 1) / 100); // 0 to 9
  const domainId = domainIndex + 1;
  const domain = DOMAINS[domainIndex] || DOMAINS[0];

  // Ticket in domain: 0 to 9 (corresponds to 1.1 to 1.10 etc)
  const ticketInDomainIndex = Math.floor(((safeId - 1) % 100) / 10); // 0 to 9
  const ticketTypeId = `${domainId}.${ticketInDomainIndex + 1}`;
  const ticketType = TICKET_TYPES.find(t => t.id === ticketTypeId) || {
    id: ticketTypeId,
    name: 'Vé 10 phút',
    description: 'Nhiệm vụ 10 phút'
  };

  // Dopamine index: 0 to 9 within the ticket type
  const dopamineIndex = (safeId - 1) % 10;

  const template = DOMAIN_TEMPLATES[domainId] || DOMAIN_TEMPLATES[1];

  // Pick deterministic actions based on combination of ticket and dopamine index
  const actionIdx = (ticketInDomainIndex * 3 + dopamineIndex) % template.actions.length;
  const locIdx = (ticketInDomainIndex * 7 + dopamineIndex * 2) % template.locations.length;
  const rewardIdx = (ticketInDomainIndex + dopamineIndex * 4) % template.rewards.length;

  const action = template.actions[actionIdx];
  const location = template.locations[locIdx];
  const reward = template.rewards[rewardIdx];

  // Full title following strict formula: [Hành động 10 phút] + [Ở đâu] + [Thưởng biến đổi]
  const title = `[${action}] + [${location}] + [${reward}]`;

  return {
    id: safeId,
    domainId,
    ticketTypeId,
    ticketTypeName: ticketType.name,
    action,
    location,
    reward,
    title,
    isCompleted: false
  };
}

// Generate all 1000 milestones
let cachedMilestones: Milestone[] | null = null;

export function getAll1000Milestones(): Milestone[] {
  if (cachedMilestones) return cachedMilestones;
  const list: Milestone[] = [];
  for (let i = 1; i <= 1000; i++) {
    list.push(getMilestoneById(i));
  }
  cachedMilestones = list;
  return cachedMilestones;
}

// Generate the 100 milestones for a specific domain (e.g. Domain 1 -> IDs 1 to 100)
export function get100MilestonesForDomain(domainId: number): Milestone[] {
  const startId = (domainId - 1) * 100 + 1;
  const endId = domainId * 100;
  const list: Milestone[] = [];
  for (let i = startId; i <= endId; i++) {
    list.push(getMilestoneById(i));
  }
  return list;
}
