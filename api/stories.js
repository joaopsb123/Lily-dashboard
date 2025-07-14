// api/stories.js
let stories = []; 
let storyId = 1; 

export default async function handler(req, res) {
  const user = JSON.parse(req.query.user || '{}');
  if (req.method === 'POST') {
    const data = await req.json();
    stories.push({ id: storyId++, user: user.username, avatar: user.avatarUrl, image: data.image, ts: Date.now() });
    stories = stories.filter(s => Date.now() - s.ts < 24*60*60*1000);
    return res.status(201).json({ ok: true });
  } else if (req.method === 'GET') {
    const recent = stories.filter(s => Date.now() - s.ts < 24*60*60*1000);
    return res.status(200).json(recent);
  }
  res.status(400).send('Bad request');
}
