import React from "react";

function SummaryCard({ summary }) {
  if (!summary) return (
    <div className="card summary-card">
      <h3>Weekly Summary</h3>
      <p>No summary available</p>
    </div>
  );

  const mostFrequentMood = Object.entries(summary.mood_counts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return (
    <div className="card summary-card">
      <h3>Weekly Summary</h3>
      <p><strong>Total Check-ins:</strong> {summary.total_checkins}</p>
      <p><strong>Most Frequent Mood:</strong> {mostFrequentMood}</p>
    </div>
  );
}

export default SummaryCard;
