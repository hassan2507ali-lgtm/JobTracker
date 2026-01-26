"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import AddJobDialog from "@/components/AddJobDialog"
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
import { Trash2 } from "lucide-react"

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

    // Hapus dari layar dulu (Optimistic UI)
    setApplications(apps => apps.filter(app => app.id !== id))

    // Hapus dari database
    const { error } = await supabase.from('applications').delete().eq('id', id)
    if (error) {
      alert("Gagal menghapus!")
      fetchApplications()
    }
  }

  // 3. Fungsi Update Status
  const handleStatusChange = async (id: string, newStatus: string) => {
    // Update di layar dulu
    setApplications(apps => 
      apps.map(app => app.id === id ? { ...app, status: newStatus } : app)
    )

    // Update ke database
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      alert("Gagal update status")
      fetchApplications()
    }
  }

  // Warna Status (Termasuk Ungu Progress buatanmu)
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied': return 'text-blue-600 font-medium'
      case 'progress': return 'text-purple-600 font-bold' // <-- Ungu
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

      {/* Ringkasan Dashboard (Ada 4 Kartu) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Total Lamaran</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{applications.length}</div></CardContent>
        </Card>
        
        {/* Kartu Progress Baru Kamu */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Dalam Proses</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {applications.filter(app => app.status === 'progress').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Interview</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {applications.filter(app => app.status === 'interview').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Ditolak</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {applications.filter(app => app.status === 'rejected').length}
            </div>
          </CardContent>
        </Card>
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
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                    Belum ada data.
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow key={app.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-bold text-gray-900">{app.company_name}</TableCell>
                    <TableCell>{app.role}</TableCell>
                    <TableCell>
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs border">
                        {app.platform}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">{app.date_applied}</TableCell>
                    
                    {/* Kolom Status (Dropdown) */}
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

                    {/* Kolom Hapus */}
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(app.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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