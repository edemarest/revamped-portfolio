import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './AnalyticsDashboard.module.css';

interface DailyVisit {
  date: string;
  count: number;
}

interface CountryData {
  country: string;
  count: number;
}

interface AnalyticsData {
  dailyVisits: DailyVisit[];
  topCountries: CountryData[];
  totalVisitors: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'];

export const AnalyticsDashboard = () => {
  const [data, setData] = useState<AnalyticsData>({
    dailyVisits: [],
    topCountries: [],
    totalVisitors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString());

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/.netlify/functions/get-analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const analytics = await response.json();
      setData(analytics);
      setLastUpdate(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Refresh every 60 seconds
    const interval = setInterval(fetchAnalytics, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading analytics...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>📊 Portfolio Analytics</h1>
        <p className={styles.subtitle}>Visitor insights from the last 30 days</p>
        <p className={styles.lastUpdate}>Last updated: {lastUpdate}</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>Total Visitors</h3>
          <p className={styles.statNumber}>{data.totalVisitors}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Top Country</h3>
          <p className={styles.statNumber}>
            {data.topCountries.length > 0 ? data.topCountries[0].country : 'N/A'}
          </p>
        </div>
        <div className={styles.statCard}>
          <h3>Countries</h3>
          <p className={styles.statNumber}>{data.topCountries.length}</p>
        </div>
      </div>

      <div className={styles.chartsContainer}>
        {/* Daily Visitors Chart */}
        {data.dailyVisits.length > 0 && (
          <div className={styles.chartWrapper}>
            <h2>Visitors by Day</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.dailyVisits}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 100, 100, 0.2)" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 30, 0.9)',
                    border: '1px solid rgba(100, 150, 200, 0.3)',
                    borderRadius: '6px',
                  }}
                  labelStyle={{ color: '#e0e0e0' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#0088FE"
                  dot={{ fill: '#0088FE' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Countries Chart */}
        {data.topCountries.length > 0 && (
          <div className={styles.chartWrapper}>
            <h2>Top Countries</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.topCountries}
                  dataKey="count"
                  nameKey="country"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(props) => `${props.payload.country} (${props.payload.count})`}
                >
                  {data.topCountries.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 30, 0.9)',
                    border: '1px solid rgba(100, 150, 200, 0.3)',
                    borderRadius: '6px',
                  }}
                  labelStyle={{ color: '#e0e0e0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className={styles.countryTable}>
        <h2>All Countries</h2>
        <table>
          <thead>
            <tr>
              <th>Country</th>
              <th>Visitors</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {data.topCountries.map((country) => (
              <tr key={country.country}>
                <td>{country.country}</td>
                <td>{country.count}</td>
                <td>
                  {data.totalVisitors > 0
                    ? ((country.count / data.totalVisitors) * 100).toFixed(1)
                    : 0}
                  %
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={fetchAnalytics} className={styles.refreshBtn}>
        🔄 Refresh Now
      </button>
    </div>
  );
};
