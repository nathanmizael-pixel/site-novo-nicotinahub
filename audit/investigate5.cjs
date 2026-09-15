const { chromium } = require('playwright');

async function investigate() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  try {
    console.log('Navigating to production...');
    await page.goto('https://site-novo-nicotinahub.vercel.app', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    console.log('\n=== Full Header HTML ===');
    const headerHTML = await page.locator('header').evaluate(el => el.outerHTML);
    console.log(headerHTML);

    console.log('\n=== All buttons in header ===');
    const buttons = await page.locator('header button').evaluateAll(els => els.map(el => ({
      class: el.className,
      text: el.textContent?.trim(),
      html: el.outerHTML.substring(0, 200)
    })));
    console.log(JSON.stringify(buttons, null, 2));

    console.log('\n=== All links in header ===');
    const links = await page.locator('header a').evaluateAll(els => els.map(el => ({
      class: el.className,
      text: el.textContent?.trim(),
      href: el.href
    })));
    console.log(JSON.stringify(links, null, 2));

  } catch (err) {
    console.error('Error:', err);
  }

  await page.waitForTimeout(5000);
  await browser.close();
}

investigate();