// Configurações do seu aplicativo Discord
const CLIENT_ID = '1388158298305597483';
const CLIENT_SECRET = 'lt5XoG0qH4os1YZeVsgAr0IZuU48A304';
const REDIRECT_URI = encodeURIComponent('https://lily-dashboard-five.vercel.app/callback.html');

// Extrai o código da URL
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
    // Troca o código por um token de acesso
    fetch(`https://discord.com/api/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: decodeURIComponent(REDIRECT_URI),
            scope: 'identify email guilds'
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao obter token');
        }
        return response.json();
    })
    .then(data => {
        if (data.access_token) {
            // Armazena o token e redireciona
            localStorage.setItem('discord_token', data.access_token);
            window.location.href = '/guild.html';
        } else {
            console.error('Falha na autenticação');
            window.location.href = '/';
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        window.location.href = '/';
    });
} else {
    window.location.href = '/';
}
