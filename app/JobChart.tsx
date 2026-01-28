"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

type Application = {
  status: string
}

export default function JobChart({ applications }: { applications: Application[] }) {
  
  // 1. Hitung jumlah setiap status
  const dataCounts = applications.reduce((acc: any, app) => {
    const status = app.status || 'applied'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  // 2. Ubah format data biar dimengerti Recharts
  const data = [
    { name: 'Applied', value: dataCounts['applied'] || 0, color: '#3b82f6' },   // Biru
    { name: 'Progress', value: dataCounts['progress'] || 0, color: '#a855f7' }, // Ungu
    { name: 'Interview', value: dataCounts['interview'] || 0, color: '#eab308' }, // Kuning
    { name: 'Offering', value: dataCounts['offering'] || 0, color: '#22c55e' },  // Hijau
    { name: 'Rejected', value: dataCounts['rejected'] || 0, color: '#ef4444' },   // Merah
  ].filter(item => item.value > 0) // Hapus yang nilainya 0 biar grafik gak aneh

  if (applications.length === 0) {
    return <div className="text-center text-gray-400 py-10">Belum ada data grafik</div>
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60} // Biar bolong tengahnya (Donut Chart)
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}