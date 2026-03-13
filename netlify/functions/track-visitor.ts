import { Handler } from '@netlify/functions';

interface VisitorData {
  pageUrl: string;
  referrer: string;
  userAgent: string;
  timestamp: string;
  country: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  ip_address: string;
}

const handler: Handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const clientIP = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';
    const pageUrl = event.body ? JSON.parse(event.body).page || '' : '';

    // Get geolocation data from ipapi.co
    let geoData: any = { country_name: 'Unknown', city: 'Unknown' };
    try {
      const geoResponse = await fetch(`https://ipapi.co/${clientIP}/json/`);
      geoData = await geoResponse.json();
    } catch (geoError) {
      console.log('Geolocation API error:', geoError);
    }

    const visitorData: VisitorData = {
      pageUrl: pageUrl,
      referrer: event.headers.referer || '',
      userAgent: event.headers['user-agent'] || '',
      timestamp: new Date().toISOString(),
      country: geoData.country_name || 'Unknown',
      city: geoData.city || 'Unknown',
      latitude: geoData.latitude || null,
      longitude: geoData.longitude || null,
      ip_address: clientIP,
    };

    // Insert into Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database configuration missing' }),
      };
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/visitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        ip_address: visitorData.ip_address,
        country: visitorData.country,
        city: visitorData.city,
        latitude: visitorData.latitude,
        longitude: visitorData.longitude,
        page_url: visitorData.pageUrl,
        user_agent: visitorData.userAgent,
        visited_at: visitorData.timestamp,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Supabase error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to store visitor data' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, visitor: visitorData }),
    };
  } catch (error) {
    console.error('Tracking error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Tracking failed', details: String(error) }),
    };
  }
};

export { handler };
