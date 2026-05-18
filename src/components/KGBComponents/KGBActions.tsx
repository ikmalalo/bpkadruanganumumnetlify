import { Download, Play } from "lucide-react"

interface KGBActionsProps {
  onProcess: () => void
  onExport?: () => void
  disabled?: boolean
}

export default function KGBActions({ onProcess, onExport, disabled }: KGBActionsProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "10px", justifyContent: "flex-end" }}>

      {/* Export Excel — outline style */}
      <button 
        onClick={onExport}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "10px 20px",
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "13px", fontWeight: 700, color: "#374151",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "#f97316"
          e.currentTarget.style.color = "#f97316"
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)"
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "#e5e7eb"
          e.currentTarget.style.color = "#374151"
          e.currentTarget.style.boxShadow = "none"
        }}
      >
        <Download size={16} />
        <span>Export Excel</span>
      </button>

      {/* Proses Penggajian — darker orange / disabled state */}
      <button
        onClick={onProcess}
        disabled={disabled}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "10px 20px",
          background: disabled
            ? "#d1d5db"
            : "linear-gradient(135deg,#fb923c,#f97316,#ea580c)",
          border: "none",
          borderRadius: "12px",
          fontSize: "13px", fontWeight: 700,
          color: disabled ? "#9ca3af" : "white",
          cursor: disabled ? "not-allowed" : "pointer",
          boxShadow: disabled ? "none" : "0 6px 20px -4px rgba(249,115,22,0.50)",
          transition: "all 0.2s",
          opacity: disabled ? 0.7 : 1,
        }}
        onMouseEnter={e => {
          if (!disabled) {
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow = "0 10px 28px -4px rgba(249,115,22,0.70)"
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)"
          e.currentTarget.style.boxShadow = disabled ? "none" : "0 6px 20px -4px rgba(249,115,22,0.50)"
        }}
      >
        <Play size={16} fill="currentColor" />
        <span>Proses Penggajian</span>
      </button>
    </div>
  )
}
