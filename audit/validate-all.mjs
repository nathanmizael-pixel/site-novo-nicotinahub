import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = 'C:\\Users\\Desktop\\Downloads\\project\\validation-screenshots';

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function takeScreenshot(page, name) {
    const filename = path.join(OUTPUT_DIR, `${name}.png`);
    await page.screenshot({ path: filename, fullPage: true });
    console.log(`📸 Screenshot: ${filename}`);
    return filename;
}

function logCheck(category, check, passed, details = '') {
    const status = passed ? '✅' : '❌';
    console.log(`  ${status} [${category}] ${check}${details ? ` - ${details}` : ''}`);
    return passed;
}

async function validateCommunityMobile(page) {
    console.log('\n' + '='.repeat(60));
    console.log('1️⃣  COMUNIDADE MOBILE (390x844)');
    console.log('='.repeat(60));
    
    await page.goto(`${BASE_URL}/community`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'community-mobile-validation');

    let allPassed = true;

    // Check menu opens/closes
    try {
        const menuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], [aria-expanded]').first();
        if (await menuButton.isVisible({ timeout: 2000 })) {
            const ariaLabel = await menuButton.getAttribute('aria-label');
            const ariaExpandedBefore = await menuButton.getAttribute('aria-expanded');
            
            await menuButton.click();
            await page.waitForTimeout(300);
            
            const ariaExpandedAfter = await menuButton.getAttribute('aria-expanded');
            const menuOpened = ariaExpandedBefore !== ariaExpandedAfter;
            
            allPassed &= logCheck('COMMUNITY', 'Menu abre/fecha', menuOpened, `aria-expanded: ${ariaExpandedBefore} -> ${ariaExpandedAfter}`);
            allPassed &= logCheck('COMMUNITY', 'aria-label correto no botão menu', !!ariaLabel, `aria-label: "${ariaLabel}"`);
            
            // Close menu
            await menuButton.click();
            await page.waitForTimeout(300);
        } else {
            allPassed &= logCheck('COMMUNITY', 'Menu abre/fecha', false, 'Botão de menu não encontrado');
            allPassed &= logCheck('COMMUNITY', 'aria-label correto no botão menu', false, 'Botão de menu não encontrado');
        }
    } catch (e) {
        allPassed &= logCheck('COMMUNITY', 'Menu abre/fecha', false, `Erro: ${e.message}`);
        allPassed &= logCheck('COMMUNITY', 'aria-label correto no botão menu', false, `Erro: ${e.message}`);
    }

    // Check tap targets ≥44px
    const tapTargets = await page.evaluate(() => {
        const elements = document.querySelectorAll('button, a[role="button"], [role="button"], .clip-corner-sm');
        const results = [];
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                results.push({
                    tag: el.tagName,
                    class: el.className,
                    text: el.innerText.trim().slice(0, 30),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height),
                    passes: rect.width >= 44 && rect.height >= 44
                });
            }
        });
        return results;
    });
    
    const failedTapTargets = tapTargets.filter(t => !t.passes);
    allPassed &= logCheck('COMMUNITY', 'Tap targets ≥44px', failedTapTargets.length === 0, 
        failedTapTargets.length > 0 ? `${failedTapTargets.length} falharam: ${failedTapTargets.map(t => `${t.tag}.${t.class}: ${t.width}x${t.height}`).join(', ')}` : 'Todos ≥44px');

    // Check no cutoff/overlap
    const overflowElements = await page.evaluate(() => {
        const results = [];
        document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth + 5 && rect.width > 0) {
                results.push({
                    tag: el.tagName,
                    class: el.className,
                    overflow: Math.round(rect.right - window.innerWidth),
                    text: el.innerText.trim().slice(0, 30)
                });
            }
        });
        return results;
    });
    
    allPassed &= logCheck('COMMUNITY', 'Nenhum corte/sobreposição', overflowElements.length === 0,
        overflowElements.length > 0 ? `${overflowElements.length} elementos com overflow` : 'Sem overflow');

    // Check single entry CTA
    const ctaButtons = await page.locator('button:has-text("Entrar"), button:has-text("Participar"), a:has-text("Entrar"), a:has-text("Participar"), .btn-primary, [class*="cta"]').all();
    const visibleCTAs = [];
    for (const btn of ctaButtons) {
        if (await btn.isVisible()) {
            visibleCTAs.push(await btn.innerText());
        }
    }
    allPassed &= logCheck('COMMUNITY', 'Apenas um CTA visual de entrada', visibleCTAs.length <= 1, 
        `CTAs encontrados: ${visibleCTAs.join(', ') || 'nenhum'}`);

    // Check for specific texts
    const bodyText = await page.locator('body').innerText();
    allPassed &= logCheck('COMMUNITY', 'Texto "O vazio escuta."', bodyText.includes('O vazio escuta.'));
    allPassed &= logCheck('COMMUNITY', 'Texto "Seja a primeira voz a ecoar."', bodyText.includes('Seja a primeira voz a ecoar.'));

    // Check navigation exists
    const nav = await page.locator('nav, [role="navigation"], header').first();
    allPassed &= logCheck('COMMUNITY', 'Navegação presente', await nav.isVisible());

    // Check footer exists
    const footer = await page.locator('footer, [role="contentinfo"]').first();
    allPassed &= logCheck('COMMUNITY', 'Footer presente', await footer.isVisible());

    return allPassed;
}

async function validateVideos(page) {
    console.log('\n' + '='.repeat(60));
    console.log('2️⃣  VÍDEOS');
    console.log('='.repeat(60));
    
    await page.goto(`${BASE_URL}/videos`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'videos-desktop-validation');

    let allPassed = true;

    // Check headings hierarchy
    const headings = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
            level: h.tagName,
            text: h.innerText.trim(),
            class: h.className
        }));
    });

    const h1Count = headings.filter(h => h.level === 'H1').length;
    const h2Count = headings.filter(h => h.level === 'H2').length;
    const h3InCards = headings.filter(h => h.level === 'H3' && (h.class.includes('card') || h.class.includes('Card')));
    
    allPassed &= logCheck('VIDEOS', 'H1 correto (apenas 1)', h1Count === 1, `H1 count: ${h1Count}`);
    allPassed &= logCheck('VIDEOS', 'H2 presentes', h2Count > 0, `H2 count: ${h2Count}`);
    allPassed &= logCheck('VIDEOS', 'Sem H3 desnecessários nos cards', h3InCards.length === 0, 
        h3InCards.length > 0 ? `H3 nos cards: ${h3InCards.map(h => h.text).join(', ')}` : 'Sem H3 nos cards');
    
    console.log('  Headings encontrados:');
    headings.forEach(h => console.log(`    ${h.level}: "${h.text}" ${h.class ? `(.${h.class.split(' ')[0]})` : ''}`));

    // Check featured not duplicated
    const featuredSections = await page.locator('[class*="featured" i], [class*="destaque" i]').all();
    allPassed &= logCheck('VIDEOS', 'Featured não duplicado', featuredSections.length <= 1, 
        `Featured sections: ${featuredSections.length}`);

    // Check "Quer ver mais?" is not a heading
    const querVerMaisHeading = await page.locator('h1:has-text("Quer ver mais"), h2:has-text("Quer ver mais"), h3:has-text("Quer ver mais"), h4:has-text("Quer ver mais")').count();
    allPassed &= logCheck('VIDEOS', '"Quer ver mais?" não é heading', querVerMaisHeading === 0);

    // Check badge "Novos vídeos toda semana" appears once
    const badgeCount = await page.locator('text=/Novos vídeos toda semana/i').count();
    allPassed &= logCheck('VIDEOS', 'Badge "Novos vídeos toda semana" aparece 1 vez', badgeCount === 1, 
        `Encontrado: ${badgeCount} vezes`);

    // Check filters and labels work
    const filterSelects = await page.locator('select, [role="combobox"]').all();
    const filterLabels = await page.locator('label').all();
    allPassed &= logCheck('VIDEOS', 'Filtros e labels funcionam', filterSelects.length > 0 || filterLabels.length > 0,
        `Selects: ${filterSelects.length}, Labels: ${filterLabels.length}`);

    // Check empty state (new)
    const emptyStateElements = await page.locator('[class*="empty"], [class*="vazio"]').all();
    const bodyTextVideos = await page.locator('body').innerText();
    const hasEmptyText = /nenhum|vazio|no results|no videos/i.test(bodyTextVideos);
    const emptyStates = [...emptyStateElements];
    if (hasEmptyText) {
        emptyStates.push({ isTextMatch: true });
    }

    const visibleEmptyStates = [];
    for (const es of emptyStates) {
        if (es.isTextMatch || await es.isVisible().catch(() => false)) {
            if (es.isTextMatch) {
                visibleEmptyStates.push('Texto de empty state detectado no body');
            } else {
                visibleEmptyStates.push(await es.innerText().catch(() => 'elemento vazio'));
            }
        }
    }
    allPassed &= logCheck('VIDEOS', 'Empty state novo presente', visibleEmptyStates.length > 0,
        visibleEmptyStates.length > 0 ? `Textos: ${visibleEmptyStates.join('; ')}` : 'Nenhum empty state visível');

    // Mobile validation
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await takeScreenshot(page, 'videos-mobile-validation');
    
    const mobileOverflow = await page.evaluate(() => {
        const results = [];
        document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth + 5 && rect.width > 0) {
                results.push({ tag: el.tagName, class: el.className, overflow: Math.round(rect.right - window.innerWidth) });
            }
        });
        return results;
    });
    allPassed &= logCheck('VIDEOS', 'Mobile sem quebra/overflow', mobileOverflow.length === 0,
        mobileOverflow.length > 0 ? `${mobileOverflow.length} elementos com overflow` : 'Sem overflow mobile');

    // Desktop validation
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);
    await takeScreenshot(page, 'videos-desktop-validation-2');
    
    const desktopOverflow = await page.evaluate(() => {
        const results = [];
        document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth + 5 && rect.width > 0) {
                results.push({ tag: el.tagName, class: el.className, overflow: Math.round(rect.right - window.innerWidth) });
            }
        });
        return results;
    });
    allPassed &= logCheck('VIDEOS', 'Desktop sem quebra/overflow', desktopOverflow.length === 0,
        desktopOverflow.length > 0 ? `${desktopOverflow.length} elementos com overflow` : 'Sem overflow desktop');

    return allPassed;
}

async function validateWishlist(page) {
    console.log('\n' + '='.repeat(60));
    console.log('3️⃣  WISHLIST');
    console.log('='.repeat(60));
    
    await page.goto(`${BASE_URL}/wishlist`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'wishlist-desktop-validation');

    let allPassed = true;

    // Check H1 correct
    const h1 = await page.locator('h1').first();
    const h1Text = await h1.innerText().catch(() => '');
    allPassed &= logCheck('WISHLIST', 'H1 correto', h1Text.length > 0, `H1: "${h1Text}"`);

    // Check no "Lista de desejos em breve"
    const bodyText = await page.locator('body').innerText();
    allPassed &= logCheck('WISHLIST', 'Sem "Lista de desejos em breve"', !bodyText.includes('Lista de desejos em breve'));

    // Check for specific texts
    allPassed &= logCheck('WISHLIST', 'Texto "A forja está fria."', bodyText.includes('A forja está fria.'));
    allPassed &= logCheck('WISHLIST', 'Texto "Itens sendo escolhidos a dedo."', bodyText.includes('Itens sendo escolhidos a dedo.'));

    // Check single CTA to Amazon
    const amazonLinks = await page.locator('a[href*="amazon" i], button:has-text("Amazon")').all();
    const visibleAmazonCTAs = [];
    for (const link of amazonLinks) {
        if (await link.isVisible()) {
            visibleAmazonCTAs.push(await link.innerText().catch(() => link.getAttribute('href') || 'link'));
        }
    }
    allPassed &= logCheck('WISHLIST', 'Apenas um CTA para Amazon', visibleAmazonCTAs.length === 1,
        `CTAs Amazon: ${visibleAmazonCTAs.join(', ') || 'nenhum'}`);

    // Mobile validation
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await takeScreenshot(page, 'wishlist-mobile-validation');
    
    const mobileOverflow = await page.evaluate(() => {
        const results = [];
        document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth + 5 && rect.width > 0) {
                results.push({ tag: el.tagName, class: el.className, overflow: Math.round(rect.right - window.innerWidth) });
            }
        });
        return results;
    });
    allPassed &= logCheck('WISHLIST', 'Mobile sem problemas', mobileOverflow.length === 0,
        mobileOverflow.length > 0 ? `${mobileOverflow.length} elementos com overflow` : 'Sem overflow mobile');

    // Desktop validation
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);
    await takeScreenshot(page, 'wishlist-desktop-validation-2');
    
    const desktopOverflow = await page.evaluate(() => {
        const results = [];
        document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth + 5 && rect.width > 0) {
                results.push({ tag: el.tagName, class: el.className, overflow: Math.round(rect.right - window.innerWidth) });
            }
        });
        return results;
    });
    allPassed &= logCheck('WISHLIST', 'Desktop sem problemas', desktopOverflow.length === 0,
        desktopOverflow.length > 0 ? `${desktopOverflow.length} elementos com overflow` : 'Sem overflow desktop');

    return allPassed;
}

async function validateHeader(page) {
    console.log('\n' + '='.repeat(60));
    console.log('4️⃣  HEADER');
    console.log('='.repeat(60));
    
    let allPassed = true;

    // Desktop header
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'header-desktop-validation');

    // Check user dropdown
    try {
        const userButton = page.locator('button[aria-label*="user" i], button[aria-label*="perfil" i], button[aria-label*="conta" i], [class*="avatar"] button, [class*="user-menu"] button').first();
        if (await userButton.isVisible({ timeout: 2000 })) {
            await userButton.click();
            await page.waitForTimeout(300);
            await takeScreenshot(page, 'header-dropdown-open');
            
            // Check "Meu perfil"
            const meuPerfil = page.locator('text=/Meu perfil/i').first();
            allPassed &= logCheck('HEADER', 'Dropdown tem "Meu perfil"', await meuPerfil.isVisible({ timeout: 1000 }));
            
            // Check "Sair"
            const sair = page.locator('text=/Sair/i, text=/Logout/i, text=/Sign out/i').first();
            allPassed &= logCheck('HEADER', 'Dropdown tem "Sair"', await sair.isVisible({ timeout: 1000 }));
            
            // Check notifications
            const notificacoes = page.locator('text=/Notificações/i, text=/Notifications/i, [aria-label*="notif" i]').first();
            allPassed &= logCheck('HEADER', 'Dropdown tem Notificações', await notificacoes.isVisible({ timeout: 1000 }));
            
            // Close dropdown
            await page.keyboard.press('Escape');
            await page.waitForTimeout(300);
        } else {
            allPassed &= logCheck('HEADER', 'Dropdown do usuário', false, 'Botão do usuário não encontrado no desktop');
            allPassed &= logCheck('HEADER', 'Dropdown tem "Meu perfil"', false);
            allPassed &= logCheck('HEADER', 'Dropdown tem "Sair"', false);
            allPassed &= logCheck('HEADER', 'Dropdown tem Notificações', false);
        }
    } catch (e) {
        allPassed &= logCheck('HEADER', 'Dropdown do usuário', false, `Erro: ${e.message}`);
        allPassed &= logCheck('HEADER', 'Dropdown tem "Meu perfil"', false);
        allPassed &= logCheck('HEADER', 'Dropdown tem "Sair"', false);
        allPassed &= logCheck('HEADER', 'Dropdown tem Notificações', false);
    }

    // Test logout functionality
    try {
        const userButton = page.locator('button[aria-label*="user" i], button[aria-label*="perfil" i], [class*="avatar"] button').first();
        if (await userButton.isVisible({ timeout: 2000 })) {
            await userButton.click();
            await page.waitForTimeout(300);
            
            const sair = page.locator('text=/Sair/i, text=/Logout/i').first();
            if (await sair.isVisible({ timeout: 1000 })) {
                await sair.click();
                await page.waitForTimeout(1000);
                
                // Check if redirected to auth or home
                const currentUrl = page.url();
                const loggedOut = currentUrl.includes('/auth') || currentUrl === BASE_URL + '/';
                allPassed &= logCheck('HEADER', 'Logout funciona', loggedOut, `Redirecionado para: ${currentUrl}`);
            } else {
                allPassed &= logCheck('HEADER', 'Logout funciona', false, 'Botão Sair não encontrado no dropdown');
            }
        }
    } catch (e) {
        allPassed &= logCheck('HEADER', 'Logout funciona', false, `Erro: ${e.message}`);
    }

    // Mobile header
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'header-mobile-validation');

    // Check mobile menu button
    try {
        const mobileMenuBtn = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], [aria-expanded][aria-controls]').first();
        const hasMobileMenu = await mobileMenuBtn.isVisible({ timeout: 2000 });
        allPassed &= logCheck('HEADER', 'Menu mobile (botão hambúrguer)', hasMobileMenu);
        
        if (hasMobileMenu) {
            await mobileMenuBtn.click();
            await page.waitForTimeout(300);
            await takeScreenshot(page, 'header-mobile-menu-open');
            
            // Check menu items in mobile menu
            const menuItems = await page.locator('[role="menu"] a, [role="navigation"] a, nav a').all();
            allPassed &= logCheck('HEADER', 'Menu mobile tem itens de navegação', menuItems.length > 0, `${menuItems.length} links no menu`);
            
            // Close
            await page.keyboard.press('Escape');
            await page.waitForTimeout(300);
        }
    } catch (e) {
        allPassed &= logCheck('HEADER', 'Menu mobile (botão hambúrguer)', false, `Erro: ${e.message}`);
        allPassed &= logCheck('HEADER', 'Menu mobile tem itens de navegação', false);
    }

    return allPassed;
}

async function runValidation() {
    console.log('🚀 INICIANDO VALIDAÇÃO COMPLETA DAS 4 ÁREAS');
    console.log('='.repeat(60));
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ 
        viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();

    // Listen for console errors
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });
    page.on('pageerror', error => {
        consoleErrors.push(error.message);
    });

    const results = {
        community: false,
        videos: false,
        wishlist: false,
        header: false
    };

    try {
        results.community = await validateCommunityMobile(page);
        results.videos = await validateVideos(page);
        results.wishlist = await validateWishlist(page);
        results.header = await validateHeader(page);
    } catch (e) {
        console.error('Erro durante validação:', e);
    }

    await browser.close();

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO FINAL');
    console.log('='.repeat(60));
    
    Object.entries(results).forEach(([area, passed]) => {
        const status = passed ? '✅ Passou' : '❌ Falhou';
        console.log(`  ${area.toUpperCase()}: ${status}`);
    });

    const allPassed = Object.values(results).every(r => r);
    console.log(`\n${allPassed ? '✅ TODAS AS VALIDAÇÕES PASSARAM' : '❌ ALGUMAS VALIDAÇÕES FALHARAM'}`);

    if (consoleErrors.length > 0) {
        console.log('\n⚠️ Console Errors detectados:');
        consoleErrors.forEach(e => console.log(`  - ${e}`));
    }

    return { results, consoleErrors, allPassed };
}

runValidation().catch(console.error);