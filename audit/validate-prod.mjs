import { chromium } from 'playwright';

const BASE_URL = 'https://site-novo-nicotinahub.vercel.app';

async function validateProduction() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    console.log('🚀 PRODUCTION VALIDATION');
    console.log('='.repeat(60));

    // Community mobile
    console.log('\n1️⃣ COMMUNITY MOBILE (390x844)');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/community`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    
    const communityCTAs = await page.locator('button:has-text("Entrar"), a:has-text("Entrar")').all();
    console.log('  CTAs de entrada:');
    for (const el of communityCTAs) {
        const tag = await el.evaluate(e => e.tagName);
        const text = await el.innerText();
        const classes = await el.getAttribute('class');
        const parent = await el.evaluate(e => e.parentElement?.tagName);
        console.log(`    ${tag}.${classes}: "${text}" (parent: ${parent})`);
    }
    
    const bodyText = await page.locator('body').innerText();
    console.log('  Textos chave:', bodyText.includes('O vazio escuta.') ? '✅' : '❌', 'O vazio escuta.');
    console.log('              ', bodyText.includes('Seja a primeira voz a ecoar.') ? '✅' : '❌', 'Seja a primeira voz a ecoar.');

    // Videos desktop
    console.log('\n2️⃣ VIDEOS DESKTOP');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/videos`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    console.log('  Headings:');
    for (const h of headings) {
        const tag = await h.evaluate(el => el.tagName.toLowerCase());
        const text = await h.innerText();
        console.log(`    ${tag}: "${text}"`);
    }
    
    const badge = await page.locator('text=/Novos vídeos toda semana/i').count();
    console.log(`  Badge "Novos vídeos toda semana": ${badge === 1 ? '✅ 1x' : '❌ ' + badge + 'x'}`);
    
    const querVerMais = await page.locator('h1:has-text("Quer ver mais"), h2:has-text("Quer ver mais"), h3:has-text("Quer ver mais")').count();
    console.log(`  "Quer ver mais?" é heading: ${querVerMais === 0 ? '✅ Não' : '❌ Sim'}`);
    
    const featuredCount = await page.locator('[class*="featured" i]').count();
    console.log(`  Featured sections: ${featuredCount === 0 ? '✅ 0 (deduped)' : featuredCount}`);

    // Videos mobile
    console.log('\n3️⃣ VIDEOS MOBILE (390x844)');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    
    const overflow = await page.evaluate(() => {
        const results = [];
        document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth + 5 && rect.width > 0) {
                results.push({ tag: el.tagName, class: el.className, overflow: Math.round(rect.right - window.innerWidth) });
            }
        });
        return results;
    });
    console.log(`  Overflow: ${overflow.length === 0 ? '✅ None' : '❌ ' + overflow.length + ' elements'}`);

    // Wishlist desktop
    console.log('\n4️⃣ WISHLIST DESKTOP');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/wishlist`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    
    const amazonCTAs = await page.locator('a[href*="amazon" i], button:has-text("Amazon")').all();
    console.log('  CTAs Amazon:');
    for (const el of amazonCTAs) {
        const tag = await el.evaluate(e => e.tagName);
        const text = await el.innerText();
        const href = await el.getAttribute('href');
        console.log(`    ${tag}: "${text}" href=${href}`);
    }
    
    const wishlistBody = await page.locator('body').innerText();
    console.log('  H1 "Lista de Desejos":', wishlistBody.includes('Lista de Desejos') ? '✅' : '❌');
    console.log('  "A forja está fria.":', wishlistBody.includes('A forja está fria.') ? '✅' : '❌');
    console.log('  "Itens sendo escolhidos a dedo.":', wishlistBody.includes('Itens sendo escolhidos a dedo.') ? '✅' : '❌');
    console.log('  "Lista de desejos em breve":', wishlistBody.includes('Lista de desejos em breve') ? '❌ PRESENTE' : '✅ Ausente');

    // Wishlist mobile
    console.log('\n5️⃣ WISHLIST MOBILE (390x844)');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    
    const overflowWL = await page.evaluate(() => {
        const results = [];
        document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth + 5 && rect.width > 0) {
                results.push({ tag: el.tagName, class: el.className, overflow: Math.round(rect.right - window.innerWidth) });
            }
        });
        return results;
    });
    console.log(`  Overflow: ${overflowWL.length === 0 ? '✅ None' : '❌ ' + overflowWL.length + ' elements'}`);

    // Header desktop (logged out)
    console.log('\n6️⃣ HEADER DESKTOP (DESLOGADO)');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    
    const headerEntrar = await page.locator('a[href="/auth"]').first();
    console.log('  Botão "Entrar" visível:', await headerEntrar.isVisible() ? '✅' : '❌');
    
    // Check no user dropdown when logged out
    const userBtn = page.locator('button[aria-label*="user" i], button[aria-label*="perfil" i], [class*="avatar"] button').first();
    console.log('  Dropdown usuário (não deve aparecer deslogado):', await userBtn.isVisible({ timeout: 1000 }) ? '❌ Visível' : '✅ Oculto');

    // Header mobile
    console.log('\n7️⃣ HEADER MOBILE');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    
    const mobileMenuBtn = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], [aria-expanded][aria-controls]').first();
    console.log('  Botão hambúrguer:', await mobileMenuBtn.isVisible({ timeout: 2000 }) ? '✅' : '❌');
    
    if (await mobileMenuBtn.isVisible({ timeout: 1000 })) {
        await mobileMenuBtn.click();
        await page.waitForTimeout(300);
        const mobileLinks = await page.locator('nav a, [role="navigation"] a').all();
        console.log(`  Links no menu mobile: ${mobileLinks.length} ${mobileLinks.length > 0 ? '✅' : '❌'}`);
    }

    await browser.close();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ VALIDAÇÃO DE PRODUÇÃO CONCLUÍDA');
}

validateProduction().catch(console.error);