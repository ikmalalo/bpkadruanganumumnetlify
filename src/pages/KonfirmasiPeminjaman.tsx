import { useState } from "react"
import "../index.css"
import { ArrowLeft, ArrowRight, FileText } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import AppNotification from "../components/Common/Notification"
import { supabase } from "../lib/supabaseClient"

export default function KonfirmasiPeminjaman() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const [notification, setNotification] = useState<{
    show: boolean
    type: "success" | "error" | "info"
    title: string
    message: string
    onConfirm?: () => void
  }>({
    show: false,
    type: "info",
    title: "",
    message: ""
  })

  // Fallback data if state is missing
  const data = (state as any) || {
    ruangan: "-",
    tanggal: "-",
    waktuMulai: "-",
    waktuSelesai: "-",
    namaAcara: "-",
    pelaksana: "-",
    jenisRuangan: "bpkad",
    dihadiri: ""
  }

  const timeToMin = (t: string, referenceStart: number | null = null) => {
    if (!t) return referenceStart !== null ? referenceStart + 300 : 0;
    const clean = t.toString().trim().toLowerCase().replace('.', ':');
    if (clean.includes('selesai')) return referenceStart !== null ? referenceStart + 300 : 1439;
    const match = clean.match(/(\d{1,2}):(\d{1,2})/);
    if (!match) return referenceStart !== null ? referenceStart + 300 : 0;
    const h = parseInt(match[1]) || 0;
    const m = parseInt(match[2]) || 0;
    return h * 60 + m;
  };

  const checkConflict = async (ruangan: string, tanggal: string, waktuMulai: string, waktuSelesai: string, excludeId = null) => {
    const sm = timeToMin(waktuMulai);
    const se = timeToMin(waktuSelesai, sm);
    
    let query = supabase
      .from('agenda_ruangan')
      .select('id, pukul, acara')
      .eq('tempat', ruangan.trim())
      .eq('tanggal', tanggal.trim());
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data: existing, error } = await query;
    if (error) throw error;
    
    for (const row of existing) {
      const timeParts = row.pukul.split(/\s*[-–—]\s*/);
      const exs = timeToMin(timeParts[0]);
      const exe = timeToMin(timeParts[1], exs);
      
      if (sm < exe && se > exs) return true;
    }
    return false;
  };

  const handleConfirm = async () => {
    const isEdit = (data as any).isEdit;
    const agendaId = (data as any).id;

    try {
      // 1. Check for double booking
      const hasConflict = await checkConflict(data.ruangan, data.tanggal, data.waktuMulai, data.waktuSelesai, isEdit ? agendaId : null);
      if (hasConflict) {
        setNotification({
          show: true,
          type: "error",
          title: "Jadwal Bentrok",
          message: "Ruangan sudah di booking pada jam tersebut. Silakan pilih jam atau ruangan lain."
        });
        return;
      }

      // 2. Prepare Data
      const type = data.jenisRuangan === 'bpkad' ? 'BPKAD' : 'PEMKOT';
      const hari = data.tanggal.split(',')[0].toUpperCase();
      const pukul = `${data.waktuMulai} - ${data.waktuSelesai}`;

      const payload = {
        hari,
        tanggal: data.tanggal,
        tempat: data.ruangan,
        pukul,
        acara: data.namaAcara,
        pelaksana: data.pelaksana,
        dihadiri: data.dihadiri || null,
        type,
        status: isEdit ? (data as any).status || 'Terjadwal' : 'Terjadwal'
      };

      let response;
      if (isEdit) {
        response = await supabase
          .from('agenda_ruangan')
          .update(payload)
          .eq('id', agendaId);
      } else {
        response = await supabase
          .from('agenda_ruangan')
          .insert([payload]);
      }

      if (response.error) throw response.error;

      setNotification({
        show: true,
        type: "success",
        title: isEdit ? "Perubahan Disimpan" : "Peminjaman Berhasil",
        message: isEdit 
          ? "Perubahan pada peminjaman ruangan Anda telah berhasil disimpan."
          : "Permohonan peminjaman ruangan Anda telah berhasil dikirim.",
        onConfirm: () => navigate('/riwayat')
      });

    } catch (error: any) {
      console.error('Save error:', error);
      setNotification({
        show: true,
        type: "error",
        title: "Gagal Mengajukan",
        message: error.message || "Terjadi kesalahan saat memproses data."
      });
    }
  };

  return (
    <div className="flex flex-col pt-4">
      {/* Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-300 p-8">

        <div className="flex items-center gap-2 mb-8 text-gray-900">
          <FileText className="text-orange-500" size={24} />
          <h3 className="text-lg font-bold">Ringkasan</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8 mb-10">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">RUANGAN</p>
            <p className="text-sm font-bold text-gray-900 uppercase">
              {data.jenisRuangan === "bpkad" ? "BPKAD" : "PEMKOT"} - {data.ruangan}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">TANGGAL & WAKTU</p>
            <p className="text-sm font-bold text-gray-900 uppercase">
              {data.tanggal}, {data.waktuMulai} - {data.waktuSelesai} WITA
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">NAMA KEGIATAN</p>
            <p className="text-sm font-bold text-gray-900 uppercase">{data.namaAcara}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">PENYELENGGARA</p>
            <p className="text-sm font-bold text-gray-900 uppercase">{data.pelaksana}</p>
          </div>
          {data.jenisRuangan === "pemkot" && data.dihadiri && (
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">DIHADIRI</p>
              <p className="text-sm font-bold text-gray-900 uppercase">{data.dihadiri}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-100 gap-4">
          <button
            onClick={() => navigate('/peminjaman')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-orange-400 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
          <button
            onClick={handleConfirm}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition shadow-md shadow-orange-500/30"
          >
            Konfirmasi Peminjaman
            <ArrowRight size={18} />
          </button>
        </div>

      </div>

      <AppNotification 
        {...notification}
        onClose={() => {
          setNotification(prev => ({ ...prev, show: false }))
          if (notification.onConfirm) notification.onConfirm()
        }}
      />
    </div>
  )
}
