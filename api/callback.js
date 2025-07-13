// Mini "database" em memória (substitua por um banco de dados real em produção)
const botGuildsDatabase = new Set([
  // Adicione aqui os IDs dos servidores onde o bot está presente
  // Exemplo: '123456789012345678'
]);

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

    if (!tokenResponse.ok) {
      console.error('Erro no token:', tokenData);
      return res.status(400).json({
        error: 'Erro ao obter token',
        debug: tokenData
      });
    }

    // Buscar informações do usuário e servidores
    const [userResponse, guildsResponse] = await Promise.all([
      fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      }),
      fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      })
    ]);

    if (!userResponse.ok || !guildsResponse.ok) {
      const userError = await userResponse.json().catch(() => ({}));
      const guildsError = await guildsResponse.json().catch(() => ({}));
      console.error('Erros:', { userError, guildsError });
      return res.status(400).json({
        error: 'Erro ao buscar dados do Discord',
        debug: { userError, guildsError }
      });
    }

    const user = await userResponse.json();
    const guilds = await guildsResponse.json();

    // Marcar servidores onde o bot está presente (usando nossa "database")
    const guildsWithBotInfo = guilds.map(guild => ({
      ...guild,
      hasBot: botGuildsDatabase.has(guild.id),
      isAdmin: (guild.permissions & 0x8) === 0x8 || guild.owner
    }));

    return res.status(200).json({ 
      user: {
        ...user,
        avatarUrl: user.avatar 
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`
      },
      guilds: guildsWithBotInfo.filter(g => g.isAdmin) // Mostrar apenas servidores onde é admin
    });
  } catch (err) {
    console.error('Erro interno:', err);
    return res.status(500).json({ 
      error: 'Erro interno no servidor',
      debug: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
