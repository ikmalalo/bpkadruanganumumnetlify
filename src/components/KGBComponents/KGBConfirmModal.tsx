import { Info, ClipboardList } from "lucide-react"

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

const SALARY_DATA: Record<string, Record<number, number>> = {
  "iiia": { 0: 2785700, 2: 2873500, 4: 2964000, 6: 3057300, 8: 3153600, 10: 3252900, 12: 3355400, 14: 3461100, 16: 3570100, 18: 3682500, 20: 3798500, 22: 3918100, 24: 4041500, 26: 4168800, 28: 4300100, 30: 4435500, 32: 4575200 },
  "iiib": { 0: 2903600, 2: 2995000, 4: 3089300, 6: 3186600, 8: 3287000, 10: 3390500, 12: 3497300, 14: 3607500, 16: 3721100, 18: 3838300, 20: 3959200, 22: 4083900, 24: 4212500, 26: 4345100, 28: 4482000, 30: 4623200, 32: 4768800 },
  "iiic": { 0: 3026400, 2: 3121700, 4: 3220000, 6: 3321400, 8: 3426000, 10: 3533900, 12: 3645200, 14: 3760100, 16: 3878500, 18: 4000600, 20: 4126600, 22: 4256600, 24: 4390700, 26: 4528900, 28: 4671600, 30: 4818700, 32: 4970500 },
  "iiid": { 0: 3154400, 2: 3253700, 4: 3356200, 6: 3461900, 8: 3571000, 10: 3683400, 12: 3799400, 14: 3919100, 16: 4042500, 18: 4169900, 20: 4301200, 22: 4436700, 24: 4576400, 26: 4720500, 28: 4869200, 30: 5022500, 32: 5180700 },
  "iva": { 0: 3287800, 2: 3391400, 4: 3498200, 6: 3608400, 8: 3722000, 10: 3839200, 12: 3960200, 14: 4084900, 16: 4213500, 18: 4346200, 20: 4483100, 22: 4624300, 24: 4770000, 26: 4920200, 28: 5075200, 30: 5235000, 32: 5399900 },
  "ivb": { 0: 3426900, 2: 3534800, 4: 3646200, 6: 3761000, 8: 3879500, 10: 4001600, 12: 4127700, 14: 4257700, 16: 4391800, 18: 4530100, 20: 4672800, 22: 4819900, 24: 4971700, 26: 5128300, 28: 5289800, 30: 5456400, 32: 5628300 },
  "ivc": { 0: 3571900, 2: 3684400, 4: 3800400, 6: 3920100, 8: 4043600, 10: 4170900, 12: 4302300, 14: 4437800, 16: 4577500, 18: 4721700, 20: 4870400, 22: 5023800, 24: 5182000, 26: 5345200, 28: 5513600, 30: 5687200, 32: 5866400 },
  "ivd": { 0: 3723000, 2: 3840200, 4: 3961200, 6: 4085900, 8: 4214600, 10: 4347300, 12: 4484300, 14: 4625500, 16: 4771200, 18: 4921400, 20: 5076400, 22: 5236300, 24: 5401200, 26: 5571400, 28: 5746800, 30: 5927800, 32: 6114500 },
  "ive": { 0: 3880400, 2: 4002700, 4: 4128700, 6: 4258700, 8: 4392900, 10: 4531200, 12: 4673900, 14: 4821100, 16: 4973000, 18: 5129600, 20: 5291200, 22: 5457800, 24: 5629700, 26: 5807000, 28: 5989900, 30: 6178600, 32: 6373200 },
  "ia": { 0: 1685700, 1: 1738800, 2: 1793500, 3: 1850000, 4: 1908300, 5: 1968400, 6: 2030400, 7: 2094300, 8: 2160300, 9: 2228300, 10: 2298500, 11: 2370900, 12: 2445500, 13: 2522600, 14: 2602000, 15: 2683900, 16: 2768500, 17: 2855700, 18: 2945600, 19: 3038400, 20: 3134100, 21: 3232900, 22: 3334900, 23: 3440000, 24: 3548400, 25: 3660200, 26: 3775500, 27: 3894300 },
  "ib": { 3: 1840800, 5: 1898800, 7: 1958600, 9: 2020300, 11: 2083900, 13: 2149600, 15: 2217300, 17: 2287100, 19: 2359100, 21: 2433400, 23: 2510100, 25: 2589100, 27: 2670700 },
  "ic": { 3: 1918700, 5: 1979100, 7: 2041500, 9: 2105800, 11: 2172100, 13: 2240500, 15: 2311100, 17: 2383900, 19: 2458900, 21: 2536400, 23: 2616300, 25: 2698700, 27: 2783700 },
  "id": { 3: 1999900, 5: 2062900, 7: 2127800, 9: 2194800, 11: 2264000, 13: 2335300, 15: 2408800, 17: 2484700, 19: 2562900, 21: 2643700, 23: 2726900, 25: 2812800, 27: 2901400 },
  "iia": { 0: 2184000, 1: 2218400, 3: 2288200, 5: 2360300, 7: 2434600, 9: 2511300, 11: 2590400, 13: 2672000, 15: 2756200, 17: 2843000, 19: 2932500, 21: 3024900, 23: 3120100, 25: 3218400, 27: 3319800, 29: 3424300, 31: 3532200, 33: 3643400 },
  "iib": { 3: 2385000, 5: 2460100, 7: 2537600, 9: 2617500, 11: 2700000, 13: 2785000, 15: 2872700, 17: 2963200, 19: 3056500, 21: 3152800, 23: 3252100, 25: 3354500, 27: 3460200, 29: 3569200, 31: 3681600, 33: 3797500 },
  "iic": { 3: 2485900, 5: 2564200, 7: 2645000, 9: 2728300, 11: 2814200, 13: 2902800, 15: 2994300, 17: 3088600, 19: 3185800, 21: 3286200, 23: 3389700, 25: 3496400, 27: 3606500, 29: 3720100, 31: 3837300, 33: 3958200 },
  "iid": { 3: 2591100, 5: 2672700, 7: 2756800, 9: 2843700, 11: 2933200, 13: 3025600, 15: 3120900, 17: 3219200, 19: 3320600, 21: 3425200, 23: 3533100, 25: 3644300, 27: 3759100, 29: 3877500, 31: 3999600, 33: 4125600 },
}

export default function KGBConfirmModal({ selectedEmployees, onClose, onConfirm }: Props) {

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num)
  }

  const parseGaji = (gajiStr: string) => {
    if (!gajiStr) return 0
    return parseInt(gajiStr.replace(/[^0-9]/g, '')) || 0
  }

  const parseMKG = (mkgStr: string) => {
    const match = mkgStr.match(/\d+/)
    return match ? parseInt(match[0]) : 0
  }

  const formatGolKey = (golStr: string) => {
    if (!golStr) return ""
    // Convert "III/c" or "III c" to "iiic" for consistent matching
    return golStr.replace(/[\/\s]/g, '').toLowerCase()
  }

  const calculateDetails = (emp: Employee) => {
    const currentMKG = parseMKG(emp.mkg)
    const newMKG = currentMKG + 2
    const golKey = formatGolKey(emp.golongan)
    
    const actualOldGaji = parseGaji(emp.gaji)
    let stepIncrease = 0
    
    // Opsi B: Ambil selisih kenaikan dari tabel, lalu tambahkan ke gaji lama yang ada di sistem
    const tableData = SALARY_DATA[golKey]
    if (tableData && tableData[currentMKG] !== undefined && tableData[newMKG] !== undefined) {
      stepIncrease = tableData[newMKG] - tableData[currentMKG]
    } else if (tableData && tableData[newMKG] !== undefined) {
      // Jika MKG lama tidak ada di tabel tapi MKG baru ada, coba cari step terdekat atau gunakan fallback
      const prevMKG = Object.keys(tableData).map(Number).filter(k => k < newMKG).sort((a,b) => b-a)[0]
      if (prevMKG !== undefined) {
        stepIncrease = tableData[newMKG] - tableData[prevMKG]
      } else {
        stepIncrease = 125000
      }
    } else {
      // Fallback: estimasi kenaikan jika data tidak lengkap (sekitar 3% atau flat)
      stepIncrease = Math.max(120000, Math.floor(actualOldGaji * 0.03))
    }
    
    const finalNewGaji = actualOldGaji + stepIncrease
    
    return { 
      oldGaji: actualOldGaji, 
      newGaji: finalNewGaji, 
      increase: stepIncrease, 
      currentMKG, 
      newMKG 
    }
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
                        Gaji lama: Rp {formatNumber(oldGaji)}
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#16a34a', lineHeight: 1.2 }}>
                        Rp. {formatNumber(newGaji)}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#22c55e', marginTop: '2px' }}>
                        + Rp {formatNumber(increase)} (KGB)
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
                  RP. {formatNumber(totalBudget)}
                </span>
                <span style={{
                  background: 'rgba(34,197,94,0.15)',
                  color: '#4ade80',
                  fontSize: '11px', fontWeight: 700,
                  padding: '4px 12px', borderRadius: '999px',
                  border: '1px solid rgba(34,197,94,0.25)',
                }}>
                  + Rp {formatNumber(totalIncrease)}
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
