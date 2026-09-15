const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Test Home page
  console.log('=== Testing Home page ===');
  await page.goto('https://site-novo-nicotinahub.vercel.app', { waitUntil: 'networkidle' });
  
  // Check tagline
  const tagline = await page.locator('p:has-text("oi eu tenho tres gatos")').first();
  if (await tagline.count() > 0) {
    const text = await tagline.textContent();
    const classes = await tagline.getAttribute('class');
    console.log('✓ Tagline found:', text.trim());
    console.log('  Classes:', classes);
    // Check for tracking-wide
    if (classes?.includes('tracking-wide')) {
      console.log('  ✓ tracking-wide present');
    } else {
      console.log('  ✗ tracking-wide MISSING');
    }
    // Check for text-body-lg
    if (classes?.includes('text-body-lg')) {
      console.log('  ✓ text-body-lg present');
    } else {
      console.log('  ✗ text-body-lg MISSING');
    }
    // Check for max-w-xl
    if (classes?.includes('max-w-xl')) {
      console.log('  ✓ max-w-xl present');
    } else {
      console.log('  ✗ max-w-xl MISSING');
    }
    // Check for text-text-muted/70
    if (classes?.includes('text-text-muted/70')) {
      console.log('  ✓ text-text-muted/70 present');
    } else {
      console.log('  ✗ text-text-muted/70 MISSING');
    }
    // Check no <br> tag
    const html = await tagline.innerHTML();
    if (!html.includes('<br')) {
      console.log('  ✓ No forced <br> tag');
    } else {
      console.log('  ✗ Forced <br> tag still present');
    }
  } else {
    console.log('✗ Tagline NOT found');
  }
  
  // Test Profile page - need to login first or check if accessible
  console.log('\n=== Testing Profile page (public view) ===');
  // Navigate to a profile (using known user ID)
  await page.goto('https://site-novo-nicotinahub.vercel.app/profile/c153d999-ecb1-4d8e-9c90-205613077fa7', { waitUntil: 'networkidle' });
  
  // Check if XP progress block exists
  const xpProgressLabel = await page.locator('text=Progresso de XP').first();
  const xpProgressValue = await page.locator('text=/\\d+ \\/ \\d+ XP/').first();
  const nextLevel = await page.locator('text=Próximo nível em').first();
  const progressBar = await page.locator('[role="progressbar"]').first();
  
  if (await xpProgressLabel.count() > 0) {
    console.log('✗ XP Progress label STILL EXISTS');
  } else {
    console.log('✓ XP Progress label REMOVED');
  }
  
  if (await xpProgressValue.count() > 0) {
    console.log('✗ XP Progress value STILL EXISTS');
  } else {
    console.log('✓ XP Progress value REMOVED');
  }
  
  if (await nextLevel.count() > 0) {
    console.log('✗ "Próximo nível em" STILL EXISTS');
  } else {
    console.log('✓ "Próximo nível em" REMOVED');
  }
  
  if (await progressBar.count() > 0) {
    console.log('✗ ProgressBar STILL EXISTS');
  } else {
    console.log('✓ ProgressBar REMOVED');
  }
  
  // Check that other stats still exist
  const levelStat = await page.locator('text=Nível').first();
  const goldStat = await page.locator('text=Ouro').first();
  const classStat = await page.locator('text=Classe').first();
  const joinedStat = await page.locator('text=Entrou em').first();
  const followersStat = await page.locator('text=Seguidores').first();
  const followingStat = await page.locator('text=Seguindo').first();
  const postsStat = await page.locator('text=Posts').first();
  
  console.log('\n--- Verifying other stats still present ---');
  for (const [name, locator] of [
    ['Nível', levelStat], ['Ouro', goldStat], ['Classe', classStat],
    ['Entrou em', joinedStat], ['Seguidores', followersStat],
    ['Seguindo', followingStat], ['Posts', postsStat]
  ]) {
    if (await locator.count() > 0) {
      console.log(`✓ ${name} present`);
    } else {
      console.log(`✗ ${name} MISSING`);
    }
  }
  
  // Check profile header shows correctly
  const profileName = await page.locator('h1.font-display.font-700.text-2xl').first();
  if (await profileName.count() > 0) {
    const name = await profileName.textContent();
    console.log(`\n✓ Profile name: ${name.trim()}`);
  }
  
  await browser.close();
  console.log('\n=== Verification complete ===');
})();