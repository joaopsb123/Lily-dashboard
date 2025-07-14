// api/posts.js
let posts = []; 
let idCounter = 1;

export default async function handler(req, res) {
  const user = JSON.parse(req.query.user || '{}');
  if (req.method === 'GET') {
    return res.status(200).json(posts);
  } else {
    const body = await req.json();
    if (body.action === 'create') {
      const post = {
        id: idCounter++,
        author: user.username + '#' + user.discriminator,
        avatar: user.avatarUrl,
        content: body.content,
        image: body.image || null,
        likes: [],
        comments: []
      };
      posts.unshift(post);
      return res.status(201).json(post);
    }
    if (body.action === 'like') {
      const p = posts.find(p => p.id === body.id);
      if (!p) return res.status(404).send('Post não existe');
      if (!p.likes.includes(user.username)) p.likes.push(user.username);
      return res.status(200).json(p);
    }
    if (body.action === 'comment') {
      const p = posts.find(p => p.id === body.id);
      if (!p) return res.status(404).send('Post não existe');
      p.comments.push({ user: user.username, text: body.text });
      return res.status(200).json(p);
    }
  }
  res.status(400).send('Bad request');
}
