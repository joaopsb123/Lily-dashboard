export default async (req, res) => {
  const { code } = req.query;

  try {
    // 1. Troca código por token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.VERCEL_URL + "/dashboard.html"
      })
    });

    const tokens = await tokenRes.json();

    // 2. Pega dados do usuário E servidores
    const [userRes, guildsRes] = await Promise.all([
      fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      }),
      fetch("https://discord.com/api/users/@me/guilds", {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      })
    ]);

    const [user, guilds] = await Promise.all([
      userRes.json(),
      guildsRes.json()
    ]);

    // 3. Filtra apenas servidores com permissão de administrador
    const managedGuilds = guilds.filter(g => (g.permissions & 0x8) === 0x8);

    res.json({
      user: {
        username: `${user.username}#${user.discriminator}`,
        email: user.email || "Privado",
        avatar: user.avatar 
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
          : 'https://cdn.discordapp.com/embed/avatars/0.png'
      },
      guilds: managedGuilds
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
