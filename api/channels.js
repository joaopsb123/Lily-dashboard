export default async function handler(req, res) {
    const { guild_id } = req.query;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token || !guild_id) {
        return res.status(400).json({ error: 'Dados faltando' });
    }

    try {
        const response = await fetch(`https://discord.com/api/guilds/${guild_id}/channels`, {
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`
            }
        });
        
        if (!response.ok) throw new Error('Erro ao buscar canais');
        
        const channels = await response.json();
        res.status(200).json(channels);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro ao buscar canais' });
    }
}
