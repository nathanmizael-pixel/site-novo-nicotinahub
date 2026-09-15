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

    console.log('\n=== Checking auth state ===');
    const authButtons = await page.locator('text=Entrar').count();
    console.log('"Entrar" buttons:', authButtons);

    // Check if there's a way to login - go to auth page
    if (authButtons > 0) {
      console.log('\n=== Going to auth page ===');
      await page.goto('https://site-novo-nicotinahub.vercel.app/auth', { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);

      // Check for login form
      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
      const loginButton = page.locator('button:has-text("Entrar"), button:has-text("Login"), button[type="submit"]').first();

      console.log('Email input:', await emailInput.count());
      console.log('Password input:', await passwordInput.count());
      console.log('Login button:', await loginButton.count());

      // Try to login with test credentials - need to ask user or check if there's a demo
      // For now, let's see what the auth page looks like
      const authPageHTML = await page.locator('body').evaluate(el => el.innerHTML);
      console.log('\n=== Auth page HTML (first 5000 chars) ===');
      console.log(authPageHTML.substring(0, 5000));
    }

    // After login, check again
    console.log('\n=== After potential login - checking header ===');
    await page.goto('https://site-novo-nicotinahub.vercel.app', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

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

  } catch (err) {
    console.error('Error:', err);
  }

  await page.waitForTimeout(5000);
  await browser.close();
}

investigate();