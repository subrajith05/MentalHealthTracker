import React from "react";

function DashboardHeader({ onLogout }) {
  return (
    <header className="dashboard-header">
      <h1>Mental Health Dashboard</h1>
      <button className="logout-btn" onClick={onLogout}>Logout</button>
    </header>
  );
}

export default DashboardHeader;
