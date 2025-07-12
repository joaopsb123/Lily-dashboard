export default async (req, res) => {
  const { code } = req.query;

  try {
    // 1. Troca o código por um token de acesso
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "https://lily-dashboard2.vercel.app/dashboard.html",
      }),
    });

    const tokenData = await tokenResponse.json();

    // 2. Obtém dados do usuário
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    // 3. Retorna os dados do usuário
    res.json({
      username: `${userData.username}#${userData.discriminator}`,
      email: userData.email || "Não disponível",
      avatar: userData.avatar 
        ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
        : 'https://cdn.discordapp.com/embed/avatars/0.png'
    });

  } catch (error) {
    console.error("Erro na autenticação:", error);
    res.status(500).json({ error: "Falha na autenticação" });
  }
};
