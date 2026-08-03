/**
 * test-blackbox.js
 * Skrip pengujian otomatis fungsional (Black Box API Testing)
 * Jalankan di terminal menggunakan perintah: node test-blackbox.js
 */

const BASE_URL = "http://localhost/bpkadumuminfinity";

async function runTests() {
  console.log("==================================================");
  console.log("    PENGUJIAN BLACK BOX OTOMATIS: BPKAD UMUM      ");
  console.log("==================================================");
  
  let cookieHeader = "";
  
  // 1. Uji Autentikasi (L-02: Login dengan kredensial salah)
  try {
    const res = await fetch(`${BASE_URL}/api/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: "umumadmin", password: "passwordSalah123" })
    });
    const data = await res.json();
    if (res.status === 401 && data.error) {
      console.log("✔ [L-02] Uji Login Salah       : [PASS] (Ditolak dengan status 401 & error message)");
    } else {
      console.log("❌ [L-02] Uji Login Salah      : [FAIL]");
    }
  } catch (e) {
    console.log("❌ [L-02] Uji Login Salah      : [ERROR]:", e.message);
  }

  // 2. Programmatic Login untuk Skenario Fungsional Lain
  try {
    const res = await fetch(`${BASE_URL}/scratch/login-helper.php`);
    const data = await res.json();
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      cookieHeader = setCookie.split(';')[0];
      console.log("✔ [SYS] Programmatic Session   : [PASS] (Session Berhasil Terbentuk)");
    } else {
      console.log("❌ [SYS] Programmatic Session  : [FAIL] (Gagal mendapatkan session cookie)");
    }
  } catch (e) {
    console.log("❌ [SYS] Programmatic Session  : [ERROR]:", e.message);
  }

  if (!cookieHeader) {
    console.log("\nPengujian dihentikan karena session gagal dibuat.");
    console.log("==================================================");
    return;
  }

  // 3. Uji Proteksi Halaman Tanpa Login (L-04: Proteksi API Admin)
  try {
    const res = await fetch(`${BASE_URL}/api/kgb_pegawai.php`); // Mengakses tanpa menyertakan cookie
    const data = await res.json();
    if (res.status === 401 && data.error === "Unauthorized") {
      console.log("✔ [L-04] Uji Proteksi API      : [PASS] (Akses ditolak dengan status 401)");
    } else {
      console.log("❌ [L-04] Uji Proteksi API      : [FAIL]");
    }
  } catch (e) {
    console.log("❌ [L-04] Uji Proteksi API      : [ERROR]:", e.message);
  }

  // 4. Uji CRUD Agenda Ruangan (AR-01, AR-03, AR-04)
  let agendaId = null;
  const mockAgenda = {
    hari: "Senin",
    tanggal: "2026-07-06",
    tempat: "Ruang Rapat Utama",
    pukul: "09:00",
    acara: "Rapat Uji Coba Black Box Otomatis",
    pelaksana: "Tim QA Tester",
    dihadiri: "Seluruh Staff",
    status: "Disetujui",
    type: "BPKAD"
  };

  // 4a. Create / Tambah Agenda (AR-01)
  try {
    const res = await fetch(`${BASE_URL}/api/agenda.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader
      },
      body: JSON.stringify(mockAgenda)
    });
    const data = await res.json();
    if (res.status === 200 && data.success && data.id) {
      agendaId = data.id;
      console.log(`✔ [AR-01] Tambah Agenda Baru    : [PASS] (Berhasil disimpan, ID: ${agendaId})`);
    } else {
      console.log("❌ [AR-01] Tambah Agenda Baru   : [FAIL]", data);
    }
  } catch (e) {
    console.log("❌ [AR-01] Tambah Agenda Baru   : [ERROR]:", e.message);
  }

  // 4b. Read / List Agenda (AR-03)
  try {
    const res = await fetch(`${BASE_URL}/api/agenda.php`, {
      headers: { 'Cookie': cookieHeader }
    });
    const data = await res.json();
    if (Array.isArray(data) && data.some(item => item.id == agendaId)) {
      console.log("✔ [AR-03] Ambil Daftar Agenda  : [PASS] (Agenda baru terdaftar dalam list data)");
    } else {
      console.log("❌ [AR-03] Ambil Daftar Agenda : [FAIL] (Agenda baru tidak ditemukan)");
    }
  } catch (e) {
    console.log("❌ [AR-03] Ambil Daftar Agenda : [ERROR]:", e.message);
  }

  // 4c. Delete / Hapus Agenda (AR-04)
  if (agendaId) {
    try {
      const res = await fetch(`${BASE_URL}/api/agenda.php?id=${agendaId}`, {
        method: 'DELETE',
        headers: { 'Cookie': cookieHeader }
      });
      const data = await res.json();
      if (res.status === 200 && data.success) {
        console.log("✔ [AR-04] Hapus Agenda         : [PASS] (Data berhasil dibersihkan)");
      } else {
        console.log("❌ [AR-04] Hapus Agenda        : [FAIL]");
      }
    } catch (e) {
      console.log("❌ [AR-04] Hapus Agenda        : [ERROR]:", e.message);
    }
  }

  // 5. Uji Modul KGB Pegawai (K-01)
  try {
    const res = await fetch(`${BASE_URL}/api/kgb_pegawai.php`, {
      headers: { 'Cookie': cookieHeader }
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      console.log(`✔ [K-01] Tarik Data Pegawai KGB: [PASS] (Berhasil menarik ${data.length} baris data pegawai)`);
    } else {
      console.log("❌ [K-01] Tarik Data Pegawai KGB: [FAIL]");
    }
  } catch (e) {
    console.log("❌ [K-01] Tarik Data Pegawai KGB: [ERROR]:", e.message);
  }

  // 6. Uji Modul Sertifikat (S-01)
  try {
    const res = await fetch(`${BASE_URL}/api/sertifikat.php`, {
      headers: { 'Cookie': cookieHeader }
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      console.log(`✔ [S-01] Tarik Data Sertifikat : [PASS] (Berhasil menarik ${data.length} sertifikat)`);
    } else {
      console.log("❌ [S-01] Tarik Data Sertifikat: [FAIL]");
    }
  } catch (e) {
    console.log("❌ [S-01] Tarik Data Sertifikat: [ERROR]:", e.message);
  }

  console.log("==================================================");
  console.log("      SELESAI: SEMUA CASING PENGUJIAN SELESAI     ");
  console.log("==================================================");
}

runTests();
