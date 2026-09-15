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

    console.log('\n=== Full Header HTML ===');
    const headerHTML = await page.locator('header').evaluate(el => el.outerHTML);
    console.log(headerHTML);

    const hasUserMenu = headerHTML.includes('userMenuOpen') || headerHTML.includes('Meu perfil') || headerHTML.includes('Sair');
    console.log('\n=== Header has new user menu code:', hasUserMenu);

    // Check if authenticated
    const avatar = page.locator('header button:has(.rounded-full)').first();
    const avatarCount = await avatar.count();
    console.log('Avatar button count:', avatarCount);

    if (avatarCount === 0) {
      console.log('\n=== Not authenticated - going to auth page to login ===');
      const entrarBtn = page.locator('text=Entrar').first();
      await entrarBtn.click();
      await page.waitForTimeout(2000);
      
      console.log('Current URL:', page.url());
      
      // Click Cadastrar tab
      const cadastrarBtn = page.locator('button:has-text("Cadastrar")').first();
      await cadastrarBtn.click();
      await page.waitForTimeout(1000);
      
      // Fill signup form
      const timestamp = Date.now();
      await page.fill('input[type="email"]', `test${timestamp}@test.com`);
      await page.fill('input[type="password"]', 'test123456');
      await page.fill('input[placeholder="Seu nome na nicotinacat"]', 'Test User');
      await page.fill('input[placeholder="seu_usuario"]', `testuser${timestamp}`);
      
      const submitBtn = page.locator('button:has-text("Criar Conta")').first();
      await submitBtn.click();
      await page.waitForTimeout(5000);
      
      console.log('After register URL:', page.url());
      
      // Go back to home
      await page.goto('https://temporary-agile-gold-znpk7ql.vercel.app', { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
    }

    console.log('\n=== Verifying avatar and dropdown ===');
    const avatarBtn = page.locator('header button:has(.rounded-full)').first();
    const avatarCount2 = await avatarBtn.count();
    console.log('Avatar button count:', avatarCount2);

    if (avatarCount2 > 0) {
      console.log('✓ Avatar appears');
      
      console.log('\n=== Clicking avatar ===');
      await avatarBtn.click();
      await page.waitForTimeout(1000);

      console.log('\n=== Checking dropdown items ===');
      const meuPerfil = await page.locator('text=Meu perfil').count();
      const sair = await page.locator('text=Sair').count();
      console.log('"Meu perfil" count:', meuPerfil);
      console.log('"Sair" count:', sair);

      if (meuPerfil > 0) {
        console.log('✓ "Meu perfil" appears in dropdown');
      } else {
        console.log('✗ "Meu perfil" NOT found');
      }

      if (sair > 0) {
        console.log('✓ "Sair" appears in dropdown');
      } else {
        console.log('✗ "Sair" NOT found');
      }

      // Check dropdown visibility
      const dropdown = page.locator('.absolute.right-0.top-full.mt-2.w-48');
      const dropdownCount = await dropdown.count();
      if (dropdownCount > 0) {
        const isVisible = await dropdown.isVisible();
        console.log('Dropdown is visible:', isVisible);
      }

      // Test logout
      if (sair > 0) {
        console.log('\n=== Testing logout ===');
        const sairBtn = page.locator('text=Sair').first();
        await sairBtn.click();
        await page.waitForTimeout(3000);
        
        console.log('URL after logout:', page.url());
        
        // Check if redirected to home
        const isHome = page.url().endsWith('/') || page.url().includes('temporary-agile-gold');
        console.log('Redirected to home:', isHome);
        
        // Check if "Entrar" link appears again
        const entrarAfterLogout = await page.locator('text=Entrar').count();
        console.log('"Entrar" link after logout:', entrarAfterLogout);
        
        if (isHome && entrarAfterLogout > 0) {
          console.log('✓ Logout works - redirected to home and shows Entrar');
        } else {
          console.log('✗ Logout may not have worked correctly');
        }
      }
    }

    // Test mobile menu
    console.log('\n=== Testing mobile menu ===');
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
      
      if (mobileSair > 0 && mobilePerfil > 0) {
        console.log('✓ Mobile menu shows both Perfil and Sair');
      } else {
        console.log('✗ Mobile menu missing items');
      }
    }

  } catch (err) {
    console.error('Error:', err);
  }

  await page.waitForTimeout(3000);
  await browser.close();
}

verifyDeployment();