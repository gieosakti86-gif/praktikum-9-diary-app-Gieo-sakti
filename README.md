# Diary App — Integrasi REST API & MySQL (Praktikum 9)

Aplikasi Buku Harian (*Mobile Diary*) berbasis **React Native (Expo)** yang terhubung dengan backend **Express.js** dan database **MySQL** untuk mengelola catatan harian secara *real-time*.

## Identitas Mahasiswa
* **Nama:** Gieo Sakti Senja Gumilang
* **NIM:** 2430511003
* **Program Studi:** Teknik Informatika — Universitas Muhammadiyah Sukabumi
* **Praktikum:** Pemrograman Mobile (Pertemuan 9 — REST API & MySQL)

---

## Fitur Aplikasi (Modul & Tugas Praktikum)
1. **CRUD Lengkap Terhubung MySQL:** Menampilkan daftar catatan (`GET`), menambah catatan baru (`POST`), memperbarui isi/status (`PUT`), dan menghapus catatan (`DELETE`).
2. **Pencarian Catatan (`?search=`):** Filter catatan secara langsung berdasarkan kata kunci judul maupun isi diary pada halaman utama.
3. **Fitur Favorit:** Menandai atau membatalkan status suka (❤️/🤍) dari halaman *Home* maupun *Detail*, serta halaman tab khusus **Favorite** untuk menampilkan catatan yang disukai.
4. **Validasi Input & Proteksi Form:** Validasi kolom wajib diisi, judul minimal 3 karakter, penonaktifan tombol selama proses pengiriman data (`saving` / `deleting`), serta dialog konfirmasi saat keluar dari halaman *Edit* jika terdapat perubahan yang belum disimpan.
5. **Informasi Timestamp:** Menampilkan tanggal catatan (`diary_date`) dan waktu pembuatan (`created_at`) pada halaman detail.

---

## Struktur Proyek

```text
pratikum-9/
├── diary-api/                  # Backend REST API (Node.js + Express + MySQL)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── diary.controller.js
│   │   ├── routes/
│   │   │   └── diary.routes.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── diary-app9/                 # Frontend Mobile (React Native + Expo Router + Redux Toolkit)
    ├── app/
    │   ├── (tabs)/
    │   │   ├── _layout.tsx
    │   │   ├── index.tsx       # Halaman Home & Search
    │   │   ├── create.tsx      # Halaman Tambah Diary
    │   │   └── favorites.tsx   # Halaman Diary Favorit
    │   ├── detail/
    │   │   └── [id].tsx        # Halaman Detail Diary
    │   ├── edit/
    │   │   └── [id].tsx        # Halaman Edit Diary
    │   └── _layout.tsx
    ├── src/
    │   ├── features/
    │   │   └── diary/
    │   │       └── diarySlice.ts
    │   ├── services/
    │   │   └── diaryApi.ts
    │   └── store/
    │       ├── hooks.ts
    │       └── store.ts
    ├── .env
    └── package.json