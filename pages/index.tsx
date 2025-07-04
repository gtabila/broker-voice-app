import React, { useState } from 'react';

export default function BrokerVoiceApp() {
  const [transcript, setTranscript] = useState('');
  const [loanScenario, setLoanScenario] = useState('');
  const [missingInfo, setMissingInfo] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleVoiceInput = async () => {
    setIsListening(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/transcribe', { method: 'POST' });
      const data = await response.json();
      setTranscript(data.transcript);
    } catch (err) {
      setErrorMessage('Transcription failed.');
    } finally {
      setIsListening(false);
    }
  };

  const handleGenerateScenario = async () => {
    try {
      const response = await fetch('/api/generate-loan-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });
      const data = await response.json();
      setLoanScenario(data.scenario);
      setMissingInfo(data.missingInfo);
    } catch (err) {
      setErrorMessage('Scenario generation failed.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h2>Voice Input</h2>
      <button onClick={handleVoiceInput} disabled={isListening}>
        🎤 {isListening ? 'Listening...' : 'Start Speaking'}
      </button>
      <textarea value={transcript} readOnly placeholder="Transcript" rows={4} style={{ width: '100%' }} />

      <h2>Loan Scenario</h2>
      <button onClick={handleGenerateScenario}>⚡ Generate Scenario</button>
      <textarea value={loanScenario} readOnly placeholder="Scenario" rows={6} style={{ width: '100%' }} />
      <textarea value={missingInfo} readOnly placeholder="Missing Info" rows={4} style={{ width: '100%' }} />

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </div>
  );
}
