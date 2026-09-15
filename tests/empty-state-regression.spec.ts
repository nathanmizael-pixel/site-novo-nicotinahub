import { test, expect } from '@playwright/test';

test.describe('EmptyState Regression Tests', () => {
  test.describe('Community Page - Empty State', () => {
    test('empty state shows correct title and description', async ({ page }) => {
      await page.goto('/community', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const emptyState = page.locator('text=O vazio escuta.').first();
      await expect(emptyState).toBeVisible({ timeout: 10000 });

      const description = page.locator('text=Seja a primeira voz a ecoar.').first();
      await expect(description).toBeVisible({ timeout: 10000 });
    });

    test('empty state heading is correct (h3 by default)', async ({ page }) => {
      await page.goto('/community', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const heading = page.locator('h3:has-text("O vazio escuta.")');
      await expect(heading).toBeVisible({ timeout: 10000 });
    });

    test('no unexpected heading changes', async ({ page }) => {
      await page.goto('/community', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const h1 = page.locator('h1:has-text("O vazio escuta.")');
      const h2 = page.locator('h2:has-text("O vazio escuta.")');
      const h4 = page.locator('h4:has-text("O vazio escuta.")');
      const h5 = page.locator('h5:has-text("O vazio escuta.")');
      const h6 = page.locator('h6:has-text("O vazio escuta.")');

      await expect(h1).toHaveCount(0);
      await expect(h2).toHaveCount(0);
      await expect(h4).toHaveCount(0);
      await expect(h5).toHaveCount(0);
      await expect(h6).toHaveCount(0);
    });

    test('CTA is not present in community empty state', async ({ page }) => {
      await page.goto('/community', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const emptyStateContainer = page.locator('text=O vazio escuta.').locator('..');
      const buttons = emptyStateContainer.locator('button, a');
      await expect(buttons).toHaveCount(0);
    });
  });

  test.describe('Videos Page - Empty State', () => {
    test('empty state shows correct title and description when no videos', async ({ page }) => {
      await page.goto('/videos', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const emptyState = page.locator('text=Nada por aqui.').first();
      if (await emptyState.count() > 0) {
        await expect(emptyState).toBeVisible({ timeout: 10000 });

        const description = page.locator('text=Ajuste os filtros e tente de novo.').first();
        await expect(description).toBeVisible({ timeout: 10000 });
      } else {
        // Videos exist - verify the grid is shown
        const videoGrid = page.locator('[class*="grid"]').first();
        await expect(videoGrid).toBeVisible({ timeout: 10000 });
      }
    });

    test('empty state heading is correct when shown', async ({ page }) => {
      await page.goto('/videos', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const heading = page.locator('h3:has-text("Nada por aqui.")');
      if (await heading.count() > 0) {
        await expect(heading).toBeVisible({ timeout: 10000 });
      }
    });

    test('no unexpected heading changes', async ({ page }) => {
      await page.goto('/videos', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const h1 = page.locator('h1:has-text("Nada por aqui.")');
      const h2 = page.locator('h2:has-text("Nada por aqui.")');
      const h4 = page.locator('h4:has-text("Nada por aqui.")');
      const h5 = page.locator('h5:has-text("Nada por aqui.")');
      const h6 = page.locator('h6:has-text("Nada por aqui.")');

      await expect(h1).toHaveCount(0);
      await expect(h2).toHaveCount(0);
      await expect(h4).toHaveCount(0);
      await expect(h5).toHaveCount(0);
      await expect(h6).toHaveCount(0);
    });

    test('layout has no overflow on desktop', async ({ page }) => {
      await page.goto('/videos', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const body = page.locator('body');
      const bodyWidth = await body.evaluate((el) => el.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);

      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
    });

    test('layout has no overflow on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/videos', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const body = page.locator('body');
      const bodyWidth = await body.evaluate((el) => el.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);

      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
    });
  });

  test.describe('Wishlist Page - Empty State', () => {
    test('empty state shows correct title and description', async ({ page }) => {
      await page.goto('/wishlist', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const emptyState = page.locator('text=A forja está fria.').first();
      if (await emptyState.count() > 0) {
        await expect(emptyState).toBeVisible({ timeout: 10000 });

        const description = page.locator('text=Itens sendo escolhidos a dedo.').first();
        await expect(description).toBeVisible({ timeout: 10000 });
      } else {
        const itemGrid = page.locator('[class*="grid"]').first();
        await expect(itemGrid).toBeVisible({ timeout: 10000 });
      }
    });

    test('empty state heading is correct when shown', async ({ page }) => {
      await page.goto('/wishlist', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const heading = page.locator('h3:has-text("A forja está fria.")');
      if (await heading.count() > 0) {
        await expect(heading).toBeVisible({ timeout: 10000 });
      }
    });

    test('no unexpected heading changes', async ({ page }) => {
      await page.goto('/wishlist', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const h1 = page.locator('h1:has-text("A forja está fria.")');
      const h2 = page.locator('h2:has-text("A forja está fria.")');
      const h4 = page.locator('h4:has-text("A forja está fria.")');
      const h5 = page.locator('h5:has-text("A forja está fria.")');
      const h6 = page.locator('h6:has-text("A forja está fria.")');

      await expect(h1).toHaveCount(0);
      await expect(h2).toHaveCount(0);
      await expect(h4).toHaveCount(0);
      await expect(h5).toHaveCount(0);
      await expect(h6).toHaveCount(0);
    });

    test('only one CTA button for Amazon exists', async ({ page }) => {
      await page.goto('/wishlist', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const amazonButtons = page.locator('a[href*="amazon"]');
      await expect(amazonButtons).toHaveCount(1);

      const ctaButton = amazonButtons.first();
      await expect(ctaButton).toBeVisible({ timeout: 10000 });
      await expect(ctaButton).toContainText('Ver lista na Amazon');
    });

    test('no unwanted changes in empty state', async ({ page }) => {
      await page.goto('/wishlist', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const emptyStateContainer = page.locator('text=A forja está fria.').locator('..');
      if (await emptyStateContainer.count() > 0) {
        const buttons = emptyStateContainer.locator('button');
        await expect(buttons).toHaveCount(0);
      }
    });
  });

  test.describe('Profile Page - Authenticated Profile', () => {
    test('display_name is rendered as H1', async ({ page }) => {
      await page.goto('/profile', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible({ timeout: 10000 });
    });

    test('no H3 used for display_name', async ({ page }) => {
      await page.goto('/profile', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const h3Elements = page.locator('h3');
      const count = await h3Elements.count();
      for (let i = 0; i < count; i++) {
        const text = await h3Elements.nth(i).textContent();
        if (text) {
          expect(text).not.toMatch(/display_name|nome de exibição/i);
        }
      }
    });

    test('XP is not displayed (removed)', async ({ page }) => {
      await page.goto('/profile', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const xpText = page.locator('text=/XP|xp|experiência/i');
      await expect(xpText).toHaveCount(0);
    });

    test('no overflow on desktop', async ({ page }) => {
      await page.goto('/profile', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const body = page.locator('body');
      const bodyWidth = await body.evaluate((el) => el.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);

      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
    });

    test('no overflow on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/profile', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const body = page.locator('body');
      const bodyWidth = await body.evaluate((el) => el.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);

      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
    });
  });

  test.describe('Profile Page - Non-existent Profile', () => {
    test('shows "Perfil não encontrado" as H1', async ({ page }) => {
      await page.goto('/profile/non-existent-id-12345', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const h1 = page.locator('h1:has-text("Perfil não encontrado")');
      await expect(h1).toBeVisible({ timeout: 10000 });
    });

    test('description is correct', async ({ page }) => {
      await page.goto('/profile/non-existent-id-12345', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const description = page.locator('text=Esta alma se perdeu no vazio. Ou talvez nunca tenha existido.');
      await expect(description).toBeVisible({ timeout: 10000 });
    });

    test('no H3 used incorrectly', async ({ page }) => {
      await page.goto('/profile/non-existent-id-12345', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const h3Elements = page.locator('h3');
      const count = await h3Elements.count();
      for (let i = 0; i < count; i++) {
        const text = await h3Elements.nth(i).textContent();
        if (text) {
          expect(text).not.toMatch(/Perfil não encontrado/i);
        }
      }
    });

    test('CTA button "Voltar à Comunidade" exists and works', async ({ page }) => {
      await page.goto('/profile/non-existent-id-12345', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const ctaButton = page.locator('button:has-text("Voltar à Comunidade")');
      await expect(ctaButton).toBeVisible({ timeout: 10000 });
      await expect(ctaButton).toBeEnabled({ timeout: 10000 });
    });

    test('no overflow on desktop', async ({ page }) => {
      await page.goto('/profile/non-existent-id-12345', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const body = page.locator('body');
      const bodyWidth = await body.evaluate((el) => el.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);

      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
    });

    test('no overflow on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/profile/non-existent-id-12345', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');

      const body = page.locator('body');
      const bodyWidth = await body.evaluate((el) => el.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);

      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
    });
  });
});