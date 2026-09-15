const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('=== Testing Profile page (debug) ===');
  await page.goto('https://site-novo-nicotinahub.vercel.app/profile/c153d999-ecb1-4d8e-9c90-205613077fa7', { waitUntil: 'networkidle' });
  
  // Wait for content to load
  await page.waitForTimeout(5000);
  
  // Get full body text
  const bodyText = await page.locator('body').textContent();
  console.log('Full page text:');
  console.log(bodyText);
  
  await browser.close();
})();