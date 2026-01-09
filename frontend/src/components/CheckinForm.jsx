// src/components/CheckinForm.jsx
import React from "react";
import "../styles/AddCheckin.css";

function CheckinForm({ mood, note, setMood, setNote, message, onSubmit }) {
  const moods = ["happy", "sad", "stressed", "calm", "neutral"];

  return (
    <div className="checkin-container">
      <h2>Daily Check-In</h2>

      <form onSubmit={onSubmit}>
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
            rows="4"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a short note about your day..."
          />
        </div>

        <button type="submit">Submit Check-In</button>
      </form>

      {message && <p className="message-text">{message}</p>}
    </div>
  );
}

export default CheckinForm;
