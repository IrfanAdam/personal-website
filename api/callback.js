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

    const html = `<!doctype html>
<html><body><script>
(function() {
  const token = ${JSON.stringify(token)};
  const msg = 'authorization:github:success:' + JSON.stringify({ token: token, provider: 'github' });
  // Try popup flow first
  if (window.opener) {
    try { window.opener.postMessage(msg, '*'); } catch(e) {}
    try { window.opener.postMessage(msg, window.location.origin); } catch(e) {}
    // Backup: also store in localStorage so /admin can recover on refresh
    try {
      const user = { token: token, provider: 'github', backendName: 'github' };
      window.opener.localStorage.setItem('decap-cms-user', JSON.stringify(user));
      window.opener.localStorage.setItem('netlify-cms-user', JSON.stringify(user));
    } catch(e) {}
    document.body.innerHTML = '<p style="font-family:sans-serif;padding:40px;text-align:center">Authorized! Closing...</p>';
    setTimeout(function(){ window.close(); }, 800);
    return;
  }
  // Same-window fallback
  try {
    const user = { token: token, provider: 'github', backendName: 'github' };
    localStorage.setItem('decap-cms-user', JSON.stringify(user));
    localStorage.setItem('netlify-cms-user', JSON.stringify(user));
  } catch(e) {}
  document.body.innerHTML = '<p style="font-family:sans-serif;padding:40px;text-align:center">Authorized! Redirecting to CMS...</p>';
  setTimeout(function(){ window.location.href = '/admin/'; }, 800);
})();
<\/script></body></html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (e) {
    res.status(500).send('OAuth callback failed: ' + e.message);
  }
}
