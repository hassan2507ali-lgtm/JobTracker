"use client"
import JobChart from "@/app/JobChart" 
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import AddJobDialog from "@/components/AddJobDialog"
import EditJobDialog from "@/components/EditJobDialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // <-- BARU: Import Input
import { Trash2, Search } from "lucide-react" // <-- BARU: Import Ikon Search

type Application = {
  id: string
  company_name: string
  role: string
  status: string
  date_applied: string
  platform: string
}

export default function Home() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("") // <-- BARU: State untuk pencarian

  // 1. Ambil Data
  const fetchApplications = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('date_applied', { ascending: false })

    if (error) console.error('Error fetching:', error)
    else setApplications(data || [])
    
    setLoading(false)
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  // 2. Fungsi Hapus Data
  const handleDelete = async (id: string) => {
    if(!confirm("Yakin mau hapus data ini?")) return;
    setApplications(apps => apps.filter(app => app.id !== id))
    const { error } = await supabase.from('applications').delete().eq('id', id)
    if (error) {
      alert("Gagal menghapus!")
      fetchApplications()
    }
  }

  // 3. Fungsi Update Status
  const handleStatusChange = async (id: string, newStatus: string) => {
    setApplications(apps => 
      apps.map(app => app.id === id ? { ...app, status: newStatus } : app)
    )
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      alert("Gagal update status")
      fetchApplications()
    }
  }

  // 4. LOGIKA FILTER PENCARIAN (BARU) 🔍
  // Kita filter data 'applications' berdasarkan apa yang diketik di 'search'
  const filteredApplications = applications.filter((app) => 
    app.company_name.toLowerCase().includes(search.toLowerCase()) || 
    app.role.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied': return 'text-blue-600 font-medium'
      case 'progress': return 'text-purple-600 font-bold'
      case 'interview': return 'text-yellow-600 font-bold'
      case 'rejected': return 'text-red-600 font-medium'
      case 'offering': return 'text-green-600 font-bold'
      default: return 'text-slate-600'
    }
  }

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Job Tracker 🚀</h1>
          <p className="text-gray-500 mt-1">Pantau progres lamaran kerjamu di sini.</p>
        </div>
        <AddJobDialog onJobAdded={fetchApplications} />
      </div>

      {/* Ringkasan Dashboard */}
    {/* Layout Atas: Kiri Kartu, Kanan Grafik (BARU) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Kartu Ringkasan (Lebar 2 kolom) */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Total Lamaran</CardTitle></CardHeader>
            <CardContent><div className="text-4xl font-bold">{applications.length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Dalam Proses</CardTitle></CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-600">
                {applications.filter(app => app.status === 'progress').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Interview</CardTitle></CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-yellow-600">
                {applications.filter(app => app.status === 'interview').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Ditolak</CardTitle></CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-600">
                {applications.filter(app => app.status === 'rejected').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Grafik (Lebar 1 kolom) */}
        <Card className="flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle className="text-sm text-gray-500 mb-[-20px]">Distribusi Status</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            {/* Panggil Komponen Grafik Disini */}
            <JobChart applications={applications} />
          </CardContent>
        </Card>

      </div>

      {/* SEARCH BAR (BARU) 🔍 */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm max-w-sm">
        <Search className="w-4 h-4 text-gray-500" />
        <Input 
          placeholder="Cari perusahaan atau posisi..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0"
        />
      </div>

      {/* Tabel Utama */}
      <Card className="shadow-lg border-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[200px]">Perusahaan</TableHead>
                <TableHead>Posisi</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="w-[180px]">Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">Memuat data...</TableCell>
                </TableRow>
              ) : filteredApplications.length === 0 ? (  // <-- Ubah jadi filteredApplications
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                    {search ? "Pencarian tidak ditemukan 😢" : "Belum ada data."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((app) => ( // <-- Ubah jadi filteredApplications
                  <TableRow key={app.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-bold text-gray-900">{app.company_name}</TableCell>
                    <TableCell>{app.role}</TableCell>
                    <TableCell>
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs border">
                        {app.platform}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">{app.date_applied}</TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={app.status} 
                        onValueChange={(val) => handleStatusChange(app.id, val)}
                      >
                        <SelectTrigger className={`h-8 w-[150px] border-none shadow-none focus:ring-0 ${getStatusColor(app.status)} bg-transparent`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="progress">In Progress ⏳</SelectItem>
                          <SelectItem value="interview">Interview 🤝</SelectItem>
                          <SelectItem value="rejected">Rejected ❌</SelectItem>
                          <SelectItem value="offering">Offering 💰</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Tombol Edit Baru */}
                        <EditJobDialog application={app} onJobUpdated={fetchApplications} />
                        
                        {/* Tombol Hapus Lama */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(app.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}