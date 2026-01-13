import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MacroChartProps {
  protein: number;
  carbs: number;
  fat: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b']; // Blue (Protein), Green (Carbs), Amber (Fat)

export const MacroChart: React.FC<MacroChartProps> = ({ protein, carbs, fat }) => {
  const data = [
    { name: 'โปรตีน (g)', value: protein },
    { name: 'คาร์บ (g)', value: carbs },
    { name: 'ไขมัน (g)', value: fat },
  ];

  // Filter out zero values to avoid empty chart segments
  const activeData = data.filter(d => d.value > 0);

  if (activeData.length === 0) {
    return <div className="text-gray-400 text-sm text-center py-4">ไม่มีข้อมูลโภชนาการ</div>;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={activeData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {activeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};