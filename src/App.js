import React, { useState } from 'react';
import { fixJson } from './services/openai';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css'; // Ensure this path is correct
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
      const fixedJsonString = await fixJson(inputJson);
      console.log('Fixed JSON String:', fixedJsonString); // Log the fixed JSON string

      // Attempt to parse the JSON
      let parsedJson;
      try {
        parsedJson = JSON.parse(fixedJsonString);
        console.log('Parsed JSON:', parsedJson); // Log the parsed JSON
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

  const handleFormatJson = (json, setJson) => {
    try {
      const formattedJson = JSON.stringify(JSON.parse(json), null, 2);
      setJson(formattedJson);
    } catch (error) {
      setError('Invalid JSON format. Please check your input.');
    }
  };

  const handleFormatParsedJson = () => {
    if (fixedJson) {
      const formattedJsonString = JSON.stringify(fixedJson, null, 2);
      setFixedJson(JSON.parse(formattedJsonString));
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
            <button onClick={() => handleFormatJson(inputJson, setInputJson)}>Format JSON</button>
          </div>
        </div>
        <button className="fix-button" onClick={handleFixJson} disabled={loading}>
          {loading ? 'Fixing...' : 'Fix JSON'}
        </button>
        <div className="json-box">
          {fixedJson ? (
            <>
              <JSONPretty className="react-json-pretty" data={fixedJson} />
              <div className="buttons">
                <button onClick={handleCopy} disabled={!fixedJson}>Copy</button>
                <button onClick={handleFormatParsedJson} disabled={!fixedJson}>Format JSON</button>
              </div>
            </>
          ) : (
            <>
              <textarea
                readOnly
                placeholder="Fixed JSON will appear here..."
                className="react-json-pretty"
              />
              <div className="buttons">
                <button onClick={handleCopy} disabled={!fixedJson}>Copy</button>
                <button onClick={handleFormatParsedJson} disabled={!fixedJson}>Format JSON</button>
              </div>
            </>
          )}
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default App;
