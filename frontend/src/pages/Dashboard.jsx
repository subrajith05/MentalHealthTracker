import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import SummaryCard from "../components/SummaryCard";
import MoodChart from "../components/MoodChart";
import PatternsCard from "../components/PatternsCard";
import CheckinList from "../components/CheckinList";
import ResourceSuggestions from "../components/ResourceSuggestions";
import CheckinForm from "../components/CheckinForm";
import Chatbot from "../components/Chatbot";
import api from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {
  const [checkins, setCheckins] = useState([]);
  const [summary, setSummary] = useState(null);
  const [patterns, setPatterns] = useState({});
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState("");
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [checkData, summaryData, patternData, suggestionData] =
        await Promise.all([
          api.get("/checkin/show", config),
          api.get("/checkin/summary", config),
          api.get("/checkin/patterns", config),
          api.get("/resources/suggestions", config),
        ]);

      setCheckins(checkData.data);
      setSummary(summaryData.data);
      setPatterns(patternData.data.patterns || {});
      setSuggestions(suggestionData.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load dashboard");
    }
  };

  const handleCheckinSubmit = async (e) => {
    e.preventDefault();

    if (!mood) return;

    try {
      setSubmitting(true);
      setMessage("");
      setError("");

      await api.post("/checkin/add", {
        mood,
        note,
      });

      setMood("");
      setNote("");

      setMessage("Check-in added successfully!");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      await loadDashboard();

      // Refresh dashboard data
      await loadDashboard();

    } catch (err) {
      setMessage(
        err.response?.data?.detail ||
        "Failed to add check-in."
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

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
          <CheckinForm
            mood={mood}
            note={note}
            setMood={setMood}
            setNote={setNote}
            message={message}
            onSubmit={handleCheckinSubmit}
            submitting={submitting}
          />
        </div>
      </main>

      <Chatbot />
    </div>
  );
}

export default Dashboard;