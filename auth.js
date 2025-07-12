// api/auth.js
export default async (req, res) => {
  const redirectURL = new URL('https://discord.com/oauth2/authorize?client_id=1388158298305597483&response_type=code&redirect_uri=https%3A%2F%2Flily-dashboard2.vercel.app%2F&scope=identify+email+guilds');
  redirectURL.searchParams.set('client_id', '1388158298305597483');
  redirectURL.searchParams.set('redirect_uri', 'https://lily-dashboard2.vercel.app/dashboard.html');
  redirectURL.searchParams.set('response_type', 'code');
  redirectURL.searchParams.set('scope', 'identify email');

  res.writeHead(302, { Location: redirectURL.toString() });
  res.end();
};
