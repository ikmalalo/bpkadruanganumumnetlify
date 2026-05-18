import { LayoutDashboard, PlusCircle, History, LogOut, Eye, X, Award, Users, CircleDollarSign, ArrowLeftRight, FileText } from "lucide-react"

import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { api } from "../../lib/api"
import { isKGBDueSoon } from "../../lib/kgbUtils"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const roomBookingMenu = [
  { path: "/rooms",      icon: LayoutDashboard, label: "Dashboard" },
  { path: "/peminjaman", icon: PlusCircle,       label: "Buat Peminjaman" },
  { path: "/preview",    icon: Eye,              label: "Preview Ruangan" },
  { path: "/riwayat",          icon: History,          label: "Riwayat" },
  { path: "/upload-informasi", icon: FileText,            label: "Upload Informasi" },
]

const kgbMenu = [
  { path: "/kgb",            icon: LayoutDashboard, label: "Dashboard" },
  { path: "/kgb/pegawai",    icon: Users,           label: "Daftar Pegawai" },
  { path: "/kgb/riwayat",    icon: CircleDollarSign, label: "Riwayat Penggajian" },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const navRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const menuRefs = useRef<(HTMLDivElement | null)[]>([])
  const isFirstRef = useRef(true)
  const [kgbAlertCount, setKgbAlertCount] = useState(0)

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  // Supabase user stores metadata in user_metadata
  const displayName = user?.user_metadata?.username || user?.email?.split('@')[0] || 'Admin'
  const role = user?.user_metadata?.role || 'Administrator'

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate("/")
  }

  const isKgb = location.pathname.startsWith('/kgb')
  const currentMenu = isKgb ? kgbMenu : roomBookingMenu

  useEffect(() => {
    const index = currentMenu.findIndex((item: any) => item.path === location.pathname)
    if (index === -1) return

    const el = menuRefs.current[index]
    const nav = navRef.current
    const highlight = highlightRef.current
    if (!el || !nav || !highlight) return

    const navRect = nav.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const top = elRect.top - navRect.top
    const height = elRect.height

    if (isFirstRef.current) {
      const originalTransition = highlight.style.transition
      highlight.style.transition = "none"
      highlight.style.top = top + "px"
      highlight.style.height = height + "px"
      highlight.style.opacity = "1"
      requestAnimationFrame(() => {
        highlight.style.transition = originalTransition
      })
      isFirstRef.current = false
    } else {
      highlight.style.top = top + "px"
      highlight.style.height = height + "px"
      highlight.style.opacity = "1"
    }
  }, [location.pathname])

  useEffect(() => {
    if (isKgb) {
      api.getKGBEmployees().then(data => {
        const count = data.filter((emp: any) => isKGBDueSoon(emp.tahunAkhir)).length
        setKgbAlertCount(count)
      }).catch(err => console.error("Sidebar KGB count error:", err))
    }
  }, [isKgb, location.pathname]) // Refresh on path change to keep it updated

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        w-64 bg-white border-r h-screen p-5 fixed left-0 top-0 flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

        {/* MOBILE CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="md:hidden absolute right-4 top-4 p-2 text-gray-500 hover:text-orange-500"
        >
          <X size={24} />
        </button>

        {/* PROFILE CARD */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-md mb-5 mt-4 md:mt-2">
          <div className="w-12 h-12 rounded-full bg-orange-200 text-orange-600 flex items-center justify-center font-bold text-lg">
            {displayName.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-sm text-gray-800 truncate">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {role}
            </p>
          </div>
        </div>

        <div className="border-b-2 border-gray-200 mb-5" />

      <nav ref={navRef} className="relative">

        <div
          ref={highlightRef}
          className="absolute left-0 w-full bg-orange-100 border-l-4 border-orange-500 rounded-lg pointer-events-none shadow-[0_2px_10px_rgba(249,115,22,0.1)]"
          style={{ 
            top: 0, 
            height: 0,
            transition: "top 450ms cubic-bezier(0.5, 0, 0, 1), height 450ms cubic-bezier(0.5, 0, 0, 1), opacity 300ms ease"
          }}
        />

        {currentMenu.map((item: any, index: number) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <div
              key={item.path}
              ref={(el) => { menuRefs.current[index] = el }}
              onClick={() => {
                navigate(item.path);
                onClose(); // Auto close on mobile
              }}
              className={`
                relative flex items-center gap-3 p-3 rounded-lg cursor-pointer z-10
                transition-colors duration-200
                ${isActive 
                  ? "text-orange-600 font-medium" 
                  : "text-gray-600 hover:text-gray-800"}
              `}
            >
              <Icon size={18} />
              <span className="flex-grow">{item.label}</span>
              {item.path === "/kgb" && kgbAlertCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {kgbAlertCount}
                </span>
              )}
            </div>
          )
        })}

      </nav>

      <div className="mt-auto pt-6">
        <div className="border-t pt-4 flex flex-col gap-1">
          <div 
            onClick={() => navigate("/services")}
            className="flex items-center gap-3 p-3 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors duration-150"
          >
            <ArrowLeftRight size={18} />
            Ganti Layanan
          </div>


          <div 
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 text-red-500 rounded-lg cursor-pointer hover:bg-red-50 transition-colors duration-150"
          >
            <LogOut size={18} />
            Logout
          </div>
        </div>
      </div>

    </div>
    </>
  )
}