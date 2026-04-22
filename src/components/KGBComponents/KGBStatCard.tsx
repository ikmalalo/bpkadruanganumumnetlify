import { Users, CheckCircle2, Clock, Landmark } from "lucide-react"

interface Props {
  label: string
  value: string
  icon: 'users' | 'check' | 'clock' | 'bank'
  color: 'orange' | 'blue' | 'green' | 'gray'
}

export default function KGBStatCard({ label, value, icon, color }: Props) {
  const configs = {
    orange: {
      bg: "bg-orange-500",
      border: "border-orange-200",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      shadow: "shadow-orange-100"
    },
    blue: {
      bg: "bg-blue-500",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      shadow: "shadow-blue-100"
    },
    green: {
      bg: "bg-green-500",
      border: "border-green-200",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      shadow: "shadow-green-100"
    },
    gray: {
      bg: "bg-gray-400",
      border: "border-gray-200",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
      shadow: "shadow-gray-100"
    }
  }

  const config = configs[color]

  const IconComponent = {
    users: Users,
    check: CheckCircle2,
    clock: Clock,
    bank: Landmark
  }[icon]

  return (
    <div className={`relative overflow-hidden group p-6 rounded-2xl border-2 ${config.border} bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${config.shadow}`}>
      {/* Background Decorative Element */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${config.bg}`} />
      
      <div className="flex flex-col gap-1 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-xl scale-75 origin-left ${config.iconBg} ${config.iconColor}`}>
            <IconComponent size={24} strokeWidth={2.5} />
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <h3 className="text-4xl font-black text-gray-800 tracking-tighter mb-1">
            {value}
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
            {label}
          </p>
        </div>
      </div>

    </div>
  )
}
