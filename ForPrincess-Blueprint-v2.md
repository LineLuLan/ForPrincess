# 💝 BLUEPRINT v2: ForPrincess Web App
*Phiên bản tối ưu — 100% Free, build trong 4 ngày*

---

## 🎯 1. Tầm nhìn

**Định vị:** Không phải là một wishlist app thông thường, mà là **"hộp ước mơ"** chung của 2 người — nơi nàng gửi gắm điều mong muốn, còn chàng âm thầm biến chúng thành kỷ niệm.

**Vibe:** Pastel hồng đào / kem / be. Font bo tròn (Quicksand, Nunito, hoặc DM Sans). UI tối giản nhưng có micro-interaction tinh tế (tim bay, confetti, card hover mềm).

**Triết lý kỹ thuật:** Free forever, zero maintenance, deploy 1 click.

---

## 🛠️ 2. Tech Stack (Tối ưu, 0đ thật sự)

| Lớp | Công nghệ | Lý do |
|---|---|---|
| **Framework** | Next.js 15 (App Router) + TypeScript | SSR + Server Actions tiết kiệm bandwidth |
| **Styling** | Tailwind CSS v4 | Utility-first, không cần config nhiều |
| **Animation** | Framer Motion | Mượt, API dễ dùng |
| **Icons** | Lucide React | Nhẹ, tree-shakeable |
| **Confetti** | `canvas-confetti` (thay vì react-confetti) | Nhẹ hơn ~5x, không cần unmount |
| **Backend + DB + Auth + Storage** | Supabase | All-in-one, free tier dư xài cho 2 user |
| **State** | ❌ Bỏ Zustand — dùng React Server Components + `useState` | App 2 user không cần global state |
| **Form** | React Hook Form + Zod (optional) | Validate sạch sẽ |
| **Hosting** | Vercel Hobby | Free, auto-deploy từ GitHub |
| **Keep-alive (lớp 1)** | GitHub Actions cron | Tin cậy, ngay trong repo, ping mỗi 3 ngày |
| **Keep-alive (lớp 2)** | UptimeRobot | Backup + monitoring + alert email, ping mỗi 5 phút |

### ⚠️ Những thứ đã bỏ vs blueprint cũ
- **Zustand** → Không cần. App này 90% là Server Components, state cục bộ dùng `useState` đủ.
- **cron-job.org** → Thay bằng **GitHub Actions** (cron schedule). Lý do: cron-job.org đôi khi delay, GitHub Actions chạy đúng giờ và không cần đăng ký thêm dịch vụ.
- **Prisma** → Không cần. Dùng thẳng `@supabase/supabase-js` + TypeScript types tự generate từ Supabase CLI. Bớt 1 layer, build nhanh hơn.

---

## 📊 3. Free Tier Reality Check (Q2/2026)

**Supabase Free:**
- 500 MB DB (đủ cho ~2 triệu dòng — bạn dùng vài trăm dòng thôi)
- 1 GB Storage cho ảnh
- 5 GB bandwidth DB + storage egress
- ⚠️ **Project tự động pause sau 7 ngày không hoạt động** → cần cron ping

**Vercel Hobby:**
- 100 GB Fast Data Transfer/tháng
- 1M Function invocations/tháng
- ⚠️ **Chỉ cho phép non-commercial use** — app cá nhân 2 người hoàn toàn OK

**Mẹo siết bandwidth (cực kỳ quan trọng):**
1. **Nén ảnh client-side** trước khi upload bằng `browser-image-compression` (max 800KB/ảnh)
2. **Dùng Supabase Storage qua CDN URL** (`/object/public/...`) — bandwidth qua CDN không tính vào quota
3. **Next.js Image với `unoptimized: false`** + remote patterns trỏ về Supabase Storage

→ Với 2 user và ~50-100 món đồ/năm, bạn dùng chưa tới 1% quota. Hoàn toàn free thật.

---

## 🎭 4. Tính năng & Phân quyền

App có **2 góc nhìn** dựa trên `role` trong DB.

### 🌸 Princess View
- ➕ **Thêm điều ước:** dán link sản phẩm, tên, giá, tải ảnh (hoặc paste từ clipboard)
- 💖 **Mức độ thích:** 3 cấp — Thích / Rất thích / Phải có
- 📝 **Ghi chú cảm xúc:** lý do thích món này
- 🔮 **Trạng thái ước mơ:** chỉ thấy món **chưa được tặng** và **chưa bị bí mật mua** (chàng có thể bí mật chuẩn bị, nàng không biết)
- 🎁 **Tủ kỷ niệm:** khi món chuyển sang "Đã tặng", card bay vào tủ kèm confetti + ngày nhận quà + lời nhắn của chàng

### 🛡️ Knight View
- 📋 **Bảng điều khiển:** xem toàn bộ wishlist, sort theo priority hoặc ngày tạo
- 🛒 **Chốt đơn (bí mật):** đánh dấu `isSecretlyBuying = true` — món vẫn hiện bên Princess bình thường, không bị lộ
- 🎀 **Đã tặng:** trao quà → bấm nút này, có thể thêm lời nhắn → confetti nổ bên màn hình của nàng
- 📅 **Sắp tới:** highlight các dịp lễ (sinh nhật, kỷ niệm) trong 30 ngày tới

---

## 🗄️ 5. Database Schema (Supabase / SQL)

```sql
-- ============================================
-- TABLE: profiles (extends auth.users)
-- ============================================
create type user_role as enum ('PRINCESS', 'KNIGHT');

create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role        user_role not null,
  created_at  timestamptz default now()
);

-- ============================================
-- TABLE: wish_items
-- ============================================
create type wish_priority as enum ('WANT', 'REALLY_WANT', 'MUST_HAVE');

create table wish_items (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  url         text,
  image_url   text,
  price       numeric(12, 2),
  currency    text default 'VND',
  priority    wish_priority not null default 'WANT',
  note        text,

  -- Knight logic
  is_secretly_buying boolean not null default false,
  is_gifted          boolean not null default false,
  gifted_at          timestamptz,
  gift_message       text,

  -- Audit
  created_by  uuid references profiles(id),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index idx_wish_items_status on wish_items(is_gifted, priority);
create index idx_wish_items_gifted_at on wish_items(gifted_at desc) where is_gifted = true;

-- ============================================
-- ROW LEVEL SECURITY (quan trọng!)
-- ============================================
alter table wish_items enable row level security;
alter table profiles   enable row level security;

-- Princess: KHÔNG được thấy is_secretly_buying = true (món chàng đang chuẩn bị)
create policy "princess_sees_non_secret" on wish_items
  for select using (
    (select role from profiles where id = auth.uid()) = 'PRINCESS'
    and is_secretly_buying = false
  );

-- Knight: thấy hết
create policy "knight_sees_all" on wish_items
  for select using (
    (select role from profiles where id = auth.uid()) = 'KNIGHT'
  );

-- Princess được thêm/sửa wish của chính mình (chỉ các field cảm xúc)
create policy "princess_inserts" on wish_items
  for insert with check (
    (select role from profiles where id = auth.uid()) = 'PRINCESS'
    and is_secretly_buying = false
    and is_gifted = false
  );

-- Knight được update mọi field (chốt đơn, đánh dấu đã tặng)
create policy "knight_updates" on wish_items
  for update using (
    (select role from profiles where id = auth.uid()) = 'KNIGHT'
  );
```

**Mẹo bảo mật:** RLS làm hết phần "ẩn món bí mật" — kể cả nếu Princess dùng DevTools soi network, query trả về cũng không có data đó. An toàn tuyệt đối.

---

## 🚀 6. Lộ trình triển khai (4 ngày)

### Phase 1 — Khởi tạo & UI tĩnh (Ngày 1, ~3h)
```bash
npx create-next-app@latest for-princess --typescript --tailwind --app
cd for-princess
npm i @supabase/supabase-js framer-motion lucide-react canvas-confetti \
      react-hook-form zod @hookform/resolvers browser-image-compression
```

- Setup Tailwind theme với pastel palette (`pink-50`, `rose-100`, `amber-50`, `stone-50`)
- Tạo layout: Navbar + container chính
- Component tĩnh: `WishCard`, `AddWishForm`, `EmptyState`
- Mock data để xem UI trước

### Phase 2 — Supabase setup (Ngày 2, ~2h)
1. Tạo project tại supabase.com (chọn region Singapore cho gần VN)
2. Chạy SQL schema ở mục 5 trong SQL Editor
3. Tạo Storage bucket `wish-images` (Public read, file size limit 2MB)
4. Vào **Auth → Providers**: bật Email, **tắt Sign-up**
5. Tạo tay 2 user trong **Auth → Users**, sau đó vào SQL chạy:
   ```sql
   insert into profiles (id, display_name, role) values
     ('<uuid-cua-nang>', 'Princess', 'PRINCESS'),
     ('<uuid-cua-chang>', 'Knight',   'KNIGHT');
   ```
6. Generate TypeScript types:
   ```bash
   npx supabase gen types typescript --project-id <id> > types/db.ts
   ```

### Phase 3 — Logic & Phân quyền (Ngày 3, ~4h)
- **Server Actions** cho CRUD (không cần API routes riêng — Next.js App Router làm hết)
- Trang `/login` đơn giản (email + password)
- `middleware.ts` redirect chưa-login về `/login`
- Component `<RoleGate role="KNIGHT">...</RoleGate>` ẩn UI theo role
- **Upload ảnh flow:**
  1. Client nén ảnh bằng `browser-image-compression`
  2. Upload lên Supabase Storage
  3. Lấy public URL → lưu vào `image_url`
- **Paste ảnh từ clipboard:** listener `paste` event trên form

### Phase 4 — Hoàn thiện & Deploy (Ngày 4, ~3h)
- Confetti khi `is_gifted` chuyển từ false → true (dùng `canvas-confetti` với màu hồng/vàng)
- Hover animation cho card (Framer Motion `whileHover={{ scale: 1.02, rotate: -1 }}`)
- Trang `/memories` cho tủ kỷ niệm — grid layout với ngày tặng + lời nhắn
- Push lên GitHub
- Vercel: Import repo, thêm 2 biến env:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Setup keep-alive 2 lớp (xem mục 7):
  - Push file `.github/workflows/keepalive.yml` lên repo
  - Đăng ký UptimeRobot, add monitor trỏ vào `/api/heartbeat`

---

## ⏰ 7. Keep-alive Cron — Chống Supabase pause

> **Vấn đề:** Supabase Free tự pause project sau **7 ngày** không có request.
> **Giải pháp:** Setup tự động ping DB mỗi vài ngày → không bao giờ chạm mốc 7 ngày.

### 🎯 Strategy 2 lớp (paranoid mode, vẫn 0đ)

| Lớp | Tần suất | Vai trò |
|---|---|---|
| **Lớp 1: GitHub Actions cron** | Mỗi 3 ngày | Primary keep-alive, chạy ngay trong repo |
| **Lớp 2: UptimeRobot** | Mỗi 5 phút | Backup + monitoring, có alert khi web sập |

→ Kể cả 2 đứa đi du lịch trăng mật 2 tuần không đụng web, DB vẫn sống nhăn răng.

---

### 🔧 Bước 7.1 — Tạo API endpoint heartbeat

File `app/api/heartbeat/route.ts`:

```ts
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Query nhẹ tênh — chỉ chạm vào DB để giữ project active
  const { error } = await supa
    .from('wish_items')
    .select('id')
    .limit(1);

  if (error) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return Response.json({
    ok: true,
    ts: new Date().toISOString()
  });
}
```

Endpoint này sẽ là `https://for-princess.vercel.app/api/heartbeat`.

---

### 🔧 Bước 7.2 — Lớp 1: GitHub Actions cron

Tạo file `.github/workflows/keepalive.yml`:

```yaml
name: Keep Supabase Awake

on:
  schedule:
    # Chạy 10h sáng VN, mỗi 3 ngày một lần (ngày 1, 4, 7, 10, 13...)
    - cron: '0 3 */3 * *'
  workflow_dispatch:  # Cho phép bấm tay chạy nếu muốn

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping heartbeat endpoint
        run: |
          curl -fsS https://for-princess.vercel.app/api/heartbeat \
            || exit 1
```

→ GitHub Actions free cho **2000 phút/tháng**, mỗi lần ping ~5 giây → dùng chưa tới 1% quota.

**Muốn paranoid hơn?** Đổi `'0 3 */3 * *'` thành `'0 3 * * *'` để ping mỗi ngày — vẫn miễn phí.

---

### 🔧 Bước 7.3 — Lớp 2: UptimeRobot (backup + monitoring)

UptimeRobot free cho phép ping URL **mỗi 5 phút**, có dashboard đẹp + alert qua email khi web sập.

**Setup 60 giây:**

1. Đăng ký tại [uptimerobot.com](https://uptimerobot.com) (free, không cần thẻ)
2. Bấm **+ New Monitor**
3. Điền:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** ForPrincess Heartbeat
   - **URL:** `https://for-princess.vercel.app/api/heartbeat`
   - **Monitoring Interval:** 5 minutes
4. Trong **Alert Contacts**: thêm email của bạn để nhận thông báo nếu web sập
5. Save → xong

Bonus: UptimeRobot cho bạn 1 trang status đẹp (`stats.uptimerobot.com/...`) để khoe uptime 99.99% với nàng. 😄

---

### ✅ Kết quả

- Web online 24/7 trên Vercel (không bao giờ tắt)
- DB Supabase được ping mỗi 5 phút bởi UptimeRobot + mỗi 3 ngày bởi GitHub
- Nếu 1 trong 2 lớp lỗi → lớp còn lại vẫn cứu
- Có alert email nếu web thật sự sập (do bug code chẳng hạn)
- **Tổng chi phí: 0đ**

---

## ✨ 8. Polish ideas (làm nếu còn hứng)

- **Dark mode** với tone burgundy/rose-gold cho ban đêm
- **Đếm ngược** đến sinh nhật / kỷ niệm
- **Trang `/stats`:** đã tặng bao nhiêu món, tổng giá trị, món đầu tiên là gì
- **Email notification** khi nàng thêm wish mới (Supabase Edge Function + Resend free tier 3k email/tháng)
- **PWA:** thêm manifest để cài như app trên điện thoại
- **Lời nhắn ngẫu nhiên** mỗi lần nàng mở app ("Hôm nay anh nhớ em" — chàng soạn sẵn 30 câu)

---

## 💰 Tổng chi phí

| Hạng mục | Chi phí |
|---|---|
| Hosting (Vercel Hobby) | **0đ** |
| Database + Auth + Storage (Supabase Free) | **0đ** |
| Domain | **0đ** (dùng `*.vercel.app`) — hoặc ~250k/năm nếu muốn `forprincess.com` |
| Cron (GitHub Actions) | **0đ** (2000 phút/tháng free) |
| **TỔNG** | **0đ/tháng** |

Build xong, deploy xong, vận hành mãi mãi không tốn xu nào. ✨
