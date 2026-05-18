import { useState, useEffect } from "react"
import { api } from "../../lib/api"
import KGBStatCard from "../../components/KGBComponents/KGBStatCard"
import KGBTable from "../../components/KGBComponents/KGBTable"
import KGBActions from "../../components/KGBComponents/KGBActions"
import KGBConfirmModal from "../../components/KGBComponents/KGBConfirmModal"
import KGBSuccessPopup from "../../components/KGBComponents/KGBSuccessPopup"
import { Search, AlertCircle, ArrowRight, X } from "lucide-react"
import { calculateKGB, formatIDRCurrency, isKGBDueSoon } from "../../lib/kgbUtils"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"

const dummyData: any[] = []

export default function KGBDashboard() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)

  const [historyCount, setHistoryCount] = useState(0)
  const [showDueOnly, setShowDueOnly] = useState(false)
  const [showBanner, setShowBanner] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await api.getKGBEmployees()
      setEmployees(data)
      
      const histData = await api.getKGBHistory()
      setHistoryCount(histData.length)
    } catch (err: any) {
      console.error("Gagal ambil data dashboard:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = "Dashboard KGB | BPKAD"
    fetchData()
  }, [])


  const dueSoonEmployees = employees.filter(emp => isKGBDueSoon(emp.tahunAkhir))

  const displayEmployees = showDueOnly ? dueSoonEmployees : employees

  const selectedEmployees = displayEmployees.filter(emp => selectedIds.includes(emp.id))

  const handleToggleId = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleToggleAll = () => {
    if (selectedIds.length === displayEmployees.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(displayEmployees.map(d => d.id))
    }
  }

  const handleConfirmProcess = async () => {
    try {
      // 1. Data for History
      const historyRecords = selectedEmployees.map(emp => {
        const { oldGaji, newGaji } = calculateKGB(emp)
        
        return {
          pegawai_id: emp.id,
          nip: emp.nip,
          nama: emp.nama,
          golongan: emp.golongan,
          mkg: emp.mkg,
          jabatan: emp.jabatan,
          gajiLama: oldGaji,
          gajiBaru: newGaji,
          periodeAwal: emp.tahunAwal,
          periodeAkhir: emp.tahunAkhir
        }
      })

      // 2. Data for Master Update
      const updateRecords = selectedEmployees.map(emp => {
        const { newGaji, newMKG } = calculateKGB(emp)
        
        const nextEnd = new Date(emp.tahunAkhir)
        nextEnd.setFullYear(nextEnd.getFullYear() + 2)

        return {
          id: emp.id,
          mkg: newMKG + " Thn",
          gaji: formatIDRCurrency(newGaji),
          tahunAwal: emp.tahunAkhir,
          tahunAkhir: nextEnd.toISOString().split('T')[0]
        }
      })

      // Execute both
      await api.addKGBHistory({ records: historyRecords })
      await api.bulkUpdateKGBEmployees(updateRecords)
      
      setProcessedCount(selectedEmployees.length)
      setShowConfirmModal(false)
      setShowSuccessPopup(true)
      setSelectedIds([])
      fetchData() // Refresh list
    } catch (err: any) {
      alert("Gagal memproses penggajian: " + err.message)
    }
  }

  const handleExportExcel = async () => {
    if (employees.length === 0) return

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Dashboard KGB")

    // Define columns
    worksheet.columns = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'NIP', key: 'nip', width: 22 },
      { header: 'Nama Pegawai', key: 'nama', width: 35 },
      { header: 'Golongan', key: 'golongan', width: 12 },
      { header: 'MKG', key: 'mkg', width: 10 },
      { header: 'Jabatan', key: 'jabatan', width: 35 },
      { header: 'Unit Kerja', key: 'unit', width: 20 },
      { header: 'Gaji Saat Ini', key: 'gaji', width: 18 },
      { header: 'Tahun Akhir', key: 'tahunAkhir', width: 15 },
      { header: 'Tahun Yang Akan Datang', key: 'tahunNext', width: 22 },
    ]

    // Style the header row (Blue background, White text, Bold, Borders)
    const headerRow = worksheet.getRow(1)
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' } // Excel default blue
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }
      }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    })

    // Add data rows with borders
    employees.forEach((e, i) => {
      const row = worksheet.addRow({
        no: i + 1,
        nip: e.nip,
        nama: e.nama,
        golongan: e.golongan,
        mkg: e.mkg,
        jabatan: e.jabatan,
        unit: e.unit,
        gaji: e.gaji,
        tahunAkhir: e.tahunAkhir,
        tahunNext: (() => {
          if (!e.tahunAkhir) return '-';
          const d = new Date(e.tahunAkhir);
          d.setFullYear(d.getFullYear() + 2);
          return d.toISOString().split('T')[0];
        })()
      })

      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
        cell.alignment = { vertical: 'middle' }
      })
    })

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, `Dashboard_KGB_${new Date().getTime()}.xlsx`)
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

      {/* ── Notification Banner ── */}
      {dueSoonEmployees.length > 0 && showBanner && !showDueOnly && (
        <div className="kgbd-fade" style={{
          background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
          border: "1px solid #fb923c",
          borderRadius: "16px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          boxShadow: "0 4px 12px rgba(251, 146, 60, 0.15)",
          marginBottom: "8px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              background: "#fb923c",
              padding: "10px",
              borderRadius: "12px",
              color: "white"
            }}>
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#9a3412" }}>
                Pengingat Kenaikan Gaji!
              </h4>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#c2410c", fontWeight: 500 }}>
                Ada <strong>{dueSoonEmployees.length} pegawai</strong> yang sudah bisa diajukan KGB dalam bulan ini.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setShowDueOnly(true)}
              style={{
                background: "#fb923c",
                color: "white",
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                border: "none",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
            >
              Lihat Detail <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => setShowBanner(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#9a3412",
                cursor: "pointer",
                padding: "4px"
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ── Active Filter Bar ── */}
      {showDueOnly && (
        <div className="kgbd-fade" style={{
          background: "#fef2f2",
          border: "1px solid #fee2e2",
          borderRadius: "12px",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#991b1b", fontWeight: 600 }}>
            <AlertCircle size={16} />
            Menampilkan {dueSoonEmployees.length} pegawai yang jatuh tempo bulan ini
          </div>
          <button 
            onClick={() => setShowDueOnly(false)}
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#b91c1c",
              background: "white",
              border: "1px solid #fecaca",
              padding: "4px 12px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Tampilkan Semua
          </button>
        </div>
      )}

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
              onExport={handleExportExcel}
              disabled={selectedIds.length === 0}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="kgbd-fade kgbd-fade-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KGBStatCard
          label="TOTAL PEGAWAI AKTIF"
          value={employees.length.toString()}
          icon="users"
          color="orange"
        />
        <KGBStatCard
          label="GAJI SUDAH TERBIT"
          value={historyCount.toString()}
          icon="check"
          color="blue"
        />
      </div>

      {/* Table Section */}
      <div className="kgbd-fade kgbd-fade-2 mt-2">
        <KGBTable 
          data={displayEmployees}
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
          onConfirm={handleConfirmProcess}
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
