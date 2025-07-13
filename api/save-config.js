import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const config = req.body;
  if (!config.guildId) return res.status(400).json({ error: 'Guild ID ausente' });

  const filePath = path.resolve('./configs/guilds.json');

  let configs = {};
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    configs = JSON.parse(data);
  } catch {}

  configs[config.guildId] = {
    welcome: !!config.welcome,
    leave: !!config.leave,
    ticket: !!config.ticket
  };

  try {
    fs.writeFileSync(filePath, JSON.stringify(configs, null, 2));
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar config', debug: err.message });
  }
}
