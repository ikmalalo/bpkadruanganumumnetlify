import { useState } from "react"
import KGBStatCard from "../../components/KGBComponents/KGBStatCard"
import KGBTable from "../../components/KGBComponents/KGBTable"
import KGBActions from "../../components/KGBComponents/KGBActions"
import KGBConfirmModal from "../../components/KGBComponents/KGBConfirmModal"
import KGBSuccessPopup from "../../components/KGBComponents/KGBSuccessPopup"
import { Search } from "lucide-react"

const dummyData = [
  { id: 1, nip: "19850112 2010121 001", nama: "Ahmad Hidayat", golongan: "IV/c", mkg: "12 Thn", jabatan: "Kepala Bidang TIK", tahunAwal: "08/01/2022", tahunAkhir: "08/01/2024", gaji: "4.850.000" },
  { id: 2, nip: "19850113 2010121 002", nama: "Siti Aminah", golongan: "IV/b", mkg: "10 Thn", jabatan: "Sekretaris", tahunAwal: "15/03/2021", tahunAkhir: "15/03/2023", gaji: "4.250.000" },
  { id: 3, nip: "19850114 2010121 003", nama: "Budi Santoso", golongan: "III/d", mkg: "8 Thn", jabatan: "Staf Ahli", tahunAwal: "10/06/2023", tahunAkhir: "10/06/2025", gaji: "3.850.000" },
  { id: 4, nip: "19850115 2010121 004", nama: "Diana Putri", golongan: "III/c", mkg: "6 Thn", jabatan: "Analisis Data", tahunAwal: "22/11/2022", tahunAkhir: "22/11/2024", gaji: "3.450.000" },
  { id: 5, nip: "19850116 2010121 005", nama: "Eko Prasetyo", golongan: "IV/a", mkg: "14 Thn", jabatan: "Kepala Sub Bagian", tahunAwal: "05/09/2020", tahunAkhir: "05/09/2022", gaji: "5.150.000" },
]

export default function KGBDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2, 3])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)

  const selectedEmployees = dummyData.filter(emp => selectedIds.includes(emp.id))

  const handleToggleId = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleToggleAll = () => {
    if (selectedIds.length === dummyData.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(dummyData.map(d => d.id))
    }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Animation styles ── */}
      <style>{`
        @keyframes kgbd-fadeup {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kgbd-fade   { animation: kgbd-fadeup 0.38s ease-out both; }
        .kgbd-fade-1 { animation-delay: 0.04s; }
        .kgbd-fade-2 { animation-delay: 0.10s; }
        .kgbd-fade-3 { animation-delay: 0.17s; }
      `}</style>

      {/* Sub-header: title + search + actions — matches riwayat layout */}
      <div className="kgbd-fade" style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "-8px", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>

          {/* Left: Title + description */}
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#111827" }}>
              Kenaikan Gaji Berkala
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", fontWeight: 500, color: "#9ca3af" }}>
              Pilih pegawai untuk melakukan penyesuaian gaji periode
            </p>
          </div>

          {/* Right: Search + Actions */}
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
                size={16}
              />
              <input
                type="text"
                placeholder="Cari NIP atau Nama..."
                style={{
                  paddingLeft: "36px", paddingRight: "16px",
                  paddingTop: "10px", paddingBottom: "10px",
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "13px", fontWeight: 500, color: "#374151",
                  outline: "none", width: "220px",
                  boxShadow: "0 1px 4px -1px rgba(0,0,0,0.06)",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = "#f97316"
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.12)"
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = "#e5e7eb"
                  e.currentTarget.style.boxShadow = "0 1px 4px -1px rgba(0,0,0,0.06)"
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <KGBActions
              onProcess={() => setShowConfirmModal(true)}
              disabled={selectedIds.length === 0}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="kgbd-fade kgbd-fade-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KGBStatCard
          label="TOTAL PEGAWAI AKTIF"
          value="124"
          icon="users"
          color="orange"
        />
        <KGBStatCard
          label="GAJI SUDAH TERBIT"
          value="842"
          icon="check"
          color="blue"
        />
        <KGBStatCard
          label="DALAM ANTRIAN PROSES"
          value="406"
          icon="clock"
          color="green"
        />
      </div>

      {/* Table Section */}
      <div className="kgbd-fade kgbd-fade-2 mt-2">
        <KGBTable 
          data={dummyData}
          searchQuery={searchQuery} 
          selectedIds={selectedIds}
          onToggleId={handleToggleId}
          onToggleAll={handleToggleAll}
        />
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <KGBConfirmModal 
          selectedEmployees={selectedEmployees}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setProcessedCount(selectedEmployees.length)
            setShowConfirmModal(false)
            setShowSuccessPopup(true)
          }}
        />
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <KGBSuccessPopup
          totalProcessed={processedCount}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </div>
  )
}
