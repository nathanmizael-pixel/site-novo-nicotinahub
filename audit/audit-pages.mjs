import { chromium } from 'playwright';

const BASE_URL = 'https://site-novo-nicotinahub.vercel.app';
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
  
  // Screenshot
  await page.screenshot({ 
    path: `audit-${pageName.toLowerCase()}-${viewportName}.png`, 
    fullPage: true 
  });
  
  // Get page title
  const title = await page.title();
  console.log(`Title: ${title}`);
  
  // Get all text content
  const bodyText = await page.locator('body').innerText();
  console.log(`Text length: ${bodyText.length} chars`);
  
  // Check for common AI/template phrases
  const aiPhrases = [
    'bem-vindo', 'welcome', 'descubra', 'explore', 'junte-se', 'join us',
    'plataforma completa', 'solução completa', 'tudo em um', 'all in one',
    'revolucione', 'transforme', 'maximize', 'otimize', 'potencialize',
    'experiência única', 'experiência incrível', 'next level',
    'comunidade vibrante', 'ecossistema', 'hub central',
    'facilita', 'simplifica', 'agiliza', 'otimiza'
  ];
  
  const foundAiPhrases = aiPhrases.filter(p => bodyText.toLowerCase().includes(p));
  if (foundAiPhrases.length > 0) {
    console.log(`⚠️ Frases genéricas/IA encontradas: ${foundAiPhrases.join(', ')}`);
  }
  
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
    const onclick = await btn.getAttribute('onclick');
    console.log(`  ${tag}: "${text.trim().slice(0,50)}" ${href ? `-> ${href}` : ''} ${onclick ? '[onclick]' : ''}`);
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
  
  // Check for misaligned/overlapping elements (rough check)
  const allElements = await page.locator('*').all();
  let overlapCount = 0;
  for (const el of allElements.slice(0, 50)) {
    const box = await el.boundingBox();
    if (box && box.width > 0 && box.height > 0) {
      // Check if element extends beyond viewport
      if (box.x + box.width > page.viewportSize().width + 10) {
        overlapCount++;
        const tag = await el.evaluate(e => e.tagName.toLowerCase());
        const cls = await el.getAttribute('class');
        console.log(`  ⚠️ Overflow: ${tag}.${cls} at x=${box.x}, w=${box.width}`);
      }
    }
  }
  
  // Check images
  const images = await page.locator('img').all();
  console.log(`Images: ${images.length}`);
  for (const img of images.slice(0, 5)) {
    const src = await img.getAttribute('src');
    const alt = await img.getAttribute('alt');
    const naturalWidth = await img.evaluate(e => e.naturalWidth);
    console.log(`  ${src?.slice(0,60)} (alt: "${alt}", naturalW: ${naturalWidth})`);
  }
  
  // Check forms
  const forms = await page.locator('form').all();
  console.log(`Forms: ${forms.length}`);
  for (const form of forms) {
    const inputs = await form.locator('input, select, textarea').all();
    console.log(`  Form with ${inputs.length} inputs`);
  }
  
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
  }
  
  return { title, bodyText, headings: headings.length, buttons: buttons.length, errors };
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
      console.log(`  ${vp}: title="${data.title}", text=${data.bodyText.length}, headings=${data.headings}, btns=${data.buttons}, errors=${data.errors.length}`);
    }
  }
}

runAudit().catch(console.error);