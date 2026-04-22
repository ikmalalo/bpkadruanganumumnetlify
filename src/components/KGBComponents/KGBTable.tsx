import { useState, useMemo } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, Pencil, Trash2, Calendar } from "lucide-react"

interface KGBTableProps {
  data: any[]
  searchQuery: string
  selectedIds: number[]
  onToggleId: (id: number) => void
  onToggleAll: () => void
}

const GOLONGAN_OPTIONS = ["Semua Golongan", "I/a", "I/b", "II/a", "II/b", "II/c", "II/d", "III/a", "III/b", "III/c", "III/d", "IV/a", "IV/b", "IV/c", "IV/d", "IV/e"]
const JABATAN_OPTIONS  = ["Semua Jabatan", "Kepala Bidang TIK", "Sekretaris", "Staf Ahli", "Analisis Data", "Kepala Sub Bagian", "Programmer", "Operator", "Admin"]
const TAMPILKAN_OPTIONS = [5, 10, 20, 50]

const fmt = (n: number) => new Intl.NumberFormat("id-ID").format(n)

export default function KGBTable({ data, searchQuery, selectedIds, onToggleId, onToggleAll }: KGBTableProps) {
  const isAllSelected = data.length > 0 && data.every(d => selectedIds.includes(d.id))

  const [golFilter, setGolFilter] = useState("Semua Golongan")
  const [jabFilter, setJabFilter] = useState("Semua Jabatan")
  const [perPage,   setPerPage]   = useState(10)
  const [page,      setPage]      = useState(1)

  const [golOpen, setGolOpen] = useState(false)
  const [jabOpen, setJabOpen] = useState(false)
  const [perOpen, setPerOpen] = useState(false)

  const filtered = useMemo(() => {
    return data.filter(r => {
      const q = searchQuery.toLowerCase()
      const matchSearch = q === "" || r.nama.toLowerCase().includes(q) || r.nip.includes(q)
      const matchGol = golFilter === "Semua Golongan" || r.golongan === golFilter
      const matchJab = jabFilter === "Semua Jabatan"  || r.jabatan  === jabFilter
      return matchSearch && matchGol && matchJab
    })
  }, [data, searchQuery, golFilter, jabFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage   = Math.min(page, totalPages)
  const paged      = filtered.slice((safePage - 1) * perPage, safePage * perPage)

  const handlePage = (p: number) => { if (p >= 1 && p <= totalPages) setPage(p) }

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
    <>
      <style>{`
        .kgbt-dropdown-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 13px;
          background: white; border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 12px; font-weight: 600; color: #374151;
          cursor: pointer; white-space: nowrap;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .kgbt-dropdown-btn:hover { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.12); }

        .kgbt-dropdown-menu {
          position: absolute; top: calc(100% + 6px); right: 0; z-index: 50;
          background: white; border: 1px solid #e5e7eb;
          border-radius: 12px; padding: 6px;
          box-shadow: 0 8px 32px -4px rgba(0,0,0,0.14);
          min-width: 160px;
        }
        .kgbt-dropdown-item {
          padding: 8px 12px; border-radius: 8px; cursor: pointer;
          font-size: 12px; font-weight: 500; color: #374151;
          transition: background 0.12s;
        }
        .kgbt-dropdown-item:hover  { background: #fff7f0; color: #f97316; }
        .kgbt-dropdown-item.active { background: #fff7f0; color: #f97316; font-weight: 700; }

        .kgbt-row { transition: background 0.12s; }
        .kgbt-row:hover { background: #fffaf7; }

        .kgbt-page-btn {
          width: 34px; height: 34px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; cursor: pointer; border: none;
          transition: background 0.15s, color 0.15s;
        }
        .kgbt-page-btn.active { background: #f97316; color: white; box-shadow: 0 4px 12px -2px rgba(249,115,22,0.45); }
        .kgbt-page-btn:not(.active) { background: white; color: #374151; border: 1px solid #e5e7eb; }
        .kgbt-page-btn:not(.active):hover { background: #fff7f0; color: #f97316; border-color: #fed7aa; }
        .kgbt-page-btn:disabled { opacity: 0.35; cursor: default; }

        .kgbt-checkbox {
          width: 16px; height: 16px; border-radius: 5px;
          accent-color: #f97316; cursor: pointer;
        }
      `}</style>

      <div style={{
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 2px 16px -4px rgba(0,0,0,0.08)",
        overflow: "hidden",
        border: "1px solid #f3f4f6",
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}>

        {/* ── Header Bar ── */}
        <div style={{
          background: "linear-gradient(135deg,#fb923c,#f97316,#ea580c)",
          padding: "14px 22px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px",
        }}>
          {/* Left: checkbox + title + badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              {/* <input
                type="checkbox"
                className="kgbt-checkbox"
                style={{ accentColor: "white" }}
                checked={isAllSelected}
                onChange={onToggleAll}
              /> */}
              <span style={{ fontSize: "15px", fontWeight: 800, color: "white" }}>Data Pegawai</span>
            </label>
            <span style={{
              background: "rgba(255,255,255,0.22)",
              color: "white",
              fontSize: "10px", fontWeight: 800,
              padding: "3px 10px", borderRadius: "999px",
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>
              {selectedIds.length} Terpilih
            </span>
          </div>

          {/* Right: Filters */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>

            {/* Golongan dropdown */}
            <div style={{ position: "relative" }}>
              <button className="kgbt-dropdown-btn" onClick={() => { setGolOpen(!golOpen); setJabOpen(false); setPerOpen(false) }}>
                <ChevronDown size={13} /> {golFilter}
              </button>
              {golOpen && (
                <div className="kgbt-dropdown-menu">
                  {GOLONGAN_OPTIONS.map(g => (
                    <div key={g} className={`kgbt-dropdown-item ${golFilter === g ? "active" : ""}`}
                      onClick={() => { setGolFilter(g); setGolOpen(false); setPage(1) }}>
                      {g}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Jabatan dropdown */}
            <div style={{ position: "relative" }}>
              <button className="kgbt-dropdown-btn" onClick={() => { setJabOpen(!jabOpen); setGolOpen(false); setPerOpen(false) }}>
                <ChevronDown size={13} /> {jabFilter}
              </button>
              {jabOpen && (
                <div className="kgbt-dropdown-menu">
                  {JABATAN_OPTIONS.map(j => (
                    <div key={j} className={`kgbt-dropdown-item ${jabFilter === j ? "active" : ""}`}
                      onClick={() => { setJabFilter(j); setJabOpen(false); setPage(1) }}>
                      {j}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Per page dropdown */}
            <div style={{ position: "relative" }}>
              <button className="kgbt-dropdown-btn" onClick={() => { setPerOpen(!perOpen); setGolOpen(false); setJabOpen(false) }}>
                <ChevronDown size={13} /> Tampilkan {perPage}
              </button>
              {perOpen && (
                <div className="kgbt-dropdown-menu">
                  {TAMPILKAN_OPTIONS.map(n => (
                    <div key={n} className={`kgbt-dropdown-item ${perPage === n ? "active" : ""}`}
                      onClick={() => { setPerPage(n); setPerOpen(false); setPage(1) }}>
                      Tampilkan {n}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
                <th style={{ padding: "14px 16px", width: "40px", textAlign: "center" }}>
                  <input type="checkbox" className="kgbt-checkbox" checked={isAllSelected} onChange={onToggleAll} />
                </th>
                {["No", "NIP & Nama Pegawai", "Golongan", "MKG", "Jabatan", "Gaji Pokok", "Tahun Awal", "Tahun Akhir", "Aksi"].map((h, i) => (
                  <th key={h} style={{
                    padding: "14px 16px",
                    textAlign: i === 0 || i === 2 || i === 3 ? "center" : i === 5 ? "right" : i === 6 || i === 7 ? "center" : "left",
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
                    Tidak ada data pegawai yang ditemukan
                  </td>
                </tr>
              ) : paged.map((item, idx) => {
                const isSelected = selectedIds.includes(item.id)
                const gajiNum = parseInt(String(item.gaji).replace(/\./g, "").replace(/[^0-9]/g, ""))
                return (
                  <tr
                    key={item.id}
                    className="kgbt-row"
                    style={{
                      borderBottom: "1px solid #f9fafb",
                      background: isSelected ? "#fffaf7" : undefined,
                    }}
                  >
                    {/* Checkbox */}
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        className="kgbt-checkbox"
                        checked={isSelected}
                        onChange={() => onToggleId(item.id)}
                      />
                    </td>

                    {/* No */}
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <div style={{
                        width: "30px", height: "30px", borderRadius: "8px",
                        background: isSelected ? "#fff7f0" : "#f9fafb",
                        color: isSelected ? "#ea580c" : "#9ca3af",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 800, fontSize: "13px", margin: "0 auto",
                        border: isSelected ? "1px solid #fed7aa" : "1px solid #f3f4f6",
                      }}>
                        {(safePage - 1) * perPage + idx + 1}
                      </div>
                    </td>

                    {/* NIP & Nama */}
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontWeight: 700, color: "#111827", fontSize: "14px" }}>{item.nama}</div>
                      <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>{item.nip}</div>
                    </td>

                    {/* Golongan */}
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <span style={{
                        background: "#fff7f0", color: "#ea580c",
                        padding: "4px 10px", borderRadius: "8px",
                        fontWeight: 700, fontSize: "12px",
                      }}>
                        {item.golongan}
                      </span>
                    </td>

                    {/* MKG */}
                    <td style={{ padding: "16px", textAlign: "center", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>
                      {item.mkg}
                    </td>

                    {/* Jabatan */}
                    <td style={{ padding: "16px", color: "#374151", fontWeight: 500 }}>
                      {item.jabatan}
                    </td>

                    {/* Gaji Pokok */}
                    <td style={{ padding: "16px", textAlign: "right", fontWeight: 800, color: "#111827", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, marginRight: "2px" }}>Rp</span>
                      {fmt(gajiNum)}
                    </td>

                    {/* Tahun Awal */}
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        background: "#eff6ff", border: "1px solid #bfdbfe",
                        borderRadius: "10px", padding: "5px 10px",
                        fontWeight: 600, color: "#1d4ed8", fontSize: "11px",
                        whiteSpace: "nowrap",
                      }}>
                        <Calendar size={12} strokeWidth={2.5} />
                        {item.tahunAwal}
                      </div>
                    </td>

                    {/* Tahun Akhir */}
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        background: "#f0fdf4", border: "1px solid #bbf7d0",
                        borderRadius: "10px", padding: "5px 10px",
                        fontWeight: 600, color: "#15803d", fontSize: "11px",
                        whiteSpace: "nowrap",
                      }}>
                        <Calendar size={12} strokeWidth={2.5} />
                        {item.tahunAkhir}
                      </div>
                    </td>

                    {/* Aksi */}
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <button style={{
                          padding: "6px", borderRadius: "8px", border: "none",
                          background: "#eff6ff", color: "#3b82f6", cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#dbeafe")}
                          onMouseLeave={e => (e.currentTarget.style.background = "#eff6ff")}
                        >
                          <Pencil size={14} />
                        </button>
                        <button style={{
                          padding: "6px", borderRadius: "8px", border: "none",
                          background: "#fef2f2", color: "#ef4444", cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#fee2e2")}
                          onMouseLeave={e => (e.currentTarget.style.background = "#fef2f2")}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div style={{
          padding: "14px 22px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: "1px solid #f3f4f6", gap: "12px", flexWrap: "wrap",
        }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Menampilkan {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, filtered.length)} dari {filtered.length} Pegawai
          </span>

          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <button className="kgbt-page-btn" disabled={safePage === 1} onClick={() => handlePage(safePage - 1)}>
              <ChevronLeft size={16} />
            </button>

            {pageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`el-${i}`} style={{ fontSize: "13px", color: "#9ca3af", padding: "0 4px" }}>…</span>
              ) : (
                <button key={p} className={`kgbt-page-btn ${safePage === p ? "active" : ""}`} onClick={() => handlePage(p as number)}>
                  {p}
                </button>
              )
            )}

            <button className="kgbt-page-btn" disabled={safePage === totalPages} onClick={() => handlePage(safePage + 1)}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
