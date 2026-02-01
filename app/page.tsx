"use client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, TrendingUp, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex flex-col items-center justify-center p-6 text-white">
      
      {/* Judul Besar */}
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          My LifeOS 🚀
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Pusat kendali karir dan investasi masa depanmu.
        </p>
      </div>

      {/* Menu Pilihan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        
        {/* Tombol ke Job Tracker */}
        <Link href="/tracker" className="group">
          <Card className="bg-white/10 border-white/10 hover:bg-white/20 transition-all cursor-pointer h-full backdrop-blur-sm group-hover:scale-105 duration-300">
            <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
              <div className="p-4 bg-blue-500/20 rounded-full text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Briefcase className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Job Tracker</h2>
                <p className="text-gray-400">Pantau lamaran & interview.</p>
              </div>
              <div className="flex items-center text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
                Buka Tracker <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Tombol ke Investment */}
        <Link href="/finance" className="group">
          <Card className="bg-white/10 border-white/10 hover:bg-white/20 transition-all cursor-pointer h-full backdrop-blur-sm group-hover:scale-105 duration-300">
            <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
              <div className="p-4 bg-emerald-500/20 rounded-full text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <TrendingUp className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Investment</h2>
                <p className="text-gray-400">Cek pasar saham & analisa.</p>
              </div>
              <div className="flex items-center text-emerald-400 font-semibold group-hover:translate-x-2 transition-transform">
                Cek Market <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

      </div>
    </div>
  )
}