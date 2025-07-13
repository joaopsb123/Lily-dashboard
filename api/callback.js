export default async function handler(req, res) {
  const code = req.query.code;
  const redirect_uri = 'https://lily-dashboard-five.vercel.app/callback.html';

  if (!code) return res.status(400).json({ error: 'Código ausente' });

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID || '1392176069070557365',
        client_secret: process.env.DISCORD_CLIENT_SECRET || '0DNQT5RRwFYPtJ2rk1bQqqElmsIoHdM6',
        grant_type: 'authorization_code',
        code,
        redirect_uri
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({
        error: 'Token inválido',
        debug: tokenData
      });
    }

    // Adicionando verificação se o bot está no servidor
    const [user, guilds, botGuilds] = await Promise.all([
      fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      }).then(res => res.json()),
      fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      }).then(res => res.json()),
      fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }
      }).then(res => res.json()).catch(() => [])
    ]);

    // Marcando servidores onde o bot está presente
    const guildsWithBotInfo = guilds.map(guild => ({
      ...guild,
      hasBot: botGuilds.some(bg => bg.id === guild.id)
    }));

    return res.status(200).json({ user, guilds: guildsWithBotInfo });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno', debug: err.message });
  }
}
