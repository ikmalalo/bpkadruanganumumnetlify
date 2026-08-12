import { api } from "./api";

const monthMap: { [key: string]: number } = {
  'jan': 0, 'januari': 0,
  'feb': 1, 'februari': 1,
  'mar': 2, 'maret': 2,
  'apr': 3, 'april': 3,
  'mei': 4,
  'jun': 5, 'juni': 5,
  'jul': 6, 'juli': 6,
  'agu': 7, 'agt': 7, 'agus': 7, 'agustus': 7,
  'sep': 8, 'september': 8,
  'okt': 9, 'oktober': 9,
  'nov': 10, 'november': 10,
  'des': 11, 'desember': 11
};

const parseIndoDate = (dateStr: string) => {
  if (!dateStr) return new Date(0);
  const cleanStr = dateStr.toLowerCase().replace(/^[a-z]+\s*,?\s*/, '').trim(); // Remove day name e.g. "senin, " or "senin "
  const parts = cleanStr.split(/\s+/);
  if (parts.length < 3) return new Date(0);
  
  const day = parseInt(parts[0]);
  const monthStr = parts[1];
  const year = parseInt(parts[2]);

  if (isNaN(day) || isNaN(year) || monthMap[monthStr] === undefined) {
    return new Date(0);
  }
  return new Date(year, monthMap[monthStr], day);
};

export const runAutoClean = async (agendas: any[]) => {
  const now = new Date();
  let modified = false;
  
  for (const agenda of agendas) {
    if (agenda.status === "Selesai") continue; // already finished
    
    const dateObj = parseIndoDate(agenda.tanggal);
    if (dateObj.getTime() === new Date(0).getTime()) continue;

    const waktuStr = agenda.pukul; // e.g. "08:00 - 10:00" or "08:00 - Selesai"
    const splitWaktu = waktuStr.split(' - ');
    const waktuMulaiStr = splitWaktu[0];
    const waktuSelesaiStr = splitWaktu[1] || "";
    
    // Set start and expiry objects
    const startDate = new Date(dateObj);
    const expiryDate = new Date(dateObj);

    const matchStart = waktuMulaiStr.match(/(\d{1,2})[:.](\d{1,2})/);
    if (!matchStart) continue;
    startDate.setHours(parseInt(matchStart[1]), parseInt(matchStart[2]), 0, 0);

    if (waktuSelesaiStr.toLowerCase() === "selesai") {
      // Dynamic length since it's "Sampai Selesai" (PEMKOT 5 hours, BPKAD 3 hours)
      const durationHours = agenda.type === "PEMKOT" ? 5 : 3;
      expiryDate.setHours(parseInt(matchStart[1]), parseInt(matchStart[2]), 0, 0);
      expiryDate.setHours(expiryDate.getHours() + durationHours);
    } else {
      // Fixed end time (e.g. "10:00")
      const matchEnd = waktuSelesaiStr.match(/(\d{1,2})[:.](\d{1,2})/);
      if (!matchEnd) continue;
      expiryDate.setHours(parseInt(matchEnd[1]), parseInt(matchEnd[2]), 0, 0);
    }

    if (now.getTime() >= expiryDate.getTime()) {
      // It has expired based on rules!
      if (agenda.type === "BPKAD") {
        await api.saveAgenda({ ...agenda, status: 'Selesai' });
        modified = true;
      } else if (agenda.type === "PEMKOT") {
        await api.deleteAgenda(agenda.id);
        modified = true;
      }
    } else if (now.getTime() >= startDate.getTime()) {
      // Meeting has started but not yet expired
      if (agenda.status === "Terjadwal") {
        await api.saveAgenda({ ...agenda, status: 'Berlangsung' });
        modified = true;
      }
    }
  }

  // return true if any modification happened so the caller knows they should refetch
  return modified;
}
