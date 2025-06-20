const express = require('express');
//const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 2000;

// async function getPageSource(url) {
//   const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
//   try {
//     const page = await browser.newPage();
//     await page.goto(url, { waitUntil: 'networkidle2' });
//     const pageSource = await page.content();
//     await browser.close();
//     return pageSource;
//   } catch (error) {
//     await browser.close();
//     throw error;
//   }
// }

app.get('/', async (req, res) => {

    return res.status(200).json({ success: 'test' });


});
// app.get('/get-page-source', async (req, res) => {
//   const { url } = req.query; 
//   if (!url) {
//     return res.status(400).json({ error: 'URL error' });
//   }

//   try {
//     const source = await getPageSource(url);
//     res.status(200).send(source); 
//   } catch (error) {
//     res.status(500).json({ error: 'error', details: error.message });
//   }
// });


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started http://localhost:${PORT}`);
});
