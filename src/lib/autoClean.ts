import { supabase } from "./supabaseClient"

const monthMap: { [key: string]: number } = {
  'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5,
  'Jul': 6, 'Agu': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11
};

const parseIndoDate = (dateStr: string) => {
  const match = dateStr.match(/, (\d{1,2}) (\w{3}) (\d{4})/);
  if (!match) return new Date(0);
  const day = parseInt(match[1]);
  const monthStr = match[2];
  const year = parseInt(match[3]);
  return new Date(year, monthMap[monthStr] || 0, day);
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
    
    // Set expiry object initially to dateObj
    const expiryDate = new Date(dateObj);

    if (waktuSelesaiStr.toLowerCase() === "selesai") {
      // Dynamic length since it's "Sampai Selesai"
      const matchStart = waktuMulaiStr.match(/(\d{1,2})[:.](\d{1,2})/);
      if (!matchStart) continue;
      expiryDate.setHours(parseInt(matchStart[1]), parseInt(matchStart[2]), 0, 0);
      
      // limit BPKAD = +3h, PEMKOT = +6h
      if (agenda.type === "BPKAD") {
        expiryDate.setHours(expiryDate.getHours() + 3);
      } else {
        // PEMKOT
        expiryDate.setHours(expiryDate.getHours() + 6);
      }
    } else {
      // Fixed end time (e.g. "10:00")
      const matchEnd = waktuSelesaiStr.match(/(\d{1,2})[:.](\d{1,2})/);
      if (!matchEnd) continue;
      expiryDate.setHours(parseInt(matchEnd[1]), parseInt(matchEnd[2]), 0, 0);
    }

    if (now.getTime() >= expiryDate.getTime()) {
      // It has expired based on rules!
      if (agenda.type === "BPKAD") {
        await supabase.from('agenda_ruangan').update({ status: 'Selesai' }).eq('id', agenda.id);
        modified = true;
      } else if (agenda.type === "PEMKOT") {
        await supabase.from('agenda_ruangan').delete().eq('id', agenda.id);
        modified = true;
      }
    }
  }

  // return true if any modification happened so the caller knows they should refetch
  return modified;
}
