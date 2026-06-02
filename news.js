// api/news.js — Vercel serverless function
// This runs on the SERVER so the RSS2JSON API key is never exposed to users

const FEEDS = [
  { url: 'https://www.forexlive.com/feed/news',                         name: 'ForexLive' },
  { url: 'https://www.fxstreet.com/rss/news',                           name: 'FXStreet' },
  { url: 'https://feeds.reuters.com/reuters/businessNews',              name: 'Reuters' },
  { url: 'https://feeds.content.dowjones.io/public/rss/mw_marketpulse', name: 'MarketWatch' },
  { url: 'https://www.investing.com/rss/news_25.rss',                   name: 'Investing.com' },
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml',              name: 'BBC Business' },
  { url: 'https://finance.yahoo.com/news/rssindex',                     name: 'Yahoo Finance' },
];

async function fetchFeed(feed, apiKey) {
  const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&count=15&api_key=${apiKey}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.status !== 'ok' && data.status !== 'ok2') throw new Error(data.message || 'feed error');
  return (data.items || []).map(item => ({
    id:       item.link,
    headline: (item.title || '').replace(/<[^>]+>/g, '').trim(),
    snippet:  (item.description || '').replace(/<[^>]+>/g, '').trim().slice(0, 280),
    source:   feed.name,
    url:      item.link,
    pubDate:  item.pubDate,
  }));
}

export default async function handler(req, res) {
  // Allow any origin so the hosted frontend can call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');

  const apiKey = process.env.RSS2JSON_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'RSS2JSON_KEY environment variable not set' });
  }

  const results = [];
  const statuses = [];

  await Promise.allSettled(FEEDS.map(async feed => {
    try {
      const items = await fetchFeed(feed, apiKey);
      results.push(...items);
      statuses.push({ name: feed.name, ok: true, count: items.length });
    } catch (e) {
      statuses.push({ name: feed.name, ok: false, error: e.message });
    }
  }));

  // Sort newest first
  results.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  return res.status(200).json({ items: results, statuses, fetchedAt: new Date().toISOString() });
}
