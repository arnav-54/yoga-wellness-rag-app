import { useState } from 'react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setResponse(null);
    setError(null);
    setFeedback(null);
    setFeedbackSent(false);

    try {
      const res = await fetch(`${API_BASE_URL}/ask`, {
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

  const handleFeedback = async (type) => {
    if (!response?.interactionId) return;

    setFeedback(type);

    try {
      await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interactionId: response.interactionId,
          feedback: type
        }),
      });
      setFeedbackSent(true);
    } catch (error) {
      console.error('Failed to send feedback', error);
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
          {loading ? 'Asking AI...' : 'Ask'}
        </button>
      </form>

      {loading && <div className="spinner"></div>}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {response && !loading && (
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

          <div className="feedback-section">
            <span>Was this helpful?</span>
            <div className="feedback-buttons">
              <button
                type="button"
                className={`feedback-btn ${feedback === 'positive' ? 'active' : ''}`}
                onClick={() => handleFeedback('positive')}
                disabled={feedbackSent}
              >
                👍
              </button>
              <button
                type="button"
                className={`feedback-btn ${feedback === 'negative' ? 'active' : ''}`}
                onClick={() => handleFeedback('negative')}
                disabled={feedbackSent}
              >
                👎
              </button>
            </div>
            {feedbackSent && <span className="feedback-message">Thanks for your feedback!</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;