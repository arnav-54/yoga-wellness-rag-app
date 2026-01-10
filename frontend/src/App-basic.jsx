import { useState } from 'react';

function App() {
  const [question, setQuestion] = useState('');

  return (
    <div className="app">
      <h1>Q&A App</h1>
      
      <form>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question..."
          rows={4}
        />
        <button type="submit">
          Ask
        </button>
      </form>
    </div>
  );
}

export default App;