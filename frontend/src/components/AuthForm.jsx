import React from "react";
import "../styles/AuthForm.css";

function AuthForm({ title, fields, buttonText, onSubmit, footer, error }) {
  return (
    <div className="auth-container">
      <h2>{title}</h2>
      <form onSubmit={onSubmit}>
        {fields.map((field, idx) => (
          <div key={idx} className="form-group">
            <label>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              required
            />
          </div>
        ))}

        <button type="submit">{buttonText}</button>

        {/* 🔴 Error message inside container */}
        {error && <p className="error-text">{error}</p>}

        <div className="form-footer">{footer}</div>
      </form>
    </div>
  );
}

export default AuthForm;
