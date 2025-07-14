export default async function handler(req, res) {
  const code = req.query.code;
  const redirect_uri = 'https://lily-dashboard-five.vercel.app/callback.html';

  if (!code) return res.status(400).json({ error: 'Código ausente' });

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: '1392176069070557365',
        client_secret: 'ARWfBzUjAMjZoKIbZHjT9tUbeUk4HlZ6',
        grant_type: 'authorization_code',
        code,
        redirect_uri
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(400).json({ error: 'Erro ao obter token', debug: tokenData });
    }

    const [userRes, guildsRes] = await Promise.all([
      fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      }),
      fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      })
    ]);

    const user = await userRes.json();
    const guilds = await guildsRes.json();

    return res.status(200).json({
      user: {
        ...user,
        avatarUrl: user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`
      },
      guilds: guilds.filter(g => (g.permissions & 0x8) === 0x8 || g.owner)
    });
  } catch (err) {
    res.status(500).send('A server error occurred');
  }
}
