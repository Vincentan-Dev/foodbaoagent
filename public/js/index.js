import React, { useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace '/your-endpoint' with an actual ORDS endpoint path
      const response = await fetch('/api/ords/your-endpoint');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>ORDS Data Fetcher</h1>
      <button 
        onClick={fetchData}
        disabled={loading}
        style={{ padding: '10px 20px', margin: '20px 0' }}
      >
        {loading ? 'Loading...' : 'Fetch Data from ORDS'}
      </button>
      
      {error && (
        <div style={{ color: 'red', margin: '20px 0' }}>
          Error: {error}
        </div>
      )}
      
      {data && (
        <div>
          <h2>Data from ORDS:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}