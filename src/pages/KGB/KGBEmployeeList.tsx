import { useState, useMemo } from "react"
import {
  Search, Plus, Pencil, Trash2, ChevronDown, ChevronLeft, ChevronRight,
  Users, X, Save, AlertTriangle, UserCheck
} from "lucide-react"

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
const initialData: Employee[] = [
  { id: 1,  nip: "19850112 2010121 001", nama: "Ahmad Hidayat",    golongan: "IV/c", mkg: "12 Thn", jabatan: "Kepala Bidang TIK",  tahunAwal: "08/01/2022", tahunAkhir: "08/01/2024", gaji: "4.850.000", unit: "Bidang TIK" },
  { id: 2,  nip: "19850113 2010121 002", nama: "Siti Aminah",      golongan: "IV/b", mkg: "10 Thn", jabatan: "Sekretaris",         tahunAwal: "15/03/2021", tahunAkhir: "15/03/2023", gaji: "4.250.000", unit: "Sekretariat" },
  { id: 3,  nip: "19850114 2010121 003", nama: "Budi Santoso",     golongan: "III/d", mkg: "8 Thn", jabatan: "Staf Ahli",          tahunAwal: "10/06/2023", tahunAkhir: "10/06/2025", gaji: "3.850.000", unit: "Bidang Anggaran" },
  { id: 4,  nip: "19850115 2010121 004", nama: "Diana Putri",      golongan: "III/c", mkg: "6 Thn", jabatan: "Analisis Data",      tahunAwal: "22/11/2022", tahunAkhir: "22/11/2024", gaji: "3.450.000", unit: "Bidang TIK" },
  { id: 5,  nip: "19850116 2010121 005", nama: "Eko Prasetyo",     golongan: "IV/a", mkg: "14 Thn", jabatan: "Kepala Sub Bagian",  tahunAwal: "05/09/2020", tahunAkhir: "05/09/2022", gaji: "5.150.000", unit: "Sekretariat" },
  { id: 6,  nip: "19850117 2010121 006", nama: "Fajar Nugroho",    golongan: "III/b", mkg: "5 Thn", jabatan: "Programmer",         tahunAwal: "01/04/2022", tahunAkhir: "01/04/2024", gaji: "3.200.000", unit: "Bidang TIK" },
  { id: 7,  nip: "19850118 2010121 007", nama: "Galih Wicaksono",  golongan: "II/d",  mkg: "4 Thn", jabatan: "Operator",           tahunAwal: "17/07/2023", tahunAkhir: "17/07/2025", gaji: "2.900.000", unit: "Umum" },
  { id: 8,  nip: "19850119 2010121 008", nama: "Hesti Rahayu",     golongan: "III/a", mkg: "3 Thn", jabatan: "Admin",              tahunAwal: "11/02/2021", tahunAkhir: "11/02/2023", gaji: "3.050.000", unit: "Sekretariat" },
  { id: 9,  nip: "19850120 2010121 009", nama: "Irwan Santoso",    golongan: "III/c", mkg: "7 Thn", jabatan: "Analisis Keuangan",  tahunAwal: "03/05/2022", tahunAkhir: "03/05/2024", gaji: "3.600.000", unit: "Bidang Anggaran" },
  { id: 10, nip: "19850121 2010121 010", nama: "Joko Widodo",      golongan: "IV/b", mkg: "11 Thn", jabatan: "Kepala Bidang",      tahunAwal: "20/08/2020", tahunAkhir: "20/08/2022", gaji: "4.500.000", unit: "Bidang Anggaran" },
  { id: 11, nip: "19850122 2010121 011", nama: "Kartini Dewi",     golongan: "III/d", mkg: "9 Thn", jabatan: "Perencana",          tahunAwal: "14/01/2023", tahunAkhir: "14/01/2025", gaji: "3.750.000", unit: "Bidang Anggaran" },
  { id: 12, nip: "19850123 2010121 012", nama: "Lukman Hakim",     golongan: "II/c",  mkg: "2 Thn", jabatan: "Staf",               tahunAwal: "25/09/2023", tahunAkhir: "25/09/2025", gaji: "2.750.000", unit: "Umum" },
]

const GOLONGAN_LIST = ["I/a","I/b","I/c","I/d","II/a","II/b","II/c","II/d","III/a","III/b","III/c","III/d","IV/a","IV/b","IV/c","IV/d","IV/e"]
const UNIT_LIST     = ["Bidang TIK","Bidang Anggaran","Sekretariat","Umum"]
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

/* ─────────────── Component ─────────────── */
export default function KGBEmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>(initialData)
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
  const [form,      setForm]      = useState<Omit<Employee,"id">>(EMPTY_FORM)
  const [editId,    setEditId]    = useState<number|null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Employee|null>(null)
  const [toast, setToast]         = useState<{msg: string; type: "success"|"danger"} | null>(null)

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
  const closeModal = () => { setModalMode(null); setForm(EMPTY_FORM); setEditId(null) }

  const showToast = (msg: string, type: "success"|"danger") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2800)
  }

  const handleSave = () => {
    if (!form.nip || !form.nama || !form.golongan || !form.jabatan) return
    if (modalMode === "add") {
      const newId = Math.max(0, ...employees.map(e => e.id)) + 1
      setEmployees(prev => [...prev, { id: newId, ...form }])
      showToast("Pegawai berhasil ditambahkan!", "success")
    } else if (modalMode === "edit" && editId) {
      setEmployees(prev => prev.map(e => e.id === editId ? { id: editId, ...form } : e))
      showToast("Data pegawai berhasil diperbarui!", "success")
    }
    closeModal()
  }

  const confirmDelete = (emp: Employee) => setDeleteTarget(emp)
  const handleDelete = () => {
    if (!deleteTarget) return
    setEmployees(prev => prev.filter(e => e.id !== deleteTarget.id))
    showToast(`${deleteTarget.nama} berhasil dihapus.`, "danger")
    setDeleteTarget(null)
  }

  const ff = (field: keyof typeof EMPTY_FORM, val: string) =>
    setForm(prev => ({ ...prev, [field]: val }))

  /* ─────────────── Render ─────────────── */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ────── CSS ────── */}
      <style>{`
        @keyframes kgbel-fadein { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes kgbel-popin  { 0%{opacity:0;transform:scale(0.93) translateY(16px)} 65%{transform:scale(1.02) translateY(-2px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes kgbel-toast  { 0%{opacity:0;transform:translateY(20px)} 10%{opacity:1;transform:translateY(0)} 85%{opacity:1} 100%{opacity:0;transform:translateY(-8px)} }

        .kgbel-fade { animation: kgbel-fadein 0.35s ease-out both; }
        .kgbel-pop  { animation: kgbel-popin  0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
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
          box-shadow:0 8px 32px -4px rgba(0,0,0,.14);
          min-width:180px;
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
          transition:border-color .15s, box-shadow .15s;
          font-family:inherit;
        }
        .kgbel-input:focus { border-color:#f97316; box-shadow:0 0 0 3px rgba(249,115,22,.12); }
        .kgbel-select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:36px; }

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
          { label: "Golongan I",   prefix: "I/",   bg: "#f0fdf4", color: "#16a34a", bar: "#22c55e" },
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
                <ChevronDown size={13}/>{golFilter}
              </button>
              {golOpen && (
                <div className="kgbel-dd-menu" style={{ maxHeight:"220px",overflowY:"auto" }}>
                  {["Semua Golongan",...GOLONGAN_LIST].map(g => (
                    <div key={g} className={`kgbel-dd-item ${golFilter===g?"active":""}`}
                      onClick={() => { setGolFilter(g); setGolOpen(false); setPage(1) }}>{g}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Unit */}
            <div style={{ position:"relative" }}>
              <button className="kgbel-dd-btn" onClick={() => { setUnitOpen(!unitOpen); setGolOpen(false); setPerOpen(false) }}>
                <ChevronDown size={13}/>{unitFilter}
              </button>
              {unitOpen && (
                <div className="kgbel-dd-menu">
                  {["Semua Unit",...UNIT_LIST].map(u => (
                    <div key={u} className={`kgbel-dd-item ${unitFilter===u?"active":""}`}
                      onClick={() => { setUnitFilter(u); setUnitOpen(false); setPage(1) }}>{u}</div>
                  ))}
                </div>
              )}
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
                        <span style={{ color:"#9ca3af" }}>{emp.tahunAwal}</span>
                        <span style={{ display:"block" }}>→ {emp.tahunAkhir}</span>
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
      {modalMode && (
        <div style={{ position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"inherit" }}>
          <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(4px)" }} onClick={closeModal}/>
          <div className="kgbel-pop" style={{
            position:"relative", background:"white",
            borderRadius:"24px", width:"100%", maxWidth:"560px",
            boxShadow:"0 24px 80px -12px rgba(0,0,0,.28)",
            overflow:"hidden",
          }}>
            {/* Modal header */}
            <div style={{ background:"linear-gradient(135deg,#fb923c,#f97316,#ea580c)", padding:"22px 28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
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
            <div style={{ padding:"28px", display:"flex", flexDirection:"column", gap:"18px", maxHeight:"65vh", overflowY:"auto" }}>

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
                  <label style={{ fontSize:"12px",fontWeight:700,color:"#374151",display:"block",marginBottom:"6px" }}>Golongan <span style={{color:"#ef4444"}}>*</span></label>
                  <select className="kgbel-input kgbel-select" value={form.golongan} onChange={e=>ff("golongan",e.target.value)}>
                    {GOLONGAN_LIST.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize:"12px",fontWeight:700,color:"#374151",display:"block",marginBottom:"6px" }}>MKG</label>
                  <input className="kgbel-input" value={form.mkg} onChange={e=>ff("mkg",e.target.value)} placeholder="cth. 12 Thn"/>
                </div>

                <div>
                  <label style={{ fontSize:"12px",fontWeight:700,color:"#374151",display:"block",marginBottom:"6px" }}>Jabatan <span style={{color:"#ef4444"}}>*</span></label>
                  <input className="kgbel-input" value={form.jabatan} onChange={e=>ff("jabatan",e.target.value)} placeholder="Jabatan pegawai"/>
                </div>

                <div>
                  <label style={{ fontSize:"12px",fontWeight:700,color:"#374151",display:"block",marginBottom:"6px" }}>Unit Kerja</label>
                  <select className="kgbel-input kgbel-select" value={form.unit} onChange={e=>ff("unit",e.target.value)}>
                    {UNIT_LIST.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize:"12px",fontWeight:700,color:"#374151",display:"block",marginBottom:"6px" }}>Tahun Awal</label>
                  <input className="kgbel-input" value={form.tahunAwal} onChange={e=>ff("tahunAwal",e.target.value)} placeholder="cth. 08/01/2022"/>
                </div>

                <div>
                  <label style={{ fontSize:"12px",fontWeight:700,color:"#374151",display:"block",marginBottom:"6px" }}>Tahun Akhir</label>
                  <input className="kgbel-input" value={form.tahunAkhir} onChange={e=>ff("tahunAkhir",e.target.value)} placeholder="cth. 08/01/2024"/>
                </div>

                <div style={{ gridColumn:"1/-1" }}>
                  <label style={{ fontSize:"12px",fontWeight:700,color:"#374151",display:"block",marginBottom:"6px" }}>Gaji Pokok</label>
                  <input className="kgbel-input" value={form.gaji} onChange={e=>ff("gaji",e.target.value)} placeholder="cth. 4.850.000"/>
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
