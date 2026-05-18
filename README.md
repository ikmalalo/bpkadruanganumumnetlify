# Manajemen Ruangan Umum BPKAD (InfinityFree Version)

Aplikasi manajemen peminjaman ruangan dan galeri sertifikat BPKAD yang telah dimigrasi dari Supabase ke MySQL + PHP untuk mendukung hosting gratis di InfinityFree.

## Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: PHP (untuk Database API)
- **Database**: MySQL

## 🚀 Panduan Deployment (InfinityFree / Shared Hosting)

Karena InfinityFree tidak mendukung runtime Node.js, ikuti langkah-langkah berikut untuk mengunggah aplikasi:

### 1. Build Frontend di Lokal
Jalankan perintah berikut di terminal komputer Anda:
```bash
npm run build
```
Perintah ini akan menghasilkan folder bernama `dist`.

### 2. Persiapan Database
1. Buka cPanel InfinityFree dan buat database MySQL baru.
2. Buka **phpMyAdmin** untuk database tersebut.
3. Klik tab **Import** dan pilih file `bpkadumum (2).sql` yang ada di root project ini.
4. Edit file `api/config.php` di komputer lokal Anda dan masukkan kredensial database dari InfinityFree:
   ```php
   $host = 'sqlXXX.infinityfree.com'; // Ambil dari cPanel
   $db_name = 'epiz_XXX_nama_db';
   $username = 'epiz_XXX';
   $password = 'password_akun_anda';
   ```

### 3. Unggah File ke htdocs
Gunakan FTP (FileZilla) atau File Manager bawaan InfinityFree:
1. Unggah **ISI** dari folder `dist` (file `index.html`, folder `assets`, dll) langsung ke dalam folder `htdocs`.
2. Unggah folder `api` beserta isinya (seperti `config.php`, `login.php`, dll) ke dalam folder `htdocs`.
3. Pastikan struktur di server seperti ini:
   - `htdocs/index.html`
   - `htdocs/assets/`
   - `htdocs/api/config.php`
   - `htdocs/api/uploads/` (Pastikan folder uploads ini ada agar fitur upload sertifikat berjalan)

### 4. Selesai
Aplikasi Anda kini bisa diakses melalui subdomain InfinityFree yang Anda buat!

## Pengembangan Lokal
Untuk menjalankan di lokal:
1. Pastikan Anda memiliki XAMPP/Laragon berjalan dengan PHP & MySQL.
2. Jalankan `npm install` dan `npm run dev`.
3. Sesuaikan `api/config.php` untuk koneksi database lokal.
