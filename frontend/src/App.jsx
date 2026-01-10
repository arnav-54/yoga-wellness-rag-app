import { useState } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setResponse(null);
    setError(null);
    
    try {
      const res = await fetch('http://localhost:3001/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setError('Unable to get answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Q&A App</h1>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question..."
          rows={4}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !question.trim()}>
          {loading ? 'Loading...' : 'Ask'}
        </button>
      </form>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {response && (
        <div className="response">
          {response.isUnsafe && (
            <div className="warning">
              ⚠️ This question may contain sensitive medical content.
            </div>
          )}
          
          <div className="answer">
            <h3>Answer:</h3>
            <p>{response.answer}</p>
          </div>

          <div className="sources">
            <h3>Sources:</h3>
            {response.sources.length > 0 ? (
              <ul>
                {response.sources.map((source, index) => (
                  <li key={index}>{source}</li>
                ))}
              </ul>
            ) : (
              <p>No sources available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;