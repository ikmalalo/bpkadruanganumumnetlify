import { useState, useMemo } from "react"
import { Download, Wallet, ChevronDown, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { useNavigate } from "react-router-dom"

/* ── Types ── */
interface HistoryRecord {
  id: number
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

/* ── Dummy Data ── */
const dummyHistory: HistoryRecord[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  nip: `198501${String(12 + (i % 8)).padStart(2, "0")} 2010121 00${(i % 5) + 1}`,
  nama: ["Ahmad Hidayat", "Siti Aminah", "Budi Santoso", "Diana Putri", "Eko Prasetyo", "Fajar Nugroho", "Galih Wicaksono", "Hesti Rahayu"][i % 8],
  golongan: ["IV/c", "IV/b", "III/d", "III/c", "IV/a", "III/b", "II/d", "III/a"][i % 8],
  mkg: `${8 + (i % 8) * 2} Thn`,
  jabatan: ["Kepala Bidang", "Sekretaris", "Staf Ahli", "Analisis Data", "Kepala Sub Bag", "Programmer", "Operator", "Admin"][i % 8],
  gajiLama: 4250000 + i * 50000,
  gajiBaru: 4850000 + i * 50000,
  periodeAwal: `01 Jan ${22 + (i % 3)}`,
  periodeAkhir: `31 Des ${23 + (i % 3)}`,
  tanggalProses: `${String((i % 28) + 1).padStart(2, "0")} Jan 2024`,
}))

const GOLONGAN_OPTIONS = ["Semua Golongan", "II/d", "III/a", "III/b", "III/c", "III/d", "IV/a", "IV/b", "IV/c"]
const JABATAN_OPTIONS  = ["Semua Jabatan", "Kepala Bidang", "Sekretaris", "Staf Ahli", "Analisis Data", "Kepala Sub Bag", "Programmer", "Operator", "Admin"]
const TAMPILKAN_OPTIONS = [5, 10, 20, 50]

const fmt = (n: number) => new Intl.NumberFormat("id-ID").format(n)

export default function KGBHistory() {
  const navigate = useNavigate()

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

  /* filtered data */
  const filtered = useMemo(() => {
    return dummyHistory.filter(r => {
      const matchSearch = search === "" ||
        r.nama.toLowerCase().includes(search.toLowerCase()) ||
        r.nip.includes(search)
      const matchGol  = golFilter === "Semua Golongan" || r.golongan === golFilter
      const matchJab  = jabFilter === "Semua Jabatan"  || r.jabatan  === jabFilter
      return matchSearch && matchGol && matchJab
    })
  }, [search, golFilter, jabFilter])

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
          <button className="kgbh-export-btn">
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
                {["No", "NIP & Nama Pegawai", "Golongan", "MKG", "Jabatan", "Gaji lama", "Gaji Baru", "Periode", "Tanggal Proses"].map((h, i) => (
                  <th key={h} style={{
                    padding: "14px 16px",
                    textAlign: i === 0 ? "center" : "left",
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
                  <td colSpan={9} style={{ padding: "48px", textAlign: "center", color: "#9ca3af", fontSize: "14px", fontWeight: 500 }}>
                    Tidak ada data yang ditemukan
                  </td>
                </tr>
              ) : paged.map((r, idx) => (
                <tr key={r.id} className="kgbh-row" style={{ borderBottom: "1px solid #f9fafb" }}>

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

                  {/* MKG */}
                  <td style={{ padding: "16px", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>
                    {r.mkg}
                  </td>

                  {/* Jabatan */}
                  <td style={{ padding: "16px", color: "#374151", fontWeight: 500, maxWidth: "130px" }}>
                    {r.jabatan}
                  </td>

                  {/* Gaji Lama */}
                  <td style={{ padding: "16px", color: "#9ca3af", fontWeight: 500, textDecoration: "line-through", whiteSpace: "nowrap" }}>
                    Rp.{fmt(r.gajiLama)}
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
                      <div style={{ color: "#9ca3af", fontSize: "10px", fontWeight: 600 }}>2 Tahun</div>
                      <div>{r.periodeAwal} – {r.periodeAkhir}</div>
                    </div>
                  </td>

                  {/* Tanggal Proses */}
                  <td style={{ padding: "16px" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      background: "#eff6ff", border: "1px solid #bfdbfe",
                      borderRadius: "10px", padding: "6px 12px",
                      fontWeight: 700, color: "#1d4ed8", fontSize: "12px",
                      whiteSpace: "nowrap",
                    }}>
                      <Calendar size={13} strokeWidth={2.5} />
                      {r.tanggalProses}
                    </div>
                  </td>

                </tr>
              ))}
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
    </div>
  )
}
