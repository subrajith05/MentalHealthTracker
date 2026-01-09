import React from "react";

function ResourceSuggestions({ suggestions }) {
  return (
    <div className="card resource-card">
      <h3>Resource Suggestions</h3>
      {suggestions ? (
        <>
          <p><strong>Based on your recent mood:</strong> {suggestions.mood}</p>
          {suggestions.resources.length > 0 ? (
            <ul>
              {suggestions.resources.map((res, idx) => (
                <li key={idx}>
                  <a href={res.link} target="_blank" rel="noopener noreferrer">
                    {res.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No specific resources found for this mood.</p>
          )}
        </>
      ) : (
        <p>No suggestions available yet.</p>
      )}
    </div>
  );
}

export default ResourceSuggestions;
