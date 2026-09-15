import { chromium } from 'playwright';

async function main() {
  console.log('🔌 Tentando conectar ao Chrome via CDP (http://127.0.0.1:9222)...');
  
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    console.log('✅ Conectado ao Chrome via CDP');
    
    const contexts = browser.contexts();
    console.log(`\n📋 Contexts encontrados: ${contexts.length}`);
    
    for (let i = 0; i < contexts.length; i++) {
      const ctx = contexts[i];
      const pages = ctx.pages();
      console.log(`\n  Context ${i}: ${pages.length} página(s)`);
      
      for (let j = 0; j < pages.length; j++) {
        const page = pages[j];
        const url = page.url();
        const title = await page.title().catch(() => 'sem título');
        console.log(`    Página ${j}: ${title}`);
        console.log(`      URL: ${url}`);
        
        if (url.includes('developers.tiktok.com') || url.includes('tiktok.com')) {
          console.log(`      🎯 PÁGINA DO TIKTOK ENCONTRADA!`);
          
          // Check if authenticated
          const needsLogin = await page.locator('text=Log in, text=Login, text=Entrar, button:has-text("Log in")').first().isVisible({ timeout: 2000 }).catch(() => false);
          const noAccess = await page.locator('text=No access').first().isVisible({ timeout: 2000 }).catch(() => false);
          const appList = await page.locator('table tbody tr, [role="row"], .app-list-item, .app-card, a[href*="/app/"]').first().isVisible({ timeout: 2000 }).catch(() => false);
          
          if (needsLogin || noAccess) {
            console.log(`      ⚠️  NÃO autenticada - precisa de login`);
          } else if (appList) {
            console.log(`      ✅ AUTENTICADA - lista de apps visível`);
          } else {
            console.log(`      ❓ Estado desconhecido`);
          }
        }
      }
    }
    
    await browser.close();
  } catch (error) {
    console.error('❌ Falha ao conectar via CDP:', error.message);
    console.log('\nA sessão atual do Chrome não está disponível via CDP na porta 9222.');
  }
}

main();