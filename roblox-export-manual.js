const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const experienceIds = [
  '' // ADD EXPERIENCE ID HERE
];

const analyticsPages = [
  //'retention',
  //'engagement',
  //'acquisition',
  //'audience',
  //'economy',
  //'funnels',
  'custom'
];

const monetizationPages = [
  //'overview',
  //'developer-products',
  //'passes',
  //'avatar-items',
  //'immersive-ads',
  //'subscriptions',
  //'creator-rewards',
  //'avatar-creation-tokens'
];

const extraPages = [
  //{ name: 'performance', url: 'analytics/performance?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform' },
  //{ name: 'errors', url: 'analytics/errors?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform' },
  //{ name: 'memory-stores', url: 'analytics/memory-stores?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform' },
  //{ name: 'speech-to-text', url: 'analytics/speech-to-text?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform' },
  //{ name: 'text-to-speech', url: 'analytics/text-to-speech?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform' },
  //{ name: 'http-service', url: 'analytics/http-service?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=HttpServiceMethod' },
  //{ name: 'messaging-service', url: 'analytics/messaging-service?annotation=Announcement&filter_DataStoreTypeV2=Standard' },
  //{ name: 'data-stores', url: 'data-stores?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform&activeTab=Dashboard' },
  //{ name: 'feedback', url: 'feedback?annotation=Announcement&filter_DataStoreTypeV2=Standard' },
  //{ name: 'events', url: 'events?annotation=Announcement&filter_DataStoreTypeV2=Standard&activeTab=creations' },
  //{ name: 'recommendation-service', url: 'recommendation-service?annotation=Announcement&filter_DataStoreTypeV2=Standard' },
  //{ name: 'safety-overview', url: 'safety/overview?annotation=Announcement&filter_DataStoreTypeV2=Standard' },
  //{ name: 'safety-bans', url: 'safety/bans?annotation=Announcement&filter_DataStoreTypeV2=Standard' }
];

(async () => {
  const BASE_EXPORT_DIR = path.join(process.cwd(), 'roblox-exports');
  if (!fs.existsSync(BASE_EXPORT_DIR)) fs.mkdirSync(BASE_EXPORT_DIR);

  const browser = await chromium.launch({ headless: false, channel: 'chrome' });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  console.log('\nOpening Roblox login...');
  await page.goto('https://www.roblox.com/login');
  console.log('Please log in to Roblox in the browser.');
  console.log('Press ENTER here once you are logged in.\n');
  await new Promise(resolve => process.stdin.once('data', resolve));

  // Helper to wait until download button is visible
  async function waitForDownloadButton(page, timeout = 60000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const button = await page.locator('[data-testid="chart-download-button"]').first();
      if (await button.count() && await button.isVisible()) return button;
      await page.waitForTimeout(1000); // retry every second
    }
    throw new Error('Download button did not appear in time.');
  }

  async function exportPage(url, folderPath, filenamePrefix) {
    console.log('\nOpening:', url);
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Wait until the download button appears
    let downloadButton;
    try {
      downloadButton = await waitForDownloadButton(page, 90000); // wait up to 90s
    } catch (err) {
      console.log(`Download button not found for ${filenamePrefix}:`, err.message);
      return;
    }

    try {
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 90000 }),
        downloadButton.click()
      ]);

      const filename = path.join(folderPath, `${filenamePrefix}.csv`);
      await download.saveAs(filename);
      console.log('Saved:', filename);
    } catch (err) {
      console.log('Download failed:', err.message);
    }
  }

  async function exportCustomEvents(experienceId, experienceFolder) {
    const customFolder = path.join(experienceFolder, 'custom-events');
    if (!fs.existsSync(customFolder)) fs.mkdirSync(customFolder);

    const url = `https://create.roblox.com/dashboard/creations/experiences/${experienceId}/analytics/custom?annotation=Announcement`;
    console.log('\nOpening Custom Events:', url);
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const label = await page.locator('label', { hasText: 'Custom Event Name' }).first();
    if (!label) return console.log('Custom Events page not found.');

    const container = await label.locator('..').first();
    const openButton = await container.locator('button[aria-label="Open"]').first();
    if (!openButton) return console.log('Could not find Custom Event dropdown button.');

    await openButton.click();
    await page.waitForTimeout(1500);

    const listbox = await page.locator('[role="listbox"]').first();
    const options = await listbox.locator('li').all();

    console.log('Found', options.length, 'custom events');

    const breakdowns = [
      { name: 'None', suffix: '' },
      { name: 'CustomField1', suffix: '&breakdown=CustomField1' },
      { name: 'CustomField2', suffix: '&breakdown=CustomField2' },
      { name: 'CustomField3', suffix: '&breakdown=CustomField3' },
      { name: 'AgeGroup', suffix: '&breakdown=AgeGroup' },
      { name: 'Gender', suffix: '&breakdown=Gender' },
      { name: 'OS', suffix: '&breakdown=OperatingSystem' },
      { name: 'Platform', suffix: '&breakdown=Platform' },
      { name: 'PayerStatus', suffix: '&breakdown=PayerStatus' },
      { name: 'NewVsReturning', suffix: '&breakdown=NewVsReturning' }
    ];

    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const eventName = (await option.textContent()).trim().replace(/\s+/g, '_');
      console.log('\nExporting custom event:', eventName);

      const eventFolder = path.join(customFolder, eventName);
      if (!fs.existsSync(eventFolder)) fs.mkdirSync(eventFolder);

      for (const breakdown of breakdowns) {
        const breakdownUrl = `https://create.roblox.com/dashboard/creations/experiences/${experienceId}/analytics/custom?filter_AggregationType=Sum&filter_CustomEventName=${eventName}&annotation=PlaceVersion&annotation=ConfigVersion&granularity=Daily${breakdown.suffix}`;
        console.log(`Downloading CSV for ${eventName} - ${breakdown.name}`);
        await exportPage(breakdownUrl, eventFolder, `${eventName}_${breakdown.name}`);
      }

      // Re-open dropdown for next custom event
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
      if (type === 'custom') await exportCustomEvents(experienceId, experienceFolder);
    }

    console.log('\nMonetization exports...');
    for (const type of monetizationPages) {
      const pageFolder = path.join(experienceFolder, type);
      if (!fs.existsSync(pageFolder)) fs.mkdirSync(pageFolder);
      const url = `https://create.roblox.com/dashboard/creations/experiences/${experienceId}/monetization/${type}?annotation=Announcement`;
      await exportPage(url, pageFolder, type);
    }

    console.log('\nExtra dashboard exports...');
    for (const pageInfo of extraPages) {
      const pageFolder = path.join(experienceFolder, pageInfo.name);
      if (!fs.existsSync(pageFolder)) fs.mkdirSync(pageFolder);
      const url = `https://create.roblox.com/dashboard/creations/experiences/${experienceId}/${pageInfo.url}`;
      await exportPage(url, pageFolder, pageInfo.name);
    }
  }

  console.log('\nAll exports complete.');
  await browser.close();
})();
