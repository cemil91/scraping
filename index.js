const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 2000;

async function getPageSource(url) {
  try {
    const response = await axios.get(url);
    return response.data; // HTML içeriği
  } catch (error) {
    throw error;
  }
}

app.get('/get-page-source', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL error' });
  }

  try {
    const source = await getPageSource(url);
    res.status(200).send(source);
  } catch (error) {
    res.status(500).json({ error: 'error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server started http://localhost:${PORT}`);
});
