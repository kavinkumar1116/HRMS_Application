import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';

const HealthCheck = () => {
  const [status, setStatus] = useState('Checking backend...');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await apiClient.get('/health');
        setStatus(response.data?.status ?? 'No status returned');
      } catch (err) {
        setError(err.response?.data?.detail || 'Unable to reach backend');
      }
    };

    fetchHealth();
  }, []);

  return (
    <section className="health-section">
      <h2>Backend Health</h2>
      {error ? <p className="error">{error}</p> : <p className="status">{status}</p>}
      <p>
        This page calls <code>GET /api/health</code> using the shared Axios client with JWT support.
      </p>
    </section>
  );
};

export default HealthCheck;

