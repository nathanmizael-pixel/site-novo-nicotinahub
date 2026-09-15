const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Test Profile page with longer wait
  console.log('=== Testing Profile page (with longer wait) ===');
  await page.goto('https://site-novo-nicotinahub.vercel.app/profile/c153d999-ecb1-4d8e-9c90-205613077fa7', { waitUntil: 'networkidle' });
  
  // Wait a bit for any loading
  await page.waitForTimeout(3000);
  
  // Check page content
  const bodyText = await page.locator('body').textContent();
  console.log('Page text preview:', bodyText.substring(0, 500));
  
  // Check for loading shimmer
  const shimmer = await page.locator('.shimmer-bg').first();
  if (await shimmer.count() > 0) {
    console.log('✗ Page still showing loading shimmer');
  }
  
  // Check for "Perfil não encontrado"
  const notFound = await page.locator('text=Perfil não encontrado').first();
  if (await notFound.count() > 0) {
    console.log('✗ Profile not found');
  }
  
  // Check for profile content
  const profileCard = await page.locator('.font-display.font-700.text-2xl').first();
  if (await profileCard.count() > 0) {
    console.log('✓ Profile header found');
  }
  
  // Check for stats grid
  const statsGrid = await page.locator('.grid.grid-cols-3.gap-4.mt-6').first();
  if (await statsGrid.count() > 0) {
    console.log('✓ Stats grid (followers/following/posts) found');
  }
  
  // Check for journey stats card
  const journeyCard = await page.locator('text=Estatísticas da Jornada').first();
  if (await journeyCard.count() > 0) {
    console.log('✓ "Estatísticas da Jornada" card found');
    // Check its children
    const journeyStats = await page.locator('text=Nível, text=Ouro, text=Classe, text=Entrou em').all();
    for (const stat of journeyStats) {
      if (await stat.count() > 0) {
        console.log('  ✓', await stat.textContent());
      }
    }
  } else {
    console.log('✗ "Estatísticas da Jornada" card NOT found');
  }
  
  await browser.close();
})();