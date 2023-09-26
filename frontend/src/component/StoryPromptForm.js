import React, { useState } from "react";
import "../StoryPromptForm.css";

function StoryPromptForm({ onPromptSubmit }) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    onPromptSubmit(prompt);
  };

  return (
    <div className="story-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Generate story</button>
      </form>
    </div>
  );
}

export default StoryPromptForm;
