export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { code } = req.query;
    
    if (!code) {
        return res.status(400).json({ error: 'Código não fornecido' });
    }

    try {
        const params = new URLSearchParams();
        params.append('client_id', process.env.CLIENT_ID);
        params.append('client_secret', process.env.CLIENT_SECRET);
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', process.env.REDIRECT_URI);
        params.append('scope', 'identify email guilds');

        const response = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Erro do Discord:', data);
            return res.status(400).json({ error: data.error_description });
        }

        // Obter informações do usuário
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${data.token_type} ${data.access_token}`,
            },
        });
        
        const user = await userResponse.json();
        
        // Aqui você pode salvar o usuário na sessão ou DB
        return res.json({ 
            token: data.access_token,
            user: {
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Erro completo:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
}
