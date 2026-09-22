// src/components/CheckinForm.jsx
import React from "react";
import "../styles/AddCheckin.css";

function CheckinForm({
  mood,
  note,
  setMood,
  setNote,
  message,
  onSubmit,
  submitting,
}) {
  const moods = ["happy", "sad", "stressed", "calm", "neutral"];

  return (
    <div className="checkin-card">
      <h3>Add Check-in</h3>

      <form onSubmit={onSubmit} className="checkin-form">
        <div className="form-group">
          <label htmlFor="mood">Mood</label>

          <select
            id="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            required
          >
            <option value="">-- Select your mood --</option>

            {moods.map((m) => (
              <option key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="note">Note (optional)</label>

          <textarea
            id="note"
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a short note about your day..."
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Check-in"}
        </button>
      </form>

      {message && <div className="success-toast">{message}</div>}
    </div>
  );
}

export default CheckinForm;