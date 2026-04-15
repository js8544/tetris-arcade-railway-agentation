import { mkdirSync } from 'node:fs'
import { test, expect } from '@playwright/test'

test('capture tetris home page screenshot', async ({ page }) => {
  mkdirSync('test-results', { recursive: true })

  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { name: '俄罗斯方块 Tetris' })).toBeVisible()

  await page.screenshot({
    path: 'test-results/tetris-home.png',
    fullPage: true,
  })
})
