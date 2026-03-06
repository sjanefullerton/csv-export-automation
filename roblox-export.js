const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const experienceIds = [
  '123456789' // ADD MORE EXPERIENCE IDs IF NEEDED
];

const analyticsPages = [
  'retention',
  'engagement',
  'acquisition',
  'audience',
  'economy',
  'funnels',
  'custom'
];

const monetizationPages = [
  'overview',
  'developer-products',
  'passes',
  'avatar-items',
  'immersive-ads',
  'subscriptions',
  'creator-rewards',
  'avatar-creation-tokens'
];

const extraPages = [
  { name: 'performance', url: 'analytics/performance?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform' },
  { name: 'errors', url: 'analytics/errors?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform' },
  { name: 'memory-stores', url: 'analytics/memory-stores?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform' },
  { name: 'speech-to-text', url: 'analytics/speech-to-text?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform' },
  { name: 'text-to-speech', url: 'analytics/text-to-speech?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform' },
  { name: 'http-service', url: 'analytics/http-service?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=HttpServiceMethod' },
  { name: 'messaging-service', url: 'analytics/messaging-service?annotation=Announcement&filter_DataStoreTypeV2=Standard' },
  { name: 'data-stores', url: 'data-stores?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform&activeTab=Dashboard' },
  { name: 'feedback', url: 'feedback?annotation=Announcement&filter_DataStoreTypeV2=Standard' },
  { name: 'events', url: 'events?annotation=Announcement&filter_DataStoreTypeV2=Standard&activeTab=creations' },
  { name: 'recommendation-service', url: 'recommendation-service?annotation=Announcement&filter_DataStoreTypeV2=Standard' },
  { name: 'safety-overview', url: 'safety/overview?annotation=Announcement&filter_DataStoreTypeV2=Standard' },
  { name: 'safety-bans', url: 'safety/bans?annotation=Announcement&filter_DataStoreTypeV2=Standard' }
];

(async () => {
  const BASE_EXPORT_DIR = path.join(process.cwd(), 'roblox-exports');
  if (!fs.existsSync(BASE_EXPORT_DIR)) fs.mkdirSync(BASE_EXPORT_DIR);

  const browser = await chromium.launch({ headless: false, channel: 'chrome' });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  console.log('\nOpening Roblox login...');
  await page.goto('https://www.roblox.com/login');
  console.log('\nPlease log in to Roblox in the browser.');
  console.log('Press ENTER here once you are logged in.\n');
  await new Promise(resolve => process.stdin.once('data', resolve));

  async function exportPage(url, experienceFolder, pageLabel) {
    console.log('\nOpening:', url);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(8000);

    const buttons = await page.$$(
      '[data-testid="chart-export-button"], [aria-label="Export your data to a .CSV file"], [data-testid="chart-download-button"]'
    );

    console.log('Found', buttons.length, 'export buttons');

    for (let i = 0; i < buttons.length; i++) {
      console.log('Downloading CSV', i + 1);

      try {
        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 15000 }),
          buttons[i].click()
        ]);

        const filename = path.join(
          experienceFolder,
          `${pageLabel}_chart-${i + 1}.csv`
        );

        await download.saveAs(filename);
        console.log('Saved:', filename);
      } catch (err) {
        console.log('No download triggered — skipping.');
      }

      await page.waitForTimeout(2000);
    }
  }

  async function exportCustomEvents(experienceId, experienceFolder) {
    const customFolder = path.join(experienceFolder, 'custom-events');
    if (!fs.existsSync(customFolder)) fs.mkdirSync(customFolder);

    const url = `https://create.roblox.com/dashboard/creations/experiences/${experienceId}/analytics/custom?annotation=Announcement`;
    console.log('\nOpening Custom Events:', url);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(8000);

    // Find the Custom Event dropdown
    const label = await page.locator('label', { hasText: 'Custom Event Name' }).first();
    if (!label) {
      console.log('Custom Events page not found.');
      return;
    }

    const container = await label.locator('..').first(); // parent container
    const openButton = await container.locator('button[aria-label="Open"]').first();

    if (!openButton) {
      console.log('Could not find Custom Event dropdown button.');
      return;
    }

    await openButton.click();
    await page.waitForTimeout(1500);

    // Get all custom event options
    const listbox = await page.locator('[role="listbox"]').first();
    const options = await listbox.locator('li').all(); // all <li> children

    console.log('Found', options.length, 'custom events');

    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const eventName = (await option.textContent()).trim().replace(/\s+/g, '_');

      console.log('Exporting custom event:', eventName);

      await option.click();
      await page.waitForTimeout(4000); // wait for chart to update

      const downloadButton = await page.locator('[data-testid="chart-download-button"]').first();
      if (!downloadButton) {
        console.log('CSV download button not found — skipping.');
        continue;
      }

      try {
        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 15000 }),
          downloadButton.click()
        ]);

        const filename = path.join(customFolder, `${eventName}.csv`);
        await download.saveAs(filename);
        console.log('Saved:', filename);
      } catch (err) {
        console.log('Download failed for event:', eventName);
      }

      // Re-open dropdown for next event
      await openButton.click();
      await page.waitForTimeout(1500);
    }

    console.log('Finished exporting all custom events');
  }

  for (const experienceId of experienceIds) {
    const experienceFolder = path.join(BASE_EXPORT_DIR, experienceId);
    if (!fs.existsSync(experienceFolder)) fs.mkdirSync(experienceFolder);

    console.log(`\n============================\nExperience: ${experienceId}\n============================`);

    console.log('\nAnalytics exports...');
    for (const type of analyticsPages) {
      if (type === 'custom') {
        await exportCustomEvents(experienceId, experienceFolder);
      } else {
        const url = `https://create.roblox.com/dashboard/creations/experiences/${experienceId}/analytics/${type}?annotation=Announcement`;
        await exportPage(url, experienceFolder, `analytics-${type}`);
      }
    }

    console.log('\nMonetization exports...');
    for (const type of monetizationPages) {
      const url = `https://create.roblox.com/dashboard/creations/experiences/${experienceId}/monetization/${type}?annotation=Announcement`;
      await exportPage(url, experienceFolder, `monetization-${type}`);
    }

    console.log('\nExtra dashboard exports...');
    for (const pageInfo of extraPages) {
      const url = `https://create.roblox.com/dashboard/creations/experiences/${experienceId}/${pageInfo.url}`;
      await exportPage(url, experienceFolder, `extra-${pageInfo.name}`);
    }
  }

  console.log('\nAll exports complete.');
  await browser.close();

})();
