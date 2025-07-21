// Extrai o código da URL
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
    // Envia o código para o backend para obter o token de acesso
    fetch('/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Armazena o token e redireciona para a página do servidor
            localStorage.setItem('discord_token', data.token);
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
