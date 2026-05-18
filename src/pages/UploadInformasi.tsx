import "../index.css"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../lib/api"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { 
  FileText, 
  User, 
  Image as ImageIcon, 
  ArrowLeft, 
  Upload,
  CheckCircle2,
  Calendar,
  File as FileIcon
} from "lucide-react"

import SectionHeader from "../components/PeminjamanComponents/SectionHeader"
import FormField from "../components/PeminjamanComponents/FormField"
import RadioCard from "../components/PeminjamanComponents/RadioCard"
import Toast from "../components/DashboardComponents/Toast"

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"

export default function UploadInformasi() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    namaPenerima: "",
    penghargaan: "INFORMASI",
    tanggal: format(new Date(), "EEEE, dd MMM yyyy", { locale: id }),
    foto: null as File | null
  })

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [openCalendar, setOpenCalendar] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  const [preview, setPreview] = useState<string | null>(null)
  const [isPdf, setIsPdf] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [toast, setToast] = useState({ show: false, message: "", type: 'success' as 'success' | 'error' })

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm(prev => ({ ...prev, foto: file }))
      const isPdfFile = file.type === 'application/pdf'
      setIsPdf(isPdfFile)

      if (isPdfFile) {
        setPreview(null) // No preview for PDF in this component, just icon
      } else {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setOpenCalendar(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSubmit = async () => {
    if (!form.namaPenerima || !form.foto) return;

    try {
      const formData = new FormData();
      formData.append('nama_penerima', form.namaPenerima);
      formData.append('penghargaan', form.penghargaan);
      formData.append('tanggal', selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
      formData.append('foto', form.foto);

      await api.uploadInformasi(formData);

      setToast({ show: true, message: "Informasi berhasil diupload!", type: 'success' });
      
      // Reset form
      setForm({
        namaPenerima: "",
        penghargaan: "INFORMASI",
        tanggal: format(new Date(), "EEEE, dd MMM yyyy", { locale: id }),
        foto: null
      });
      setSelectedDate(new Date());
      setPreview(null);
      setIsPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
    } catch (error: any) {
      console.error('Error uploading information:', error);
      setToast({ show: true, message: `Gagal upload: ${error.message}`, type: 'error' });
    }
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  }

  return (
    <div className="flex flex-col pt-4 relative">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-8 py-7 space-y-8">
        
        {/* INFORMASI PENGIRIM / SUMBER */}
        <section>
          <SectionHeader 
            icon={<User className="w-5 h-5" />} 
            title="Informasi Sumber / Judul" 
            divider={false} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Judul / Nama Informasi">
              <input 
                type="text" 
                className={inputClass}
                placeholder="Contoh: Surat Edaran Wali Kota"
                value={form.namaPenerima}
                onChange={(e) => handleChange("namaPenerima", e.target.value)}
              />
            </FormField>
            <FormField label="Tanggal Upload">
              <div className="relative" ref={calendarRef}>
                <button
                  type="button"
                  onClick={() => setOpenCalendar(!openCalendar)}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:border-orange-400 transition min-h-[40px]"
                >
                  <span className="text-gray-700">
                    {selectedDate
                      ? format(selectedDate, "dd MMMM yyyy", { locale: id })
                      : "Pilih tanggal"}
                  </span>
                  <Calendar size={18} className="text-gray-400" />
                </button>
                <div
                  className={`absolute z-30 mt-2 bg-white rounded-xl shadow-lg border p-3 transition-all duration-200 ${
                    openCalendar
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date)
                      if (date) {
                        handleChange(
                          "tanggal",
                          format(date, "EEEE, dd MMM yyyy", { locale: id })
                        )
                      }
                      setOpenCalendar(false)
                    }}
                  />
                </div>
              </div>
            </FormField>
          </div>
        </section>

        {/* KATEGORI */}
        <section>
          <SectionHeader 
            icon={<FileText className="w-5 h-5" />} 
            title="Kategori Informasi" 
          />
          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <RadioCard 
              label="INFORMASI"
              description="Informasi umum, surat edaran, atau pengumuman"
              selected={form.penghargaan === "INFORMASI"}
              onClick={() => handleChange("penghargaan", "INFORMASI")}
            />
            <RadioCard 
              label="SERTIFIKAT"
              description="Penghargaan atau apresiasi pegawai"
              selected={form.penghargaan === "SERTIFIKAT"}
              onClick={() => handleChange("penghargaan", "SERTIFIKAT")}
            />
          </div>
        </section>


        {/* LAMPIRAN FILE */}
        <section>
          <SectionHeader 
            icon={<ImageIcon className="w-5 h-5" />} 
            title="Lampiran File (Gambar atau PDF)" 
          />
          <div className="mt-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
              />
              
              {isPdf ? (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-red-100 rounded-xl flex items-center justify-center mb-3">
                    <FileIcon className="text-red-500 w-10 h-10" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">{form.foto?.name}</p>
                  <p className="text-xs text-red-500 mt-1">File PDF Terpilih</p>
                </div>
              ) : preview ? (
                <div className="relative w-full max-w-md">
                  <img src={preview} alt="Preview" className="w-full h-auto rounded-lg shadow-md" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                    <p className="text-white font-bold text-sm">Ganti File</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-100 transition-colors">
                    <Upload className="text-gray-400 group-hover:text-orange-500 w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Klik untuk Upload Gambar atau PDF</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG atau PDF (Max. 10MB)</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ACTIONS */}
        <div className="flex justify-between pt-6 border-t border-gray-100">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2 border-2 border-gray-200 text-gray-500 font-bold rounded-lg hover:bg-gray-50 transition"
          >
            <ArrowLeft size={18} />
            Batal
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!form.namaPenerima || !form.foto}
            className={`
              flex items-center gap-2 px-8 py-2 font-bold rounded-lg shadow-lg transition-all
              ${(!form.namaPenerima || !form.foto) 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-orange-500 text-white hover:bg-orange-600 hover:scale-[1.02]"}
            `}
          >
            Simpan Informasi
            <CheckCircle2 size={18} />
          </button>
        </div>

      </div>
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  )
}
