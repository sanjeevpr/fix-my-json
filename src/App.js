import React, { useState } from 'react';
import { fixJson } from './services/openai';
import { JSONTree } from 'react-json-tree';
import './App.css';

function App() {
  const [inputJson, setInputJson] = useState('');
  const [fixedJson, setFixedJson] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFixJson = async () => {
    try {
      setError(null); // Clear previous errors
      setLoading(true);
      try {
        const fixedJsonString = await fixJson(inputJson);
        const parsedJson = JSON.parse(fixedJsonString);
        setFixedJson(parsedJson);
      } catch (parsingError) {
        setError('Error parsing the fixed JSON. Please try again.');
        console.error('Error parsing JSON:', parsingError);
      }
    } catch (error) {
      setError('Failed to fix JSON. Please try again.');
      console.error('Error fixing JSON:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputJson('');
    setFixedJson(null);
    setError(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(fixedJson, null, 2));
  };

  const handleFormatJson = () => {
    try {
      const formattedJson = JSON.stringify(JSON.parse(inputJson), null, 2);
      setInputJson(formattedJson);
    } catch (error) {
      setError('Invalid JSON format. Please check your input.');
    }
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
          <div className="buttons">
            <button onClick={handleClear}>Clear</button>
            <button onClick={handleFormatJson}>Format JSON</button>
          </div>
        </div>
        <button className="fix-button" onClick={handleFixJson} disabled={loading}>
          {loading ? 'Fixing...' : 'Fix JSON'}
        </button>
        <div className="json-box">
          {fixedJson ? (
            <JSONTree data={fixedJson} />
          ) : (
            <textarea
              readOnly
              placeholder="Fixed JSON will appear here..."
            />
          )}
          <button onClick={handleCopy} disabled={!fixedJson}>Copy</button>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default App;
