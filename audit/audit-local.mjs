import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';
const PAGES = [
  { path: '/', name: 'Home' },
  { path: '/community', name: 'Comunidade' },
  { path: '/videos', name: 'Vídeos' },
  { path: '/wishlist', name: 'Lista de Desejos' },
  { path: '/profile', name: 'Perfil' }
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 }
];

async function auditPage(page, url, pageName, viewportName) {
  console.log(`\n=== ${pageName} (${viewportName}) ===`);
  console.log(`URL: ${url}`);
  
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  
  // Get page title
  const title = await page.title();
  console.log(`Title: ${title}`);
  
  // Check headings hierarchy
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
  console.log(`Headings (${headings.length}):`);
  for (const h of headings) {
    const tag = await h.evaluate(el => el.tagName.toLowerCase());
    const text = await h.innerText();
    console.log(`  ${tag}: "${text}"`);
  }
  
  // Check buttons/links
  const buttons = await page.locator('button, a[role="button"], .btn, [class*="btn"]').all();
  console.log(`Buttons/Links (${buttons.length}):`);
  for (const btn of buttons.slice(0, 10)) {
    const text = await btn.innerText();
    const tag = await btn.evaluate(el => el.tagName.toLowerCase());
    const href = await btn.getAttribute('href');
    const ariaLabel = await btn.getAttribute('aria-label');
    const ariaExpanded = await btn.getAttribute('aria-expanded');
    console.log(`  ${tag}: "${text.trim().slice(0,50)}" ${href ? `-> ${href}` : ''} ${ariaLabel ? `[aria-label="${ariaLabel}"]` : ''} ${ariaExpanded ? `[aria-expanded="${ariaExpanded}"]` : ''}`);
  }
  
  // Check for empty states
  const emptyStates = await page.locator('[class*="empty"], [class*="vazio"], [data-empty], text=/nenhum|vazio|empty|no items|no results/i').all();
  if (emptyStates.length > 0) {
    console.log(`Empty states encontrados: ${emptyStates.length}`);
    for (const es of emptyStates) {
      const text = await es.innerText();
      console.log(`  "${text.trim().slice(0,100)}"`);
    }
  }
  
  // Check tap targets
  const allElements = await page.locator('*').all();
  let tapTargetIssues = 0;
  for (const el of allElements.slice(0, 100)) {
    const box = await el.boundingBox();
    if (box && box.width > 0 && box.height > 0 && box.width < 44 && box.height < 44 && 
        (el.tagName === 'BUTTON' || el.tagName === 'A' || el.getAttribute('role') === 'button' || el.classList.contains('btn'))) {
      tapTargetIssues++;
      const tag = await el.evaluate(e => e.tagName.toLowerCase());
      const cls = await el.getAttribute('class');
      console.log(`  ⚠️ Tap target <44px: ${tag}.${cls?.substring(0,40)} at ${Math.round(box.width)}x${Math.round(box.height)}`);
    }
  }
  if (tapTargetIssues === 0) {
    console.log('  ✅ No tap target issues (<44px)');
  }
  
  // Check for overflow
  let overflowIssues = 0;
  for (const el of allElements.slice(0, 100)) {
    const box = await el.boundingBox();
    if (box && box.right > page.viewportSize().width + 5) {
      overflowIssues++;
      const tag = await el.evaluate(e => e.tagName.toLowerCase());
      const cls = await el.getAttribute('class');
      console.log(`  ⚠️ Overflow: ${tag}.${cls?.substring(0,40)} by ${Math.round(box.right - page.viewportSize().width)}px`);
    }
  }
  if (overflowIssues === 0) {
    console.log('  ✅ No overflow issues');
  }
  
  // Check images
  const images = await page.locator('img').all();
  console.log(`Images: ${images.length}`);
  
  // Check forms
  const forms = await page.locator('form').all();
  console.log(`Forms: ${forms.length}`);
  
  // Console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));
  
  await page.waitForTimeout(500);
  if (errors.length > 0) {
    console.log(`Console Errors: ${errors.length}`);
    errors.forEach(e => console.log(`  ${e}`));
  } else {
    console.log('  ✅ No console errors');
  }
  
  return { title, headings: headings.length, buttons: buttons.length, tapTargetIssues, overflowIssues, errors };
}

async function runAudit() {
  const browser = await chromium.launch({ headless: true });
  
  const allResults = {};
  
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`VIEWPORT: ${viewport.name} (${viewport.width}x${viewport.height})`);
    console.log(`{'='.repeat(60)}`);
    
    for (const pageInfo of PAGES) {
      const url = BASE_URL + pageInfo.path;
      try {
        const result = await auditPage(page, url, pageInfo.name, viewport.name);
        if (!allResults[pageInfo.name]) allResults[pageInfo.name] = {};
        allResults[pageInfo.name][viewport.name] = result;
      } catch (e) {
        console.log(`ERRO em ${pageInfo.name}: ${e.message}`);
      }
    }
    
    await context.close();
  }
  
  await browser.close();
  
  // Summary
  console.log('\n\n' + '='.repeat(60));
  console.log('RESUMO GERAL');
  console.log('='.repeat(60));
  
  for (const [pageName, viewports] of Object.entries(allResults)) {
    console.log(`\n--- ${pageName} ---`);
    for (const [vp, data] of Object.entries(viewports)) {
      console.log(`  ${vp}: title="${data.title}", headings=${data.headings}, btns=${data.buttons}, tapIssues=${data.tapTargetIssues}, overflow=${data.overflowIssues}, errors=${data.errors.length}`);
    }
  }
}

runAudit().catch(console.error);