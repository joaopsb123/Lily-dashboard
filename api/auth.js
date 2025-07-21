// api/auth.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Código não fornecido' });
    }

    try {
        const data = {
            client_id: process.env.CLIENT_ID || '1388158298305597483',
            client_secret: process.env.CLIENT_SECRET || 'lt5XoG0qH4os1YZeVsgAr0IZuU48A304',
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.REDIRECT_URI || 'https://lily-dashboard-five.vercel.app/callback.html',
            scope: 'identify email guilds'
        };

        const response = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams(data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const tokenData = await response.json();
        
        if (!response.ok) {
            throw new Error(tokenData.error_description || 'Falha na autenticação');
        }

        res.status(200).json({ token: tokenData.access_token });
    } catch (error) {
        console.error('Erro na autenticação:', error);
        res.status(500).json({ error: error.message });
    }
}
