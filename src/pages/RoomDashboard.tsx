import { useState, useEffect } from "react"
import StatCard from "../components/DashboardComponents/StatCard"
import BookingTable from "../components/DashboardComponents/BookingTable"
import DashboardFilter from "../components/DashboardComponents/DashboardFilter"
import CertificateTable from "../components/DashboardComponents/CertificateTable"
import Toast from "../components/DashboardComponents/Toast"
import "../index.css"
import { supabase } from "../lib/supabaseClient"
import { runAutoClean } from "../lib/autoClean"

export default function RoomDashboard() {

  const [statusFilter, setStatusFilter] = useState("Semua")
  const [tempatFilter, setTempatFilter] = useState("Semua")
  const [hariFilter, setHariFilter] = useState("Terdekat")

  const [bpkadData, setBpkadData] = useState<any[]>([])
  const [pemkotData, setPemkotData] = useState<any[]>([])
  const [certificates, setCertificates] = useState<any[]>([])
  const [selectedAgenda, setSelectedAgenda] = useState<any | null>(null)
  const [toast, setToast] = useState({ show: false, message: "", type: 'success' as 'success' | 'error' })

  const fetchData = async () => {
    try {
      // Fetch Agendas
      const { data: agendas, error: agendaError } = await supabase
        .from('agenda_ruangan')
        .select('*')
        .order('id', { ascending: true })

      if (agendaError) throw agendaError

      if (agendas) {
        const modified = await runAutoClean(agendas);
        if (modified) {
          fetchData();
          return;
        }
      }
      
      const bpkad = agendas.filter((item: any) => item.type === 'BPKAD' && item.status !== 'Selesai')
      const pemkot = agendas.filter((item: any) => item.type === 'PEMKOT' && item.status !== 'Selesai')
      
      setBpkadData(bpkad)
      setPemkotData(pemkot)

      // Fetch Certificates (Sertifikat)
      const { data: certs, error: certError } = await supabase
        .from('sertifikat')
        .select('*')
        .order('created_at', { ascending: false })

      if (certError) throw certError
      setCertificates(certs)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteCertificate = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus sertifikat ini?")) return;
    
    try {
      const { error } = await supabase
        .from('sertifikat')
        .delete()
        .eq('id', id)

      if (error) throw error

      setCertificates(prev => prev.filter(c => c.id !== id));
      setToast({ show: true, message: "Sertifikat berhasil dihapus", type: 'success' });
    } catch (error) {
      console.error('Error deleting certificate:', error);
      setToast({ show: true, message: "Terjadi kesalahan saat menghapus sertifikat", type: 'error' });
    }
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleDeleteAgenda = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus ruangan ini secara permanen?")) return;
    
    try {
      const { error } = await supabase
        .from('agenda_ruangan')
        .delete()
        .eq('id', id)

      if (error) throw error

      setBpkadData(prev => prev.filter(c => c.id !== id));
      setPemkotData(prev => prev.filter(c => c.id !== id));
      setSelectedAgenda(null);
      setToast({ show: true, message: "Peminjaman ruangan berhasil dihapus permanen", type: 'success' });
    } catch (error) {
      console.error('Error deleting agenda:', error);
      setToast({ show: true, message: "Terjadi kesalahan saat menghapus peminjaman", type: 'error' });
    }
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const totalBpkad = bpkadData.length
  const totalPemkot = pemkotData.length

  const sedangDigunakan =
    bpkadData.filter(d => d.status === "Berlangsung").length +
    pemkotData.filter(d => d.status === "Berlangsung").length

  const terjadwal =
    bpkadData.filter(d => d.status === "Terjadwal").length +
    pemkotData.filter(d => d.status === "Terjadwal").length

  return (
    <div className="flex flex-col relative">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-10">
        <StatCard
          number={totalBpkad.toString()}
          label="PEMINJAMAN BPKAD"
          color="border-orange-500 text-orange-500"
        />

        <StatCard
          number={totalPemkot.toString()}
          label="PEMINJAMAN PEMKOT"
          color="border-indigo-500 text-indigo-500"
        />

        <StatCard
          number={certificates.length.toString()}
          label="TOTAL SERTIFIKAT"
          color="border-yellow-500 text-yellow-500"
        />

        <StatCard
          number={sedangDigunakan.toString()}
          label="SEDANG DIGUNAKAN"
          color="border-green-500 text-green-500"
        />

        <StatCard
          number={terjadwal.toString()}
          label="TERJADWAL"
          color="border-purple-500 text-purple-500"
        />
      </div>

      <DashboardFilter
        setStatusFilter={setStatusFilter}
        setTempatFilter={setTempatFilter}
        setHariFilter={setHariFilter}
        selectedAgenda={selectedAgenda}
        onDeleteAgenda={handleDeleteAgenda}
      />

      <BookingTable
        statusFilter={statusFilter}
        tempatFilter={tempatFilter}
        hariFilter={hariFilter}
        bpkadData={bpkadData}
        pemkotData={pemkotData}
        setBpkadData={setBpkadData}
        setPemkotData={setPemkotData}
        selectedAgenda={selectedAgenda}
        setSelectedAgenda={setSelectedAgenda}
      />

      <CertificateTable 
        certificates={certificates}
        onDelete={handleDeleteCertificate}
      />
      
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  )
}