import { LayoutDashboard } from "lucide-react"

interface Props {
  totalProcessed: number
  onClose: () => void
}

export default function KGBSuccessPopup({ totalProcessed, onClose }: Props) {
  return (
    <div
      id="kgb-success-overlay"
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      {/* Keyframes */}
      <style>{`
        @keyframes kgbSuccessFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes kgbSuccessPopIn {
          0%   { opacity: 0; transform: scale(0.85) translateY(24px); }
          65%  { transform: scale(1.03) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes kgbSuccessCheckBounce {
          0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
          55%  { transform: scale(1.18) rotate(6deg); opacity: 1; }
          75%  { transform: scale(0.92) rotate(-3deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes kgbSuccessGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); }
          50%      { box-shadow: 0 0 0 22px rgba(249,115,22,0); }
        }
        @keyframes kgbSuccessRipple {
          0%   { transform: scale(0.6); opacity: 0.7; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .kgb-success-fade { animation: kgbSuccessFadeIn 0.3s ease-out forwards; }
        .kgb-success-pop  { animation: kgbSuccessPopIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .kgb-success-check { animation: kgbSuccessCheckBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.25s both; }
        .kgb-success-ripple {
          position: absolute; inset: 0; border-radius: 50%;
          background: rgba(249,115,22,0.25);
          animation: kgbSuccessRipple 1.6s ease-out infinite;
        }
        .kgb-success-ripple2 {
          position: absolute; inset: 0; border-radius: 50%;
          background: rgba(249,115,22,0.15);
          animation: kgbSuccessRipple 1.6s ease-out 0.55s infinite;
        }
        #kgb-success-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 44px -4px rgba(249,115,22,0.75) !important;
        }
        #kgb-success-btn:active {
          transform: translateY(0);
        }
        #kgb-success-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
      `}</style>

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm kgb-success-fade"
        onClick={onClose}
      />

      {/* Card */}
      <div
        className="kgb-success-pop relative bg-white flex flex-col items-center"
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '28px',
          padding: '48px 40px 40px',
          boxShadow: '0 24px 80px -12px rgba(0,0,0,0.28)',
          textAlign: 'center',
        }}
      >
        {/* Icon with ripple */}
        <div
          className="kgb-success-check"
          style={{ position: 'relative', width: '88px', height: '88px', marginBottom: '28px' }}
        >
          {/* Ripple rings */}
          <div className="kgb-success-ripple" />
          <div className="kgb-success-ripple2" />

          {/* Glow halo */}
          <div style={{
            position: 'absolute', inset: '-8px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, rgba(249,115,22,0) 70%)',
          }} />

          {/* Circle */}
          <div style={{
            position: 'relative',
            width: '88px', height: '88px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fb923c 0%, #f97316 60%, #ea580c 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px -4px rgba(249,115,22,0.55)',
          }}>
            {/* Checkmark SVG */}
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
              <path
                d="M10 21.5L17.5 29L32 13"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 style={{
          margin: '0 0 10px',
          fontSize: '22px',
          fontWeight: 900,
          color: '#111827',
          letterSpacing: '-0.02em',
          lineHeight: 1.25,
        }}>
          Kenaikan Gaji Berhasil Di Proses!
        </h2>

        {/* Subtitle */}
        <p style={{
          margin: '0 0 32px',
          fontSize: '14px',
          fontWeight: 500,
          color: '#9ca3af',
          lineHeight: 1.6,
          maxWidth: '300px',
        }}>
          Data Periode dan Gaji Karyawan telah diperbarui<br />di dalam database
        </p>

        {/* Stat card */}
        <div style={{
          width: '100%',
          background: '#f9fafb',
          borderRadius: '18px',
          padding: '20px 24px',
          marginBottom: '32px',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '8px',
          }}>
            TOTAL KARYAWAN YANG DIGAJI
          </div>
          <div style={{
            fontSize: '48px',
            fontWeight: 900,
            color: '#111827',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}>
            {totalProcessed}
          </div>
          <div style={{
            height: '1px',
            background: '#e5e7eb',
            marginTop: '16px',
          }} />
        </div>

        {/* CTA Button */}
        <button
          id="kgb-success-btn"
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '16px 28px',
            background: 'linear-gradient(135deg, #fb923c 0%, #f97316 60%, #ea580c 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            boxShadow: '0 8px 32px -4px rgba(249,115,22,0.55)',
          }}
        >
          <LayoutDashboard size={20} strokeWidth={2.5} />
          <span>Kembali Ke Dashboard</span>
        </button>
      </div>
    </div>
  )
}
