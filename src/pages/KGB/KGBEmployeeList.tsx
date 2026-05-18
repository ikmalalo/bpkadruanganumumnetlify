import { useState, useMemo, useEffect } from "react"
import { api } from "../../lib/api"
import {
  Search, Plus, Pencil, Trash2, ChevronDown, ChevronLeft, ChevronRight,
  Users, X, Save, AlertTriangle, UserCheck, Download, Calendar
} from "lucide-react"
import { SALARY_DATA, formatGolKey, formatIDRCurrency } from "../../lib/kgbUtils"
import * as XLSX from "xlsx"

/* ─────────────── Types ─────────────── */
interface Employee {
  id: number
  nip: string
  nama: string
  golongan: string
  mkg: string
  jabatan: string
  tahunAwal: string
  tahunAkhir: string
  gaji: string
  unit: string
}

/* ─────────────── Dummy Data ─────────────── */
const GOLONGAN_LIST = ["II/a","II/b","II/c","II/d","III/a","III/b","III/c","III/d","IV/a","IV/b","IV/c","IV/d","IV/e"]
const UNIT_LIST     = ["Bidang Aset","Sekretariat","Bidang Anggaran","Bidang Perbendaharaan","Bidang Akuntansi"]
const TAMPILKAN_OPTIONS = [5, 10, 20, 50]

const EMPTY_FORM: Omit<Employee, "id"> = {
  nip: "", nama: "", golongan: "III/a", mkg: "", jabatan: "",
  tahunAwal: "", tahunAkhir: "", gaji: "", unit: "Bidang TIK",
}

/* ─────────────── Helpers ─────────────── */
const avatarColor = (name: string) => {
  const colors = [
    ["#fff7f0","#ea580c"],["#eff6ff","#2563eb"],["#f0fdf4","#16a34a"],
    ["#fdf4ff","#9333ea"],["#fefce8","#ca8a04"],["#fff1f2","#e11d48"],
  ]
  return colors[name.charCodeAt(0) % colors.length]
}

/* ─────────────── Custom Components ─────────────── */
const CustomSelect = ({ value, onChange, options, placeholder, isOpen, setOpen }: any) => (
  <div style={{ position: "relative" }}>
    <div className="kgbel-input" onClick={() => setOpen(!isOpen)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", userSelect:"none" }}>
      <span style={{ color: value ? "#111827" : "#9ca3af" }}>{value || placeholder}</span>
      <ChevronDown size={16} style={{ color:"#f97316", transform: isOpen ? "rotate(180deg)" : "none", transition:"transform 0.3s" }}/>
    </div>
    <div className={`kgbel-dd-menu ${isOpen?"active":""}`} style={{ width:"100%", zIndex:300, top:"calc(100% + 4px)" }}>
      {options.map((opt:any) => (
        <div key={opt.value} className={`kgbel-dd-item ${value===opt.value?"active":""}`} onClick={()=>{onChange(opt.value);setOpen(false)}}>
          {opt.label}
        </div>
      ))}
    </div>
  </div>
)

const MiniCalendar = ({ value, onChange, isOpen, setOpen }: any) => {
  const [date, setDate] = useState(value ? new Date(value) : new Date());
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const handleSelect = (d: number) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(d).padStart(2, '0');
    onChange(`${y}-${m}-${day}`);
    setOpen(false);
  }
  const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  
  return (
    <div style={{ position: "relative" }}>
      <div className="kgbel-input" onClick={() => setOpen(!isOpen)} style={{ display:"flex", justifyContent:"space-between", cursor:"pointer", userSelect:"none" }}>
        <span style={{ color: value ? "#111827" : "#9ca3af" }}>{value || "Pilih tanggal"}</span>
        <Calendar size={16} color="#f97316"/>
      </div>
      <div className={`kgbel-dd-menu ${isOpen?"active":""}`} style={{ width:"260px", padding:"12px", zIndex:300, top:"calc(100% + 4px)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
          <button onClick={(e) => { e.preventDefault(); setDate(new Date(date.getFullYear(), date.getMonth()-1, 1)) }} style={{ background:"none", border:"none", cursor:"pointer", color:"#374151" }}><ChevronLeft size={16}/></button>
          <span style={{ fontSize:"13px", fontWeight:700, color:"#111827" }}>{months[date.getMonth()]} {date.getFullYear()}</span>
          <button onClick={(e) => { e.preventDefault(); setDate(new Date(date.getFullYear(), date.getMonth()+1, 1)) }} style={{ background:"none", border:"none", cursor:"pointer", color:"#374151" }}><ChevronRight size={16}/></button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:"4px", textAlign:"center", fontSize:"12px", fontWeight:600, color:"#9ca3af", marginBottom:"4px" }}>
          {["Min","Sen","Sel","Rab","Kam","Jum","Sab"].map(d => <div key={d}>{d}</div>)}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:"4px" }}>
          {Array.from({length: firstDay}).map((_,i) => <div key={`empty-${i}`}/>)}
          {Array.from({length: daysInMonth}).map((_,i) => {
            const d = i+1;
            const isSelected = value === `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            return (
              <button 
                key={d} 
                onClick={(e) => { e.preventDefault(); handleSelect(d) }}
                style={{
                  background: isSelected ? "#f97316" : "transparent",
                  color: isSelected ? "white" : "#374151",
                  border: "none", borderRadius: "6px",
                  padding: "6px 0", cursor: "pointer",
                  fontSize: "13px", fontWeight: 500,
                  transition: "all 0.15s"
                }}
                onMouseEnter={e => { if(!isSelected){ e.currentTarget.style.background = "#fff7f0"; e.currentTarget.style.color = "#f97316" } }}
                onMouseLeave={e => { if(!isSelected){ e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#374151" } }}
              >{d}</button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ─────────────── Component ─────────────── */
export default function KGBEmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState("")
  const [golFilter, setGolFilter] = useState("Semua Golongan")
  const [unitFilter,setUnitFilter]= useState("Semua Unit")
  const [perPage,   setPerPage]   = useState(10)
  const [page,      setPage]      = useState(1)

  /* dropdown open */
  const [golOpen,  setGolOpen]  = useState(false)
  const [unitOpen, setUnitOpen] = useState(false)
  const [perOpen,  setPerOpen]  = useState(false)

  /* modal state */
  const [modalMode, setModalMode] = useState<"add"|"edit"|null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [form,      setForm]      = useState<Omit<Employee,"id">>(EMPTY_FORM)
  const [editId,    setEditId]    = useState<number|null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Employee|null>(null)
  const [toast, setToast]         = useState<{msg: string; type: "success"|"danger"} | null>(null)

  /* custom inputs state */
  const [mGolOpen, setMGolOpen] = useState(false)
  const [mMkgOpen, setMMkgOpen] = useState(false)
  const [mUnitOpen, setMUnitOpen] = useState(false)
  const [mDate1Open, setMDate1Open] = useState(false)
  const [mDate2Open, setMDate2Open] = useState(false)


  /* ── Fetch Data ── */
  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await api.getKGBEmployees()
      setEmployees(data)
    } catch (err: any) {
      showToast("Gagal mengambil data pegawai", "danger")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  /* ── filtered & paged ── */
  const filtered = useMemo(() => employees.filter(e => {
    const q = search.toLowerCase()
    const ms = q === "" || e.nama.toLowerCase().includes(q) || e.nip.includes(q)
    const mg = golFilter  === "Semua Golongan" || e.golongan === golFilter
    const mu = unitFilter === "Semua Unit"     || e.unit     === unitFilter
    return ms && mg && mu
  }), [employees, search, golFilter, unitFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage   = Math.min(page, totalPages)
  const paged      = filtered.slice((safePage - 1) * perPage, safePage * perPage)

  const handlePage = (p: number) => { if (p >= 1 && p <= totalPages) setPage(p) }

  const pageNumbers = (): (number|"...")[] => {
    const pages: (number|"...")[] = []
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i) }
    else {
      pages.push(1)
      if (safePage > 3) pages.push("...")
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i)
      if (safePage < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  /* ── CRUD ── */
  const openAdd = () => {
    setForm(EMPTY_FORM); setEditId(null); setModalMode("add")
  }
  const openEdit = (emp: Employee) => {
    const { id, ...rest } = emp; setForm(rest); setEditId(id); setModalMode("edit")
  }
  const closeModal = () => { 
    setIsClosing(true)
    setTimeout(() => {
      setModalMode(null)
      setForm(EMPTY_FORM)
      setEditId(null)
      setMGolOpen(false)
      setMMkgOpen(false)
      setMUnitOpen(false)
      setMDate1Open(false)
      setMDate2Open(false)
      setIsClosing(false)
    }, 250) // matches the popout animation duration
  }

  const showToast = (msg: string, type: "success"|"danger") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2800)
  }

  const handleSave = async () => {
    if (!form.nip || !form.nama || !form.golongan || !form.jabatan) return
    try {
      if (modalMode === "add") {
        await api.addKGBEmployee(form)
        showToast("Pegawai berhasil ditambahkan!", "success")
      } else if (modalMode === "edit" && editId) {
        await api.updateKGBEmployee({ id: editId, ...form })
        showToast("Data pegawai berhasil diperbarui!", "success")
      }
      fetchData()
      closeModal()
    } catch (err: any) {
      showToast(`Gagal menyimpan: ${err.message}`, "danger")
    }
  }

  const confirmDelete = (emp: Employee) => setDeleteTarget(emp)
  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.deleteKGBEmployee(deleteTarget.id)
      showToast(`${deleteTarget.nama} berhasil dihapus.`, "danger")
      setDeleteTarget(null)
      fetchData()
    } catch (err: any) {
      showToast(`Gagal menghapus: ${err.message}`, "danger")
    }
  }

  const ff = (field: keyof typeof EMPTY_FORM, val: string) => {
    setForm(prev => {
      const next = { ...prev, [field]: val }
      // Otomatis tambah 2 tahun jika yang diisi adalah Tahun Akhir (tahunAwal)
      if (field === "tahunAwal" && val) {
        const d = new Date(val)
        if (!isNaN(d.getTime())) {
          d.setFullYear(d.getFullYear() + 2)
          next.tahunAkhir = d.toISOString().split('T')[0]
        }
      }
      return next
    })
  }

  const handleExportExcel = () => {
    if (employees.length === 0) return
    const exportData = employees.map((e, i) => ({
      "No": i + 1,
      "NIP": e.nip,
      "Nama Pegawai": e.nama,
      "Golongan": e.golongan,
      "MKG": e.mkg,
      "Jabatan": e.jabatan,
      "Unit Kerja": e.unit,
      "Gaji Pokok": e.gaji,
      "Tahun Akhir": e.tahunAwal,
      "Tahun Akan Datang": e.tahunAkhir
    }))
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Data Pegawai")
    XLSX.writeFile(wb, `Data_Pegawai_KGB_${new Date().getTime()}.xlsx`)
  }

  /* ─────────────── Render ─────────────── */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ────── CSS ────── */}
      <style>{`
        @keyframes kgbel-fadein { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes kgbel-popin  { 0%{opacity:0;transform:scale(0.93) translateY(16px)} 65%{transform:scale(1.02) translateY(-2px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes kgbel-popout { 0%{opacity:1;transform:scale(1) translateY(0)} 100%{opacity:0;transform:scale(0.95) translateY(10px)} }
        @keyframes kgbel-fadeout { from{opacity:1} to{opacity:0} }
        @keyframes kgbel-toast  { 0%{opacity:0;transform:translateY(20px)} 10%{opacity:1;transform:translateY(0)} 85%{opacity:1} 100%{opacity:0;transform:translateY(-8px)} }

        .kgbel-fade { animation: kgbel-fadein 0.35s ease-out both; }
        .kgbel-pop  { animation: kgbel-popin  0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        .kgbel-pop.closing { animation: kgbel-popout 0.25s cubic-bezier(0.4, 0, 1, 1) both; }
        .kgbel-overlay { animation: kgbel-fadein 0.35s ease-out both; }
        .kgbel-overlay.closing { animation: kgbel-fadeout 0.25s ease-out both; }
        .kgbel-toast-anim { animation: kgbel-toast 2.8s ease forwards; }

        .kgbel-dd-btn {
          display:flex; align-items:center; gap:6px;
          padding:8px 14px; background:white;
          border:1px solid #e5e7eb; border-radius:10px;
          font-size:13px; font-weight:600; color:#374151;
          cursor:pointer; white-space:nowrap;
          transition:border-color .15s, box-shadow .15s;
        }
        .kgbel-dd-btn:hover { border-color:#f97316; box-shadow:0 0 0 3px rgba(249,115,22,.12); }
        .kgbel-dd-menu {
          position:absolute; top:calc(100% + 6px); left:0; z-index:60;
          background:white; border:1px solid #e5e7eb;
          border-radius:12px; padding:6px;
          box-shadow:0 10px 40px -6px rgba(0,0,0,.15);
          min-width:180px;
          max-height: 250px;
          overflow-y: auto;

          /* Smooth transition setup */
          opacity: 0;
          visibility: hidden;
          transform: translateY(-12px) scale(0.95);
          filter: blur(4px);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: top left;
          pointer-events: none;
        }
        .kgbel-dd-menu.active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
          filter: blur(0);
          pointer-events: auto;
        }
        .kgbel-dd-item { padding:8px 12px; border-radius:8px; cursor:pointer; font-size:13px; font-weight:500; color:#374151; transition:background .12s; }
        .kgbel-dd-item:hover,
        .kgbel-dd-item.active { background:#fff7f0; color:#f97316; font-weight:700; }

        .kgbel-row { transition:background .12s; }
        .kgbel-row:hover { background:#fffaf7; }

        .kgbel-page {
          width:34px;height:34px; border-radius:8px;
          display:flex; align-items:center; justify-content:center;
          font-size:13px; font-weight:700; cursor:pointer; border:none;
          transition:background .15s, color .15s;
        }
        .kgbel-page.on  { background:#f97316; color:white; box-shadow:0 4px 12px -2px rgba(249,115,22,.45); }
        .kgbel-page:not(.on) { background:white; color:#374151; border:1px solid #e5e7eb; }
        .kgbel-page:not(.on):hover { background:#fff7f0; color:#f97316; border-color:#fed7aa; }
        .kgbel-page:disabled { opacity:.35; cursor:default; }

        .kgbel-input {
          width:100%; padding:10px 14px;
          border:1.5px solid #e5e7eb; border-radius:10px;
          font-size:13px; font-weight:500; color:#111827; outline:none;
          transition:all .2s ease;
          font-family:inherit;
          background: white;
        }
        .kgbel-input:focus { 
          border-color:#f97316; 
          box-shadow:0 0 0 4px rgba(249,115,22,.12), 0 4px 12px -2px rgba(249,115,22,0.1); 
          background: #fffaf7;
        }
        .kgbel-select { 
          appearance:none; 
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23f97316' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); 
          background-repeat:no-repeat; background-position:right 14px center; padding-right:40px; 
          cursor: pointer;
        }
        .kgbel-input[type="date"] {
          position: relative;
          cursor: pointer;
        }
        .kgbel-input[type="date"]::-webkit-calendar-picker-indicator {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          width: auto; height: auto;
          color: transparent;
          background: transparent;
          cursor: pointer;
          z-index: 10;
        }
        .kgbel-date-wrapper { position: relative; }
        .kgbel-date-icon {
          position: absolute;
          right: 14px; top: 50%;
          transform: translateY(-50%);
          color: #f97316;
          pointer-events: none;
        }

        .kgbel-save-btn {
          display:flex; align-items:center; gap:8px;
          padding:11px 24px;
          background:linear-gradient(135deg,#fb923c,#f97316,#ea580c);
          border:none; border-radius:12px;
          font-size:14px; font-weight:700; color:white;
          cursor:pointer;
          box-shadow:0 6px 20px -4px rgba(249,115,22,.5);
          transition:all .2s;
        }
        .kgbel-save-btn:hover { transform:translateY(-1px); box-shadow:0 10px 28px -4px rgba(249,115,22,.7); }
        .kgbel-cancel-btn {
          display:flex; align-items:center; gap:8px;
          padding:11px 20px;
          background:white; border:1.5px solid #e5e7eb;
          border-radius:12px; font-size:14px; font-weight:600; color:#374151;
          cursor:pointer; transition:all .2s;
        }
        .kgbel-cancel-btn:hover { border-color:#d1d5db; background:#f9fafb; }
      `}</style>

      {/* ────── Toast ────── */}
      {toast && (
        <div className="kgbel-toast-anim" style={{
          position: "fixed", bottom: "28px", right: "28px", zIndex: 9999,
          background: toast.type === "success" ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${toast.type === "success" ? "#bbf7d0" : "#fecaca"}`,
          color: toast.type === "success" ? "#15803d" : "#dc2626",
          padding: "14px 20px", borderRadius: "14px",
          fontWeight: 700, fontSize: "14px",
          boxShadow: "0 8px 32px -4px rgba(0,0,0,.14)",
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          {toast.type === "success" ? <UserCheck size={18}/> : <AlertTriangle size={18}/>}
          {toast.msg}
        </div>
      )}

      {/* ────── Sub-header ────── */}
      <div className="kgbel-fade" style={{ display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:"16px", marginTop:"-8px" }}>
        <div>
          <h2 style={{ margin:0, fontSize:"18px", fontWeight:800, color:"#111827" }}>Daftar Pegawai</h2>
          <p style={{ margin:"4px 0 0", fontSize:"13px", fontWeight:500, color:"#9ca3af" }}>
            Kelola data pegawai — tambah, edit, dan hapus
          </p>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
          {/* Search */}
          <div style={{ position:"relative" }}>
            <Search style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }} size={15}/>
            <input
              placeholder="Cari NIP atau Nama..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              style={{
                paddingLeft:"36px", paddingRight:"16px",
                paddingTop:"10px", paddingBottom:"10px",
                background:"white", border:"1px solid #e5e7eb",
                borderRadius:"12px", fontSize:"13px", fontWeight:500,
                color:"#374151", outline:"none", width:"220px",
                boxShadow:"0 1px 4px -1px rgba(0,0,0,.06)",
                transition:"border-color .15s, box-shadow .15s",
                fontFamily:"inherit",
              }}
              onFocus={e => { e.currentTarget.style.borderColor="#f97316"; e.currentTarget.style.boxShadow="0 0 0 3px rgba(249,115,22,.12)" }}
              onBlur={e  => { e.currentTarget.style.borderColor="#e5e7eb"; e.currentTarget.style.boxShadow="0 1px 4px -1px rgba(0,0,0,.06)" }}
            />
          </div>

          {/* Export */}
          <button onClick={handleExportExcel} className="kgbel-cancel-btn" style={{ padding: "10px 16px", borderRadius: "12px", gap: "6px" }}>
            <Download size={16}/> Export
          </button>

          {/* Tambah */}
          <button onClick={openAdd} style={{
            display:"flex", alignItems:"center", gap:"8px",
            padding:"10px 20px",
            background:"linear-gradient(135deg,#fb923c,#f97316,#ea580c)",
            border:"none", borderRadius:"12px",
            fontSize:"13px", fontWeight:700, color:"white", cursor:"pointer",
            boxShadow:"0 6px 20px -4px rgba(249,115,22,.5)",
            transition:"all .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 28px -4px rgba(249,115,22,.7)" }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="0 6px 20px -4px rgba(249,115,22,.5)" }}
          >
            <Plus size={16}/> Tambah Pegawai
          </button>
        </div>
      </div>

      {/* ────── Stat Cards ────── */}
      {(() => {
        const total = employees.length
        const groups = [
          { label: "Golongan II",  prefix: "II/",  bg: "#eff6ff", color: "#2563eb", bar: "#3b82f6" },
          { label: "Golongan III", prefix: "III/", bg: "#fdf4ff", color: "#9333ea", bar: "#a855f7" },
          { label: "Golongan IV",  prefix: "IV/",  bg: "#fff7f0", color: "#ea580c", bar: "#f97316" },
        ]
        return (
          <div className="kgbel-fade" style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>

            {/* Total Pegawai — big card */}
            <div style={{
              display:"flex", alignItems:"center", gap:"16px",
              background:"linear-gradient(135deg,#fb923c,#f97316,#ea580c)",
              borderRadius:"18px",
              boxShadow:"0 6px 24px -6px rgba(249,115,22,.45)",
              padding:"20px 28px",
              minWidth:"180px",
            }}>
              <div style={{ width:"48px",height:"48px",borderRadius:"14px",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <Users size={24} color="white"/>
              </div>
              <div>
                <div style={{ fontSize:"11px",fontWeight:700,color:"rgba(255,255,255,0.75)",textTransform:"uppercase",letterSpacing:"0.14em" }}>Total Pegawai</div>
                <div style={{ fontSize:"32px",fontWeight:900,color:"white",lineHeight:1,marginTop:"4px" }}>{total}</div>
              </div>
            </div>

            {/* Per-golongan cards */}
            {groups.map(g => {
              const count = employees.filter(e => e.golongan.startsWith(g.prefix)).length
              const pct   = total > 0 ? Math.round((count / total) * 100) : 0
              return (
                <div key={g.label} style={{
                  background:"white", borderRadius:"18px",
                  border:"1px solid #f3f4f6",
                  boxShadow:"0 2px 10px -4px rgba(0,0,0,.07)",
                  padding:"18px 22px",
                  minWidth:"160px", flex:"1",
                  display:"flex", flexDirection:"column", gap:"10px",
                }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ width:"38px",height:"38px",borderRadius:"11px",background:g.bg,color:g.color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"13px" }}>
                      {g.prefix.replace("/","")}
                    </div>
                    <span style={{ fontSize:"22px",fontWeight:900,color:"#111827" }}>{count}</span>
                  </div>
                  <div>
                    <div style={{ fontSize:"11px",fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.10em",marginBottom:"6px" }}>{g.label}</div>
                    {/* Progress bar */}
                    <div style={{ height:"5px",background:"#f3f4f6",borderRadius:"999px",overflow:"hidden" }}>
                      <div style={{ height:"100%",width:`${pct}%`,background:g.bar,borderRadius:"999px",transition:"width 0.6s ease" }}/>
                    </div>
                    <div style={{ fontSize:"10px",fontWeight:600,color:"#9ca3af",marginTop:"4px" }}>{pct}% dari total</div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })()}

      {/* ────── Table Card ────── */}
      <div className="kgbel-fade" style={{
        background:"white", borderRadius:"20px",
        boxShadow:"0 2px 16px -4px rgba(0,0,0,.08)",
        overflow:"hidden", border:"1px solid #f3f4f6",
      }}>

        {/* Header bar */}
        <div style={{
          background:"linear-gradient(135deg,#fb923c,#f97316,#ea580c)",
          padding:"14px 22px",
          display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"10px",
        }}>
          <span style={{ fontSize:"15px",fontWeight:800,color:"white" }}>Data Pegawai</span>

          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>

            {/* Golongan */}
            <div style={{ position:"relative" }}>
              <button className="kgbel-dd-btn" onClick={() => { setGolOpen(!golOpen); setUnitOpen(false); setPerOpen(false) }}>
                <ChevronDown size={13} style={{ transform: golOpen ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}/>{golFilter}
              </button>
              <div className={`kgbel-dd-menu ${golOpen ? "active" : ""}`}>
                {["Semua Golongan",...GOLONGAN_LIST].map(g => (
                  <div key={g} className={`kgbel-dd-item ${golFilter===g?"active":""}`}
                    onClick={() => { setGolFilter(g); setGolOpen(false); setPage(1) }}>{g}</div>
                ))}
              </div>
            </div>

            {/* Unit */}
            <div style={{ position:"relative" }}>
              <button className="kgbel-dd-btn" onClick={() => { setUnitOpen(!unitOpen); setGolOpen(false); setPerOpen(false) }}>
                <ChevronDown size={13} style={{ transform: unitOpen ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}/>{unitFilter}
              </button>
              <div className={`kgbel-dd-menu ${unitOpen ? "active" : ""}`}>
                {["Semua Unit",...UNIT_LIST].map(u => (
                  <div key={u} className={`kgbel-dd-item ${unitFilter===u?"active":""}`}
                    onClick={() => { setUnitFilter(u); setUnitOpen(false); setPage(1) }}>{u}</div>
                ))}
              </div>
            </div>

            {/* Per page */}
            <div style={{ position:"relative" }}>
              <button className="kgbel-dd-btn" onClick={() => { setPerOpen(!perOpen); setGolOpen(false); setUnitOpen(false) }}>
                <ChevronDown size={13}/>Tampilkan {perPage}
              </button>
              {perOpen && (
                <div className="kgbel-dd-menu">
                  {TAMPILKAN_OPTIONS.map(n => (
                    <div key={n} className={`kgbel-dd-item ${perPage===n?"active":""}`}
                      onClick={() => { setPerPage(n); setPerOpen(false); setPage(1) }}>Tampilkan {n}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
            <thead>
              <tr style={{ borderBottom:"2px solid #f3f4f6" }}>
                {["No","NIP & Nama Pegawai","Golongan","MKG","Unit / Jabatan","Gaji Pokok","Periode","Aksi"].map((h,i) => (
                  <th key={h} style={{
                    padding:"14px 16px",
                    textAlign: i===0||i===2||i===3 ? "center" : i===4 ? "right" : "left",
                    fontSize:"11px", fontWeight:700,
                    color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.08em",
                    whiteSpace:"nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={8} style={{ padding:"56px", textAlign:"center", color:"#9ca3af", fontSize:"14px", fontWeight:500 }}>
                  Tidak ada data pegawai yang ditemukan
                </td></tr>
              ) : paged.map((emp, idx) => {
                const gajiNum = parseInt(emp.gaji.replace(/\./g, "").replace(/[^0-9]/g,""))
                return (
                  <tr key={emp.id} className="kgbel-row" style={{ borderBottom:"1px solid #f9fafb" }}>

                    {/* No */}
                    <td style={{ padding:"16px", textAlign:"center" }}>
                      <div style={{ width:"30px",height:"30px",borderRadius:"8px",background:"#f9fafb",color:"#9ca3af",border:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"13px",margin:"0 auto" }}>
                        {(safePage-1)*perPage+idx+1}
                      </div>
                    </td>

                    {/* NIP & Nama */}
                    <td style={{ padding:"16px" }}>
                      <div>
                        <div style={{ fontWeight:700, color:"#111827", fontSize:"14px" }}>{emp.nama}</div>
                        <div style={{ fontSize:"11px", color:"#9ca3af", marginTop:"2px" }}>{emp.nip}</div>
                      </div>
                    </td>

                    {/* Golongan */}
                    <td style={{ padding:"16px", textAlign:"center" }}>
                      <span style={{ background:"#fff7f0",color:"#ea580c",padding:"4px 10px",borderRadius:"8px",fontWeight:700,fontSize:"12px" }}>
                        {emp.golongan}
                      </span>
                    </td>

                    {/* MKG */}
                    <td style={{ padding:"16px", textAlign:"center", fontWeight:600, color:"#374151", whiteSpace:"nowrap" }}>
                      {emp.mkg}
                    </td>

                    {/* Unit / Jabatan */}
                    <td style={{ padding:"16px", textAlign:"right" }}>
                      <div style={{ fontWeight:700, color:"#111827", fontSize:"13px" }}>{emp.jabatan}</div>
                      <div style={{ fontSize:"11px",color:"#9ca3af",marginTop:"2px" }}>{emp.unit}</div>
                    </td>

                    {/* Gaji */}
                    <td style={{ padding:"16px", fontWeight:800, color:"#111827", whiteSpace:"nowrap" }}>
                      <span style={{ fontSize:"11px",color:"#9ca3af",fontWeight:600,marginRight:"2px" }}>Rp</span>
                      {new Intl.NumberFormat("id-ID").format(gajiNum)}
                    </td>

                    {/* Periode */}
                    <td style={{ padding:"16px" }}>
                      <div style={{ fontSize:"11px",fontWeight:600,color:"#374151",whiteSpace:"nowrap",lineHeight:1.6 }}>
                        <span style={{ color:"#9ca3af" }}>
                          {emp.tahunAwal ? new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(emp.tahunAwal)) : '-'}
                        </span>
                        <span style={{ display:"block" }}>
                          → {emp.tahunAkhir ? new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(emp.tahunAkhir)) : '-'}
                        </span>
                      </div>
                    </td>

                    {/* Aksi */}
                    <td style={{ padding:"16px" }}>
                      <div style={{ display:"flex", gap:"6px" }}>
                        <button onClick={() => openEdit(emp)} style={{ padding:"7px",borderRadius:"9px",border:"none",background:"#eff6ff",color:"#2563eb",cursor:"pointer",transition:"background .15s" }}
                          onMouseEnter={e=>e.currentTarget.style.background="#dbeafe"}
                          onMouseLeave={e=>e.currentTarget.style.background="#eff6ff"}
                          title="Edit">
                          <Pencil size={15}/>
                        </button>
                        <button onClick={() => confirmDelete(emp)} style={{ padding:"7px",borderRadius:"9px",border:"none",background:"#fef2f2",color:"#dc2626",cursor:"pointer",transition:"background .15s" }}
                          onMouseEnter={e=>e.currentTarget.style.background="#fee2e2"}
                          onMouseLeave={e=>e.currentTarget.style.background="#fef2f2"}
                          title="Hapus">
                          <Trash2 size={15}/>
                        </button>
                      </div>
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding:"14px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid #f3f4f6", flexWrap:"wrap", gap:"10px" }}>
          <span style={{ fontSize:"11px",fontWeight:600,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em" }}>
            Menampilkan {filtered.length===0?0:(safePage-1)*perPage+1}–{Math.min(safePage*perPage,filtered.length)} dari {filtered.length} Pegawai
          </span>
          <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
            <button className="kgbel-page" disabled={safePage===1} onClick={()=>handlePage(safePage-1)}><ChevronLeft size={16}/></button>
            {pageNumbers().map((p,i) =>
              p==="..." ? <span key={`el${i}`} style={{ fontSize:"13px",color:"#9ca3af",padding:"0 4px" }}>…</span>
              : <button key={p} className={`kgbel-page ${safePage===p?"on":""}`} onClick={()=>handlePage(p as number)}>{p}</button>
            )}
            <button className="kgbel-page" disabled={safePage===totalPages} onClick={()=>handlePage(safePage+1)}><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          ADD / EDIT MODAL
      ══════════════════════════════════════════ */}
      {(modalMode || isClosing) && (
        <div style={{ position:"fixed",inset:0,zIndex:200,display:"flex",padding:"40px 24px",fontFamily:"inherit", overflowY:"auto" }}>
          <div className={`kgbel-overlay ${isClosing ? "closing" : ""}`} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(4px)" }} onClick={closeModal}/>
          <div className={`kgbel-pop ${isClosing ? "closing" : ""}`} style={{
            position:"relative", background:"white",
            borderRadius:"24px", width:"100%", maxWidth:"560px",
            boxShadow:"0 24px 80px -12px rgba(0,0,0,.28)",
            margin: "auto"
          }}>
            {/* Modal header */}
            <div style={{ background:"linear-gradient(135deg,#fb923c,#f97316,#ea580c)", padding:"22px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", borderTopLeftRadius:"24px", borderTopRightRadius:"24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <div style={{ width:"40px",height:"40px",borderRadius:"12px",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  {modalMode==="add" ? <Plus size={20} color="white"/> : <Pencil size={20} color="white"/>}
                </div>
                <div>
                  <div style={{ fontSize:"17px",fontWeight:800,color:"white" }}>
                    {modalMode==="add" ? "Tambah Pegawai Baru" : "Edit Data Pegawai"}
                  </div>
                  <div style={{ fontSize:"12px",color:"rgba(255,255,255,0.75)",marginTop:"2px" }}>
                    {modalMode==="add" ? "Isi form di bawah untuk menambah pegawai" : "Perbarui informasi pegawai"}
                  </div>
                </div>
              </div>
              <button onClick={closeModal} style={{ background:"rgba(255,255,255,0.2)",border:"none",borderRadius:"10px",width:"34px",height:"34px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"white" }}>
                <X size={18}/>
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding:"28px", display:"flex", flexDirection:"column", gap:"18px" }}>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={{ fontSize:"12px",fontWeight:700,color:"#374151",display:"block",marginBottom:"6px" }}>NIP <span style={{color:"#ef4444"}}>*</span></label>
                  <input className="kgbel-input" value={form.nip} onChange={e=>ff("nip",e.target.value)} placeholder="cth. 19850112 2010121 001"/>
                </div>

                <div style={{ gridColumn:"1/-1" }}>
                  <label style={{ fontSize:"12px",fontWeight:700,color:"#374151",display:"block",marginBottom:"6px" }}>Nama Lengkap <span style={{color:"#ef4444"}}>*</span></label>
                  <input className="kgbel-input" value={form.nama} onChange={e=>ff("nama",e.target.value)} placeholder="Nama lengkap pegawai"/>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>Golongan <span style={{ color: "#ef4444" }}>*</span></label>
                  <CustomSelect 
                    value={form.golongan} 
                    onChange={(val: string) => { setForm(prev => ({ ...prev, golongan: val, gaji: "", mkg: "" })); }}
                    options={GOLONGAN_LIST.map(g => ({ label: g, value: g }))}
                    isOpen={mGolOpen} setOpen={(v:boolean)=>{setMGolOpen(v);setMMkgOpen(false);setMUnitOpen(false);setMDate1Open(false);setMDate2Open(false)}}
                    placeholder="Pilih Golongan"
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>MKG</label>
                  <CustomSelect 
                    value={form.mkg} 
                    onChange={(val: string) => {
                      const golKey = formatGolKey(form.golongan);
                      const tableData = SALARY_DATA[golKey] || {};
                      const numericMKG = parseInt(val);
                      const salaryVal = tableData[numericMKG];
                      setForm(prev => ({ ...prev, mkg: val, gaji: salaryVal ? formatIDRCurrency(salaryVal) : "" }));
                    }}
                    options={
                      Object.keys(SALARY_DATA[formatGolKey(form.golongan)] || {})
                        .map(Number).sort((a,b)=>a-b)
                        .map(m => ({ label: `${String(m).padStart(2,'0')} Thn`, value: `${String(m).padStart(2,'0')} Thn` }))
                    }
                    isOpen={mMkgOpen} setOpen={(v:boolean)=>{setMMkgOpen(v);setMGolOpen(false);setMUnitOpen(false);setMDate1Open(false);setMDate2Open(false)}}
                    placeholder="Pilih MKG..."
                  />
                </div>

                <div>
                  <label style={{ fontSize:"12px",fontWeight:700,color:"#374151",display:"block",marginBottom:"6px" }}>Jabatan <span style={{color:"#ef4444"}}>*</span></label>
                  <input className="kgbel-input" value={form.jabatan} onChange={e=>ff("jabatan",e.target.value)} placeholder="Jabatan pegawai"/>
                </div>

                <div>
                  <label style={{ fontSize:"12px",fontWeight:700,color:"#374151",display:"block",marginBottom:"6px" }}>Unit Kerja</label>
                  <CustomSelect 
                    value={form.unit} 
                    onChange={(val: string) => ff("unit", val)}
                    options={UNIT_LIST.map(u => ({ label: u, value: u }))}
                    isOpen={mUnitOpen} setOpen={(v:boolean)=>{setMUnitOpen(v);setMGolOpen(false);setMMkgOpen(false);setMDate1Open(false);setMDate2Open(false)}}
                    placeholder="Pilih Unit Kerja"
                  />
                </div>

                <div>
                  <label style={{ fontSize:"12px",fontWeight:700,color:"#374151",display:"block",marginBottom:"6px" }}>Tahun Akhir</label>
                  <MiniCalendar 
                    value={form.tahunAwal} onChange={(val: string) => ff("tahunAwal", val)}
                    isOpen={mDate1Open} setOpen={(v:boolean)=>{setMDate1Open(v);setMGolOpen(false);setMMkgOpen(false);setMUnitOpen(false);setMDate2Open(false)}}
                  />
                </div>

                <div>
                  <label style={{ fontSize:"12px",fontWeight:700,color:"#374151",display:"block",marginBottom:"6px" }}>Tahun Akan Datang</label>
                  <MiniCalendar 
                    value={form.tahunAkhir} onChange={(val: string) => ff("tahunAkhir", val)}
                    isOpen={mDate2Open} setOpen={(v:boolean)=>{setMDate2Open(v);setMGolOpen(false);setMMkgOpen(false);setMUnitOpen(false);setMDate1Open(false)}}
                  />
                </div>

                <div style={{ gridColumn: "1/-1" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>Gaji Pokok</label>
                  <input 
                    className="kgbel-input" 
                    style={{ background: "#f9fafb", cursor: "not-allowed" }}
                    value={form.gaji ? `Rp ${form.gaji}` : ""} 
                    readOnly
                    placeholder="Pilih MKG untuk melihat gaji"
                  />
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div style={{ padding:"16px 28px 24px", display:"flex", justifyContent:"flex-end", gap:"10px", borderTop:"1px solid #f3f4f6" }}>
              <button className="kgbel-cancel-btn" onClick={closeModal}><X size={15}/>Batal</button>
              <button className="kgbel-save-btn" onClick={handleSave}><Save size={15}/>
                {modalMode==="add" ? "Simpan Pegawai" : "Perbarui Data"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          DELETE CONFIRM MODAL
      ══════════════════════════════════════════ */}
      {deleteTarget && (
        <div style={{ position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"inherit" }}>
          <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(4px)" }} onClick={()=>setDeleteTarget(null)}/>
          <div className="kgbel-pop" style={{
            position:"relative", background:"white",
            borderRadius:"24px", width:"100%", maxWidth:"400px",
            boxShadow:"0 24px 80px -12px rgba(0,0,0,.28)",
            padding:"36px 32px",
            display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center",
          }}>
            <div style={{ width:"64px",height:"64px",borderRadius:"50%",background:"#fef2f2",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"20px" }}>
              <AlertTriangle size={30} color="#dc2626"/>
            </div>
            <h3 style={{ margin:"0 0 10px",fontSize:"18px",fontWeight:800,color:"#111827" }}>Hapus Pegawai?</h3>
            <p style={{ margin:"0 0 28px",fontSize:"14px",color:"#9ca3af",lineHeight:1.6 }}>
              Anda akan menghapus data <strong style={{color:"#374151"}}>{deleteTarget.nama}</strong>.<br/>
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div style={{ display:"flex", gap:"10px", width:"100%" }}>
              <button className="kgbel-cancel-btn" style={{ flex:1, justifyContent:"center" }} onClick={()=>setDeleteTarget(null)}>
                Batal
              </button>
              <button onClick={handleDelete} style={{
                flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
                padding:"11px 20px", background:"linear-gradient(135deg,#f87171,#ef4444,#dc2626)",
                border:"none", borderRadius:"12px", fontSize:"14px", fontWeight:700, color:"white",
                cursor:"pointer", boxShadow:"0 6px 20px -4px rgba(220,38,38,.45)", transition:"all .2s",
              }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 10px 28px -4px rgba(220,38,38,.65)" }}
                onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="0 6px 20px -4px rgba(220,38,38,.45)" }}
              >
                <Trash2 size={15}/> Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
