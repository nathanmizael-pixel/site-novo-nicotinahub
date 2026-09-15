import { chromium } from 'playwright';

const TIKTOK_DEV_PORTAL = 'https://developers.tiktok.com/apps';
const APP_NAME = 'nicotinacat Hub';
const WEBSITE_URL = 'https://site-novo-nicotinahub.vercel.app';
const TERMS_URL = 'https://site-novo-nicotinahub.vercel.app/terms';
const PRIVACY_URL = 'https://site-novo-nicotinahub.vercel.app/privacy';
const REDIRECT_URI = 'https://site-novo-nicotinahub.vercel.app/auth/tiktok/callback';
const DESCRIPTION = 'Exibe vídeos públicos da comunidade nicotinacat e conecta criadores à comunidade.';
const REVIEW_EXPLANATION = `The nicotinacat Hub is a web community platform. TikTok Login Kit is used to securely authorize the administrator account that owns the TikTok content displayed on the website. The TikTok Display API is used to retrieve the authorized creator's public videos and display their titles, thumbnails, metadata and links on the Videos page. The user.info.basic scope provides the authorized creator's basic identity information, while video.list provides access to the creator's public videos. Tokens are exchanged and stored securely on the server.`;

const REQUIRED_SCOPES = ['user.info.basic', 'video.list'];
const UNWANTED_SCOPES = ['user.info.profile', 'user.info.stats'];

async function takeScreenshot(page, name) {
  await page.screenshot({ path: `tiktok-portal-${name}.png`, fullPage: true });
  console.log(`📸 Screenshot: tiktok-portal-${name}.png`);
}

async function safeClick(page, selector) {
  try {
    const el = page.locator(selector).first();
    await el.waitFor({ state: 'visible', timeout: 5000 });
    await el.click();
    await page.waitForLoadState('networkidle');
    return true;
  } catch { return false; }
}

async function safeFill(page, selector, value) {
  try {
    const el = page.locator(selector).first();
    await el.waitFor({ state: 'visible', timeout: 5000 });
    await el.clear();
    await el.fill(value);
    return true;
  } catch { return false; }
}

async function safeCheck(page, selector) {
  try {
    const el = page.locator(selector).first();
    await el.waitFor({ state: 'visible', timeout: 5000 });
    if (!(await el.isChecked())) await el.check();
    return true;
  } catch { return false; }
}

async function safeUncheck(page, selector) {
  try {
    const el = page.locator(selector).first();
    await el.waitFor({ state: 'visible', timeout: 3000 });
    if (await el.isChecked()) await el.uncheck();
    return true;
  } catch { return false; }
}

async function main() {
  console.log('🔌 Conectando ao Chrome via CDP (porta 9222)...');
  
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  console.log('✅ Conectado ao Chrome real via CDP');
  
  const contexts = browser.contexts();
  const context = contexts[0] || await browser.newContext();
  const pages = context.pages();
  const page = pages[0] || await context.newPage();
  
  console.log('📄 Navegando para TikTok Developer Portal...');
  await page.goto(TIKTOK_DEV_PORTAL, { waitUntil: 'networkidle', timeout: 60000 });
  await takeScreenshot(page, '00-initial');
  
  // Check if we need to login
  const needsLogin = await page.locator('text=Log in, text=Login, text=Entrar, button:has-text("Log in")').first().isVisible({ timeout: 3000 }).catch(() => false);
  const noAccess = await page.locator('text=No access').first().isVisible({ timeout: 3000 }).catch(() => false);
  
  if (needsLogin || noAccess) {
    console.log('⚠️  Sessão não autenticada detectada. Aguardando login manual...');
    console.log('Por favor, faça login no TikTok Developer Portal na janela do Chrome.');
    
    await page.waitForFunction(() => {
      const rows = document.querySelectorAll('table tbody tr, [role="row"], .app-list-item, .app-card, a[href*="/app/"]');
      return rows.length > 0;
    }, { timeout: 300000 });
    await page.waitForLoadState('networkidle');
    console.log('✅ Login detectado - sessão ativa');
  } else {
    console.log('✅ Sessão autenticada existente reconhecida');
  }
  
  await takeScreenshot(page, '01-authenticated');
  
  const result = {
    basicInfo: { appName: false, website: false, termsOfService: false, privacyPolicy: false, platform: false, description: false },
    appIcon: { hasValidIcon: false },
    products: { loginKit: false, displayApi: false },
    loginKitWeb: { enabled: false, redirectUriSaved: false },
    scopes: { active: [], removed: [] },
    appReview: { explanationFilled: false },
    errors: { count: 0, pendingFields: [] },
    redirectUriConfirmed: false,
    scopesConfirmed: false,
    readyForOAuth: false,
    manualActionsNeeded: [],
  };
  
  // Find and open the app
  console.log(`🔍 Procurando app "${APP_NAME}"...`);
  const appRow = page.locator('table tbody tr, [role="row"], .app-list-item, .app-card, a[href*="/app/"]').filter({ hasText: APP_NAME });
  await appRow.first().waitFor({ state: 'visible', timeout: 30000 });
  await appRow.first().click();
  await page.waitForLoadState('networkidle');
  console.log('✅ App aberto');
  await takeScreenshot(page, '02-app-opened');
  
  // 1. Basic Information
  console.log('\n📝 Configurando Basic Information...');
  await safeClick(page, 'text=Basic Information, [data-tab="basic"], a:has-text("Basic"), button:has-text("Basic Information")');
  
  if (await safeFill(page, 'input[name="app_name"], input[placeholder*="App name" i]', APP_NAME)) result.basicInfo.appName = true;
  if (await safeFill(page, 'input[name="website"], input[placeholder*="Website" i]', WEBSITE_URL)) result.basicInfo.website = true;
  if (await safeFill(page, 'input[name="terms_of_service"], input[placeholder*="Terms" i]', TERMS_URL)) result.basicInfo.termsOfService = true;
  if (await safeFill(page, 'input[name="privacy_policy"], input[placeholder*="Privacy" i]', PRIVACY_URL)) result.basicInfo.privacyPolicy = true;
  if (await safeCheck(page, 'input[type="radio"][value="web"], label:has-text("Web") input[type="radio"]')) result.basicInfo.platform = true;
  if (await safeFill(page, 'textarea[name="description"], textarea[placeholder*="Description" i]', DESCRIPTION)) result.basicInfo.description = true;
  await safeClick(page, 'button:has-text("Save"), button:has-text("Salvar"), [type="submit"]');
  await takeScreenshot(page, '03-basic-info');
  
  // 2. App Icon
  console.log('\n🖼️  Verificando App Icon...');
  await safeClick(page, 'text=App icon, [data-tab="icon"], a:has-text("App icon")');
  try {
    const icon = page.locator('img[alt*="icon" i], img[src*="icon" i], .app-icon-preview img').first();
    if (await icon.isVisible({ timeout: 3000 })) {
      const src = await icon.getAttribute('src');
      if (src && !src.includes('placeholder') && !src.includes('default')) result.appIcon.hasValidIcon = true;
    }
  } catch {}
  await takeScreenshot(page, '04-app-icon');
  
  // 3. Products
  console.log('\n📦 Configurando Products...');
  await safeClick(page, 'text=Products, [data-tab="products"], a:has-text("Products")');
  
  try {
    const card = page.locator('text=Login Kit').locator('..').first();
    const btn = card.locator('button:has-text("Add"), button:has-text("Adicionar"), button:has-text("Configure")').first();
    if (await btn.isVisible({ timeout: 3000 })) { await btn.click(); await page.waitForLoadState('networkidle'); }
    result.products.loginKit = true;
  } catch {}
  
  try {
    const card = page.locator('text=Display API, text=TikTok API').first().locator('..').first();
    const btn = card.locator('button:has-text("Add"), button:has-text("Adicionar"), button:has-text("Configure")').first();
    if (await btn.isVisible({ timeout: 3000 })) { await btn.click(); await page.waitForLoadState('networkidle'); }
    result.products.displayApi = true;
  } catch {}
  
  for (const p of ['Share Kit', 'Content Posting API', 'Research API']) {
    try {
      const card = page.locator(`text=${p}`).locator('..').first();
      const btn = card.locator('button:has-text("Remove"), button:has-text("Remover")').first();
      if (await btn.isVisible({ timeout: 2000 })) await btn.click();
    } catch {}
  }
  await takeScreenshot(page, '05-products');
  
  // 4. Login Kit → Web
  console.log('\n🌐 Configurando Login Kit → Web...');
  await safeClick(page, 'text=Login Kit');
  await safeClick(page, 'text=Web, [data-tab="web"]');
  
  if (await safeCheck(page, 'input[type="checkbox"][name*="enable" i], label:has-text("Enable") input[type="checkbox"]')) result.loginKitWeb.enabled = true;
  if (await safeFill(page, 'input[name="redirect_uri"], input[name="redirect_uris"], input[placeholder*="Redirect" i]', REDIRECT_URI)) {
    result.loginKitWeb.redirectUriSaved = true;
  }
  await safeClick(page, 'button:has-text("Save"), button:has-text("Salvar")');
  await takeScreenshot(page, '06-login-kit-web');
  
  // 5. Scopes
  console.log('\n🔐 Configurando Scopes...');
  await safeClick(page, 'text=Scopes, [data-tab="scopes"]');
  
  for (const scope of REQUIRED_SCOPES) {
    if (await safeCheck(page, `input[type="checkbox"][value="${scope}"], label:has-text("${scope}") input[type="checkbox"]`)) {
      result.scopes.active.push(scope);
    }
  }
  for (const scope of UNWANTED_SCOPES) {
    if (await safeUncheck(page, `input[type="checkbox"][value="${scope}"], label:has-text("${scope}") input[type="checkbox"]`)) {
      result.scopes.removed.push(scope);
    }
  }
  await safeClick(page, 'button:has-text("Save"), button:has-text("Salvar")');
  await takeScreenshot(page, '07-scopes');
  
  // 6. App Review
  console.log('\n📋 Configurando App Review...');
  await safeClick(page, 'text=App Review, [data-tab="review"]');
  
  if (await safeFill(page, 'textarea[name="explanation"], textarea[placeholder*="explanation" i]', REVIEW_EXPLANATION)) {
    result.appReview.explanationFilled = true;
  }
  await takeScreenshot(page, '08-app-review');
  
  // 7. Validate and Save
  console.log('\n✅ Validando e salvando...');
  await safeClick(page, 'button:has-text("Save"), button:has-text("Salvar"), [type="submit"]');
  await page.waitForTimeout(2000);
  
  // Check errors
  try {
    const errors = page.locator('.error, .invalid, [role="alert"], .text-red, .error-message').first();
    const count = await errors.count();
    result.errors.count = count;
    for (let i = 0; i < count; i++) {
      const text = await errors.nth(i).textContent();
      if (text?.trim()) result.errors.pendingFields.push(text.trim());
    }
  } catch {}
  
  // Confirm Redirect URI
  try {
    await safeClick(page, 'text=Login Kit');
    await safeClick(page, 'text=Web');
    const uri = await page.locator('input[name="redirect_uri"], input[name="redirect_uris"]').first().inputValue();
    result.redirectUriConfirmed = uri.includes(REDIRECT_URI);
    console.log(`  Redirect URI confirmado: ${result.redirectUriConfirmed ? '✅' : '❌'} (${uri})`);
  } catch {}
  
  // Confirm Scopes
  try {
    await safeClick(page, 'text=Scopes');
    const checked = [];
    for (const s of REQUIRED_SCOPES.concat(UNWANTED_SCOPES)) {
      const cb = page.locator(`input[type="checkbox"][value="${s}"]`).first();
      if (await cb.isVisible({ timeout: 2000 }) && await cb.isChecked()) checked.push(s);
    }
    result.scopesConfirmed = JSON.stringify(checked.sort()) === JSON.stringify(REQUIRED_SCOPES.sort());
    console.log(`  Scopes confirmados: ${result.scopesConfirmed ? '✅' : '❌'} (${checked.join(', ')})`);
  } catch {}
  
  await takeScreenshot(page, '09-final-validation');
  
  // Check manual actions needed
  const url = page.url();
  if (url.includes('login') || url.includes('signin')) result.manualActionsNeeded.push('Login no TikTok Developer Portal');
  if (await page.locator('text=2FA, text=Two-factor').first().isVisible({ timeout: 1000 }).catch(() => false)) result.manualActionsNeeded.push('2FA');
  if (await page.locator('text=CAPTCHA, text=verificação humana').first().isVisible({ timeout: 1000 }).catch(() => false)) result.manualActionsNeeded.push('CAPTCHA');
  if (await page.locator('text=Submit for review, button:has-text("Submit")').first().isVisible({ timeout: 1000 }).catch(() => false)) result.manualActionsNeeded.push('Submissão para review (não fazer ainda)');
  if (result.errors.count > 0) result.manualActionsNeeded.push(`Resolver ${result.errors.count} erro(s) de validação`);
  
  result.readyForOAuth = result.redirectUriConfirmed && result.scopesConfirmed && result.products.loginKit && result.basicInfo.appName && result.basicInfo.website && result.errors.count === 0;
  
  // Summary
  console.log('\n📊 RESUMO DA CONFIGURAÇÃO');
  console.log('============================');
  console.log(`Conectado ao Chrome real via CDP: ✅`);
  console.log(`Sessão existente reconhecida: ${!needsLogin && !noAccess ? '✅' : '⚠️ (login manual necessário)'}`);
  console.log(`App Name: ${result.basicInfo.appName ? '✅' : '❌'}`);
  console.log(`Website: ${result.basicInfo.website ? '✅' : '❌'}`);
  console.log(`Terms of Service: ${result.basicInfo.termsOfService ? '✅' : '❌'}`);
  console.log(`Privacy Policy: ${result.basicInfo.privacyPolicy ? '✅' : '❌'}`);
  console.log(`Platform (Web): ${result.basicInfo.platform ? '✅' : '❌'}`);
  console.log(`Description: ${result.basicInfo.description ? '✅' : '❌'}`);
  console.log(`App Icon válido: ${result.appIcon.hasValidIcon ? '✅' : '❌'}`);
  console.log(`Login Kit: ${result.products.loginKit ? '✅' : '❌'}`);
  console.log(`Display API: ${result.products.displayApi ? '✅' : '❌'}`);
  console.log(`Login Kit Web ativado: ${result.loginKitWeb.enabled ? '✅' : '❌'}`);
  console.log(`Redirect URI salvo: ${result.loginKitWeb.redirectUriSaved ? '✅' : '❌'}`);
  console.log(`Redirect URI confirmado: ${result.redirectUriConfirmed ? '✅' : '❌'}`);
  console.log(`Scopes ativos: ${result.scopes.active.join(', ') || 'nenhum'}`);
  console.log(`Scopes removidos: ${result.scopes.removed.join(', ') || 'nenhum'}`);
  console.log(`Scopes confirmados: ${result.scopesConfirmed ? '✅' : '❌'}`);
  console.log(`App Review explicação: ${result.appReview.explanationFilled ? '✅' : '❌'}`);
  console.log(`Erros de validação: ${result.errors.count}`);
  result.errors.pendingFields.forEach(f => console.log(`   - ${f}`));
  console.log(`\n⚠️  Ações manuais necessárias:`);
  result.manualActionsNeeded.forEach(a => console.log(`   - ${a}`));
  console.log(`\n🚀 Pronto para OAuth: ${result.readyForOAuth ? 'SIM' : 'NÃO'}`);
  
  await browser.close();
}

main().catch(console.error);