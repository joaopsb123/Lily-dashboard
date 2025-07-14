// api/callback.js
const fetch = require('node-fetch');

const CLIENT_ID = '1392176069070557365'; // Seu client_id do Discord
const CLIENT_SECRET = 'ARWfBzUjAMjZoKIbZHjT9tUbeUk4HlZ6'; // Seu client_secret do Discord
const REDIRECT_URI = 'https://lily-dashboard-five.vercel.app/callback.html';

module.exports = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: 'Código OAuth2 ausente' });

  try {
    // Trocar code pelo token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) return res.status(400).json({ error: 'Erro no token', details: tokenData });

    const accessToken = tokenData.access_token;

    // Buscar dados do usuário e guilds
    const [userResponse, guildsResponse] = await Promise.all([
      fetch('https://discord.com/api/users/@me', { headers: { Authorization: `Bearer ${accessToken}` } }),
      fetch('https://discord.com/api/users/@me/guilds', { headers: { Authorization: `Bearer ${accessToken}` } }),
    ]);

    const user = await userResponse.json();
    const guilds = await guildsResponse.json();

    // Filtrar só servidores onde o user é admin (permissão 0x8)
    const adminGuilds = guilds.filter(guild => (guild.permissions & 0x8) === 0x8);

    return res.status(200).json({
      user: {
        ...user,
        avatarUrl: user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`,
      },
      guilds: adminGuilds,
      accessToken,
    });
  } catch (error) {
    console.error('Erro interno:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
};
