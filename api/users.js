// api/users.js
let bios = {}; 

export default async function handler(req, res) {
  const q = req.query.q;
  if (req.method === 'GET') {
    if (q) {
      const all = Object.keys(bios).map(name => ({ username: name, bio: bios[name] }));
      const results = all.filter(u => u.username.toLowerCase().includes(q.toLowerCase()));
      return res.status(200).json(results);
    } else if (req.query.user) {
      const user = JSON.parse(req.query.user);
      return res.status(200).json({
        username: user.username + '#' + user.discriminator,
        avatar: user.avatarUrl,
        bio: bios[user.username] || ''
      });
    }
  } else if (req.method === 'POST') {
    const { user, bio } = await req.json();
    bios[user.username] = bio;
    return res.status(200).json({ ok: true });
  }
  res.status(400).send('Bad request');
}
