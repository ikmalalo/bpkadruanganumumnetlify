import { useEffect, useRef, useState } from "react"

interface PdfToImageProps {
  fileUrl: string;
  pageNumber: number;
  className?: string;
  onLoaded?: (totalPages: number) => void;
  autoScroll?: boolean;
}

export default function PdfToImage({ fileUrl, pageNumber, className, onLoaded, autoScroll }: PdfToImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    const renderPage = async () => {
      try {
        const pdfjsLib = (window as any).pdfjsLib
        
        let retries = 0
        while (!pdfjsLib && retries < 10) {
          await new Promise(r => setTimeout(r, 100))
          const currentLib = (window as any).pdfjsLib
          if (currentLib) break
          retries++
        }

        if (!pdfjsLib) throw new Error("Library PDF belum siap")

        const loadingTask = pdfjsLib.getDocument(fileUrl)
        const pdf = await loadingTask.promise
        
        if (onLoaded && isMounted) onLoaded(pdf.numPages)

        if (!isMounted) return
        
        const actualPageNumber = Math.min(Math.max(1, pageNumber), pdf.numPages)
        const page = await pdf.getPage(actualPageNumber)
        
        const viewport = page.getViewport({ scale: 3.0 }) 
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext("2d")
        if (!context) return

        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        }

        await page.render(renderContext).promise
        if (isMounted) setLoading(false)
      } catch (err: any) {
        console.error("PDF Render Error:", err)
        if (isMounted) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    renderPage()

    return () => {
      isMounted = false
    }
  }, [fileUrl, pageNumber])

  return (
    <div className={`relative overflow-hidden flex flex-col items-center ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
          <div className="text-gray-400 text-sm font-medium animate-pulse">Memuat...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-20">
          <div className="text-red-500 text-xs font-medium">Gagal memuat PDF</div>
        </div>
      )}
      <div 
        key={`page-container-${pageNumber}`}
        className={`w-full ${loading || error ? 'invisible' : 'visible'} ${autoScroll ? 'animate-pdf-scroll' : ''}`}
        style={{ 
          transform: 'scale(1.08)',
          transformOrigin: 'top center'
        }}
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-auto shadow-lg"
          style={{ 
            imageRendering: 'crisp-edges'
          }}
        />
      </div>
      <style>{`
        @keyframes pdf-scroll {
          0% { transform: scale(1.08) translateY(0); }
          100% { transform: scale(1.08) translateY(calc(-100% + 75vh)); }
        }
        .animate-pdf-scroll {
          animation: pdf-scroll 12s linear forwards;
        }
      `}</style>
    </div>
  )
}
