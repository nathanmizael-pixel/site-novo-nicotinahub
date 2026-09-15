import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = 'C:\\Users\\Desktop\\Downloads\\project\\audit-screenshots';

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function takeScreenshot(page, name, options = {}) {
    const filename = path.join(OUTPUT_DIR, `${name}.png`);
    await page.screenshot({ path: filename, fullPage: true, ...options });
    console.log(`Screenshot saved: ${filename}`);
    return filename;
}

async function audit() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    // Listen for console errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log(`[CONSOLE ERROR] ${msg.text()}`);
        }
    });

    page.on('pageerror', error => {
        console.log(`[PAGE ERROR] ${error.message}`);
    });

    const pages = [
        { path: '/', name: 'home' },
        { path: '/community', name: 'community' },
        { path: '/profile', name: 'profile' },
        { path: '/wishlist', name: 'wishlist' },
        { path: '/auth', name: 'auth' },
        { path: '/terms', name: 'terms' },
        { path: '/privacy', name: 'privacy' },
    ];

    for (const { path: route, name } of pages) {
        try {
            console.log(`\n=== Visiting ${BASE_URL}${route} ===`);
            await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
            await page.waitForTimeout(1000); // Let animations settle
            
            // Desktop screenshot
            await takeScreenshot(page, `${name}-desktop`);
            
            // Tablet screenshot
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.waitForTimeout(500);
            await takeScreenshot(page, `${name}-tablet`);
            
            // Mobile screenshot
            await page.setViewportSize({ width: 375, height: 667 });
            await page.waitForTimeout(500);
            await takeScreenshot(page, `${name}-mobile`);
            
            // Reset to desktop
            await page.setViewportSize({ width: 1920, height: 1080 });
            
            // Check for any specific elements
            const title = await page.title();
            console.log(`Page title: ${title}`);
            
            // Check for console errors
            const logs = [];
            page.on('console', msg => logs.push(msg.text()));
            
        } catch (error) {
            console.error(`Error visiting ${route}:`, error.message);
        }
    }

    // Test hover states on Home
    try {
        await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);
        
        // Hover over buttons
        const buttons = await page.locator('button, a[role="button"], .clip-corner-sm').all();
        for (let i = 0; i < Math.min(buttons.length, 5); i++) {
            try {
                await buttons[i].hover();
                await page.waitForTimeout(300);
            } catch (e) {}
        }
        
        // Hover over cards
        const cards = await page.locator('.card-surface, .card-elevated').all();
        for (let i = 0; i < Math.min(cards.length, 5); i++) {
            try {
                await cards[i].hover();
                await page.waitForTimeout(300);
            } catch (e) {}
        }
        
        await takeScreenshot(page, 'home-hover-states');
    } catch (e) {
        console.error('Hover test error:', e.message);
    }

    // Test Community interactions
    try {
        await page.goto(`${BASE_URL}/community`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);
        
        // Check for comment expansion
        const commentButtons = await page.locator('button:has-text("Comment"), button:has(svg)').all();
        console.log(`Found ${commentButtons.length} potential comment buttons`);
        
        await takeScreenshot(page, 'community-interactions');
    } catch (e) {
        console.error('Community interaction error:', e.message);
    }

    // Test Auth form interactions
    try {
        await page.goto(`${BASE_URL}/auth`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);
        
        // Switch to signup
        const signupTab = await page.locator('button:has-text("Sign Up")').first();
        if (await signupTab.isVisible()) {
            await signupTab.click();
            await page.waitForTimeout(300);
            await takeScreenshot(page, 'auth-signup');
        }
        
        // Switch back to login
        const loginTab = await page.locator('button:has-text("Sign In")').first();
        if (await loginTab.isVisible()) {
            await loginTab.click();
            await page.waitForTimeout(300);
            await takeScreenshot(page, 'auth-login');
        }
    } catch (e) {
        console.error('Auth interaction error:', e.message);
    }

    await browser.close();
    console.log('\n=== Audit complete ===');
}

audit().catch(console.error);