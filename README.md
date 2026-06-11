# Kasflow

Kasflow adalah aplikasi kasbon sederhana untuk mencatat utang piutang pribadi. User dapat mencatat siapa yang berutang kepadanya atau siapa yang harus dibayar, mengelola status pelunasan, serta melihat ringkasan posisi utang piutang secara real-time.

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- Supabase Auth
- Supabase PostgreSQL
- Row Level Security (RLS)
- Zod
- Lucide React

## Demo

- Repository: https://github.com/Mustofaadni04040/kasbon-app
- Vercel: [kasflow-theta.vercel.app](https://kasflow-theta.vercel.app/)
- Gunakan akun dengan Email: useratest@gmail.com dan Password: user1234 untuk demo

---

## Setup Local

Clone repository:

```bash
git clone https://github.com/Mustofaadni04040/kasbon-app.git
cd kasflow
```

Install dependency:

```bash
npm install
```

Buat file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Jalankan aplikasi:

```bash
npm run dev
```

Akses:

```text
http://localhost:3000
```

---

## Database Migration

Migration tersedia pada folder:

```text
supabase/migrations
```

Cara menjalankan migration:

1. Buka Supabase Dashboard.
2. Masuk ke SQL Editor.
3. Copy seluruh isi file migration.
4. Jalankan query.
5. Pastikan tabel `debts` berhasil dibuat.
6. Pastikan seluruh RLS Policy aktif.
7. Pastikan settingan Supabase Authentication → Email → Disable email confirmation, untuk register

### Tabel Debts

| Column           | Type        |
| ---------------- | ----------- |
| id               | uuid        |
| user_id          | uuid        |
| type             | debt_type   |
| counterpart_name | text        |
| amount           | bigint      |
| note             | text        |
| due_date         | date        |
| settled_at       | timestamptz |
| created_at       | timestamptz |
| updated_at       | timestamptz |

### RLS Policies

- User hanya dapat melihat data miliknya sendiri.
- User hanya dapat membuat data miliknya sendiri.
- User hanya dapat mengubah data miliknya sendiri.
- User hanya dapat menghapus data miliknya sendiri.

---

## Features

### Authentication

- Signup menggunakan email dan password
- Login menggunakan email dan password
- Logout
- Protected Route

### Debt Management

- Tambah catatan kasbon
- Edit catatan kasbon
- Hapus catatan kasbon
- Tandai lunas
- Validasi client dan server

### Dashboard

- Total dihutangi
- Total saya hutang
- Net position
- Search berdasarkan nama
- Filter status
- Filter tipe
- Sorting data

### UX

- Responsive layout
- Empty state
- Loading state
- Error state
- Format Rupiah Indonesia (`id-ID`)
- Relative date

---

## Approach

Fokus utama saya dalam implementasi aplikasi ini adalah keamanan data dan konsistensi business logic. Seluruh data kasbon disimpan di Supabase PostgreSQL dengan Row Level Security (RLS) aktif sehingga setiap user hanya dapat mengakses datanya sendiri, bahkan ketika endpoint database diakses secara langsung. Untuk validasi input saya menggunakan Zod agar validasi dapat diterapkan secara konsisten di sisi client maupun server. Nominal kasbon disimpan sebagai `BIGINT` dalam satuan Rupiah utuh untuk menghindari masalah presisi yang umum terjadi pada tipe data floating point.

---

## Trade-offs

Jika memiliki tambahan waktu sekitar satu hari, saya akan melakukan beberapa peningkatan berikut:

- Menambahkan pagination atau infinite scrolling untuk menangani data dalam jumlah besar.
- Menambahkan export data ke CSV.
- Menambahkan dashboard analytics yang lebih informatif.
- Menambahkan optimistic update untuk meningkatkan pengalaman pengguna.
- Menambahkan fitur reminder jatuh tempo kasbon.

---

## Time Spent

Estimasi waktu pengerjaan:

**Total: ±10.5 jam**

---

## Future Improvements

- Reminder jatuh tempo
- Export PDF / CSV
- Multiple currency support
- Recurring debt tracking
- Dashboard analytics
- Mobile application version
