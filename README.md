# Kasflow App

Starter project untuk hiring task aplikasi Kasflow menggunakan:

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- Supabase Auth + PostgreSQL
- Lucide React
- Zod
- ECharts

## Setup Lokal

### 1. Install dependency

```bash
npm install
```

### 2. Siapkan environment variable

Copy file contoh env:

```bash
copy .env.example .env.local
```

Lalu isi value berikut:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Jalankan migration database

File migration awal ada di:

```text
supabase/migrations/20260611133000_create_debts.sql
```

Jalankan lewat Supabase SQL Editor atau Supabase CLI.

### 4. Jalankan development server

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Struktur Folder

```text
app/
components/
lib/
supabase/
types/
validations/
```

Penjelasan singkat:

- `app` -> routing App Router, layout, page, server action, dan API route
- `components` -> komponen UI reusable
- `lib` -> helper umum, auth helper, Supabase client, formatter, env
- `supabase` -> migration SQL dan file terkait Supabase
- `types` -> shared TypeScript types
- `validations` -> schema validasi input

## Yang Sudah Discaffold

- Landing page awal dengan CTA login dan signup
- Login form dan signup form berbasis Supabase Auth
- Logout action
- Dashboard summary, filter, dan debt list yang consume API
- Create, edit, tandai lunas, dan hapus debt
- Group multiple debts dari orang yang sama
- Page chart bonus di `/charts`
- Supabase browser client, server client, dan `proxy.ts` untuk refresh session
- Migration SQL tabel `debts` + trigger `updated_at` + RLS policy
- API `GET/POST /api/debts` dan `PATCH/DELETE /api/debts/[id]`

## Library Tambahan

- `zod` -> validasi request body dan query
- `lucide-react` -> icon UI ringan dan konsisten
- `echarts` + `echarts-for-react` -> page bonus bar chart compare total dihutangi vs total saya hutang

## Submission Checklist

- [ ] Signup dan login berjalan pakai Supabase Auth
- [ ] Logout berjalan
- [ ] Route protected hanya bisa diakses user login
- [ ] Migration `debts` sudah dijalankan di Supabase
- [ ] RLS sudah dites dengan minimal 2 user berbeda
- [ ] API debts aman dan hanya akses data milik user login
- [ ] Format uang tampil `Rp 1.234.000`
- [ ] Dashboard summary, filter, dan list berjalan
- [ ] Create, edit, tandai lunas, dan hapus berjalan lalu tetap konsisten setelah refresh
- [ ] Group multiple debts tampil
- [ ] Bonus chart page `/charts` tampil
- [ ] README final berisi setup, approach, trade-off, dan time spent
- [ ] Deploy Vercel aktif
- [ ] Loom demo siap

## Commit Checkpoint

Supaya history commit kamu rapi, saya saranin pola ini:

1. `chore: install supabase lucide zod and auth scaffold`
2. `feat: add debts schema migration and rls policies`
3. `feat: implement debts api endpoints`
4. `feat: build dashboard summary and debt list`
5. `feat: add create edit and settle debt flows`

## Next Step yang Disarankan

1. Tes manual end-to-end dengan 2 user
2. Rapikan copy README final: approach, trade-off, time spent
3. Deploy ke Vercel
4. Rekam Loom
