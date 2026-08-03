import { useState, useEffect } from "react"
import StatCard from "../components/DashboardComponents/StatCard"
import BookingTable from "../components/DashboardComponents/BookingTable"
import DashboardFilter from "../components/DashboardComponents/DashboardFilter"
import CertificateTable from "../components/DashboardComponents/CertificateTable"
import Toast from "../components/DashboardComponents/Toast"
import ConfirmPopup from "../components/Common/ConfirmPopup"
import "../index.css"
import { api } from "../lib/api"

export default function RoomDashboard() {

  const [statusFilter, setStatusFilter] = useState("Semua")
  const [tempatFilter, setTempatFilter] = useState("Semua")
  const [hariFilter, setHariFilter] = useState("Terdekat")

  const [bpkadData, setBpkadData] = useState<any[]>([])
  const [pemkotData, setPemkotData] = useState<any[]>([])
  const [certificates, setCertificates] = useState<any[]>([])
  const [selectedAgenda, setSelectedAgenda] = useState<any | null>(null)
  const [toast, setToast] = useState({ show: false, message: "", type: 'success' as 'success' | 'error' })
  const [confirmPopup, setConfirmPopup] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    variant: 'danger'
  })

  const fetchData = async () => {
    try {
      // Fetch Agendas
      const agendas = await api.getAgendas();

      const bpkad = agendas.filter((item: any) => item.type === 'BPKAD')
      const pemkot = agendas.filter((item: any) => item.type === 'PEMKOT')
      
      setBpkadData(bpkad)
      setPemkotData(pemkot)

      // Fetch Information (Informasi)
      const infos = await api.getInformasi();
      setCertificates(infos)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  useEffect(() => {
    document.title = "Dashboard Ruangan | BPKAD"
    fetchData()
  }, [])

  const handleDeleteInformasi = (id: number) => {
    setConfirmPopup({
      isOpen: true,
      title: "Hapus Informasi",
      message: "Apakah Anda yakin ingin menghapus informasi ini?",
      variant: 'danger',
      onConfirm: async () => {
        try {
          await api.deleteInformasi(id);
          setCertificates(prev => prev.filter(c => c.id !== id));
          setToast({ show: true, message: "Informasi berhasil dihapus", type: 'success' });
        } catch (error) {
          console.error('Error deleting information:', error);
          setToast({ show: true, message: "Terjadi kesalahan saat menghapus informasi", type: 'error' });
        }
        setConfirmPopup(prev => ({ ...prev, isOpen: false }));
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      }
    });
  };

  const handleDeleteAgenda = (id: number) => {
    setConfirmPopup({
      isOpen: true,
      title: "Hapus Peminjaman",
      message: "Apakah Anda yakin ingin menghapus ruangan ini secara permanen?",
      variant: 'danger',
      onConfirm: async () => {
        try {
          await api.deleteAgenda(id);
          setBpkadData(prev => prev.filter(c => c.id !== id));
          setPemkotData(prev => prev.filter(c => c.id !== id));
          setSelectedAgenda(null);
          setToast({ show: true, message: "Peminjaman ruangan berhasil dihapus permanen", type: 'success' });
        } catch (error) {
          console.error('Error deleting agenda:', error);
          setToast({ show: true, message: "Terjadi kesalahan saat menghapus peminjaman", type: 'error' });
        }
        setConfirmPopup(prev => ({ ...prev, isOpen: false }));
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      }
    });
  };

  // Dynamic stats based on filters
  const getFilteredData = (data: any[]) => {
    let filtered = [...data]
    if (statusFilter !== "Semua") filtered = filtered.filter(d => d.status === statusFilter)
    if (tempatFilter !== "Semua") filtered = filtered.filter(d => d.tempat.includes(tempatFilter))
    return filtered
  }

  const filteredBpkad = getFilteredData(bpkadData)
  const filteredPemkot = getFilteredData(pemkotData)

  const totalBpkad = filteredBpkad.length
  const totalPemkot = filteredPemkot.length

  const sedangDigunakan =
    filteredBpkad.filter(d => d.status === "Berlangsung").length +
    filteredPemkot.filter(d => d.status === "Berlangsung").length

  const terjadwal =
    filteredBpkad.filter(d => d.status === "Terjadwal").length +
    filteredPemkot.filter(d => d.status === "Terjadwal").length

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
          label="TOTAL INFORMASI"
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
        onDelete={handleDeleteInformasi}
      />
      
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <ConfirmPopup
        isOpen={confirmPopup.isOpen}
        title={confirmPopup.title}
        message={confirmPopup.message}
        variant={confirmPopup.variant}
        onConfirm={confirmPopup.onConfirm}
        onCancel={() => setConfirmPopup(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}