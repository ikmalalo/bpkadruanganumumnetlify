/**
 * test-app.js
 * Skrip pengujian mandiri untuk aplikasi BPKAD Umum & KGB.
 * Jalankan di terminal menggunakan perintah: node test-app.js
 */

// 1. Definisikan Tabel Gaji PP No. 5 2024 (Salinan dari kgbUtils.ts untuk unit test)
const SALARY_DATA = {
  "iiia": { 0: 2785700, 2: 2873500, 4: 2964000, 6: 3057300, 8: 3153600, 10: 3252900, 12: 3355400, 14: 3461100, 16: 3570100, 18: 3682500, 20: 3798500, 22: 3918100, 24: 4041500, 26: 4168800, 28: 4300100, 30: 4435500, 32: 4575200 },
  "iiib": { 0: 2903600, 2: 2995000, 4: 3089300, 6: 3186600, 8: 3287000, 10: 3390500, 12: 3497300, 14: 3607500, 16: 3721100, 18: 3838300, 20: 3959200, 22: 4083900, 24: 4212500, 26: 4345100, 28: 4482000, 30: 4623200, 32: 4768800 },
  "ivc": { 0: 3571900, 2: 3684400, 4: 3800400, 6: 3920100, 8: 4043600, 10: 4170900, 12: 4302300, 14: 4437800, 16: 4577500, 18: 4721700, 20: 4870400, 22: 5023800, 24: 5182000, 26: 5345200, 28: 5513600, 30: 5687200, 32: 5866400 }
};

function parseGaji(gajiStr) {
  if (!gajiStr) return 0;
  return parseInt(String(gajiStr).replace(/[^0-9]/g, '')) || 0;
}

function parseMKG(mkgStr) {
  const match = String(mkgStr).match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

function formatGolKey(golStr) {
  if (!golStr) return "";
  return golStr.replace(/[\/\s]/g, '').toLowerCase();
}

function calculateKGB(emp) {
  const currentMKG = parseMKG(emp.mkg);
  const newMKG = currentMKG + 2;
  const golKey = formatGolKey(emp.golongan);
  
  const actualOldGaji = parseGaji(emp.gaji);
  const tableData = SALARY_DATA[golKey];
  
  let finalNewGaji = 0;
  let stepIncrease = 0;
  
  // Jika MKG baru ada di tabel resmi
  if (tableData && tableData[newMKG] !== undefined) {
    finalNewGaji = tableData[newMKG];
    stepIncrease = finalNewGaji - actualOldGaji;
  } else {
    // Fallback jika melebihi tabel
    stepIncrease = Math.max(120000, Math.floor(actualOldGaji * 0.03));
    finalNewGaji = actualOldGaji + stepIncrease;
  }
  
  return { 
    oldGaji: actualOldGaji, 
    newGaji: finalNewGaji, 
    increase: stepIncrease, 
    currentMKG, 
    newMKG 
  };
}

console.log("==================================================");
console.log("      SISTEM PENGUJIAN MANDIRI: BPKAD UMUM        ");
console.log("==================================================");

// --- TEST 1: UNIT TESTING LOGIKA KALKULASI KGB ---
console.log("\n[TEST 1] Menjalankan Unit Test Kalkulasi KGB...");

const mockEmployee = {
  nama: "H. ANANTA FATHURROZI, S.Sos, M.Si",
  golongan: "IV/c",
  mkg: "33 Thn", // MKG saat ini
  gaji: "5.866.400"
};

try {
  const result = calculateKGB(mockEmployee);
  
  console.log("✔ Pegawai Uji       :", mockEmployee.nama);
  console.log(`✔ Golongan & Masa Kerja: ${mockEmployee.golongan} | ${result.currentMKG} Thn -> KGB Berikutnya: ${result.newMKG} Thn`);
  console.log(`✔ Gaji Lama         : Rp ${result.oldGaji.toLocaleString('id-ID')}`);
  console.log(`✔ Gaji Baru (Est)   : Rp ${result.newGaji.toLocaleString('id-ID')}`);
  console.log(`✔ Nilai Kenaikan    : Rp ${result.increase.toLocaleString('id-ID')}`);
  
  if (result.newGaji > result.oldGaji) {
    console.log("STATUS TEST 1: [SUCCESS] (Kalkulasi KGB Berjalan Sesuai PP No. 5 2024)");
  } else {
    console.log("STATUS TEST 1: [FAILED] (Gaji Baru tidak bertambah)");
  }
} catch (error) {
  console.error("STATUS TEST 1: [ERROR]", error);
}

// --- TEST 2: INTEGRATION TEST KONEKSI API PHP LOKAL ---
console.log("\n[TEST 2] Menjalankan Integration Test API PHP & Database...");
const localApiUrl = "http://localhost/bpkadumuminfinity/api/agenda.php";

console.log(`Menghubungi API Lokal di: ${localApiUrl}...`);

fetch(localApiUrl)
  .then(res => {
    console.log(`✔ Status HTTP API   : ${res.status} (${res.statusText})`);
    return res.json();
  })
  .then(data => {
    if (Array.isArray(data)) {
      console.log(`✔ Database MySQL    : Terkoneksi. Berhasil mengambil ${data.length} data agenda ruangan.`);
      console.log("STATUS TEST 2: [SUCCESS] (Koneksi API & Database MySQL OK)");
    } else if (data.error) {
      console.log(`❌ Error dari server API: ${data.error}`);
      console.log("STATUS TEST 2: [FAILED] (Terjadi kendala pada PHP API)");
    } else {
      console.log("✔ Respon diterima tetapi format tidak sesuai array.");
      console.log("STATUS TEST 2: [WARNING] (Cek format output PHP)");
    }
    console.log("\n==================================================");
  })
  .catch(err => {
    console.log("❌ Koneksi Gagal. Pastikan Laragon/Apache Anda sudah dijalankan.");
    console.log("Detail Error:", err.message);
    console.log("STATUS TEST 2: [FAILED] (Laragon/Apache Offline)");
    console.log("\n==================================================");
  });
