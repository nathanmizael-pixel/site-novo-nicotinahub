import { test, expect } from '@playwright/test';

const PROD_URL = 'https://site-novo-nicotinahub.vercel.app';

test.describe('Production Regression Tests', () => {
  test.describe('Community Page', () => {
    test('empty state shows correct title and description', async ({ page }) => {
      await page.goto(`${PROD_URL}/community`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const emptyState = page.locator('text=O vazio escuta.').first();
      await expect(emptyState).toBeVisible({ timeout: 15000 });

      const description = page.locator('text=Seja a primeira voz a ecoar.').first();
      await expect(description).toBeVisible({ timeout: 15000 });
    });

    test('empty state heading is h3', async ({ page }) => {
      await page.goto(`${PROD_URL}/community`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const heading = page.locator('h3:has-text("O vazio escuta.")');
      await expect(heading).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('Videos Page', () => {
    test('empty state or video grid shows correctly', async ({ page }) => {
      await page.goto(`${PROD_URL}/videos`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const emptyState = page.locator('text=Nada por aqui.').first();
      if (await emptyState.count() > 0) {
        await expect(emptyState).toBeVisible({ timeout: 15000 });
        const description = page.locator('text=Ajuste os filtros e tente de novo.').first();
        await expect(description).toBeVisible({ timeout: 15000 });
      } else {
        const videoGrid = page.locator('[class*="grid"]').first();
        await expect(videoGrid).toBeVisible({ timeout: 15000 });
      }
    });

    test('no overflow on desktop', async ({ page }) => {
      await page.goto(`${PROD_URL}/videos`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const body = page.locator('body');
      const bodyWidth = await body.evaluate((el) => el.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);

      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
    });
  });

  test.describe('Profile Page - Non-existent Profile', () => {
    test('shows "Perfil não encontrado" as H1', async ({ page }) => {
      await page.goto(`${PROD_URL}/profile/non-existent-id-12345`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const h1 = page.locator('h1:has-text("Perfil não encontrado")');
      await expect(h1).toBeVisible({ timeout: 15000 });
    });

    test('description is correct', async ({ page }) => {
      await page.goto(`${PROD_URL}/profile/non-existent-id-12345`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const description = page.locator('text=Esta alma se perdeu no vazio. Ou talvez nunca tenha existido.');
      await expect(description).toBeVisible({ timeout: 15000 });
    });

    test('CTA button "Voltar à Comunidade" exists', async ({ page }) => {
      await page.goto(`${PROD_URL}/profile/non-existent-id-12345`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const ctaButton = page.locator('button:has-text("Voltar à Comunidade")');
      await expect(ctaButton).toBeVisible({ timeout: 15000 });
      await expect(ctaButton).toBeEnabled({ timeout: 15000 });
    });
  });

  test.describe('Profile Page - Authenticated Profile (if accessible)', () => {
    test('page loads without errors', async ({ page }) => {
      await page.goto(`${PROD_URL}/profile`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      // Should either show profile or redirect to auth
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible({ timeout: 15000 });
    });
  });
});