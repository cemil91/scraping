const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 2000;

function extractCsrfToken(html) {
  const match = html.match(/<meta name="csrf-token" content="([^"]+)"\s*\/?>/i);
  return match ? match[1] : null;
}

async function getPageSource(url) {
  const response = await axios.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
    },
  });

  return {
    html: response.data,
    cookies: response.headers['set-cookie'] || [],
  };
}

app.get('/get-page-source', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('URL error');
  }

  try {
    const page = await getPageSource(url);
    const csrfToken = extractCsrfToken(page.html);

    let phoneXml = '';
    if (csrfToken) {
      const cookieHeader = page.cookies.map((c) => c.split(';')[0]).join('; ');
      const phoneApiUrl =
        url +
        '/show_phones?trigger_button=main&source_link=' +
        encodeURIComponent(url);

      try {
        const phoneResponse = await axios.get(phoneApiUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
            'X-CSRF-Token': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
            Cookie: cookieHeader,
            Referer: url,
            Accept: 'application/json, text/javascript, */*; q=0.01',
          },
        });

        if (phoneResponse.data && Array.isArray(phoneResponse.data.phones)) {
          phoneXml = phoneResponse.data.phones
            .map(
              (p) =>
                `<phone raw="${p.raw}">${p.primary || p.raw}</phone>`
            )
            .join('');
        }
      } catch (e) {
        phoneXml = `<phone error="${e.message}"></phone>`;
      }
    }

    const finalHtml = page.html + phoneXml;
    res.status(200).send(finalHtml);
  } catch (error) {
    res.status(500).send(`error: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server started http://localhost:${PORT}`);
});
