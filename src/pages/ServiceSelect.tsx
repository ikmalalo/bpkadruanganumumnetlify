import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import ServiceHeader from "../components/ServiceComponents/ServiceHeader"
import ServiceContainer from "../components/ServiceComponents/ServiceContainer"
import ServiceFooter from "../components/ServiceComponents/ServiceFooter"
import ServiceBackground from "../components/ServiceComponents/ServiceBackground"
import "../index.css"

export default function ServiceSelect() {
  const [hoveredTheme, setHoveredTheme] = useState<"none" | "blue" | "green">("none")

  return (
    <div className="min-h-screen bg-white flex flex-col items-center relative overflow-hidden transition-colors duration-700">
      
      {/* Animated Background with Dynamic Theme */}
      <ServiceBackground theme={hoveredTheme} />

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center px-6 md:px-0">
        
        {/* Back Button (Top Left) */}
        <Link 
          to="/" 
          className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 transition-all duration-300 shadow-sm z-50"
        >
          <ArrowLeft size={16} />
          Kembali
        </Link>

        <ServiceHeader />
        <ServiceContainer onHoverChange={setHoveredTheme} />
        <ServiceFooter />
      </div>

    </div>
  )
}