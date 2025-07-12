export default async (req, res) => {
  const { code } = req.query;

  // 1. Verifica se há um código
  if (!code) {
    return res.status(400).json({ error: "Código de autenticação não fornecido" });
  }

  try {
    // 2. Troca o código por um token de acesso
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
        redirect_uri: "https://lily-dashboard2.vercel.app/",
      }),
    });

    const tokenData = await tokenResponse.json();

    // 3. Obtém dados do usuário
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    // 4. Retorna os dados formatados
    res.json({
      username: `${userData.username}#${userData.discriminator}`,
      email: userData.email || null,
      avatar: userData.avatar 
        ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
        : 'https://cdn.discordapp.com/embed/avatars/0.png'
    });

  } catch (error) {
    console.error("Erro na autenticação:", error);
    res.status(500).json({ error: "Falha ao autenticar com Discord" });
  }
};
