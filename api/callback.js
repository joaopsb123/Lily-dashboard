export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) return res.status(400).json({ error: 'Faltando o code' });

  const params = new URLSearchParams();
  params.append('client_id', '1392176069070557365');
  params.append('client_secret', '0DNQT5RRwFYPtJ2rk1bQqqElmsIoHdM6');
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', 'https://lily-dashboard-bdgy.vercel.app/');
  params.append('scope', 'identify guilds');

  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });

  const tokenData = await tokenRes.json();

  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });

  const userData = await userRes.json();

  res.status(200).json(userData);
}
