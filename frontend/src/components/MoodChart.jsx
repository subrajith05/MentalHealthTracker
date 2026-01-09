import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";

function MoodChart({ summary }) {
  const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#f59e0b", "#9333ea", "#0ea5e9"];

  if (!summary || !summary.mood_counts)
    return (
      <div className="card chart-card">
        <h3>Mood Distribution</h3>
        <p>No data yet</p>
      </div>
    );

  const data = Object.entries(summary.mood_counts).map(([name, value]) => ({ name, value }));

  return (
    <div className="card chart-card">
      <h3>Mood Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={90}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MoodChart;
