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

    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });
    page.on('pageerror', error => {
        consoleErrors.push(error.message);
    });

    const pages = [
        { path: '/', name: 'home' },
        { path: '/videos', name: 'videos' },
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
            await page.waitForTimeout(1000);
            
            await page.setViewportSize({ width: 1920, height: 1080 });
            await takeScreenshot(page, `${name}-desktop`);
            
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.waitForTimeout(500);
            await takeScreenshot(page, `${name}-tablet`);
            
            await page.setViewportSize({ width: 375, height: 667 });
            await page.waitForTimeout(500);
            await takeScreenshot(page, `${name}-mobile`);
            
            await page.setViewportSize({ width: 1920, height: 1080 });
            
            const title = await page.title();
            console.log(`Page title: ${title}`);
            
        } catch (error) {
            console.error(`Error visiting ${route}:`, error.message);
        }
    }

    console.log('\n=== Console Errors ===');
    console.log(consoleErrors.length > 0 ? consoleErrors : 'None');

    await browser.close();
    console.log('\n=== Audit complete ===');
}

audit().catch(console.error);