import { ArrowRight } from "lucide-react"

interface Props {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  themeColor: "green" | "blue" // Changed orange to green
  onClick?: () => void
}

export default function ServiceCard({ title, description, icon, color, themeColor, onClick }: Props) {
  const glowClass = themeColor === "green" 
    ? "hover:shadow-[0_0_50px_rgba(34,197,94,0.3)] hover:border-green-200/50" 
    : "hover:shadow-[0_0_50px_rgba(37,99,235,0.3)] hover:border-blue-200/50";
  
  const textAccent = themeColor === "green" ? "group-hover:text-green-600" : "group-hover:text-blue-600";
  const actionAccent = themeColor === "green" ? "text-green-600" : "text-blue-600";
  const borderAccent = themeColor === "green" ? "from-green-400 to-green-600" : "from-blue-400 to-blue-600";
  const bgGradient = themeColor === "green" ? "from-green-50" : "from-blue-50";

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 h-full min-h-[260px] 
      shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
      ${glowClass}
      transition-all duration-500 hover:-translate-y-3 cursor-pointer flex flex-col justify-between overflow-hidden`}
    >
      {/* Decorative Gradient background on hover */}
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${bgGradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-bl-full -z-10`} />

      <div>
        {/* Icon Container */}
        <div className={`w-16 h-16 flex items-center justify-center rounded-2xl mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${color}`}>
          <div className="transform group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
        </div>

        <h2 className={`text-2xl font-black text-gray-900 mb-3 tracking-tight ${textAccent} transition-colors duration-300`}>
          {title}
        </h2>

        <p className="text-gray-500 text-sm font-medium leading-relaxed mb-4">
          {description}
        </p>
      </div>

      {/* Action Indicator */}
      <div className={`flex items-center gap-2 ${actionAccent} font-extrabold text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out`}>
        Buka Layanan <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
      </div>

      {/* Bottom Border Accent */}
      <div className={`absolute bottom-0 left-0 w-0 h-1.5 bg-gradient-to-r ${borderAccent} group-hover:w-full transition-all duration-700`} />
    </div>
  )
}