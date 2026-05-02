# 🌷 IDEAS — Đề xuất phát triển ForPrincess

> Một danh sách "việc-có-thể-làm-tiếp" cho ForPrincess. Sắp xếp theo độ rung động dự kiến (con gái sẽ "ưmm dễ thương quá") chứ không phải theo độ khó kỹ thuật. Mỗi mục có:
>
> - **Quy mô**: 🟢 nhỏ (<2 giờ) · 🟡 vừa (nửa ngày) · 🔴 lớn (cả cuối tuần)
> - **Tác động cảm xúc**: ♥ ấm áp · ♥♥ rung động · ♥♥♥ "anh ơi sao thương vậy"

Đọc qua, chọn 1-2 cái nàng sẽ thích nhất rồi build từ từ. Tránh build hết một lúc — mỗi lần thêm 1 chi tiết là một lần "lại có gì mới".

---

## ✨ Polish ngay được

### 1. 🟢 ♥♥ Đếm ngược kỷ niệm
Một widget nhỏ trên Navbar hoặc PrincessHome: **"Còn 12 ngày là sinh nhật em"** / **"Còn 38 ngày là kỷ niệm 1 năm"**. Knight nhập vào `profiles.special_dates` (jsonb), Princess thấy.

- Bảng phụ `special_dates(label, date, role_visible)` hoặc cột jsonb trên profiles.
- Component `<Countdown />` — `setInterval` chạy lại mỗi phút.
- Khi countdown < 7 ngày → đổi màu thành mint pulsing.

### 2. 🟢 ♥♥ Lời nhắn ngẫu nhiên hằng ngày
Knight pre-soạn 30 câu ("Hôm nay anh nhớ em", "Em mặc áo gì cũng xinh", v.v.). Mỗi lần Princess mở app, hiện 1 câu trên hero — đổi mỗi 24h dựa trên ngày.

- Bảng `love_notes(text, author)` hoặc file JSON tĩnh trong `public/love-notes.json`.
- Hash ngày → index, đảm bảo cùng 1 ngày luôn ra cùng 1 câu.
- Hiển thị bằng Caveat font dưới hero.

### 3. 🟢 ♥ Empty state nâng cấp
Hiện state "chưa có điều ước" dùng icon mặc định. Thay bằng SVG illustration tự custom (Bear cầm bóng bay, hoặc 1 con mèo ngủ trên gối) — vibe storybook.

- Hire Inu/Stitch generate, hoặc dùng `image-studio` skill render từ prompt.
- 2 phiên bản: bright (Princess) + line-art trắng (Knight).

### 4. 🟢 ♥ Heart-rain "anh nhớ em" button
Nút nhỏ ở góc Knight dashboard → bấm là trên màn hình Princess sẽ rơi mưa tim trong 3 giây (qua Supabase Realtime).

- Bảng `pings(from_user, type, created_at)`, Princess subscribe channel.
- `canvas-confetti` shape `'heart'` với pink palette.
- Cooldown: 1 ping/15 phút để không spam.

### 5. 🟢 ♥ Trang `/stats`
Dashboard nhỏ: tổng số điều ước, % đã tặng, tổng giá trị quà, món đắt nhất, món đầu tiên, khoảng thời gian trung bình từ "thêm" đến "tặng".

- 1 query `select` + aggregate, render ra cards.
- Recharts hoặc D3 cho biểu đồ timeline.

---

## 🎁 Tính năng có thể xây tiếp

### 6. 🟡 ♥♥ Photo memories sau khi tặng
Sau khi Knight bấm "Đã tặng", Princess có thể upload ảnh thật của món + ngày nhận thật + cảm xúc. Card trong `/memories` show ảnh trước-sau.

- Thêm `gift_received_image_url`, `gift_received_at`, `princess_reaction` vào `wish_items`.
- Princess được update các field này dù `is_gifted = true` (cần policy mới: `princess_records_reaction`).
- WishCard mode "memory" — flip card show 2 mặt (image gốc / image thật).

### 7. 🟡 ♥♥ Nhóm theo dịp (Wish Collections)
Tag mỗi wish theo dịp: Sinh nhật / Valentine / Tết / Random. Princess lọc, Knight planning theo collection.

- Bảng `wish_collections(id, name, color, icon)` + cột `collection_id` trên `wish_items`.
- UI: chip filter trên đầu grid.
- Xíu nâng cao: Knight thấy "Sinh nhật còn 14 ngày — 3 wishes chưa chuẩn bị" highlight đỏ.

### 8. 🟡 ♥♥♥ Voice notes của Knight
Khi tặng, Knight ghi âm lời nhắn (15-30s), Princess mở `/memories` nghe được giọng anh.

- MediaRecorder API → upload `webm/opus` lên Storage bucket `gift-voices`.
- Cột `gift_voice_url` trên `wish_items`.
- Player nhỏ trên WishCard mode memory.

### 9. 🟡 ♥♥ Email notification "nàng vừa thêm wish mới"
Princess thêm 1 điều ước → Knight nhận email tóm tắt (kèm ảnh + giá + note) → click "Tôi sẽ chuẩn bị" trong email tự động flag `is_secretly_buying`.

- Resend free tier (3k email/tháng).
- Supabase Edge Function trigger trên `wish_items` insert.
- Magic link trong email gọi 1 server action ẩn (signed token).

### 10. 🟡 ♥ Letter mode
Trang riêng `/letters` — Knight viết thư handwriting-style cho nàng (Caveat font, kẹp ảnh tùy chọn). Princess thấy theo timeline.

- Bảng `letters(body, image_url, written_at, author)`.
- UI: card lá thư với border răng cưa, slight rotate.
- Bonus: Knight có thể schedule 1 thư mở vào ngày X.

---

## 💝 Surprise / dịp đặc biệt

### 11. 🟡 ♥♥♥ Time-locked gifts
Knight chuẩn bị quà nhưng đặt "chỉ mở vào sinh nhật". Trước ngày đó, card hiện "📦 Có gì đó cho ngày 15/05 — đang đếm ngược". Princess không biết là gì, mỗi ngày card rung 1 chút.

- Cột `unlocks_at` trên `wish_items`.
- Princess RLS policy bổ sung: thấy được card nhưng `title` + `image_url` bị nullify ở select level (dùng view + RLS trên view).
- Sau ngày unlock, confetti vàng kim + reveal animation.

### 12. 🟡 ♥♥ Birthday/Valentine takeover mode
Vào ngày sinh nhật Princess → toàn bộ app đổi sang theme đặc biệt: pink rose-gold, sparkles rơi, hero đổi thành "Happy Birthday, Princess 🎂", nhạc nền 1 bài (autoplay với mute toggle).

- Trigger qua util `getOccasion(today, profile.birthdate)`.
- Theme override qua `[data-occasion="birthday"]` trên html.
- Có thể chuẩn bị 4 occasion: Birthday, Valentine, Christmas, Anniversary.

### 13. 🟡 ♥♥ Câu hỏi mỗi ngày (daily question)
Mỗi ngày Princess được hỏi 1 câu nhẹ (do Knight pre-soạn) — "Em nhớ kỷ niệm nào nhất tuần này?" — Princess trả lời, Knight thấy. Lưu thành sổ tay yêu nhau.

- Bảng `daily_questions` + `daily_answers`.
- UI: 1 card cố định trên hero Princess.

### 14. 🔴 ♥♥♥ Mood + reciprocal wishlist
Nàng có wishlist, **chàng cũng có** — đảo role: Princess thành "Knight" của Knight, có thể mua tặng anh ngược lại. Cùng app, role-swap theo perspective.

- Cần đổi schema khá nhiều: thêm `wish_for_role` enum, đổi RLS phức tạp hơn.
- Tính năng trưởng thành — chỉ làm sau khi muốn đẩy app lên thành "couple's app" thật.

---

## 🛠️ Tech / DX

### 15. 🟢 PWA — cài như app trên điện thoại
Thêm `manifest.json` + service worker (next-pwa hoặc Workbox) → Princess chạm "Add to Home Screen" trên iOS, có icon riêng, mở fullscreen.

### 16. 🟢 Dark mode auto cho Princess
Hiện Princess là light-only. Thêm dark variant của sky/mint palette → tự bật theo `prefers-color-scheme` hoặc nút toggle. Knight đã tối sẵn rồi.

### 17. 🟢 Generated DB types thay placeholder
Hiện `src/types/db.ts` là hand-written. Sau khi push lên Vercel, chạy `npm run db:types` (đã có script sẵn) để thay bằng Supabase CLI generated → kiểu chính xác 100%, có thêm Views/Functions.

### 18. 🟡 Tests — Playwright cho golden path
2 user flow chính: Princess add wish → Knight mark secret → Princess không thấy → Knight mark gifted → confetti. 1 file Playwright test xác nhận RLS hoạt động.

### 19. 🟡 Realtime sync (Supabase Realtime)
Hiện cần reload mới thấy Knight vừa flag secret. Subscribe `wish_items` channel → cards update tức thời, không cần F5.

### 20. 🟡 Error boundary + Sentry/LogTail
Một `error.tsx` global cho toàn app, kết nối Sentry free tier (5k events/tháng) hoặc LogTail. Khi nàng gặp lỗi → mình biết liền.

---

## 🌸 Touch nhỏ (tinh tế cộng hưởng)

- **Cursor decoration**: Princess view có sparkle theo cursor (CSS `pointer-events: none` div fixed).
- **Sound on confetti**: tiếng "ting" dịu nhẹ khi mark gifted (Web Audio API, < 5KB sample).
- **Card hover tilts** theo vị trí mouse (Framer Motion `useMotionValue` + perspective).
- **Vietnamese number reading**: `1.290.000 đ` thành `"một triệu hai trăm chín mươi nghìn"` khi hover (tooltip).
- **Greeting theo giờ**: header thay "Những điều em đang mong" thành "Chào buổi sáng, Princess ☀️" / "Tối khuya rồi, ngủ sớm nhé 🌙".
- **Locale time-of-day blob**: 2 blob gradient ở body shift màu theo giờ — sáng cam/vàng, chiều hồng, tối tím.
- **Reduced motion alternative**: thay vì confetti, animate 1 trái tim phồng to-thu-nhỏ giữa màn hình (đã có `motion-reduce` rule global).

---

## 🗺️ Gợi ý lộ trình "lần lượt nâng cấp"

Thứ tự đề xuất, ưu tiên đẹp + cảm xúc trước, tech-quality sau:

| Tuần | Mục tiêu |
|---|---|
| **1** | Push lên prod, setup keep-alive (U3-U5). Sống sót 1 tuần để chắc chắn ổn. |
| **2** | Idea #1 (countdown) + #2 (lời nhắn ngẫu nhiên) — quick wins, nàng sẽ nhận ra ngay. |
| **3** | Idea #6 (photo memories sau khi tặng) — tăng giá trị `/memories`. |
| **4** | Idea #11 (time-locked gifts) — đúng dịp gần nhất (sinh nhật / kỷ niệm) thì tung ra. |
| **5** | Idea #15 (PWA) + #19 (realtime) — quality-of-life. |
| **6+** | Tùy hứng — chọn từ phần "Touch nhỏ" mỗi lần buồn buồn nâng cấp 1 chi tiết. |

---

## 📝 Note cho future-me

- App này là **gift, không phải product**. Đừng over-engineer. Nếu một feature mất quá 1 cuối tuần → cắt scope hoặc bỏ.
- Mỗi lần thêm tính năng → nói nàng biết bằng 1 message "anh vừa thêm cái này", không silently roll out. Chính cái khoảnh khắc nàng phát hiện ra mới là phần quà.
- Test trước trên Knight account, mới enable cho Princess.
- Free-tier vẫn dư xài. Đừng vì 1 feature mà đụng paid plan — chọn alternative.
