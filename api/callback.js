export default async function handler(req, res) {
  const code = req.query.code;
  const clientId = process.env.GITHUB_CLIENT_ID || process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || process.env.OAUTH_CLIENT_SECRET;

  if (!code) {
    res.status(400).send('Missing code');
    return;
  }
  if (!clientId || !clientSecret) {
    res.status(500).send('Missing GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET env vars in Vercel.');
    return;
  }

  try {
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await r.json();

    if (data.error || !data.access_token) {
      res.status(400).send(`OAuth error: ${data.error || 'no token'} - ${data.error_description || ''}`);
      return;
    }

    const token = data.access_token;
    const provider = 'github';

    // Decap CMS expects postMessage: `authorization:github:success:{"token":"...","provider":"github"}`
    const html = `<!doctype html>
<html><body><script>
(function() {
  const token = ${JSON.stringify(token)};
  const provider = ${JSON.stringify(provider)};
  const msg = 'authorization:' + provider + ':success:' + JSON.stringify({ token, provider });
  if (window.opener) {
    window.opener.postMessage(msg, '*');
    window.close();
  } else {
    document.body.innerText = 'Auth success. You can close this window. Token: ' + token.slice(0,8) + '...';
  }
})();
<\/script></body></html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (e) {
    res.status(500).send('OAuth callback failed: ' + e.message);
  }
}
