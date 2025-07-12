export default async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const { code } = req.query;
    
    // 1. Troca código por token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.VERCEL_URL
      })
    });

    const tokens = await tokenRes.json();

    // 2. Pega dados do usuário
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });

    const user = await userRes.json();

    // 3. Retorna dados simplificados
    res.json({
      username: `${user.username}#${user.discriminator}`,
      email: user.email || "Não disponível",
      avatar: user.avatar 
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : 'https://cdn.discordapp.com/embed/avatars/0.png'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
