import { Handler } from '@netlify/functions';

interface DailyVisit {
  date: string;
  count: number;
}

interface CountryData {
  country: string;
  count: number;
}

const handler: Handler = async (event) => {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database configuration missing' }),
      };
    }

    // Get all visitors from last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const response = await fetch(
      `${supabaseUrl}/rest/v1/visitors?visited_at=gte.${thirtyDaysAgo}&select=visited_at,country`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Supabase error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch analytics' }),
      };
    }

    const data = await response.json();

    // Group by date
    const dailyVisits: Record<string, number> = {};
    data.forEach((visitor: any) => {
      if (visitor.visited_at) {
        const date = new Date(visitor.visited_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        dailyVisits[date] = (dailyVisits[date] || 0) + 1;
      }
    });

    // Group by country
    const countryCounts: Record<string, number> = {};
    data.forEach((visitor: any) => {
      if (visitor.country) {
        countryCounts[visitor.country] = (countryCounts[visitor.country] || 0) + 1;
      }
    });

    // Convert to arrays and sort
    const dailyVisitsArray: DailyVisit[] = Object.entries(dailyVisits)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const topCountries: CountryData[] = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      statusCode: 200,
      body: JSON.stringify({
        dailyVisits: dailyVisitsArray,
        topCountries: topCountries,
        totalVisitors: data.length,
      }),
    };
  } catch (error) {
    console.error('Analytics error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Analytics failed', details: String(error) }),
    };
  }
};

export { handler };
