import React, { useState } from 'react';
import { fixJson } from './services/openai';
import './App.css';

function App() {
  const [inputJson, setInputJson] = useState('');
  const [fixedJson, setFixedJson] = useState('');
  const [error, setError] = useState(null);

  const handleFixJson = async () => {
    try {
      setError(null); // Clear previous errors
      const fixedJson = await fixJson(inputJson);
      setFixedJson(fixedJson);
    } catch (error) {
      setError('Failed to fix JSON. Please try again.');
      console.error('Error fixing JSON:', error);
    }
  };

  const handleClear = () => {
    setInputJson('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fixedJson);
  };

  return (
    <div className="App">
      <h1>FixMyJSON</h1>
      <div className="json-container">
        <div className="json-box">
          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="Paste your broken JSON here..."
          />
          <button onClick={handleClear}>Clear</button>
        </div>
        <button className="fix-button" onClick={handleFixJson}>Fix JSON</button>
        <div className="json-box">
          <textarea
            value={fixedJson}
            readOnly
            placeholder="Fixed JSON will appear here..."
          />
          <button onClick={handleCopy}>Copy</button>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default App;
