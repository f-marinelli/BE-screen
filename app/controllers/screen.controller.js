const puppeteer = require('puppeteer');

const screenshot = async (req, res) => {
  const data = req.body.html;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 3,
  });

  await page.setContent(data);

  const element = await page.$('body');
  const screen = await element.screenshot();

  await browser.close();

  res.writeHead(200, { 'Content-Type': 'image/jpeg' });
  res.end(screen);
};

module.exports = { screenshot };
