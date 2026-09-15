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

    console.log('\n=== Clicking Entrar button (client-side nav) ===');
    const entrarBtn = page.locator('text=Entrar').first();
    await entrarBtn.click();
    await page.waitForTimeout(2000);

    console.log('\n=== Current URL ===');
    console.log('URL:', page.url());

    console.log('\n=== Clicking Cadastrar tab ===');
    const cadastrarBtn = page.locator('button:has-text("Cadastrar")').first();
    await cadastrarBtn.click();
    await page.waitForTimeout(1000);

    console.log('\n=== Filling signup form ===');
    const timestamp = Date.now();
    await page.fill('input[type="email"]', `test${timestamp}@test.com`);
    await page.fill('input[type="password"]', 'test123456');
    await page.fill('input[placeholder="Seu nome na nicotinacat"]', 'Test User');
    await page.fill('input[placeholder="seu_usuario"]', `testuser${timestamp}`);
    
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

      // Check parent containers for overflow
      const userMenuContainer = page.locator('header .relative').nth(1);
      const containerCount = await userMenuContainer.count();
      console.log('User menu container count:', containerCount);
      
      if (containerCount > 0) {
        const containerStyles = await userMenuContainer.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            overflow: computed.overflow,
            position: computed.position,
            zIndex: computed.zIndex,
          };
        });
        console.log('User menu container styles:', containerStyles);
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

      // Get full dropdown HTML
      const dropdownHTML = await page.evaluate(() => {
        const dropdown = document.querySelector('.absolute.right-0.top-full.mt-2.w-48');
        return dropdown ? dropdown.outerHTML : 'NOT FOUND';
      });
      console.log('\n=== Dropdown HTML ===');
      console.log(dropdownHTML);
    }

    // Check mobile menu
    console.log('\n=== Checking mobile menu ===');
    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const mobileMenuBtn = page.locator('button.lg\\:hidden').first();
    const mobileBtnCount = await mobileMenuBtn.count();
    console.log('Mobile menu button count:', mobileBtnCount);

    if (mobileBtnCount > 0) {
      await mobileMenuBtn.click();
      await page.waitForTimeout(500);
      
      const mobileSair = await page.locator('text=Sair').count();
      const mobilePerfil = await page.locator('text=Perfil').count();
      console.log('Mobile "Sair" count:', mobileSair);
      console.log('Mobile "Perfil" count:', mobilePerfil);
    }

  } catch (err) {
    console.error('Error:', err);
  }

  await page.waitForTimeout(5000);
  await browser.close();
}

investigate();