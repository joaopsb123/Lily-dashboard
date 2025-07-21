// callback.js atualizado para usar a API route
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
    fetch('/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na autenticação');
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
            localStorage.setItem('discord_token', data.token);
            window.location.href = '/guild.html';
        } else {
            throw new Error('Token não recebido');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        window.location.href = '/';
    });
} else {
    window.location.href = '/';
}
