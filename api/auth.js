export default async function handler(req, res) {
  console.log("Iniciando autenticação..."); // Debug 1
  
  if (req.method !== 'GET') {
    console.log("Método errado:", req.method); // Debug 2
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { code } = req.query;
  console.log("Code recebido:", code); // Debug 3
  
  if (!code) {
    console.log("Código não fornecido"); // Debug 4
    return res.status(400).json({ error: 'Código não fornecido' });
  }

  try {
    const params = new URLSearchParams();
    params.append('client_id', process.env.CLIENT_ID || '1388158298305597483');
    params.append('client_secret', process.env.CLIENT_SECRET || 'lt5XoG0qH4os1YZeVsgAr0IZuU48A304');
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', process.env.REDIRECT_URI || 'https://lily-dashboard-five.vercel.app/callback.html');
    params.append('scope', 'identify email guilds');

    console.log("Params:", params.toString()); // Debug 5

    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json();
    console.log("Resposta do Discord:", data); // Debug 6
    
    if (!response.ok) {
      console.error("Erro do Discord:", data);
      return res.status(400).json({ 
        error: 'Discord API Error',
        details: data 
      });
    }

    return res.json({ token: data.access_token });
    
  } catch (error) {
    console.error("Erro completo:", error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      fullError: error.message 
    });
  }
}
