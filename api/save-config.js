export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { guildId, config } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token || !guildId || !config) {
        return res.status(400).json({ error: 'Dados faltando' });
    }

    try {
        // Aqui você salvaria no seu banco de dados
        // Exemplo com MongoDB:
        /*
        await db.collection('guild_configs').updateOne(
            { guildId },
            { $set: config },
            { upsert: true }
        );
        */
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro ao salvar configurações' });
    }
}
