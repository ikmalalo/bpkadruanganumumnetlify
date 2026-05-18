import { useState, useMemo, useEffect } from "react"
import { api } from "../../lib/api"
import { Download, Wallet, ChevronDown, ChevronLeft, ChevronRight, Calendar, RotateCcw, Trash2, X, Check } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { formatIDRCurrency } from "../../lib/kgbUtils"
import * as XLSX from "xlsx"

/* ── Types ── */
interface HistoryRecord {
  id: number
  pegawai_id: number
  nip: string
  nama: string
  golongan: string
  mkg: string
  jabatan: string
  gajiLama: number
  gajiBaru: number
  periodeAwal: string
  periodeAkhir: string
  tanggalProses: string
}

/* ── Dummy Data (Removed) ── */

const GOLONGAN_OPTIONS = ["Semua Golongan", "II/a", "II/b", "II/c", "II/d", "III/a", "III/b", "III/c", "III/d", "IV/a", "IV/b", "IV/c", "IV/d", "IV/e"]
const JABATAN_OPTIONS  = ["Semua Jabatan", "Kepala Bidang", "Sekretaris", "Staf Ahli", "Analisis Data", "Kepala Sub Bag", "Programmer", "Operator", "Admin"]
const TAMPILKAN_OPTIONS = [5, 10, 20, 50]

const fmt = (v: any) => {
  const n = typeof v === "number" ? v : parseInt(String(v).replace(/\./g, "").replace(/[^0-9]/g, "")) || 0
  return new Intl.NumberFormat("id-ID").format(n)
}

export default function KGBHistory() {
  const navigate = useNavigate()
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  
  // Undo Modal State
  const [showUndoModal, setShowUndoModal] = useState(false)
  const [undoTarget, setUndoTarget] = useState<{emp: any, records: HistoryRecord[]} | null>(null)
  const [checkedUndoIds, setCheckedUndoIds] = useState<number[]>([])

  /* filters */
  const [search, setSearch]           = useState("")
  const [golFilter, setGolFilter]     = useState("Semua Golongan")
  const [jabFilter, setJabFilter]     = useState("Semua Jabatan")
  const [perPage, setPerPage]         = useState(10)
  const [page, setPage]               = useState(1)

  /* dropdown open state */
  const [golOpen, setGolOpen]     = useState(false)
  const [jabOpen, setJabOpen]     = useState(false)
  const [perOpen, setPerOpen]     = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await api.getKGBHistory()
      setHistory(data)
    } catch (err: any) {
      console.error("Gagal ambil riwayat:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  /* Selection Logic (for grouped view) */
  const groupedHistory = useMemo(() => {
    const groups: Record<number, HistoryRecord[]> = {}
    history.forEach(r => {
      if (!groups[r.pegawai_id]) groups[r.pegawai_id] = []
      groups[r.pegawai_id].push(r)
    })
    
    // Sort each group by date desc
    return Object.values(groups).map(records => {
      return records.sort((a,b) => new Date(b.tanggalProses).getTime() - new Date(a.tanggalProses).getTime())
    })
  }, [history])

  const handleOpenUndo = (records: HistoryRecord[]) => {
    setUndoTarget({ emp: records[0], records })
    setCheckedUndoIds([records[0].id]) // Default select latest
    setShowUndoModal(true)
  }

  const handleConfirmUndo = async () => {
    if (checkedUndoIds.length === 0) return
    
    try {
      const selectedRecords = history.filter(r => checkedUndoIds.includes(r.id))
      
      // We should revert to the earliest record's OLD state if we undo multiple, 
      // but usually undoing the LATEST is what restores consistency.
      // For simplicity, we take the one that is NOT being deleted as the new master, 
      // or if all deleted, take the oldest's original state.
      
      const latestToUndo = selectedRecords.sort((a,b) => new Date(b.tanggalProses).getTime() - new Date(a.tanggalProses).getTime())[0]

      const revertPayload = [{
        id: latestToUndo.pegawai_id,
        mkg: latestToUndo.mkg,
        gaji: formatIDRCurrency(latestToUndo.gajiLama),
        tahunAwal: latestToUndo.periodeAwal,
        tahunAkhir: latestToUndo.periodeAkhir
      }]

      await api.bulkUpdateKGBEmployees(revertPayload)
      await api.deleteKGBHistory(checkedUndoIds)
      
      setShowUndoModal(false)
      fetchData()
    } catch (err: any) {
      alert("Gagal undo: " + err.message)
    }
  }

  /* filtered data */
  const filtered = useMemo(() => {
    return groupedHistory.filter(group => {
      const r = group[0] // representative (latest)
      const matchSearch = search === "" ||
        r.nama.toLowerCase().includes(search.toLowerCase()) ||
        r.nip.includes(search)
      const matchGol  = golFilter === "Semua Golongan" || r.golongan === golFilter
      const matchJab  = jabFilter === "Semua Jabatan"  || r.jabatan  === jabFilter
      return matchSearch && matchGol && matchJab
    })
  }, [groupedHistory, search, golFilter, jabFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage   = Math.min(page, totalPages)
  const paged      = filtered.slice((safePage - 1) * perPage, safePage * perPage)

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) setPage(p)
  }

  const pageNumbers = () => {
    const pages: (number | "...")[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (safePage > 3) pages.push("...")
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i)
      if (safePage < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  const handleExportExcel = () => {
    if (history.length === 0) return
    const exportData = history.map((r, i) => ({
      "No": i + 1,
      "NIP": r.nip,
      "Nama Pegawai": r.nama,
      "Golongan": r.golongan,
      "MKG": r.mkg,
      "Jabatan": r.jabatan,
      "Gaji Lama": r.gajiLama,
      "Gaji Baru": r.gajiBaru,
      "Periode Awal": r.periodeAwal,
      "Periode Akhir": r.periodeAkhir,
      "Tanggal Proses": new Date(r.tanggalProses).toLocaleDateString("id-ID")
    }))
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Riwayat KGB")
    XLSX.writeFile(wb, `Riwayat_KGB_${new Date().getTime()}.xlsx`)
  }

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ── Style block ── */}
      <style>{`
        @keyframes kgbHistFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kgbh-fade { animation: kgbHistFadeUp 0.35s ease-out both; }
        .kgbh-fade-2 { animation-delay: 0.10s; }

        .kgbh-dropdown-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #374151;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s;
          position: relative;
          white-space: nowrap;
        }
        .kgbh-dropdown-btn:hover { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }

        .kgbh-dropdown-menu {
          position: absolute; top: calc(100% + 6px); left: 0; z-index: 50;
          background: white; border: 1px solid #e5e7eb;
          border-radius: 12px; padding: 6px;
          box-shadow: 0 8px 32px -4px rgba(0,0,0,0.14);
          min-width: 160px;
          max-height: 220px;
          overflow-y: auto;
          animation: kgbh-dropdown-in 0.2s cubic-bezier(0, 0, 0.2, 1);
          transform-origin: top left;
        }
        @keyframes kgbh-dropdown-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .kgbh-dropdown-item {
          padding: 8px 12px; border-radius: 8px; cursor: pointer;
          font-size: 13px; font-weight: 500; color: #374151;
          transition: background 0.12s;
        }
        .kgbh-dropdown-item:hover { background: #fff7f0; color: #f97316; }
        .kgbh-dropdown-item.active { background: #fff7f0; color: #f97316; font-weight: 700; }

        .kgbh-row { transition: background 0.12s; }
        .kgbh-row:hover { background: #fffaf7; }

        .kgbh-page-btn {
          width: 34px; height: 34px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; cursor: pointer; border: none;
          transition: background 0.15s, color 0.15s;
        }
        .kgbh-page-btn.active { background: #f97316; color: white; box-shadow: 0 4px 12px -2px rgba(249,115,22,0.45); }
        .kgbh-page-btn:not(.active) { background: white; color: #374151; border: 1px solid #e5e7eb; }
        .kgbh-page-btn:not(.active):hover { background: #fff7f0; color: #f97316; border-color: #fed7aa; }
        .kgbh-page-btn:disabled { opacity: 0.35; cursor: default; }

        .kgbh-export-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px;
          background: white; border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 13px; font-weight: 700; color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }
        .kgbh-export-btn:hover { border-color: #f97316; color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }

        .kgbh-process-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg,#fb923c,#f97316,#ea580c);
          border: none; border-radius: 12px;
          font-size: 13px; font-weight: 700; color: white;
          cursor: pointer;
          box-shadow: 0 6px 20px -4px rgba(249,115,22,0.55);
          transition: all 0.2s;
        }
        .kgbh-process-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px -4px rgba(249,115,22,0.7);
        }
      `}</style>

      {/* ── Sub-header ── */}
      <div className="kgbh-fade flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 -mt-2">
        <div>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#111827" }}>
            Riwayat Kenaikan Gaji Berkala
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: "13px", fontWeight: 500, color: "#9ca3af" }}>
            informasi terkait riwayat kenaikan gaji karyawan
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
          <button className="kgbh-export-btn" onClick={handleExportExcel}>
            <Download size={16} />
            <span>Export Excel</span>
          </button>
          <button className="kgbh-process-btn" onClick={() => navigate("/kgb")}>
            <Wallet size={16} />
            <span>Proses Penggajian</span>
          </button>
        </div>
      </div>


      {/* ── Table Card ── */}
      <div
        className="kgbh-fade kgbh-fade-2"
        style={{
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 2px 16px -4px rgba(0,0,0,0.08)",
          overflow: "hidden",
          border: "1px solid #f3f4f6",
        }}
      >
        {/* Table header bar */}
        <div style={{
          background: "linear-gradient(135deg,#fb923c,#f97316,#ea580c)",
          padding: "16px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
        }}>
          <span style={{ fontSize: "16px", fontWeight: 800, color: "white", letterSpacing: "0.02em" }}>
            Data Pegawai
          </span>

          {/* Filters */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>

            {/* Golongan */}
            <div style={{ position: "relative" }}>
              <button className="kgbh-dropdown-btn" onClick={() => { setGolOpen(!golOpen); setJabOpen(false); setPerOpen(false) }}>
                <ChevronDown size={14} />
                {golFilter}
              </button>
              {golOpen && (
                <div className="kgbh-dropdown-menu">
                  {GOLONGAN_OPTIONS.map(g => (
                    <div key={g} className={`kgbh-dropdown-item ${golFilter === g ? "active" : ""}`}
                      onClick={() => { setGolFilter(g); setGolOpen(false); setPage(1) }}>
                      {g}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Jabatan */}
            <div style={{ position: "relative" }}>
              <button className="kgbh-dropdown-btn" onClick={() => { setJabOpen(!jabOpen); setGolOpen(false); setPerOpen(false) }}>
                <ChevronDown size={14} />
                {jabFilter}
              </button>
              {jabOpen && (
                <div className="kgbh-dropdown-menu">
                  {JABATAN_OPTIONS.map(j => (
                    <div key={j} className={`kgbh-dropdown-item ${jabFilter === j ? "active" : ""}`}
                      onClick={() => { setJabFilter(j); setJabOpen(false); setPage(1) }}>
                      {j}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Per page */}
            <div style={{ position: "relative" }}>
              <button className="kgbh-dropdown-btn" onClick={() => { setPerOpen(!perOpen); setGolOpen(false); setJabOpen(false) }}>
                <ChevronDown size={14} />
                Tampilkan {perPage}
              </button>
              {perOpen && (
                <div className="kgbh-dropdown-menu">
                  {TAMPILKAN_OPTIONS.map(n => (
                    <div key={n} className={`kgbh-dropdown-item ${perPage === n ? "active" : ""}`}
                      onClick={() => { setPerPage(n); setPerOpen(false); setPage(1) }}>
                      Tampilkan {n}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
                {["No", "NIP & Nama Pegawai", "Golongan", "Total Riwayat", "Jabatan", "Gaji Terakhir", "Periode Terakhir", "Aksi"].map((h, i) => (
                  <th key={h} style={{
                    padding: "14px 16px",
                    textAlign: i === 0 || i === 7 ? "center" : "left",
                    fontSize: "11px", fontWeight: 700,
                    color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em",
                    whiteSpace: "nowrap",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "48px", textAlign: "center", color: "#9ca3af", fontSize: "14px", fontWeight: 500 }}>
                    Tidak ada data yang ditemukan
                  </td>
                </tr>
              ) : paged.map((group, idx) => {
                const r = group[0] // Latest
                return (
                <tr key={r.pegawai_id} className="kgbh-row" style={{ borderBottom: "1px solid #f9fafb" }}>
                  
                  {/* No */}
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <div style={{
                      width: "30px", height: "30px", borderRadius: "8px",
                      background: "#fff7f0", color: "#ea580c",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: "13px", margin: "0 auto",
                    }}>
                      {(safePage - 1) * perPage + idx + 1}
                    </div>
                  </td>

                  {/* NIP & Nama */}
                  <td style={{ padding: "16px 16px" }}>
                    <div style={{ fontWeight: 700, color: "#111827", fontSize: "14px" }}>{r.nama}</div>
                    <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>{r.nip}</div>
                  </td>

                  {/* Golongan */}
                  <td style={{ padding: "16px" }}>
                    <span style={{
                      background: "#fff7f0", color: "#ea580c",
                      padding: "4px 10px", borderRadius: "8px",
                      fontWeight: 700, fontSize: "12px",
                    }}>
                      {r.golongan}
                    </span>
                  </td>

                  {/* Total Riwayat */}
                  <td style={{ padding: "16px" }}>
                    <span style={{
                      background: "#f3f4f6", color: "#374151",
                      padding: "4px 10px", borderRadius: "8px",
                      fontWeight: 700, fontSize: "11px",
                    }}>
                      {group.length} Proses
                    </span>
                  </td>

                  {/* Jabatan */}
                  <td style={{ padding: "16px", color: "#374151", fontWeight: 500, maxWidth: "130px" }}>
                    {r.jabatan}
                  </td>

                  {/* Gaji Baru */}
                  <td style={{ padding: "16px", fontWeight: 800, color: "#16a34a", fontSize: "14px", whiteSpace: "nowrap" }}>
                    Rp.{fmt(r.gajiBaru)}
                  </td>

                  {/* Periode */}
                  <td style={{ padding: "16px" }}>
                    <div style={{
                      background: "#f9fafb", border: "1px solid #f3f4f6",
                      borderRadius: "10px", padding: "6px 10px",
                      fontSize: "11px", fontWeight: 600, color: "#374151",
                      lineHeight: 1.5, whiteSpace: "nowrap",
                    }}>
                      <div>
                        {r.periodeAwal ? new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(r.periodeAwal)) : '-'} – {r.periodeAkhir ? new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(r.periodeAkhir)) : '-'}
                      </div>
                    </div>
                  </td>

                  {/* Aksi Buttons */}
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <button 
                        onClick={() => handleOpenUndo(group)}
                        title="Undo Proses KGB"
                        style={{
                          width: "34px", height: "34px", borderRadius: "10px",
                          background: "#fee2e2", color: "#ef4444",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: "none", cursor: "pointer", transition: "all 0.2s",
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = "#fecaca"; e.currentTarget.style.transform = "scale(1.1)" }}
                        onMouseOut={(e) => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.transform = "scale(1)" }}
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if(window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat KGB untuk pegawai ini?')) {
                            api.deleteKGBHistory(group.map(r => r.id)).then(() => fetchData()).catch((err: any) => alert('Gagal menghapus: ' + err.message));
                          }
                        }}
                        title="Hapus Seluruh Riwayat"
                        style={{
                          width: "34px", height: "34px", borderRadius: "10px",
                          background: "#f3f4f6", color: "#6b7280",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: "none", cursor: "pointer", transition: "all 0.2s",
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = "#e5e7eb"; e.currentTarget.style.color = "#111827"; e.currentTarget.style.transform = "scale(1.1)" }}
                        onMouseOut={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.transform = "scale(1)" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              )})}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div style={{
          padding: "16px 24px",
          display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px",
          borderTop: "1px solid #f3f4f6",
        }}>
          <button
            className="kgbh-page-btn"
            disabled={safePage === 1}
            onClick={() => handlePageChange(safePage - 1)}
          >
            <ChevronLeft size={16} />
          </button>

          {pageNumbers().map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} style={{ fontSize: "13px", color: "#9ca3af", padding: "0 4px" }}>…</span>
            ) : (
              <button
                key={p}
                className={`kgbh-page-btn ${safePage === p ? "active" : ""}`}
                onClick={() => handlePageChange(p as number)}
              >
                {p}
              </button>
            )
          )}

          <button
            className="kgbh-page-btn"
            disabled={safePage === totalPages}
            onClick={() => handlePageChange(safePage + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ── UNDO MODAL ── */}
      {showUndoModal && undoTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 kgb-animate-fade">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUndoModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[28px] overflow-hidden shadow-2xl kgb-animate-pop" style={{ border: '1px solid #f3f4f6' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '32px 32px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', background: '#fee2e2', color: '#ef4444', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RotateCcw size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#111827' }}>Konfirmasi Undo</h3>
                <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: 500, color: '#6b7280' }}>{undoTarget.emp.nama}</p>
              </div>
              <button onClick={() => setShowUndoModal(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '0 32px 32px' }}>
              <p style={{ fontSize: '12px', color: '#ef4444', background: '#fef2f2', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontWeight: 600 }}>
                Catatan: Untuk menjaga konsistensi data, Anda hanya dapat melakukan undo pada riwayat yang paling baru secara berurutan.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '40vh', overflowY: 'auto', paddingRight: '4px' }}>
                {undoTarget.records.map((r, i) => (
                  <div 
                    key={r.id} 
                    style={{
                      padding: '16px', borderRadius: '16px', border: '2px solid',
                      borderColor: i === 0 ? '#ef4444' : '#e5e7eb',
                      background: i === 0 ? '#fef2f2' : '#f9fafb',
                      cursor: i === 0 ? 'default' : 'not-allowed', 
                      opacity: i === 0 ? 1 : 0.6,
                      transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '14px'
                    }}
                  >
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      border: '2px solid', borderColor: i === 0 ? '#ef4444' : '#d1d5db',
                      background: i === 0 ? '#ef4444' : '#f3f4f6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {i === 0 && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                        {r.periodeAwal ? new Date(r.periodeAwal).getFullYear() : '-'} – {r.periodeAkhir ? new Date(r.periodeAkhir).getFullYear() : '-'}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 500, color: '#6b7280', marginTop: '2px' }}>
                        Gaji: Rp.{fmt(r.gajiBaru)} (MKG: {r.mkg})
                      </div>
                    </div>
                    {i === 0 ? (
                      <span style={{ background: '#ef4444', color: 'white', fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: '99px', textTransform: 'uppercase' }}>Siap di-Undo</span>
                    ) : (
                      <span style={{ background: '#9ca3af', color: 'white', fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: '99px', textTransform: 'uppercase' }}>Terkunci</span>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '28px', display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setShowUndoModal(false)}
                  style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #e5e7eb', background: 'white', color: '#374151', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button 
                  onClick={handleConfirmUndo}
                  disabled={checkedUndoIds.length === 0}
                  style={{ 
                    flex: 1, padding: '14px', borderRadius: '14px', border: 'none', 
                    background: checkedUndoIds.length > 0 ? '#ef4444' : '#f3f4f6', 
                    color: checkedUndoIds.length > 0 ? 'white' : '#9ca3af', 
                    fontSize: '14px', fontWeight: 700, cursor: checkedUndoIds.length > 0 ? 'pointer' : 'default' 
                  }}
                >
                  Konfirmasi Undo
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
