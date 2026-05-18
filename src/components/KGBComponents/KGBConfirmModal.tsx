import { Info, ClipboardList } from "lucide-react"
import { calculateKGB, formatIDRCurrency, parseGaji, parseMKG, formatGolKey } from "../../lib/kgbUtils"

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
}

interface Props {
  selectedEmployees: Employee[]
  onClose: () => void
  onConfirm: () => void
}

export default function KGBConfirmModal({ selectedEmployees, onClose, onConfirm }: Props) {

  const calculateDetails = (emp: Employee) => {
    return calculateKGB(emp)
  }

  const addYearsToDate = (dateStr: string, years: number) => {
    if (!dateStr || !dateStr.includes('/')) return dateStr
    const parts = dateStr.split('/')
    if (parts.length !== 3) return dateStr
    const year = parseInt(parts[2])
    return `${parts[0]}/${parts[1]}/${year + years}`
  }

  const getYearOnly = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('/')) return dateStr
    const parts = dateStr.split('/')
    return parts[2]
  }

  const totalIncrease = selectedEmployees.reduce((acc, emp) => acc + calculateDetails(emp).increase, 0)
  const totalBudget = selectedEmployees.reduce((acc, emp) => acc + calculateDetails(emp).newGaji, 0)

  return (
    <div
      id="kgb-modal-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      {/* Animation Styles */}
      <style>{`
        @keyframes kgbPopIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes kgbFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .kgb-animate-pop {
          animation: kgbPopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .kgb-animate-fade {
          animation: kgbFadeIn 0.3s ease-out forwards;
        }
      `}</style>

      {/* Backdrop */}
      <div
        id="kgb-modal-backdrop"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm kgb-animate-fade"
        onClick={onClose}
      />

      {/* Modal Container — matches the photo: white, soft rounded, subtle shadow, no border */}
      <div
        id="kgb-modal-container"
        className="relative bg-white w-full flex flex-col overflow-hidden kgb-animate-pop"
        style={{
          maxWidth: '900px',
          maxHeight: '90vh',
          borderRadius: '24px',
          boxShadow: '0 20px 60px -10px rgba(0,0,0,0.25)',
        }}
      >

        {/* ── HEADER ── */}
        <div id="kgb-modal-header" style={{ padding: '32px 36px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Icon box — orange square rounded */}
          <div style={{
            width: '52px', height: '52px',
            background: '#fff2eb',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#f97316', flexShrink: 0,
          }}>
            <ClipboardList size={26} strokeWidth={2} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
              Konfirmasi Kenaikan Gaji Masal (Detail)
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 500, color: '#9ca3af' }}>
              Tinjau kembali rincian golongan dan jabatan
            </p>
          </div>
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <div
          id="kgb-modal-content"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 36px 32px', overflow: 'hidden' }}
        >

          {/* ── INFO ALERT ── */}
          <div
            id="kgb-modal-info-alert"
            style={{
              background: '#fff7f0',
              border: '1px solid #fed7aa',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
            }}
          >
            {/* Orange circle icon */}
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#f97316',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: '1px',
            }}>
              <Info size={18} strokeWidth={2.5} color="white" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#c2410c' }}>
                Informasi Pembaruan Golongan &amp; MKG
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 500, color: '#ea580c', opacity: 0.85, lineHeight: 1.5 }}>
                Sistem akan memperbarui MKG +2 tahun dan menyesuaikan gaji pokok sesuai tabel peraturan gaji PNS terbaru.
              </p>
            </div>
          </div>

          {/* ── TABLE ── */}
          <div id="kgb-modal-table-area" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>

            {/* Table Header */}
            <div
              id="kgb-modal-table-header"
              style={{
                display: 'grid',
                gridTemplateColumns: '52px 1fr 100px 160px 180px',
                padding: '0 16px 12px',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              {['No', 'Nama Pegawai & Identitas', 'Golongan', 'MKG & Periode', 'Perbandingan Gaji'].map((label, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    textAlign: i === 0 ? 'center' : i === 4 ? 'right' : i === 3 ? 'center' : 'left',
                    paddingLeft: i === 1 ? '12px' : 0,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Employee Rows */}
            <div id="kgb-modal-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '12px', overflowY: 'auto', flex: 1 }}>
              {selectedEmployees.map((emp, idx) => {
                const { oldGaji, newGaji, increase, currentMKG, newMKG } = calculateDetails(emp)
                return (
                  <div
                    id={`kgb-modal-employee-item-${emp.id}`}
                    key={emp.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '52px 1fr 100px 160px 180px',
                      alignItems: 'center',
                      background: '#f9fafb',
                      border: '1px solid #f3f4f6',
                      borderRadius: '14px',
                      padding: '18px 16px',
                    }}
                  >
                    {/* No */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '50%',
                        background: '#ffedd5', color: '#ea580c',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '14px',
                      }}>
                        {idx + 1}
                      </div>
                    </div>

                    {/* Identity */}
                    <div style={{ paddingLeft: '12px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
                        {emp.nama}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', marginTop: '2px' }}>
                        {emp.nip}
                      </div>
                    </div>

                    {/* Golongan */}
                    <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: 700, color: '#374151' }}>
                      {emp.golongan}
                    </div>

                    {/* MKG & Periode */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        background: '#fb923c', color: 'white',
                        fontSize: '10px', fontWeight: 700,
                        padding: '3px 10px', borderRadius: '6px',
                        letterSpacing: '0.03em',
                      }}>
                        MKG: {currentMKG} ➔ {newMKG} Thn
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 500, color: '#9ca3af' }}>
                          Periode: {getYearOnly(emp.tahunAwal)}-{getYearOnly(emp.tahunAkhir)}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#374151' }}>
                          Periode: {getYearOnly(addYearsToDate(emp.tahunAwal, 2))}-{getYearOnly(addYearsToDate(emp.tahunAkhir, 2))}
                        </span>
                      </div>
                    </div>

                    {/* Salary Comparison */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                      <div style={{
                        fontSize: '11px', fontWeight: 500, color: '#9ca3af',
                        textDecoration: 'line-through',
                      }}>
                        Gaji lama: Rp {formatIDRCurrency(oldGaji)}
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#16a34a', lineHeight: 1.2 }}>
                        Rp. {formatIDRCurrency(newGaji)}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#22c55e', marginTop: '2px' }}>
                        + Rp {formatIDRCurrency(increase)} (KGB)
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>
          </div>

          {/* ── STATS BAR ── */}
          <div
            id="kgb-modal-stats-bar"
            style={{
              background: '#1e2d3d',
              borderRadius: '16px',
              padding: '18px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Left */}
            <div id="kgb-modal-total-budget">
              <div style={{
                fontSize: '10px', fontWeight: 700, color: '#6b7280',
                textTransform: 'uppercase', letterSpacing: '0.2em',
                marginBottom: '8px',
              }}>
                TOTAL ESTIMASI ANGGARAN
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>
                  RP. {formatIDRCurrency(totalBudget)}
                </span>
                <span style={{
                  background: 'rgba(34,197,94,0.15)',
                  color: '#4ade80',
                  fontSize: '11px', fontWeight: 700,
                  padding: '4px 12px', borderRadius: '999px',
                  border: '1px solid rgba(34,197,94,0.25)',
                }}>
                  + Rp {formatIDRCurrency(totalIncrease)}
                </span>
              </div>
            </div>

            {/* Right */}
            <div id="kgb-modal-selected-count" style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '11px', fontWeight: 600, color: '#6b7280',
                marginBottom: '4px', letterSpacing: '0.05em',
              }}>
                Jumlah Pegawai Terpilih
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '36px', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                  {selectedEmployees.length}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280' }}>
                  Orang Pegawai
                </span>
              </div>
            </div>
          </div>

          {/* ── ACTION ROW ── */}
          <div id="kgb-modal-action-row" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              id="kgb-modal-confirm-button"
              onClick={onConfirm}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '14px 32px',
                background: '#f97316',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 8px 30px -4px rgba(249,115,22,0.55)',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px -4px rgba(249,115,22,0.7)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 30px -4px rgba(249,115,22,0.55)'
              }}
            >
              <span>PROSES GAJI</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
