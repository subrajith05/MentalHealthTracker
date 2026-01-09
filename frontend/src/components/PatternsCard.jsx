import React from "react";

function PatternsCard({ patterns }) {
  return (
    <div className="card patterns-card">
      <h3>Day-wise Patterns</h3>
      {Object.keys(patterns).length > 0 ? (
        <ul>
          {Object.entries(patterns).map(([day, mood]) => (
            <li key={day}>
              <strong>{day}</strong>: {mood}
            </li>
          ))}
        </ul>
      ) : (
        <p>No pattern data</p>
      )}
    </div>
  );
}

export default PatternsCard;
