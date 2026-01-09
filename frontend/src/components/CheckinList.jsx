import React from "react";

function CheckinList({ checkins }) {
  return (
    <div className="card checkin-card">
      <h3>Recent Check-ins</h3>
      {checkins.length > 0 ? (
        <ul>
          {checkins.slice(-7).reverse().map((c, i) => (
            <li key={i}>
              {new Date(c.timestamp).toLocaleDateString()} —{" "}
              <strong>{c.mood}</strong> {c.note && `(${c.note})`}
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent check-ins</p>
      )}
    </div>
  );
}

export default CheckinList;
