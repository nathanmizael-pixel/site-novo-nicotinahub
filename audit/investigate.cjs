const { chromium } = require('playwright');

async function investigate() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console logs
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  try {
    console.log('Navigating to production...');
    await page.goto('https://site-novo-nicotinahub.vercel.app', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    console.log('\n=== Checking if authenticated ===');
    const authButton = await page.locator('text=Entrar').count();
    console.log('"Entrar" button count:', authButton);

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

      // Check if dropdown exists but is hidden
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

      // Check parent element for overflow/clipping
      const userMenuContainer = page.locator('header .relative').nth(1); // The second relative div (user menu)
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

      // Check header styles
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

      // Get full HTML of dropdown area
      const dropdownHTML = await page.locator('header .relative').nth(1).locator('..').evaluate(el => el.outerHTML);
      console.log('\n=== User menu container HTML ===');
      console.log(dropdownHTML.substring(0, 3000));
    }

    console.log('\n=== Checking mobile menu ===');
    const mobileMenuBtn = page.locator('button:has(svg.lucide-menu), button:has(svg.lucide-x)').first();
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