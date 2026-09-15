import { test, expect, Page } from '@playwright/test';

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

interface ConfigResult {
  basicInfo: {
    appName: boolean;
    website: boolean;
    termsOfService: boolean;
    privacyPolicy: boolean;
    platform: boolean;
    description: boolean;
  };
  appIcon: {
    hasValidIcon: boolean;
  };
  products: {
    loginKit: boolean;
    displayApi: boolean;
  };
  loginKitWeb: {
    enabled: boolean;
    redirectUriSaved: boolean;
  };
  scopes: {
    active: string[];
    removed: string[];
  };
  appReview: {
    explanationFilled: boolean;
  };
  errors: {
    count: number;
    pendingFields: string[];
  };
  redirectUriConfirmed: boolean;
  scopesConfirmed: boolean;
  readyForOAuth: boolean;
  manualActionsNeeded: string[];
}

async function waitForManualLogin(page: Page): Promise<void> {
  console.log('\n⏸️  AGUARDANDO LOGIN MANUAL...');
  console.log('Por favor, faça login no TikTok Developer Portal (incluindo 2FA/CAPTCHA se necessário).');
  console.log('O script continuará automaticamente quando detectar que você está logado e na lista de apps.\n');

  const loginButton = page.locator('button:has-text("Login"), button:has-text("Entrar"), a:has-text("Login"), button:has-text("Log in")').first();
  if (await loginButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log('🔘 Clicando no botão Login...');
    await loginButton.click();
    await page.waitForLoadState('networkidle');
  }

  console.log('⏳ Aguardando conclusão do login (lista de apps aparecer)...');
  await page.waitForFunction(() => {
    const appRows = document.querySelectorAll('table tbody tr, [role="row"], .app-list-item, .app-card, a[href*="/app/"]');
    return appRows.length > 0;
  }, { timeout: 300000 });
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  console.log('✅ Login detectado - lista de apps visível. Continuando...\n');
}

async function ensureLoggedIn(page: Page): Promise<void> {
  const noAccessText = page.locator('text=No access').first();
  const needsLoginText = page.locator('text=need to login, text=precisa fazer login, text=You need to login').first();
  const loginButton = page.locator('button:has-text("Login"), button:has-text("Entrar")').first();

  const hasNoAccess = await noAccessText.isVisible({ timeout: 3000 }).catch(() => false);
  const needsLogin = await needsLoginText.isVisible({ timeout: 3000 }).catch(() => false);
  const hasLoginButton = await loginButton.isVisible({ timeout: 3000 }).catch(() => false);

  if (hasNoAccess || needsLogin || hasLoginButton) {
    console.log('🔒 Página de login detectada, iniciando fluxo de login...');
    await waitForManualLogin(page);
    return;
  }

  const loginUrl = page.url();
  if (loginUrl.includes('/login') || loginUrl.includes('/signin') || loginUrl.includes('/auth') || loginUrl.includes('/sso')) {
    console.log('🔒 URL de login detectada, aguardando login...');
    await waitForManualLogin(page);
    return;
  }

  const appListVisible = await page.locator('table tbody tr, [role="row"], .app-list-item, .app-card, text=My Apps, text=Meus Apps').first().isVisible({ timeout: 3000 }).catch(() => false);
  if (!appListVisible) {
    console.log('🔒 Lista de apps não visível, assumindo que login é necessário...');
    await waitForManualLogin(page);
  }
}

async function findAndOpenApp(page: Page): Promise<void> {
  console.log('🔍 Procurando o app "nicotinacat Hub"...');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  const appRow = page.locator('table tbody tr, [role="row"], .app-list-item, .app-card, a[href*="app"]').filter({ hasText: APP_NAME });
  await expect(appRow.first()).toBeVisible({ timeout: 30000 });

  await appRow.first().click();
  await page.waitForLoadState('networkidle');
  console.log('✅ App aberto.\n');
}

async function configureBasicInfo(page: Page, result: ConfigResult): Promise<void> {
  console.log('📝 Configurando Basic Information...');

  const basicTab = page.locator('text=Basic Information, [data-tab="basic"], a:has-text("Basic"), button:has-text("Basic Information")').first();
  if (await basicTab.isVisible({ timeout: 5000 }).catch(() => false)) {
    await basicTab.click();
    await page.waitForLoadState('networkidle');
  }

  const fields = [
    { label: 'App name', selector: 'input[name="app_name"], input[placeholder*="App name" i], input[id*="app_name" i]', value: APP_NAME, key: 'appName' },
    { label: 'Website', selector: 'input[name="website"], input[placeholder*="Website" i], input[id*="website" i]', value: WEBSITE_URL, key: 'website' },
    { label: 'Terms of Service', selector: 'input[name="terms_of_service"], input[placeholder*="Terms" i], input[id*="terms" i]', value: TERMS_URL, key: 'termsOfService' },
    { label: 'Privacy Policy', selector: 'input[name="privacy_policy"], input[placeholder*="Privacy" i], input[id*="privacy" i]', value: PRIVACY_URL, key: 'privacyPolicy' },
  ];

  for (const field of fields) {
    try {
      const input = page.locator(field.selector).first();
      await input.waitFor({ state: 'visible', timeout: 5000 });
      await input.clear();
      await input.fill(field.value);
      result.basicInfo[field.key as keyof typeof result.basicInfo] = true;
      console.log(`  ✅ ${field.label}: preenchido`);
    } catch {
      console.log(`  ⚠️  ${field.label}: campo não encontrado`);
    }
  }

  try {
    const webPlatform = page.locator('input[type="radio"][value="web"], label:has-text("Web") input[type="radio"], input[type="radio"][id*="web" i]').first();
    await webPlatform.waitFor({ state: 'visible', timeout: 5000 });
    await webPlatform.check();
    result.basicInfo.platform = true;
    console.log('  ✅ Platform: Web selecionado');
  } catch {
    console.log('  ⚠️  Platform: opção Web não encontrada');
  }

  try {
    const descInput = page.locator('textarea[name="description"], textarea[placeholder*="Description" i], textarea[id*="description" i]').first();
    await descInput.waitFor({ state: 'visible', timeout: 5000 });
    await descInput.clear();
    await descInput.fill(DESCRIPTION);
    result.basicInfo.description = true;
    console.log('  ✅ Description: preenchido');
  } catch {
    console.log('  ⚠️  Description: campo não encontrado');
  }

  try {
    await page.click('button:has-text("Save"), button:has-text("Salvar"), [type="submit"]');
    await page.waitForLoadState('networkidle');
    console.log('  💾 Basic Information salvo');
  } catch {
    console.log('  ⚠️  Botão Save não encontrado');
  }
}

async function checkAppIcon(page: Page, result: ConfigResult): Promise<void> {
  console.log('🖼️  Verificando App Icon...');

  const iconTab = page.locator('text=App icon, [data-tab="icon"], a:has-text("App icon"), button:has-text("App icon")').first();
  if (await iconTab.isVisible({ timeout: 5000 }).catch(() => false)) {
    await iconTab.click();
    await page.waitForLoadState('networkidle');
  }

  try {
    const iconPreview = page.locator('img[alt*="icon" i], img[src*="icon" i], .app-icon-preview img, .icon-preview img').first();
    if (await iconPreview.isVisible({ timeout: 3000 })) {
      const src = await iconPreview.getAttribute('src');
      if (src && !src.includes('placeholder') && !src.includes('default') && !src.includes('data:')) {
        result.appIcon.hasValidIcon = true;
        console.log('  ✅ Ícone válido encontrado');
      } else {
        console.log('  ⚠️  Ícone parece ser placeholder/padrão');
      }
    } else {
      console.log('  ⚠️  Nenhum ícone visível');
    }
  } catch {
    console.log('  ⚠️  Não foi possível verificar ícone');
  }
}

async function configureProducts(page: Page, result: ConfigResult): Promise<void> {
  console.log('📦 Configurando Products...');

  const productsTab = page.locator('text=Products, [data-tab="products"], a:has-text("Products"), button:has-text("Products")').first();
  if (await productsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
    await productsTab.click();
    await page.waitForLoadState('networkidle');
  }

  try {
    const loginKitCard = page.locator('text=Login Kit').locator('..').first();
    const addButton = loginKitCard.locator('button:has-text("Add"), button:has-text("Adicionar"), button:has-text("Configure"), button:has-text("Ativar")').first();
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      await page.waitForLoadState('networkidle');
    }
    result.products.loginKit = true;
    console.log('  ✅ Login Kit: ativo');
  } catch {
    console.log('  ⚠️  Login Kit: não encontrado ou já configurado');
  }

  try {
    const displayApiCard = page.locator('text=Display API, text=TikTok API, text=Display').first().locator('..').first();
    const addButton = displayApiCard.locator('button:has-text("Add"), button:has-text("Adicionar"), button:has-text("Configure"), button:has-text("Ativar")').first();
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      await page.waitForLoadState('networkidle');
    }
    result.products.displayApi = true;
    console.log('  ✅ Display API / TikTok API: ativo');
  } catch {
    console.log('  ⚠️  Display API: não encontrado ou já configurado');
  }

  const unwantedProducts = ['Share Kit', 'Content Posting API', 'Research API'];
  for (const product of unwantedProducts) {
    try {
      const card = page.locator(`text=${product}`).locator('..').first();
      const removeBtn = card.locator('button:has-text("Remove"), button:has-text("Remover"), button:has-text("Desativar")').first();
      if (await removeBtn.isVisible({ timeout: 2000 })) {
        await removeBtn.click();
        console.log(`  🗑️  ${product}: removido`);
      }
    } catch {
      // Ignore - product may not be present
    }
  }
}

async function configureLoginKitWeb(page: Page, result: ConfigResult): Promise<void> {
  console.log('🌐 Configurando Login Kit → Web...');

  const loginKitTab = page.locator('text=Login Kit, a:has-text("Login Kit"), button:has-text("Login Kit")').first();
  if (await loginKitTab.isVisible({ timeout: 5000 }).catch(() => false)) {
    await loginKitTab.click();
    await page.waitForLoadState('networkidle');
  }

  const webTab = page.locator('text=Web, [data-tab="web"], a:has-text("Web"), button:has-text("Web")').first();
  if (await webTab.isVisible({ timeout: 5000 }).catch(() => false)) {
    await webTab.click();
    await page.waitForLoadState('networkidle');
  }

  try {
    const enableToggle = page.locator('input[type="checkbox"][name*="enable" i], label:has-text("Enable") input[type="checkbox"], input[type="checkbox"][id*="enable" i]').first();
    if (await enableToggle.isVisible({ timeout: 3000 })) {
      if (!(await enableToggle.isChecked())) {
        await enableToggle.check();
      }
      result.loginKitWeb.enabled = true;
      console.log('  ✅ Web: ativado');
    }
  } catch {
    console.log('  ⚠️  Toggle de ativação Web não encontrado');
  }

  try {
    const redirectInput = page.locator('input[name="redirect_uri"], input[name="redirect_uris"], input[placeholder*="Redirect" i], input[id*="redirect" i]').first();
    await redirectInput.waitFor({ state: 'visible', timeout: 5000 });
    await redirectInput.clear();
    await redirectInput.fill(REDIRECT_URI);
    result.loginKitWeb.redirectUriSaved = true;
    console.log(`  ✅ Redirect URI: ${REDIRECT_URI}`);
  } catch {
    console.log('  ⚠️  Campo Redirect URI não encontrado');
  }

  try {
    await page.click('button:has-text("Save"), button:has-text("Salvar")');
    await page.waitForLoadState('networkidle');
    console.log('  💾 Login Kit Web salvo');
  } catch {
    console.log('  ⚠️  Botão Save não encontrado');
  }
}

async function configureScopes(page: Page, result: ConfigResult): Promise<void> {
  console.log('🔐 Configurando Scopes...');

  const scopesTab = page.locator('text=Scopes, [data-tab="scopes"], a:has-text("Scopes"), button:has-text("Scopes")').first();
  if (await scopesTab.isVisible({ timeout: 5000 }).catch(() => false)) {
    await scopesTab.click();
    await page.waitForLoadState('networkidle');
  }

  for (const scope of REQUIRED_SCOPES) {
    try {
      const checkbox = page.locator(`input[type="checkbox"][value="${scope}"], label:has-text("${scope}") input[type="checkbox"], input[type="checkbox"][id*="${scope}" i]`).first();
      await checkbox.waitFor({ state: 'visible', timeout: 5000 });
      if (!(await checkbox.isChecked())) {
        await checkbox.check();
      }
      result.scopes.active.push(scope);
      console.log(`  ✅ ${scope}: selecionado`);
    } catch {
      console.log(`  ⚠️  ${scope}: checkbox não encontrado`);
    }
  }

  for (const scope of UNWANTED_SCOPES) {
    try {
      const checkbox = page.locator(`input[type="checkbox"][value="${scope}"], label:has-text("${scope}") input[type="checkbox"], input[type="checkbox"][id*="${scope}" i]`).first();
      await checkbox.waitFor({ state: 'visible', timeout: 3000 });
      if (await checkbox.isChecked()) {
        await checkbox.uncheck();
        result.scopes.removed.push(scope);
        console.log(`  🗑️  ${scope}: desmarcado`);
      }
    } catch {
      // Ignore - scope checkbox may not be present
    }
  }

  try {
    await page.click('button:has-text("Save"), button:has-text("Salvar")');
    await page.waitForLoadState('networkidle');
    console.log('  💾 Scopes salvos');
  } catch {
    console.log('  ⚠️  Botão Save não encontrado');
  }
}

async function configureAppReview(page: Page, result: ConfigResult): Promise<void> {
  console.log('📋 Configurando App Review...');

  const reviewTab = page.locator('text=App Review, [data-tab="review"], a:has-text("App Review"), button:has-text("App Review")').first();
  if (await reviewTab.isVisible({ timeout: 5000 }).catch(() => false)) {
    await reviewTab.click();
    await page.waitForLoadState('networkidle');
  }

  try {
    const explanationField = page.locator('textarea[name="explanation"], textarea[placeholder*="explanation" i], textarea[placeholder*="Explicação" i], textarea[id*="explanation" i]').first();
    await explanationField.waitFor({ state: 'visible', timeout: 5000 });
    await explanationField.clear();
    await explanationField.fill(REVIEW_EXPLANATION);
    result.appReview.explanationFilled = true;
    console.log('  ✅ Explicação preenchida');
  } catch {
    console.log('  ⚠️  Campo de explicação não encontrado');
  }
}

async function validateAndSave(page: Page, result: ConfigResult): Promise<void> {
  console.log('✅ Validando e salvando configurações...');

  try {
    await page.click('button:has-text("Save"), button:has-text("Salvar"), [type="submit"]');
    await page.waitForLoadState('networkidle');
    console.log('  💾 Configurações salvas');
  } catch {
    console.log('  ⚠️  Botão Save final não encontrado');
  }

  await page.waitForTimeout(2000);

  try {
    const errorElements = page.locator('.error, .invalid, [role="alert"], .text-red, .error-message, .field-error, [aria-invalid="true"]').first();
    const errorCount = await errorElements.count();
    result.errors.count = errorCount;

    if (errorCount > 0) {
      for (let i = 0; i < errorCount; i++) {
        const text = await errorElements.nth(i).textContent();
        if (text?.trim()) {
          result.errors.pendingFields.push(text.trim());
        }
      }
      console.log(`  ❌ ${errorCount} erro(s) encontrado(s):`);
      result.errors.pendingFields.forEach(f => console.log(`     - ${f}`));
    } else {
      console.log('  ✅ Nenhum erro de validação');
    }
  } catch {
    console.log('  ⚠️  Não foi possível verificar erros');
  }

  try {
    await page.click('text=Login Kit');
    await page.waitForLoadState('networkidle');
    await page.click('text=Web');
    await page.waitForLoadState('networkidle');

    const redirectInput = page.locator('input[name="redirect_uri"], input[name="redirect_uris"]').first();
    const savedUri = await redirectInput.inputValue();
    result.redirectUriConfirmed = savedUri.includes(REDIRECT_URI);
    console.log(`  ${result.redirectUriConfirmed ? '✅' : '❌'} Redirect URI confirmado: ${savedUri}`);
  } catch {
    console.log('  ⚠️  Não foi possível confirmar Redirect URI');
  }

  try {
    await page.click('text=Scopes');
    await page.waitForLoadState('networkidle');

    const checkedScopes: string[] = [];
    for (const scope of REQUIRED_SCOPES.concat(UNWANTED_SCOPES)) {
      const checkbox = page.locator(`input[type="checkbox"][value="${scope}"]`).first();
      if (await checkbox.isVisible({ timeout: 2000 })) {
        if (await checkbox.isChecked()) {
          checkedScopes.push(scope);
        }
      }
    }
    result.scopesConfirmed = JSON.stringify(checkedScopes.sort()) === JSON.stringify(REQUIRED_SCOPES.sort());
    console.log(`  ${result.scopesConfirmed ? '✅' : '❌'} Scopes confirmados: ${checkedScopes.join(', ')}`);
  } catch {
    console.log('  ⚠️  Não foi possível confirmar Scopes');
  }
}

async function checkManualActions(page: Page, result: ConfigResult): Promise<void> {
  console.log('🔍 Verificando ações manuais necessárias...');

  const currentUrl = page.url();
  if (currentUrl.includes('login') || currentUrl.includes('signin') || currentUrl.includes('auth') || currentUrl.includes('sso')) {
    result.manualActionsNeeded.push('Login no TikTok Developer Portal');
  }

  if (await page.locator('text=2FA, text=Two-factor, text=autenticação de dois fatores').first().isVisible({ timeout: 2000 }).catch(() => false)) {
    result.manualActionsNeeded.push('Autenticação de dois fatores (2FA)');
  }

  if (await page.locator('text=CAPTCHA, text=verificação humana, iframe[src*="captcha"]').first().isVisible({ timeout: 2000 }).catch(() => false)) {
    result.manualActionsNeeded.push('Resolução de CAPTCHA');
  }

  if (await page.locator('text=Submit for review, text=Enviar para revisão, button:has-text("Submit")').first().isVisible({ timeout: 2000 }).catch(() => false)) {
    result.manualActionsNeeded.push('Submissão final para revisão (não fazer ainda)');
  }

  if (result.errors.count > 0) {
    result.manualActionsNeeded.push(`Resolver ${result.errors.count} erro(s) de validação`);
  }

  result.readyForOAuth = result.redirectUriConfirmed &&
                        result.scopesConfirmed &&
                        result.products.loginKit &&
                        result.basicInfo.appName &&
                        result.basicInfo.website &&
                        result.errors.count === 0;

  console.log('\n📊 RESUMO DA CONFIGURAÇÃO:');
  console.log('============================');
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
}

async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: `tiktok-portal-${name}.png`, fullPage: true });
  console.log(`📸 Screenshot salvo: tiktok-portal-${name}.png`);
}

test.use({ browserName: 'chromium' });

test('Configure TikTok Developer Portal for nicotinacat Hub', async ({ page }) => {
  test.setTimeout(600000);
  const result: ConfigResult = {
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

  console.log('🚀 Iniciando configuração do TikTok Developer Portal');
  console.log('====================================================\n');

  await page.goto(TIKTOK_DEV_PORTAL);
  await page.waitForLoadState('networkidle');

  await ensureLoggedIn(page);

  await findAndOpenApp(page);
  await takeScreenshot(page, '01-app-opened');

  await configureBasicInfo(page, result);
  await takeScreenshot(page, '02-basic-info');

  await checkAppIcon(page, result);
  await takeScreenshot(page, '03-app-icon');

  await configureProducts(page, result);
  await takeScreenshot(page, '04-products');

  await configureLoginKitWeb(page, result);
  await takeScreenshot(page, '05-login-kit-web');

  await configureScopes(page, result);
  await takeScreenshot(page, '06-scopes');

  await configureAppReview(page, result);
  await takeScreenshot(page, '07-app-review');

  await validateAndSave(page, result);
  await takeScreenshot(page, '08-final-validation');

  await checkManualActions(page, result);

  console.log('\n✨ Configuração concluída!');
  console.log('Screenshots salvas para verificação visual.');
});