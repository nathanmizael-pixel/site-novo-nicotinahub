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

    console.log('\n=== Checking header ===');
    const headerHTML = await page.locator('header').evaluate(el => el.outerHTML);
    console.log('Header HTML:', headerHTML.substring(0, 3000));

    console.log('\n=== Clicking Entrar button (client-side nav) ===');
    const entrarBtn = page.locator('text=Entrar').first();
    await entrarBtn.click();
    await page.waitForTimeout(3000);

    console.log('\n=== After click - checking URL ===');
    console.log('Current URL:', page.url());

    console.log('\n=== Checking for auth form ===');
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    console.log('Email input count:', await emailInput.count());
    console.log('Password input count:', await passwordInput.count());

    if (await emailInput.count() > 0) {
      // Try to register a test account
      console.log('\n=== Attempting to register test account ===');
      await page.fill('input[type="email"]', 'test' + Date.now() + '@test.com');
      await page.fill('input[type="password"]', 'test123456');
      await page.fill('input[placeholder="Seu nome na nicotinacat"]', 'Test User');
      await page.fill('input[placeholder="seu_usuario"]', 'testuser' + Date.now());
      
      const submitBtn = page.locator('button:has-text("Criar Conta")').first();
      await submitBtn.click();
      await page.waitForTimeout(5000);
      
      console.log('\n=== After register - checking URL ===');
      console.log('Current URL:', page.url());
      
      // Check header again
      console.log('\n=== Checking header after auth ===');
      const avatar = page.locator('header button:has(.rounded-full)').first();
      const avatarCount = await avatar.count();
      console.log('Avatar button count:', avatarCount);

      if (avatarCount > 0) {
        console.log('\n=== Clicking avatar ===');
        await avatar.click();
        await page.waitForTimeout(1000);

        console.log('\n=== Checking for dropdown items ===');
        const meuPerfil = await page.locator('text=Meu perfil').count();
        const sair = await page.locator('text=Sair').count();
        console.log('"Meu perfil" count:', meuPerfil);
        console.log('"Sair" count:', sair);

        const dropdown = page.locator('.absolute.right-0.top-full.mt-2.w-48');
        const dropdownCount = await dropdown.count();
        console.log('Dropdown element count:', dropdownCount);

        if (dropdownCount > 0) {
          const isVisible = await dropdown.isVisible();
          console.log('Dropdown is visible:', isVisible);
          
          const styles = await dropdown.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              display: computed.display,
              visibility: computed.visibility,
              opacity: computed.opacity,
              zIndex: computed.zIndex,
              position: computed.position,
              top: computed.top,
              right: computed.right,
              overflow: computed.overflow,
              clipPath: computed.clipPath,
            };
          });
          console.log('Dropdown computed styles:', styles);
        }

        const header = page.locator('header').first();
        const headerStyles = await header.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            overflow: computed.overflow,
            zIndex: computed.zIndex,
            position: computed.position,
          };
        });
        console.log('Header styles:', headerStyles);
      }
    }

  } catch (err) {
    console.error('Error:', err);
  }

  await page.waitForTimeout(5000);
  await browser.close();
}

investigate();