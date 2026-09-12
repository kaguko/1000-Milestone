# 🏙️ Máy Đẻ 1000 Milestone Ở Trọ Sài Gòn
> **Saigon Room Milestone Machine** — Hệ thống bốc vé dopamine 10 phút, bản đồ sao 1000 điểm và sổ đời 4 cột bảo vệ sức khỏe tâm thần cho người ở trọ TP.HCM.

[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini API](https://img.shields.io/badge/Gemini_API-3.8_Flash-4285f4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Mục lục

1. [Bối Cảnh & Vấn Đề (The Why)](#-bối-cảnh--vấn-đề-the-why)
2. [Triết Lý Cốt Lõi: 3 WHY & Luật 90-10](#-triết-lý-cốt-lõi-3-why--luật-90-10)
3. [Các Tính Năng Chính](#-các-tính-năng-chính)
   - [1. Hũ Bốc Thăm Dopamine (Daily Gacha)](#1-hũ-bốc-thăm-dopamine-daily-gacha)
   - [2. Chế Độ Siêu Dễ Cho Người Mới](#2-chế-độ-siêu-dễ-cho-người-mới-simple-mode)
   - [3. Sổ Đời 4 Cột Kiểu Google Sheet](#3-sổ-đời-4-cột-kiểu-google-sheet)
   - [4. Phân Bổ 2 Giờ Sâu & 3 Khe Hở Rìa](#4-phân-bổ-2-giờ-sâu--3-khe-hở-rìa)
   - [5. Hệ Thống 5 Phanh Ổn Định & Phanh Xả](#5-hệ-thống-5-phanh-ổn-định--phanh-xả)
   - [6. Bản Đồ Sao 1000 Điểm (Constellation)](#6-bản-đồ-sao-1000-điểm-constellation)
   - [7. Máy Đẻ 100 Vé & Tích Hợp AI Gemini](#7-máy-đẻ-100-vé--tích-hợp-ai-gemini)
   - [8. Trạm "Soi Gương" Nhận Diện Pattern](#8-trạm-soi-gương-nhận-diện-pattern)
4. [Kiến Trúc & Cấu Trúc Thư Mục](#-kiến-trúc--cấu-trúc-thư-mục)
5. [Cài Đặt & Chạy Ứng Dụng](#-cài-đặt--chạy-ứng-dụng)
6. [Biến Môi Trường (Environment Variables)](#-biến-môi-trường-environment-variables)
7. [Bảo Mật & Lưu Trữ Dữ Liệu (Local-First)](#-bảo-mật--lưu-trữ-dữ-liệu-local-first)

---

## 💡 Bối Cảnh & Vấn Đề (The Why)

Hàng triệu sinh viên và người trẻ từ quê lên TP.HCM sinh sống trong những căn phòng trọ 12–20m² thường rơi vào một vòng lặp độc hại:
* **Hội chứng 4 bức tường:** Cả ngày đi làm/học mệt nhoài, tối về giam mình trong phòng lướt TikTok/Facebook đến 1-2h sáng.
* **Cảm giác tê liệt ý chí:** Quá mệt để nghĩ ra một hoạt động ý nghĩa, nhưng lại cắn rứt vì thấy một ngày trôi qua vô nghĩa.
* **Sợ tốn kém:** Nghĩ rằng muốn xả stress thì phải đi cà phê máy lạnh 60k-80k, ăn nhà hàng sang trọng hay đi bar, trong khi ví tiền cuối tháng cạn kiệt.
* **Overthinking:** Có 10-15 phút rảnh rỗi nhưng tốn hết 20 phút để đắn đo: *"Giờ nên làm cái gì?"*.

**Máy Đẻ 1000 Milestone** ra đời như một liều thuốc giải độc: **Giảm gánh nặng ra quyết định xuống bằng 0** thông qua việc bốc ngẫu nhiên một hành động nhỏ chỉ tốn đúng **10 phút** và **0đ – 20k**, giúp người trẻ bước chân ra khỏi phòng trọ và chạm vào nhịp thở chân thực của Sài Gòn.

---

## 🎯 Triết Lý Cốt Lõi: 3 WHY & Luật 90-10

### 1. 3 WHY
| CÂU HỎI | CÂU TRẢ LỜI CỦA HỆ THỐNG |
| :--- | :--- |
| **Tại sao phải là 1000 Milestone?** | Đủ lớn để não bộ luôn đón nhận kích thích mới lạ (*novelty*), không bao giờ bị nhàm chán lặp lại. |
| **Tại sao phải đúng 10 phút?** | 10 phút là ranh giới vàng: Đủ ngắn để não không thể viện cớ trì hoãn (*lười biếng*), nhưng đủ dài để hoàn thành một hành động có tác động sinh học (*hít thở khí trời, vận động cơ xương*). |
| **Tại sao gắn chặt với phòng trọ Sài Gòn?** | Sài Gòn có một cấu trúc đô thị kỳ diệu: Bước ra khỏi con hẻm trọ là ngay lập tức có xe nước mía 10k, bà bán chuối nướng, tiếng ve kêu bờ kênh, ánh đèn đường vàng vọt. Không cần đi đâu xa, cả một thế giới dopamine lành mạnh ở ngay đầu ngõ. |

### 2. Luật 90-10
* **90% Thời Gian:** Giữ kỷ luật thép cho công việc chuyên môn và ca học sâu (Deep Work Blocks).
* **10% Thời Gian (Tối đa 2 vé = 20 phút mỗi ngày):** Chỉ được nhét vào **3 Khe Hở Rìa** (Sáng thức dậy, Chiều tan tầm, Tối trước khi ngủ). Tuyệt đối không làm vé xả hơi lấn vào giờ làm việc.

---

## 🚀 Các Tính Năng Chính

### 1. Hũ Bốc Thăm Dopamine (Daily Gacha)
- Bốc ngẫu nhiên vé dựa trên thuật toán `=RANDBETWEEN(1, 1000)` mô phỏng hàm Google Sheets.
- **Bộ lọc ngân sách thực tế:** 
  - `🪙 0đ` (Không tốn xu nào: đi dạo ngõ cụt, lau mặt nước mát, nhìn người qua lại).
  - `☕ 20k` (Ly nước mía, bánh tráng nướng vỉa hè).
  - `🍲 50k` (Tô hủ tiếu gõ, ly trà dâu đặc biệt).
- **Bộ lọc hoàn cảnh đặc biệt:** 
  - `Thi cử / Deadline dồn dập` (Chỉ bốc vé giải tỏa nhức mắt, giãn cơ tại chỗ).
  - `Hết tiền cuối tháng` (Bộ lọc vé 0đ triệt để).
  - `Mưa ngập Sài Gòn` (Các hoạt động bên khung cửa sổ ngắm mưa nghe sấm).
- **Đột biến vé (Mutate Ticket):** Tự động tùy biến vị trí vé theo từng quận cụ thể (Bình Thạnh, Tân Bình, Quận 10, Thủ Đức...).

### 2. Chế Độ Siêu Dễ Cho Người Mới (Simple Mode)
- Thiết kế riêng cho người mù công nghệ, người sợ bấm nhầm hoặc người đang kiệt sức:
  - Nút **"Cách Dùng Siêu Dễ"** hướng dẫn bằng 3 bước mộc mạc nhất.
  - Chế độ **Tối Giản (Simple Mode)** ẩn toàn bộ các bảng đồ thị phức tạp, chỉ chừa lại đúng 1 nút bốc vé to rõ.
  - Phím bấm điều hướng rõ ràng, hỗ trợ phím `Esc` và luôn có thanh ghim `[← Quay Lại / Thoát Ra]` chống kẹt màn hình.

### 3. Sổ Đời 4 Cột Kiểu Google Sheet
Dựa trên phương pháp tự quan sát hành vi kinh điển:
- **Cột 1 (Số thứ tự):** ID Milestone (1 đến 1000).
- **Cột 2 (Nhiệm vụ):** Công thức `[Hành động 10p] + [Địa điểm] + [Thưởng biến đổi]`.
- **Cột 3 (Cảm giác sau khi làm):** Ghi chép 1 dòng cảm xúc chân thật ngay khi vừa bước chân về phòng trọ.
- **Cột 4 (Muốn làm lại không?):** Phân loại `Có (Rất cuốn)` hoặc `Không (Trải nghiệm 1 lần là đủ)`.
- **Bộ đo 2 chỉ số ổn định:**
  - `Pin năng lượng`: `+pin` (nạp lại sức) hoặc `-pin` (hơi đuối).
  - `Đo tội lỗi`: Khẳng định đi đúng khe hở rìa, không cắn rứt vì lấn giờ học.
- Hỗ trợ xuất dữ liệu ra file `.CSV` để người dùng import vào Google Sheets cá nhân.

### 4. Phân Bổ 2 Giờ Sâu & 3 Khe Hở Rìa (Slot Scheduler)
- Cài đặt khung giờ học tập chuyên sâu (Ca sáng & Ca chiều).
- Hệ thống tự động tính toán và nhắc nhở thời điểm vàng để thực hiện vé:
  - **Khe 1 (Khởi động ngày mới):** Trước khi vào bàn học/làm.
  - **Khe 2 (Giải phóng năng lượng tồn đọng):** Sau khi tan làm/về phòng.
  - **Khe 3 (Xả stress cuối ngày):** 10 phút trước khi đi ngủ, ngắt hẳn ánh sáng xanh.

### 5. Hệ Thống 5 Phanh Ổn Định & Phanh Xả
- **5 Phanh An Toàn:**
  1. *Phanh Ngân Sách* (Không để vé 10p biến thành mua sắm Shopee/Lazada).
  2. *Phanh Thời Gian* (Đúng 10 phút chuông reo là quay về phòng).
  3. *Phanh Tội Lỗi* (Tự nhắc: "Đây là 10% xả hơi hợp pháp theo luật 90-10").
  4. *Phanh Kiệt Sức* (Nếu quá mệt, bật Phanh Xả).
  5. *Phanh Một Mình* (Không phụ thuộc vào việc bạn bè có rảnh đi cùng hay không).
- **Nút Phanh Xả Khẩn Cấp `[Phanh (Xả)]`:** Cho phép người dùng chọn trạng thái *"Hôm nay kiệt sức, nằm yên 10 phút nghe tiếng quạt quay"* mà vẫn được tính hoàn thành chỉ tiêu, dập tắt tiếng nói tự trách bản thân.

### 6. Bản Đồ Sao 1000 Điểm (Constellation Map)
- 1000 milestone được trực quan hóa thành một dải ngân hà 10 cụm sao tương ứng với 10 miền đời sống:
  1. *Hẻm & Đời sống đường phố Sài Gòn*
  2. *Mùi hương & Vị giác bình dân*
  3. *Âm thanh & Nhịp thở đô thị*
  4. *Cơ thể & Phục hồi giác quan*
  5. *Quan sát xã hội & Con người*
  6. *Góc trọ & Không gian sinh tồn*
  7. *Thiên nhiên & Bầu trời thành phố*
  8. *Ký ức & Hoài niệm Sài Gòn*
  9. *Kết nối ngẫu nhiên không cam kết*
  10. *Tĩnh lặng & Cắt đứt kết nối số*
- Lọc theo vé đã hoàn thành, vé chưa làm, độ zoom tương tác mượt mà.

### 7. Máy Đẻ 100 Vé & Tích Hợp AI Gemini
- Khám phá danh mục vé theo từng miền đời sống và từng loại vé chi tiết.
- Tích hợp **Google Gemini 3.8 Flash** (`@google/genai`): Tự động sinh thêm hàng chục milestone mới lạ theo đúng ngữ cảnh quận/huyện Sài Gòn dựa trên công thức nghiêm ngặt.
- Có sẵn bộ sinh dự phòng thuật toán (Local Algorithmic Fallback) khi không có kết nối mạng hoặc hết quota API.

### 8. Trạm "Soi Gương" Nhận Diện Pattern
- Cứ sau mỗi **20 vé** hoàn thành, trạm Soi Gương sẽ kích hoạt:
  - Thống kê tỷ lệ vé khiến bạn nạp pin (`+pin`) nhiều nhất thuộc miền nào.
  - Gợi ý những việc bạn muốn làm lại (`Want Redo = true`).
  - Phản ánh chân dung tâm lý và sở thích tiềm ẩn của bạn khi sống ở Sài Gòn.

---

## 📂 Kiến Trúc & Cấu Trúc Thư Mục

```text
├── index.html                  # File HTML chính, cấu hình viewport và SEO title
├── metadata.json               # Cấu hình applet và permissions nền tảng
├── package.json                # Danh sách thư viện và scripts (Vite, React 19, Tailwind)
├── server.ts                   # Backend Express phục vụ API Gemini và Vite SSR/SPA
├── vite.config.ts              # Cấu hình Vite bundler & Tailwind CSS v4 plugin
├── src/
│   ├── App.tsx                 # Điều phối state chính, tab view và modals
│   ├── main.tsx                # React Root DOM mounting
│   ├── types.ts                # TypeScript interfaces (Milestone, Domain, SheetRecord...)
│   ├── index.css               # Global styles & Tailwind v4 `@import "tailwindcss";`
│   ├── components/
│   │   ├── Navbar.tsx             # Thanh điều hướng, nút Simple Mode, nút 3 WHY
│   │   ├── DailyGacha.tsx         # Máy bốc thăm ngẫu nhiên, lọc tiền/người, đột biến vé
│   │   ├── BeginnerGuideModal.tsx # Bảng hướng dẫn 3 bước siêu dễ cho người mới
│   │   ├── GoogleSheetTable.tsx   # Bảng Sổ Đời 4 cột, lọc, tìm kiếm, xuất CSV
│   │   ├── SlotScheduler.tsx      # Quản lý 2 Khối Giờ Sâu & 3 Khe Hở Rìa
│   │   ├── StabilityBrakes.tsx    # Giao diện 5 phanh an toàn và chế độ Stress Test
│   │   ├── BrakeModal.tsx         # Modal bấm Phanh Xả nhanh khi kiệt sức
│   │   ├── ConstellationMap.tsx   # Bản đồ sao trực quan hóa 1000 điểm
│   │   ├── DomainExplorer.tsx     # Khám phá 10 miền và sinh vé theo công thức
│   │   ├── CompleteModal.tsx      # Bảng ghi nhận cảm xúc Cột 3 & Cột 4 (có sticky header/footer)
│   │   ├── MirrorModal.tsx        # Trạm Soi Gương phân tích sau mỗi 20 vé
│   │   ├── AIGeneratorModal.tsx   # Modal sinh milestone tùy chỉnh bằng Gemini AI
│   │   ├── StressTestLab.tsx      # Phòng thử tải tình huống cực đoan
│   │   └── WhyModal.tsx           # Bảng giải thích triết lý 3 WHY
│   ├── data/
│   │   ├── domains.ts             # Dữ liệu 10 miền đời sống và các loại vé
│   │   └── generatorEngine.ts     # Engine sinh 1000 milestone và thuật toán đột biến
│   └── utils/
│       └── sound.ts               # Bộ phát âm thanh Web Audio API (Tick, Ding, Roll, Shutter...)
```

---

## 💻 Cài Đặt & Chạy Ứng Dụng

### Yêu Cầu Môi Trường
- **Node.js**: Phiên bản 18.0 trở lên (khuyên dùng Node 20 LTS).
- **npm** hoặc **pnpm / yarn**.

### 1. Clone Source Code
```bash
git clone https://github.com/your-username/saigon-room-1000-milestones.git
cd saigon-room-1000-milestones
```

### 2. Cài Đặt Dependencies
```bash
npm install
```

### 3. Thiết Lập Biến Môi Trường
Tạo file `.env` từ mẫu `.env.example`:
```bash
cp .env.example .env
```
Điền khóa API Gemini của bạn vào `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Nếu không có API key, ứng dụng vẫn hoạt động bình thường nhờ có sẵn bộ sinh 1000 milestone thuật toán offline).*

### 4. Chạy Ở Chế Độ Phát Triển (Development)
```bash
npm run dev
```
Ứng dụng sẽ khởi chạy tại: **`http://localhost:3000`**

### 5. Kiểm Tra Lỗi & Build Production
```bash
# Kiểm tra TypeScript type safety
npm run lint

# Build production bundle (Client Vite + Server CJS)
npm run build

# Khởi chạy production server
npm start
```

---

## 🔑 Biến Môi Trường (Environment Variables)

Xem chi tiết tại file `.env.example`:

| Tên biến | Bắt buộc? | Mô tả |
| :--- | :---: | :--- |
| `GEMINI_API_KEY` | Không | API Key từ Google AI Studio để dùng tính năng AI tạo milestone tự động bằng mô hình `gemini-3.8-flash`. (Bảo mật tuyệt đối ở phía server, không lộ ra client). |

---

## 🛡️ Bảo Mật & Lưu Trữ Dữ Liệu (Local-First)

1. **Bảo Mật API Key Tuyệt Đối:** Mọi tác vụ gọi mô hình Gemini đều được xử lý qua backend endpoint `/api/generate-milestones` trong file `server.ts`. Trình duyệt người dùng không bao giờ nhìn thấy `GEMINI_API_KEY`.
2. **Quyền Riêng Tư 100% (Local-First Data):** Toàn bộ nhật ký cảm xúc, vé đã làm, cấu hình giờ học sâu và lịch sử soi gương đều được lưu trữ trực tiếp trên trình duyệt của bạn thông qua `localStorage`. 
3. **Không Cần Đăng Nhập:** Người dùng không cần tạo tài khoản, không cần cung cấp email hay số điện thoại, mở web là dùng được ngay.
4. **Sao Lưu Tiện Lợi:** Dễ dàng bấm nút `Xuất CSV` trong tab **Sổ Đời (Google Sheet)** để tải bản sao lưu về máy bất cứ lúc nào.

---

## 🌟 Đóng Góp & Tác Quyền

Dự án được xây dựng với tình yêu dành cho mảnh đất Sài Gòn và sự đồng cảm sâu sắc với các bạn trẻ đang nỗ lực từng ngày trong những căn phòng trọ. 

* **Mọi đóng góp, ý tưởng thêm milestone mới hay phản hồi cải tiến đều được hoan nghênh nồng nhiệt!**
* Hãy tạo một Pull Request hoặc mở Issue trên GitHub.

*Chúc bạn có những 10 phút thật nhẹ lòng giữa lòng Sài Gòn hoa lệ! 🛵☕🌳*
