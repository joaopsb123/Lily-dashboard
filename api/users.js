// api/users.js
let bios = {}; 

export default async function handler(req, res) {
  const q = (req.query.q || '').toLowerCase();
  const userParam = req.query.user;
  let currentUser = null;

  if (userParam) {
    try {
      currentUser = JSON.parse(userParam);
    } catch {}
  }

  if (req.method === 'GET') {
    // Monta lista de usuários do "banco"
    const all = Object.keys(bios).map(name => ({
      username: name,
      bio: bios[name] || ''
    }));

    // Se veio currentUser, assegura que esteja na lista
    if (currentUser) {
      const uname = `${currentUser.username}#${currentUser.discriminator}`;
      if (!all.find(u => u.username === uname)) {
        all.push({ username: uname, bio: bios[currentUser.username] || '' });
      }
    }

    // Filtra pela query
    const results = q
      ? all.filter(u => u.username.toLowerCase().includes(q))
      : all;

    return res.status(200).json(results);
  }

  // Grava bio
  if (req.method === 'POST') {
    const { user, bio } = await req.json();
    bios[user.username] = bio;
    return res.status(200).json({ ok: true });
  }

  res.status(400).send('Bad request');
}
