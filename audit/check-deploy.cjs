const { chromium } = require('playwright');

async function verifyProduction() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  try {
    console.log('=== Navigating to production ===');
    await page.goto('https://site-novo-nicotinahub.vercel.app', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    console.log('\n=== Full Header HTML ===');
    const headerHTML = await page.locator('header').evaluate(el => el.outerHTML);
    console.log(headerHTML);

    // Check if this is the new version
    const hasUserMenu = headerHTML.includes('userMenuOpen') || headerHTML.includes('Meu perfil') || headerHTML.includes('Sair');
    console.log('\n=== Header has new user menu code:', hasUserMenu);

  } catch (err) {
    console.error('Error:', err);
  }

  await page.waitForTimeout(3000);
  await browser.close();
}

verifyProduction();