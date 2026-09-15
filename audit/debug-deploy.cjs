const { chromium } = require('playwright');

async function verifyDeployment() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  try {
    console.log('=== Navigating to NEW temporary deployment ===');
    await page.goto('https://temporary-agile-gold-znpk7ql.vercel.app', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Check the actual JS being loaded
    const jsContent = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[src*="index-"]');
      return Array.from(scripts).map(s => s.src);
    });
    console.log('JS files:', jsContent);

    // Check if React has rendered the new header
    console.log('\n=== Checking React-rendered header ===');
    const headerHTML = await page.locator('header').evaluate(el => el.outerHTML);
    console.log('Header HTML length:', headerHTML.length);
    console.log('Contains "Meu perfil":', headerHTML.includes('Meu perfil'));
    console.log('Contains "Sair":', headerHTML.includes('Sair'));
    console.log('Contains "userMenuOpen":', headerHTML.includes('userMenuOpen'));
    
    // Check for avatar
    const avatar = page.locator('header button:has(.rounded-full)').first();
    const avatarCount = await avatar.count();
    console.log('Avatar button count:', avatarCount);

    // Check all buttons in header
    const buttons = await page.locator('header button').evaluateAll(els => els.map(el => ({
      class: el.className,
      text: el.textContent?.trim(),
    })));
    console.log('Buttons:', JSON.stringify(buttons, null, 2));

    // Check all links in header
    const links = await page.locator('header a').evaluateAll(els => els.map(el => ({
      class: el.className,
      text: el.textContent?.trim(),
      href: el.href
    })));
    console.log('Links:', JSON.stringify(links, null, 2));

    // Force a re-render check
    console.log('\n=== Checking for session/auth state ===');
    const sessionCheck = await page.evaluate(() => {
      // Check localStorage, sessionStorage for auth
      return {
        localStorage: Object.keys(localStorage),
        sessionStorage: Object.keys(sessionStorage),
      };
    });
    console.log('Storage:', sessionCheck);

  } catch (err) {
    console.error('Error:', err);
  }

  await page.waitForTimeout(3000);
  await browser.close();
}

verifyDeployment();