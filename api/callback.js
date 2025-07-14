// Mini "database" em memória (substitua por BD real em produção)
const botGuildsDatabase = new Set([
  // IDs dos servidores onde o bot está
  // Ex: '123456789012345678'
]);

export default async function handler(req, res) {
  const code = req.query.code;
  const redirect_uri = process.env.DISCORD_REDIRECT_URI;
  if (!code) return res.status(400).json({ error: 'Código ausente' });

  try {
    // Troca code por access_token
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type:    'authorization_code',
        code,
        redirect_uri
      })
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) return res.status(400).json({ error: 'Erro token', debug: tokenData });

    // Busca dados do usuário e guilds
    const [userRes, guildsRes] = await Promise.all([
      fetch('https://discord.com/api/users/@me',     { headers: { Authorization: `Bearer ${tokenData.access_token}` } }),
      fetch('https://discord.com/api/users/@me/guilds', { headers: { Authorization: `Bearer ${tokenData.access_token}` } })
    ]);
    const user = await userRes.json();
    const guilds= await guildsRes.json();
    // Marca onde o bot está
    const guildsInfo = guilds.map(g=>({
      ...g,
      hasBot: botGuildsDatabase.has(g.id),
      isAdmin: (g.permissions & 0x8) === 0x8 || g.owner
    })).filter(g=>g.isAdmin);

    return res.status(200).json({
      user: {
        ...user,
        avatarUrl: user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`
      },
      guilds: guildsInfo
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
