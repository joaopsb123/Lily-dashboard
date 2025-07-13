export default async function handler(req, res) {
  const code = req.query.code;
  const redirect_uri = 'https://lily-dashboard-five.vercel.app/callback.html';

  if (!code) return res.status(400).json({ error: 'Código ausente' });

  try {
    // Trocar o code por um access_token
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

    const userRequest = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const guildsRequest = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const user = await userRequest.json();
    const guilds = await guildsRequest.json();

    // Por enquanto marcamos hasBot false — ajuste isso depois via banco do bot
    const guildsWithBotInfo = guilds.map(guild => ({
      ...guild,
      hasBot: false
    }));

    return res.status(200).json({ user, guilds: guildsWithBotInfo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno', debug: err.message });
  }
}
