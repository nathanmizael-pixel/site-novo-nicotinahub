import { chromium } from 'playwright';

const BASE_URL = 'https://site-novo-nicotinahub.vercel.app';

async function auditHomeAndVideos() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  for (const path of ['/', '/videos']) {
    const url = BASE_URL + path;
    console.log('\n=== ' + path + ' ===');
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);
    
    const data = await page.evaluate(() => {
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
      
      // Full HTML for identity check
      const html = document.documentElement.outerHTML;
      results.hasDarkBg = bodyStyle.backgroundColor.includes('5, 4, 7') || bodyStyle.backgroundColor.includes('0, 0, 0');
      results.hasPurple = html.includes('168, 85, 247') || html.includes('a855f7') || html.includes('purple-500');
      results.hasGold = html.includes('c9a84c') || html.includes('d4af37') || html.includes('gold') || html.includes('amber');
      results.hasRed = html.includes('dc2626') || html.includes('ef4444') || html.includes('red-600') || html.includes('red-500');
      
      // Headings
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      results.headings = [];
      headings.forEach(h => {
        results.headings.push({
          level: h.tagName,
          text: (h.innerText || '').trim(),
          class: h.className
        });
      });
      
      // Buttons
      const buttons = document.querySelectorAll('button, a[role="button"], .btn, [class*="btn"]');
      results.buttons = [];
      buttons.forEach((btn, i) => {
        if (i < 10) {
          const style = window.getComputedStyle(btn);
          results.buttons.push({
            text: (btn.innerText || '').trim().slice(0, 50),
            tag: btn.tagName,
            href: btn.getAttribute('href') || '',
            bg: style.backgroundColor,
            color: style.color,
            border: style.border,
            radius: style.borderRadius,
            padding: style.padding,
            weight: style.fontWeight,
            cursor: style.cursor
          });
        }
      });
      
      // Cards
      const cards = document.querySelectorAll('[class*="card"], [class*="Card"], article, .video-card, .post-card, [class*="grid"] > div');
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
      
      // Images
      const images = document.querySelectorAll('img');
      results.images = [];
      images.forEach(img => {
        results.images.push({
          src: img.src.slice(0, 80),
          alt: img.alt || '[NO ALT]',
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          displayedWidth: img.width,
          displayedHeight: img.height,
          class: img.className
        });
      });
      
      // All text for generic check
      const allText = document.body.innerText || '';
      const genericPatterns = [
        'lorem ipsum', 'placeholder', 'em breve', 'coming soon',
        'sua jornada', 'sua experiência', 'sua aventura',
        'descubra o', 'descubra a', 'explore o', 'explore a',
        'junte-se', 'faça parte', 'não perca'
      ];
      results.genericText = genericPatterns.filter(p => allText.toLowerCase().includes(p));
      
      // Empty states
      const emptyTexts = allText.match(/nenhum|vazio|empty|no items|no results|em breve|coming soon/gi);
      results.emptyTextMatches = emptyTexts ? [...new Set(emptyTexts.map(t => t.toLowerCase()))] : [];
      
      // Nav/Footer
      const nav = document.querySelector('nav, [role="navigation"], header');
      results.nav = nav ? { exists: true, height: nav.offsetHeight, links: nav.querySelectorAll('a').length } : { exists: false };
      
      const footer = document.querySelector('footer, [role="contentinfo"]');
      results.footer = footer ? { exists: true, text: (footer.innerText || '').trim().slice(0, 200) } : { exists: false };
      
      // Spacing issues - tap targets
      const allElements = document.querySelectorAll('*');
      results.spacingIssues = [];
      allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (rect.width > 0 && rect.height > 0 && rect.width < 44 && rect.height < 44 && 
            (el.tagName === 'BUTTON' || el.tagName === 'A' || el.getAttribute('role') === 'button' || el.classList.contains('btn'))) {
          results.spacingIssues.push({
            tag: el.tagName,
            class: el.className,
            size: Math.round(rect.width) + 'x' + Math.round(rect.height),
            text: (el.innerText || '').trim().slice(0, 30)
          });
        }
        const fontSize = parseFloat(style.fontSize);
        if (fontSize > 0 && fontSize < 12 && (el.innerText || '').trim().length > 10) {
          results.spacingIssues.push({
            tag: el.tagName,
            class: el.className,
            issue: 'Font size ' + fontSize + 'px',
            text: (el.innerText || '').trim().slice(0, 30)
          });
        }
      });
      
      // Alignment
      results.alignmentIssues = [];
      allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth + 5) {
          results.alignmentIssues.push({
            tag: el.tagName,
            class: el.className,
            overflow: Math.round(rect.right - window.innerWidth),
            text: (el.innerText || '').trim().slice(0, 30)
          });
        }
      });
      
      return results;
    });
    
    console.log('Body bg:', data.body.backgroundColor);
    console.log('Dark bg:', data.hasDarkBg, 'Purple:', data.hasPurple, 'Gold:', data.hasGold, 'Red:', data.hasRed);
    console.log('Headings:', data.headings.map(h => h.level + ':' + h.text.slice(0,30)).join(' | '));
    console.log('Buttons:', data.buttons.length);
    data.buttons.forEach((b, i) => console.log('  ['+i+'] "'+b.text+'" bg='+b.bg+' color='+b.color+' radius='+b.radius+' padding='+b.padding));
    console.log('Cards:', data.cardCount);
    if (data.cardStyle) console.log('Card style:', JSON.stringify(data.cardStyle));
    console.log('Images:', data.images.length);
    data.images.forEach((img, i) => console.log('  ['+i+'] '+img.src+' alt="'+img.alt+'" natural='+img.naturalWidth+'x'+img.naturalHeight));
    console.log('Generic text:', data.genericText.join(', ') || 'none');
    console.log('Empty states:', data.emptyTextMatches.join(', ') || 'none');
    console.log('Spacing issues:', data.spacingIssues.length);
    data.spacingIssues.slice(0,5).forEach(s => console.log('  '+s.tag+'.'+s.class.substring(0,30)+': '+s.size+' - "'+s.text+'"'));
    console.log('Alignment issues:', data.alignmentIssues.length);
    data.alignmentIssues.slice(0,5).forEach(a => console.log('  '+a.tag+'.'+a.class.substring(0,30)+': overflow '+a.overflow+'px'));
    console.log('Nav:', data.nav.exists, 'Footer:', data.footer.exists);
  }
  
  await browser.close();
}

auditHomeAndVideos().catch(console.error);