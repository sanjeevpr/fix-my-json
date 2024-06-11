import React, { useState } from 'react';
import { fixJson } from './services/openai';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy as syntaxTheme } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './App.css';

function App() {
  const [inputJson, setInputJson] = useState('');
  const [fixedJson, setFixedJson] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFixJson = async () => {
    try {
      setError(null);
      setLoading(true);
      const fixedJsonString = await fixJson(inputJson);
      let parsedJson;
      try {
        parsedJson = JSON.parse(fixedJsonString);
        setFixedJson(parsedJson);
      } catch (parsingError) {
        setError('Error parsing the fixed JSON. Please try again.');
      }
    } catch (error) {
      setError('Failed to fix JSON. Please try again.');
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
        <div className="json-box input-box">
          <div className="toolbar">
            <button onClick={handleClear}>Clear</button>
            <button onClick={() => handleFormatJson(inputJson, setInputJson)}>Format JSON</button>
          </div>
          <div className="editor-container">
            <SyntaxHighlighter language="json" style={syntaxTheme} customStyle={{ backgroundColor: 'inherit', color: 'inherit' }}>
              {inputJson}
            </SyntaxHighlighter>
            <textarea
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              placeholder="Paste your broken JSON here..."
              className="editor-textarea"
            />
          </div>
        </div>
        <div className="fix-button-container">
          <button className="fix-button" onClick={handleFixJson} disabled={loading}>
            {loading ? 'Fixing...' : 'Fix JSON'}
          </button>
        </div>
        <div className="json-box output-box">
          <div className="toolbar">
            <button onClick={handleCopy} disabled={!fixedJson}>Copy</button>
            <button onClick={handleFormatParsedJson} disabled={!fixedJson}>Format JSON</button>
          </div>
          {fixedJson ? (
            <>
              <div className="json-preview">
                <SyntaxHighlighter language="json" style={syntaxTheme} customStyle={{ backgroundColor: 'inherit', color: 'inherit' }}>
                  {JSON.stringify(fixedJson, null, 2)}
                </SyntaxHighlighter>
              </div>
            </>
          ) : (
            <>
              <div className="placeholder">Fixed JSON will appear here...</div>
            </>
          )}
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default App;
