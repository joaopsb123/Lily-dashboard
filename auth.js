// /api/auth
import { cookies } from 'next/headers';

export async function GET() {
  const authUrl = new URL('https://discord.com/oauth2/authorize');
  authUrl.searchParams.set('client_id', process.env.DISCORD_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', `${process.env.VERCEL_URL}/api/callback`);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'identify email');

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl.toString(),
    },
  });
}
