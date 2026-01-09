import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import SummaryCard from "../components/SummaryCard";
import MoodChart from "../components/MoodChart";
import PatternsCard from "../components/PatternsCard";
import CheckinList from "../components/CheckinList";
import ResourceSuggestions from "../components/ResourceSuggestions";
import "../styles/Dashboard.css";

function Dashboard() {
  const [checkins, setCheckins] = useState([]);
  const [summary, setSummary] = useState(null);
  const [patterns, setPatterns] = useState({});
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchWithToken = async (endpoint) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    const res = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed: " + res.statusText);
    return await res.json();
  };

  const loadDashboard = async () => {
    try {
      const [checkData, summaryData, patternData, suggestionData] = await Promise.all([
        fetchWithToken("http://localhost:8000/checkin/show"),
        fetchWithToken("http://localhost:8000/checkin/summary"),
        fetchWithToken("http://localhost:8000/checkin/patterns"),
        fetchWithToken("http://localhost:8000/resources/suggestions"),
      ]);
      setCheckins(checkData);
      setSummary(summaryData);
      setPatterns(patternData.patterns || {});
      setSuggestions(suggestionData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <DashboardHeader onLogout={handleLogout} />
      {error && <p className="error-text">{error}</p>}
      <main className="dashboard-content">
        <div className="dashboard-grid">
          <SummaryCard summary={summary} />
          <MoodChart summary={summary} />
          <PatternsCard patterns={patterns} />
          <CheckinList checkins={checkins} />
          <ResourceSuggestions suggestions={suggestions} />
        </div>
      </main>

      <Link to="/add-checkin" className="add-btn">+ Add Check-in</Link>
    </div>
  );
}

export default Dashboard;
