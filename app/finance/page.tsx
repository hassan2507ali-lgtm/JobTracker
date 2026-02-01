"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Briefcase, 
  LineChart, 
  Search, 
  Brain, 
  ArrowUpRight, 
  Home,
  Building2 // <-- Import Icon Baru
} from "lucide-react"

export default function FinancePage() {
  // State: Saham apa yang sedang dilihat (Default BBRI)
  const [activeTicker, setActiveTicker] = useState("BBRI") 
  const [activeSymbol, setActiveSymbol] = useState("IDX:BBRI") // Format TradingView
  const [searchQuery, setSearchQuery] = useState("")
  
  // State untuk AI
  const [analisa, setAnalisa] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // State untuk Top Cards (Real-Time)
  const [topStocks, setTopStocks] = useState<any[]>([])

  // Ambil Data Harga Live dari Python
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/quotes")
        const data = await res.json()
        setTopStocks(data)
      } catch (e) {
        console.log("Python mati/error, pakai data dummy sementara.")
        setTopStocks([
          { code: "BBCA", name: "BCA", price: "---", change: "0%", up: true },
          { code: "BBRI", name: "BRI", price: "---", change: "0%", up: true },
          { code: "TLKM", name: "Telkom", price: "---", change: "0%", up: true },
          { code: "GOTO", name: "GoTo", price: "---", change: "0%", up: false },
          { code: "BUMI", name: "Bumi", price: "---", change: "0%", up: true },
        ])
      }
    }

    fetchMarketData()

    // Auto-refresh setiap 10 detik
    const interval = setInterval(fetchMarketData, 10000)
    return () => clearInterval(interval)
  }, [])

  // Fungsi Ganti Saham
  const handleStockChange = (code: string) => {
    const cleanCode = code.toUpperCase().replace(".JK", "")
    setActiveTicker(cleanCode)
    setActiveSymbol(`IDX:${cleanCode}`)
    setAnalisa(null) // Reset analisa AI saat ganti saham
  }

  // Fungsi Panggil AI (Python)
  const handleAnalisa = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://127.0.0.1:8000/analisa/${activeTicker}.JK`)
      if (!res.ok) throw new Error("Gagal")
      const data = await res.json()
      setAnalisa(data)
    } catch (err) {
      // Simulasi Data kalau Python mati
      setTimeout(() => {
        setAnalisa({
          rekomendasi: "BUY ON WEAKNESS",
          target: 6200,
          buy_pressure: 65, // Simulasi Pressure
          bid: 5600,
          ask: 5625,
          summary: `Analisa untuk ${activeTicker}: Secara teknikal sedang berada di support kuat. Valuasi masih murah dibandingkan rata-rata industri. Potensi rebound dalam jangka pendek.`
        })
      }, 1500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* 1. SIDEBAR (Kiri) */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col p-6 fixed h-full z-10">
        <div className="mb-10 flex items-center gap-2 text-2xl font-bold text-indigo-600">
          <div className="p-2 bg-indigo-100 rounded-lg"><LineChart className="w-6 h-6"/></div>
          LifeOS
        </div>
        
        <nav className="space-y-2 flex-1">
          <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Main Menu</p>
          
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50">
              <Home className="w-5 h-5" /> Home
            </Button>
          </Link>
          
          <Link href="/tracker">
            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50">
              <Briefcase className="w-5 h-5" /> Job Tracker
            </Button>
          </Link>

          <Button variant="ghost" className="w-full justify-start gap-3 bg-indigo-50 text-indigo-600 font-bold">
            <LineChart className="w-5 h-5" /> Stocks Pro
          </Button>

          {/* MENU BARU: BROKER SUMMARY */}
          <Link href="/broker">
            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50">
              <Building2 className="w-5 h-5" /> Broker Summary
            </Button>
          </Link>
        </nav>

        <div className="p-4 bg-gray-900 rounded-xl text-white mt-auto">
          <p className="text-xs text-gray-400 mb-1">Portfolio Value</p>
          <p className="text-xl font-bold">Rp 124.500.000</p>
          <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3"/> +12.5% bulan ini
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT (Kanan) */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        
        {/* Header & Search */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Market Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back, Investor!</p>
          </div>
          <div className="flex gap-2 bg-white p-2 rounded-full shadow-sm border w-96">
            <Search className="text-gray-400 w-5 h-5 ml-2 mt-2" />
            <Input 
              placeholder="Cari emiten lain (misal: UNVR)..." 
              className="border-none shadow-none focus-visible:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStockChange(searchQuery)}
            />
          </div>
        </div>

       {/* Top Cards Row (SCROLLABLE) */}
        <div className="flex overflow-x-auto gap-4 mb-8 pb-4 scrollbar-hide snap-x">
          {topStocks.map((stock) => (
            <div 
              key={stock.code}
              onClick={() => handleStockChange(stock.code)}
              className={`min-w-[200px] snap-center p-5 rounded-2xl bg-white border cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${activeTicker === stock.code ? 'ring-2 ring-indigo-500 shadow-md' : 'shadow-sm'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-full ${activeTicker === stock.code ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                  {["BBCA", "BBRI", "BMRI", "BBNI", "BRIS"].includes(stock.code) ? <Briefcase className="w-5 h-5"/> : <LineChart className="w-5 h-5"/>}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stock.up ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {stock.change}
                </span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{stock.name}</h3>
              <p className="text-xl font-bold text-gray-800">Rp {stock.price}</p>
            </div>
          ))}
        </div>

        {/* Area Grafik & AI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* BAGIAN TENGAH: CHART BESAR */}
          <Card className="lg:col-span-2 border-none shadow-lg rounded-2xl overflow-hidden bg-white">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <div>
                <CardTitle className="text-xl">Chart Analysis: {activeTicker}</CardTitle>
                <p className="text-gray-500 text-sm">Real-time data from IDX</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-full">1D</Button>
                <Button size="sm" variant="outline" className="rounded-full bg-indigo-50 text-indigo-600 border-indigo-200">1W</Button>
                <Button size="sm" variant="outline" className="rounded-full">1M</Button>
              </div>
            </CardHeader>
            <CardContent className="h-[450px] p-0">
              <TradingViewWidget key={activeSymbol} symbol={activeSymbol} />
            </CardContent>
          </Card>

          {/* BAGIAN KANAN: AI ADVISOR */}
          <div className="flex flex-col gap-6">
            <Card className="border-none shadow-lg rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain className="w-32 h-32" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="text-yellow-400" /> AI Analyst
                </CardTitle>
                <p className="text-indigo-200 text-sm">Tanya AI sebelum beli {activeTicker}.</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                    <p className="text-xs text-indigo-300 mb-1">Target Harga (AI Prediction)</p>
                    <p className="text-3xl font-bold text-white">
                      {analisa ? `Rp ${new Intl.NumberFormat('id-ID').format(analisa.target)}` : "---"}
                    </p>
                  </div>

                  {/* === METERAN TEKANAN PASAR (BARU) === */}
                  {analisa && (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3 mb-4">
                      <div className="flex justify-between text-xs text-indigo-200">
                        <span>Bid (Antri Beli)</span>
                        <span>Ask (Antri Jual)</span>
                      </div>
                      
                      {/* Bar Visualisasi Hijau Merah */}
                      <div className="h-3 w-full bg-red-500 rounded-full overflow-hidden flex shadow-inner">
                        <div 
                          className="h-full bg-green-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(34,197,94,0.6)]" 
                          style={{ width: `${analisa.buy_pressure}%` }}
                        />
                      </div>

                      {/* Angka Detail */}
                      <div className="flex justify-between font-mono text-sm">
                        <div className="text-left">
                          <p className="text-green-400 font-bold text-lg">{analisa.buy_pressure}%</p>
                          <div className="text-xs text-gray-400">
                            @Rp {new Intl.NumberFormat('id-ID').format(analisa.bid)}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-red-400 font-bold text-lg">{100 - analisa.buy_pressure}%</p>
                          <div className="text-xs text-gray-400">
                            @Rp {new Intl.NumberFormat('id-ID').format(analisa.ask)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* ==================================== */}
                  
                  <Button 
                    onClick={handleAnalisa}
                    disabled={loading} 
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-12 rounded-xl"
                  >
                    {loading ? "Sedang Menganalisa..." : `Analisa ${activeTicker} Sekarang`}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Hasil Analisa Text */}
            {analisa && (
              <Card className="border-none shadow-md rounded-2xl bg-white flex-1">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base text-gray-500">Kesimpulan AI</CardTitle>
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">
                      {analisa.rekomendasi}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {analisa.summary}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}

// Komponen Kecil Chart TradingView
function TradingViewWidget({ symbol }: { symbol: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "" 
      const script = document.createElement("script")
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
      script.type = "text/javascript"
      script.async = true
      script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": symbol,
        "interval": "D",
        "timezone": "Asia/Jakarta",
        "theme": "light",
        "style": "1",
        "locale": "id",
        "enable_publishing": false,
        "hide_top_toolbar": true, 
        "hide_legend": false,
        "save_image": false,
        "calendar": false,
        "hide_volume": true,
        "support_host": "https://www.tradingview.com"
      })
      containerRef.current.appendChild(script)
    }
  }, [symbol])

  return <div className="h-full w-full" ref={containerRef} />
}