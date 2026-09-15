import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  
  await page.goto('http://localhost:5173/community', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  const elements = await page.locator('button:has-text("Entrar"), a:has-text("Entrar")').all();
  console.log('=== COMMUNITY PAGE ===');
  for (const el of elements) {
    const tag = await el.evaluate(e => e.tagName);
    const text = await el.innerText();
    const classes = await el.getAttribute('class');
    const parent = await el.evaluate(e => e.parentElement?.tagName);
    console.log(`  ${tag}.${classes}: "${text}" (parent: ${parent})`);
  }
  
  await page.goto('http://localhost:5173/wishlist', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  const elements2 = await page.locator('a[href*="amazon"], button:has-text("Amazon")').all();
  console.log('\n=== WISHLIST PAGE ===');
  for (const el of elements2) {
    const tag = await el.evaluate(e => e.tagName);
    const text = await el.innerText();
    const classes = await el.getAttribute('class');
    const parent = await el.evaluate(e => e.parentElement?.tagName);
    const href = await el.getAttribute('href');
    console.log(`  ${tag}.${classes}: "${text}" href=${href} (parent: ${parent})`);
  }
  
  await browser.close();
})();