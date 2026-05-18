import ServiceCard from "./ServiceCard"
import { useNavigate } from "react-router-dom"
import { Building2, Banknote } from "lucide-react"

interface ContainerProps {
  onHoverChange: (theme: "none" | "blue" | "green") => void
}

export default function ServiceContainer({ onHoverChange }: ContainerProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col md:flex-row flex-wrap justify-center gap-8 md:gap-12 mt-12 md:mt-20 w-full max-w-6xl mx-auto px-4 pb-20">

      <div 
        className="w-full md:w-[440px] h-full"
        onMouseEnter={() => onHoverChange("blue")}
        onMouseLeave={() => onHoverChange("none")}
      >
        <ServiceCard
          title="Peminjaman Ruangan"
          description="Sistem pengelola jadwal dan reservasi fasilitas ruangan rapat dan aula secara real-time."
          icon={<Building2 size={32} />}
          color="bg-blue-50 text-blue-600 border border-blue-100"
          themeColor="blue"
          onClick={() => navigate("/rooms")}
        />
      </div>

      <div 
        className="w-full md:w-[440px] h-full"
        onMouseEnter={() => onHoverChange("green")}
        onMouseLeave={() => onHoverChange("none")}
      >
        <ServiceCard
          title="Kenaikan Gaji Berkala"
          description="Sistem otomasi perhitungan dan pengajuan kenaikan gaji berkala pegawai BPKAD."
          icon={<Banknote size={32} />}
          color="bg-green-50 text-green-600 border border-green-100"
          themeColor="green"
          onClick={() => navigate("/kgb")}
        />
      </div>

    </div>
  )
}