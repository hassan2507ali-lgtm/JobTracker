"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Ini prop biar pas berhasil simpan, dashboard bisa refresh otomatis
export default function AddJobDialog({ onJobAdded }: { onJobAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // State untuk data formulir
  const [formData, setFormData] = useState({
    company_name: "",
    role: "",
    status: "applied", // Default status
    date_applied: new Date().toISOString().split('T')[0], // Default hari ini
    platform: "",
    job_link: "" // Opsional
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Kirim data ke Supabase
    const { error } = await supabase
      .from('applications')
      .insert([formData])

    setLoading(false)

    if (error) {
      alert("Gagal simpan: " + error.message)
    } else {
      setOpen(false) // Tutup popup
      onJobAdded() // Refresh data di dashboard
      // Reset form
      setFormData({
        company_name: "",
        role: "",
        status: "applied",
        date_applied: new Date().toISOString().split('T')[0],
        platform: "",
        job_link: ""
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white hover:bg-gray-800">
          + Tambah Lamaran
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Lamaran Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          {/* Nama Perusahaan */}
          <div className="grid gap-2">
            <Label htmlFor="company">Nama Perusahaan</Label>
            <Input 
              id="company" 
              required
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              placeholder="Contoh: Tokopedia" 
            />
          </div>

          {/* Posisi */}
          <div className="grid gap-2">
            <Label htmlFor="role">Posisi / Role</Label>
            <Input 
              id="role" 
              required
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              placeholder="Contoh: Backend Developer" 
            />
          </div>

          {/* Status & Tanggal (Sebelah-sebelahan) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(val) => setFormData({...formData, status: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="progress">In Progress ⏳</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="offering">Offering</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Tanggal Apply</Label>
              <Input 
                id="date" 
                type="date"
                required
                value={formData.date_applied}
                onChange={(e) => setFormData({...formData, date_applied: e.target.value})}
              />
            </div>
          </div>

          {/* Platform */}
          <div className="grid gap-2">
            <Label htmlFor="platform">Platform / Sumber</Label>
            <Input 
              id="platform" 
              value={formData.platform}
              onChange={(e) => setFormData({...formData, platform: e.target.value})}
              placeholder="Contoh: LinkedIn, Jobstreet" 
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Data"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}