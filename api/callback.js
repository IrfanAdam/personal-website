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

    // Handle both popup (window.opener) and same-window redirect flows
    const html = `<!doctype html>
<html><body><script>
(function() {
  const token = ${JSON.stringify(token)};
  const provider = ${JSON.stringify(provider)};
  const msg = 'authorization:' + provider + ':success:' + JSON.stringify({ token, provider });
  // Popup flow: Decap opened /api/auth in a new window
  if (window.opener) {
    window.opener.postMessage(msg, '*');
    window.close();
    return;
  }
  // Same-window flow: browser blocked popup and navigated here directly
  // Decap stores user in localStorage under 'decap-cms-user' (v3) and 'netlify-cms-user' (compat)
  try {
    const user = { token, provider, backendName: provider };
    localStorage.setItem('decap-cms-user', JSON.stringify(user));
    localStorage.setItem('netlify-cms-user', JSON.stringify(user));
  } catch(e) {}
  // Go back to admin - Decap will read token from localStorage
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
