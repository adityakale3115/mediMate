import React, { useState } from "react";
import { checkSymptoms } from "../services/api";

export default function SymptomForm() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await checkSymptoms(input);
    setResponse(res);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Describe your symptoms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Check</button>
      </form>
      {response && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Possible Issues:</strong>
          <ul>
            {response.diagnoses?.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
