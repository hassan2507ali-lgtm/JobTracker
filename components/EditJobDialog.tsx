"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react" // Ikon Pensil
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

// Kita butuh tipe data ini biar Typescript gak marah
type Application = {
  id: string
  company_name: string
  role: string
  status: string
  date_applied: string
  platform: string
}

export default function EditJobDialog({ 
  application, 
  onJobUpdated 
}: { 
  application: Application, 
  onJobUpdated: () => void 
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    company_name: application.company_name,
    role: application.role,
    status: application.status,
    date_applied: application.date_applied,
    platform: application.platform
  })

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('applications')
      .update(formData) // <-- Bedanya disini: UPDATE bukan INSERT
      .eq('id', application.id) // <-- Cari yang ID-nya cocok

    setLoading(false)

    if (error) {
      alert("Gagal update: " + error.message)
    } else {
      setOpen(false)
      onJobUpdated() // Refresh dashboard
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Lamaran</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdate} className="grid gap-4 py-4">
          
          <div className="grid gap-2">
            <Label htmlFor="company">Nama Perusahaan</Label>
            <Input 
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Posisi / Role</Label>
            <Input 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(val) => setFormData({...formData, status: val})}
              >
                <SelectTrigger> <SelectValue /> </SelectTrigger>
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
              <Label>Tanggal</Label>
              <Input 
                type="date"
                value={formData.date_applied}
                onChange={(e) => setFormData({...formData, date_applied: e.target.value})}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Platform</Label>
            <Input 
              value={formData.platform}
              onChange={(e) => setFormData({...formData, platform: e.target.value})}
            />
          </div>

          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? "Menyimpan..." : "Update Data"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}