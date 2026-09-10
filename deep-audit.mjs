import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';

async function deepAudit() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    const consoleErrors = [];
    const networkErrors = [];

    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    page.on('pageerror', error => {
        consoleErrors.push(error.message);
    });

    page.on('response', response => {
        if (response.status() >= 400) {
            networkErrors.push(`${response.status()} ${response.url()}`);
        }
    });

    // ============ HOME PAGE DEEP AUDIT ============
    console.log('\n========== HOME PAGE DEEP AUDIT ==========');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Get computed styles of key elements
    const heroStyles = await page.evaluate(() => {
        const hero = document.querySelector('section');
        const h1 = document.querySelector('h1');
        const logo = document.querySelector('svg');
        const buttons = document.querySelectorAll('button, a[role="button"]');
        const cards = document.querySelectorAll('.card-surface, .card-elevated');
        
        return {
            hero: hero ? {
                bg: getComputedStyle(hero).background,
                bgImage: getComputedStyle(hero).backgroundImage,
                minHeight: getComputedStyle(hero).minHeight,
            } : null,
            h1: h1 ? {
                fontFamily: getComputedStyle(h1).fontFamily,
                fontSize: getComputedStyle(h1).fontSize,
                fontWeight: getComputedStyle(h1).fontWeight,
                color: getComputedStyle(h1).color,
                letterSpacing: getComputedStyle(h1).letterSpacing,
            } : null,
            logo: logo ? {
                width: getComputedStyle(logo).width,
                height: getComputedStyle(logo).height,
            } : null,
            buttons: Array.from(buttons).map(b => ({
                text: b.textContent?.trim(),
                bg: getComputedStyle(b).backgroundColor,
                color: getComputedStyle(b).color,
                border: getComputedStyle(b).border,
                borderRadius: getComputedStyle(b).borderRadius,
            })),
            cards: Array.from(cards).slice(0, 3).map(c => ({
                bg: getComputedStyle(c).backgroundColor,
                border: getComputedStyle(c).border,
                boxShadow: getComputedStyle(c).boxShadow,
                borderRadius: getComputedStyle(c).borderRadius,
            })),
        };
    });
    console.log('HOME styles:', JSON.stringify(heroStyles, null, 2));

    // Get section structure
    const sections = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('section')).map((s, i) => ({
            index: i,
            className: s.className,
            children: s.children.length,
            firstChildTag: s.firstElementChild?.tagName,
            firstChildClass: s.firstElementChild?.className,
        }));
    });
    console.log('HOME sections:', JSON.stringify(sections, null, 2));

    // ============ COMMUNITY PAGE DEEP AUDIT ============
    console.log('\n========== COMMUNITY PAGE DEEP AUDIT ==========');
    await page.goto(`${BASE_URL}/community`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const communityStyles = await page.evaluate(() => {
        const feed = document.querySelector('main') || document.querySelector('div[class*="max-w"]');
        const posts = document.querySelectorAll('.card-surface, .card-elevated');
        const composer = document.querySelector('textarea');
        const avatar = document.querySelector('[class*="rounded-full"]');
        
        return {
            feed: feed ? {
                maxWidth: getComputedStyle(feed).maxWidth,
                padding: getComputedStyle(feed).padding,
            } : null,
            postsCount: posts.length,
            postSample: posts.length > 0 ? {
                bg: getComputedStyle(posts[0]).backgroundColor,
                border: getComputedStyle(posts[0]).border,
                padding: getComputedStyle(posts[0]).padding,
                margin: getComputedStyle(posts[0]).margin,
            } : null,
            composer: composer ? {
                bg: getComputedStyle(composer).backgroundColor,
                border: getComputedStyle(composer).border,
                placeholder: composer.placeholder,
            } : null,
            avatar: avatar ? {
                width: getComputedStyle(avatar).width,
                height: getComputedStyle(avatar).height,
                border: getComputedStyle(avatar).border,
            } : null,
        };
    });
    console.log('COMMUNITY styles:', JSON.stringify(communityStyles, null, 2));

    // ============ PROFILE PAGE DEEP AUDIT ============
    console.log('\n========== PROFILE PAGE DEEP AUDIT ==========');
    await page.goto(`${BASE_URL}/profile`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const profileStyles = await page.evaluate(() => {
        const headerCard = document.querySelector('.card-elevated');
        const avatar = document.querySelector('[class*="rounded-full"][class*="w-20"], [class*="rounded-full"][class*="w-14"]');
        const stats = document.querySelectorAll('[class*="grid"] [class*="text-center"]');
        const progressBar = document.querySelector('[role="progressbar"], [class*="progress"]');
        
        return {
            headerCard: headerCard ? {
                bg: getComputedStyle(headerCard).backgroundColor,
                border: getComputedStyle(headerCard).border,
                boxShadow: getComputedStyle(headerCard).boxShadow,
            } : null,
            avatar: avatar ? {
                width: getComputedStyle(avatar).width,
                height: getComputedStyle(avatar).height,
                border: getComputedStyle(avatar).border,
            } : null,
            statsCount: stats.length,
            progressBar: progressBar ? {
                width: getComputedStyle(progressBar).width,
                height: getComputedStyle(progressBar).height,
                bg: getComputedStyle(progressBar).backgroundColor,
            } : null,
        };
    });
    console.log('PROFILE styles:', JSON.stringify(profileStyles, null, 2));

    // ============ WISHLIST PAGE DEEP AUDIT ============
    console.log('\n========== WISHLIST PAGE DEEP AUDIT ==========');
    await page.goto(`${BASE_URL}/wishlist`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const wishlistStyles = await page.evaluate(() => {
        const cards = document.querySelectorAll('.card-surface, .card-elevated');
        const ctaButton = document.querySelector('a[href*="amazon"] button, button:has-text("Amazon")');
        
        return {
            cardsCount: cards.length,
            cardSample: cards.length > 0 ? {
                bg: getComputedStyle(cards[0]).backgroundColor,
                border: getComputedStyle(cards[0]).border,
                aspectRatio: getComputedStyle(cards[0]).aspectRatio,
            } : null,
            ctaButton: ctaButton ? {
                bg: getComputedStyle(ctaButton).backgroundColor,
                color: getComputedStyle(ctaButton).color,
            } : null,
        };
    });
    console.log('WISHLIST styles:', JSON.stringify(wishlistStyles, null, 2));

    // ============ AUTH PAGE DEEP AUDIT ============
    console.log('\n========== AUTH PAGE DEEP AUDIT ==========');
    await page.goto(`${BASE_URL}/auth`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const authStyles = await page.evaluate(() => {
        const form = document.querySelector('form');
        const container = document.querySelector('.card-elevated');
        const inputs = document.querySelectorAll('input');
        const tabs = document.querySelectorAll('button[role="tab"], .flex.gap-1 button');
        
        return {
            container: container ? {
                bg: getComputedStyle(container).backgroundColor,
                border: getComputedStyle(container).border,
                boxShadow: getComputedStyle(container).boxShadow,
                borderRadius: getComputedStyle(container).borderRadius,
            } : null,
            inputs: Array.from(inputs).slice(0, 2).map(i => ({
                type: i.type,
                bg: getComputedStyle(i).backgroundColor,
                border: getComputedStyle(i).border,
                placeholder: i.placeholder,
                padding: getComputedStyle(i).padding,
            })),
            tabs: Array.from(tabs).map(t => ({
                text: t.textContent?.trim(),
                bg: getComputedStyle(t).backgroundColor,
                color: getComputedStyle(t).color,
            })),
        };
    });
    console.log('AUTH styles:', JSON.stringify(authStyles, null, 2));

    // ============ GLOBAL STYLES ============
    console.log('\n========== GLOBAL DESIGN TOKENS ==========');
    const globalTokens = await page.evaluate(() => {
        const root = document.documentElement;
        const body = document.body;
        
        // Check CSS custom properties
        const styles = getComputedStyle(root);
        
        // Check font loading
        const fonts = Array.from(document.fonts.values()).map(f => ({
            family: f.family,
            status: f.status,
        }));
        
        // Check for specific patterns
        const elementsWithGradient = document.querySelectorAll('[style*="gradient"], [class*="gradient"]');
        const elementsWithGlow = document.querySelectorAll('[style*="glow"], [class*="glow"], [style*="shadow"]');
        const elementsWithBlur = document.querySelectorAll('[style*="blur"], [class*="blur"]');
        
        return {
            bodyBg: getComputedStyle(body).backgroundColor,
            bodyBgImage: getComputedStyle(body).backgroundImage,
            fontsLoaded: fonts,
            gradientElements: elementsWithGradient.length,
            glowElements: elementsWithGlow.length,
            blurElements: elementsWithBlur.length,
        };
    });
    console.log('GLOBAL tokens:', JSON.stringify(globalTokens, null, 2));

    // ============ ANIMATION AUDIT ============
    console.log('\n========== ANIMATION AUDIT ==========');
    const animationAudit = await page.evaluate(() => {
        const animatedElements = document.querySelectorAll('[class*="animate-"], [style*="animation"], [style*="transition"]');
        const keyframes = Array.from(document.styleSheets).flatMap(sheet => {
            try {
                return Array.from(sheet.cssRules || []).filter(rule => rule.type === CSSRule.KEYFRAMES_RULE).map(r => r.name);
            } catch (e) {
                return [];
            }
        });
        
        return {
            animatedElementsCount: animatedElements.length,
            animatedClasses: Array.from(animatedElements).slice(0, 10).map(el => el.className),
            keyframes: [...new Set(keyframes)],
        };
    });
    console.log('ANIMATION audit:', JSON.stringify(animationAudit, null, 2));

    // ============ RESPONSIVE BREAKPOINT TEST ============
    console.log('\n========== RESPONSIVE TEST ==========');
    for (const viewport of [
        { name: 'desktop', width: 1920, height: 1080 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'mobile', width: 375, height: 667 },
    ]) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(300);
        
        const overflow = await page.evaluate(() => {
            return {
                bodyScrollWidth: document.body.scrollWidth,
                bodyClientWidth: document.body.clientWidth,
                hasHorizontalScroll: document.body.scrollWidth > document.body.clientWidth,
                maxElementWidth: Math.max(...Array.from(document.querySelectorAll('*')).map(el => el.getBoundingClientRect().width)),
            };
        });
        console.log(`${viewport.name} (${viewport.width}px):`, overflow);
    }

    // ============ COLOR AUDIT ============
    console.log('\n========== COLOR AUDIT ==========');
    const colorAudit = await page.evaluate(() => {
        const allElements = document.querySelectorAll('*');
        const colors = new Set();
        const bgColors = new Set();
        const borderColors = new Set();
        
        allElements.forEach(el => {
            const style = getComputedStyle(el);
            if (style.color !== 'rgba(0, 0, 0, 0)') colors.add(style.color);
            if (style.backgroundColor !== 'rgba(0, 0, 0, 0)') bgColors.add(style.backgroundColor);
            if (style.borderColor !== 'rgba(0, 0, 0, 0)') borderColors.add(style.borderColor);
        });
        
        return {
            uniqueTextColors: colors.size,
            uniqueBgColors: bgColors.size,
            uniqueBorderColors: borderColors.size,
            textColors: Array.from(colors).slice(0, 20),
            bgColors: Array.from(bgColors).slice(0, 20),
        };
    });
    console.log('COLOR audit:', JSON.stringify(colorAudit, null, 2));

    // Summary
    console.log('\n========== CONSOLE ERRORS ==========');
    console.log(consoleErrors.length > 0 ? consoleErrors : 'None');
    
    console.log('\n========== NETWORK ERRORS ==========');
    console.log(networkErrors.length > 0 ? networkErrors : 'None');

    await browser.close();
}

deepAudit().catch(console.error);