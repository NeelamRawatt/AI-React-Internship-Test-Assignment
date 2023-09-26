import React, { useState } from 'react';

function StoryForm({ onPromptSubmit }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
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
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default StoryForm;
