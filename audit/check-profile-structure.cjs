const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('=== Testing Profile page structure (with mock check) ===');
  await page.goto('https://site-novo-nicotinahub.vercel.app/profile/c153d999-ecb1-4d8e-9c90-205613077fa7', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Check page structure elements
  const elements = [
    ['EmptyState title', 'text=Perfil não encontrado'],
    ['EmptyState description', 'text=Esta alma ainda não entrou'],
    ['Button Voltar', 'text=Voltar para a Comunidade'],
    ['XP Progress label', 'text=Progresso de XP'],
    ['XP value', 'text=/\\d+ \\/ \\d+ XP/'],
    ['Next level', 'text=Próximo nível em'],
    ['ProgressBar', '[role="progressbar"]'],
    ['Level stat', 'text=Nível'],
    ['Gold stat', 'text=Ouro'],
    ['Class stat', 'text=Classe'],
    ['Joined stat', 'text=Entrou em'],
    ['Followers', 'text=Seguidores'],
    ['Following', 'text=Seguindo'],
    ['Posts', 'text=Posts'],
  ];
  
  for (const [name, selector] of elements) {
    const el = await page.locator(selector).first();
    const count = await el.count();
    console.log(`${count > 0 ? '✓' : '✗'} ${name}: ${count > 0 ? 'FOUND' : 'NOT FOUND'}`);
  }
  
  await browser.close();
})();