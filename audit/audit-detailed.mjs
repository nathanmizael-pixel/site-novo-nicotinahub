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

async function detailedAudit(page, url, pageName, viewportName) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`DETAILED: ${pageName} (${viewportName})`);
  console.log(`${'='.repeat(70)}`);
  
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);
  
  // Get computed styles for key elements
  const styleInfo = await page.evaluate(() => {
    const results = {};
    
    // Body styles
    const body = document.body;
    const bodyStyle = window.getComputedStyle(body);
    results.body = {
      backgroundColor: bodyStyle.backgroundColor,
      color: bodyStyle.color,
      fontFamily: bodyStyle.fontFamily,
      fontSize: bodyStyle.fontSize,
      lineHeight: bodyStyle.lineHeight
    };
    
    // Check for dark fantasy/metal identity markers
    const html = document.documentElement.outerHTML;
    results.hasDarkBg = html.includes('#0a0a0a') || html.includes('#111') || html.includes('#000') || bodyStyle.backgroundColor.includes('0, 0, 0') || bodyStyle.backgroundColor.includes('10, 10, 10');
    results.hasMetalColors = html.includes('#c9a84c') || html.includes('#d4af37') || html.includes('#b8860b') || html.includes('gold') || html.includes('amber');
    results.hasRedAccents = html.includes('#dc2626') || html.includes('#ef4444') || html.includes('#b91c1c') || html.includes('red-600') || html.includes('red-500');
    
    // Check all elements for spacing issues
    const allElements = document.querySelectorAll('*');
    const spacingIssues = [];
    const alignmentIssues = [];
    
    allElements.forEach(el => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      
      // Check for tiny tap targets (mobile)
      if (rect.width > 0 && rect.height > 0 && rect.width < 44 && rect.height < 44 && 
          (el.tagName === 'BUTTON' || el.tagName === 'A' || el.getAttribute('role') === 'button')) {
        spacingIssues.push({
          tag: el.tagName,
          class: el.className,
          size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
          text: el.innerText.slice(0, 30)
        });
      }
      
      // Check for text too small
      const fontSize = parseFloat(style.fontSize);
      if (fontSize > 0 && fontSize < 12 && el.innerText.trim().length > 10) {
        spacingIssues.push({
          tag: el.tagName,
          class: el.className,
          issue: `Font size ${fontSize}px`,
          text: el.innerText.slice(0, 30)
        });
      }
      
      // Check for overflow
      if (rect.right > window.innerWidth + 5) {
        alignmentIssues.push({
          tag: el.tagName,
          class: el.className,
          overflow: Math.round(rect.right - window.innerWidth),
          text: el.innerText.slice(0, 30)
        });
      }
    });
    
    results.spacingIssues = spacingIssues.slice(0, 10);
    results.alignmentIssues = alignmentIssues.slice(0, 10);
    
    // Check specific components
    const cards = document.querySelectorAll('[class*="card"], [class*="Card"], article, .video-card, .post-card');
    results.cardCount = cards.length;
    if (cards.length > 0) {
      const firstCard = cards[0];
      const cardStyle = window.getComputedStyle(firstCard);
      results.cardStyle = {
        backgroundColor: cardStyle.backgroundColor,
        border: cardStyle.border,
        borderRadius: cardStyle.borderRadius,
        padding: cardStyle.padding,
        margin: cardStyle.margin,
        gap: cardStyle.gap
      };
    }
    
    // Check buttons
    const buttons = document.querySelectorAll('button, a[role="button"], .btn, [class*="btn"]');
    results.buttonCount = buttons.length;
    const buttonStyles = [];
    buttons.forEach((btn, i) => {
      if (i < 5) {
        const style = window.getComputedStyle(btn);
        buttonStyles.push({
          text: btn.innerText.trim().slice(0, 30),
          backgroundColor: style.backgroundColor,
          color: style.color,
          border: style.border,
          borderRadius: style.borderRadius,
          padding: style.padding,
          fontWeight: style.fontWeight,
          cursor: style.cursor
        });
      }
    });
    results.buttonStyles = buttonStyles;
    
    // Check for generic/placeholder text
    const allText = document.body.innerText;
    const genericPatterns = [
      /lorem ipsum/i,
      /placeholder/i,
      /em breve/i,
      /coming soon/i,
      /sua (jornada|experiência|aventura)/i,
      /descubra (o|a|os|as)/i,
      /explore (o|a|os|as)/i,
      /junte.se/i,
      /faça parte/i,
      /não perca/i
    ];
    results.genericText = genericPatterns.filter(p => p.test(allText)).map(p => p.source);
    
    // Check heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingData = [];
    headings.forEach(h => {
      headingData.push({
        level: h.tagName,
        text: h.innerText.trim(),
        class: h.className
      });
    });
    results.headings = headingData;
    
    // Check images
    const images = document.querySelectorAll('img');
    const imageData = [];
    images.forEach(img => {
      imageData.push({
        src: img.src.slice(0, 80),
        alt: img.alt || '[NO ALT]',
        width: img.naturalWidth,
        height: img.naturalHeight,
        displayedWidth: img.width,
        displayedHeight: img.height,
        class: img.className
      });
    });
    results.images = imageData;
    
    // Check forms
    const forms = document.querySelectorAll('form');
    const formData = [];
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea');
      formData.push({
        inputCount: inputs.length,
        action: form.action,
        method: form.method
      });
    });
    results.forms = formData;
    
    // Check for empty states
    const emptySelectors = ['.empty', '.vazio', '[data-empty]', '.no-results', '.no-items'];
    const emptyStates = [];
    emptySelectors.forEach(sel => {
      const els = document.querySelectorAll(sel);
      els.forEach(el => emptyStates.push({
        selector: sel,
        text: el.innerText.trim().slice(0, 100),
        visible: el.offsetWidth > 0 && el.offsetHeight > 0
      }));
    });
    // Also check text content for empty messages
    const emptyTexts = allText.match(/nenhum|vazio|empty|no items|no results|em breve|coming soon/gi);
    if (emptyTexts) {
      results.emptyTextMatches = [...new Set(emptyTexts.map(t => t.toLowerCase()))];
    }
    results.emptyStates = emptyStates;
    
    // Check navigation/footer
    const nav = document.querySelector('nav, [role="navigation"], header');
    if (nav) {
      const navStyle = window.getComputedStyle(nav);
      results.nav = {
        exists: true,
        height: nav.offsetHeight,
        backgroundColor: navStyle.backgroundColor,
        links: nav.querySelectorAll('a').length
      };
    } else {
      results.nav = { exists: false };
    }
    
    const footer = document.querySelector('footer, [role="contentinfo"]');
    if (footer) {
      results.footer = {
        exists: true,
        text: footer.innerText.trim().slice(0, 200)
      };
    } else {
      results.footer = { exists: false };
    }
    
    return results;
  });
  
  // Print results
  console.log('\n--- IDENTITY CHECK ---');
  console.log(`Dark background: ${styleInfo.hasDarkBg ? '✅' : '❌'}`);
  console.log(`Metal/gold accents: ${styleInfo.hasMetalColors ? '✅' : '❌'}`);
  console.log(`Red accents: ${styleInfo.hasRedAccents ? '✅' : '❌'}`);
  console.log(`Body bg: ${styleInfo.body.backgroundColor}`);
  console.log(`Body font: ${styleInfo.body.fontFamily}`);
  console.log(`Body color: ${styleInfo.body.color}`);
  
  console.log('\n--- HEADING HIERARCHY ---');
  styleInfo.headings.forEach(h => {
    console.log(`  ${h.level}: "${h.text}" ${h.class ? `(.${h.class.split(' ')[0]})` : ''}`);
  });
  
  console.log('\n--- BUTTON STYLES ---');
  styleInfo.buttonStyles.forEach((btn, i) => {
    console.log(`  [${i}] "${btn.text}"`);
    console.log(`       bg: ${btn.backgroundColor} | color: ${btn.color} | border: ${btn.border}`);
    console.log(`       radius: ${btn.borderRadius} | padding: ${btn.padding} | weight: ${btn.fontWeight}`);
  });
  
  console.log('\n--- CARDS ---');
  console.log(`Count: ${styleInfo.cardCount}`);
  if (styleInfo.cardStyle) {
    console.log(`Style: bg=${styleInfo.cardStyle.backgroundColor} border=${styleInfo.cardStyle.border} radius=${styleInfo.cardStyle.borderRadius} padding=${styleInfo.cardStyle.padding} gap=${styleInfo.cardStyle.gap}`);
  }
  
  console.log('\n--- IMAGES ---');
  styleInfo.images.forEach((img, i) => {
    console.log(`  [${i}] ${img.src}`);
    console.log(`       alt: "${img.alt}" | natural: ${img.width}x${img.height} | displayed: ${img.displayedWidth}x${img.displayedHeight}`);
  });
  
  console.log('\n--- SPACING ISSUES (tap targets < 44px, tiny text) ---');
  if (styleInfo.spacingIssues.length === 0) {
    console.log('  None detected');
  } else {
    styleInfo.spacingIssues.forEach(issue => {
      console.log(`  ⚠️ ${issue.tag}.${issue.class}: ${issue.size || issue.issue} - "${issue.text}"`);
    });
  }
  
  console.log('\n--- ALIGNMENT/OVERFLOW ISSUES ---');
  if (styleInfo.alignmentIssues.length === 0) {
    console.log('  None detected');
  } else {
    styleInfo.alignmentIssues.forEach(issue => {
      console.log(`  ⚠️ ${issue.tag}.${issue.class}: overflow ${issue.overflow}px - "${issue.text}"`);
    });
  }
  
  console.log('\n--- GENERIC/TEMPLATE TEXT ---');
  if (styleInfo.genericText.length === 0) {
    console.log('  None detected');
  } else {
    styleInfo.genericText.forEach(t => console.log(`  ⚠️ Pattern: ${t}`));
  }
  
  console.log('\n--- EMPTY STATES ---');
  console.log(`Text matches: ${styleInfo.emptyTextMatches ? styleInfo.emptyTextMatches.join(', ') : 'none'}`);
  styleInfo.emptyStates.forEach(es => {
    if (es.visible) console.log(`  ${es.selector}: "${es.text}"`);
  });
  
  console.log('\n--- NAV/FOOTER ---');
  console.log(`Nav: ${styleInfo.nav.exists ? `✅ (h=${styleInfo.nav.height}, links=${styleInfo.nav.links})` : '❌'}`);
  console.log(`Footer: ${styleInfo.footer.exists ? '✅' : '❌'}`);
  if (styleInfo.footer.exists) console.log(`  "${styleInfo.footer.text}"`);
  
  console.log('\n--- FORMS ---');
  styleInfo.forms.forEach((f, i) => console.log(`  Form ${i}: ${f.inputCount} inputs, action=${f.action}, method=${f.method}`));
  
  return styleInfo;
}

async function runDetailedAudit() {
  const browser = await chromium.launch({ headless: true });
  const allResults = {};
  
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    
    console.log(`\n${'#'.repeat(70)}`);
    console.log(`VIEWPORT: ${viewport.name.toUpperCase()} (${viewport.width}x${viewport.height})`);
    console.log(`${'#'.repeat(70)}`);
    
    for (const pageInfo of PAGES) {
      const url = BASE_URL + pageInfo.path;
      try {
        const result = await detailedAudit(page, url, pageInfo.name, viewport.name);
        if (!allResults[pageInfo.name]) allResults[pageInfo.name] = {};
        allResults[pageInfo.name][viewport.name] = result;
      } catch (e) {
        console.log(`ERRO em ${pageInfo.name}: ${e.message}`);
      }
    }
    
    await context.close();
  }
  
  await browser.close();
  
  // Final summary
  console.log('\n\n' + '#'.repeat(70));
  console.log('FINAL SUMMARY - KEY FINDINGS');
  console.log('#'.repeat(70));
  
  for (const [pageName, viewports] of Object.entries(allResults)) {
    console.log(`\n### ${pageName} ###`);
    const desktop = viewports.desktop;
    if (desktop) {
      console.log(`Identity: Dark=${desktop.hasDarkBg} Metal=${desktop.hasMetalColors} Red=${desktop.hasRedAccents}`);
      console.log(`Headings: ${desktop.headings.length} (${desktop.headings.map(h => `${h.level}:${h.text.slice(0,20)}`).join(', ')})`);
      console.log(`Buttons: ${desktop.buttonCount}, Cards: ${desktop.cardCount}, Images: ${desktop.images.length}`);
      console.log(`Spacing issues: ${desktop.spacingIssues.length}, Alignment issues: ${desktop.alignmentIssues.length}`);
      console.log(`Generic text patterns: ${desktop.genericText.join(', ') || 'none'}`);
      console.log(`Empty states: ${desktop.emptyTextMatches ? desktop.emptyTextMatches.join(', ') : 'none'}`);
      console.log(`Nav: ${desktop.nav.exists ? 'yes' : 'no'}, Footer: ${desktop.footer.exists ? 'yes' : 'no'}`);
    }
  }
}

runDetailedAudit().catch(console.error);