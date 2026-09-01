"use client";

import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";

const colors = ["#0f766e", "#2563eb", "#059669", "#e11d48", "#64748b"];

export function AdminCharts({ deptData, statusData }: { deptData: { name: string; value: number }[]; statusData: { name: string; value: number }[] }) {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <Card>
        <h2 className="mb-4 font-bold">Appointments by Department</h2>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={deptData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#0f766e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h2 className="mb-4 font-bold">Status Distribution</h2>
        <div className="h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90}>
                {statusData.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
