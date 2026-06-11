const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/home/ubnt/.gemini/antigravity-ide/brain/05f6fedf-70e5-4426-9942-a9dac42f221d/visuals';
const URL = 'http://127.0.0.1:8080/index.html';

const VIEWPORTS = [
  { width: 320, height: 568, label: '320px' },
  { width: 375, height: 812, label: '375px' },
  { width: 414, height: 896, label: '414px' },
];

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    executablePath: '/usr/bin/google-chrome',
  });

  const tab = await browser.newPage();

  for (const lang of ['en', 'ar']) {
    for (const vp of VIEWPORTS) {
      await tab.setViewport({ width: vp.width, height: vp.height });
      await tab.goto(URL, { waitUntil: 'networkidle2' });
      
      if (lang === 'ar') {
        await tab.evaluate(() => {
          const btn = document.getElementById('langToggle');
          if (btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 1000));
      }

      // Capture Closed State
      await tab.screenshot({ path: path.join(OUTPUT_DIR, `${lang}_${vp.label}_closed.png`) });

      // Open Menu
      await tab.evaluate(() => {
        const hamburger = document.getElementById('hamburger');
        if (hamburger) hamburger.click();
      });
      await new Promise(r => setTimeout(r, 800)); // Wait for animation

      // Capture Open State
      await tab.screenshot({ path: path.join(OUTPUT_DIR, `${lang}_${vp.label}_open.png`) });
      
      console.log(`Saved screenshots for ${lang} @ ${vp.label}`);
    }
  }

  await browser.close();
  console.log('Validation complete.');
})();
