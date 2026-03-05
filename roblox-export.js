const { chromium } = require('playwright');
const fs = require('fs');

const experienceIds = [
  '123456789', // PUT YOUR EXPERIENCE ID(s) HERE
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
  {
    name: 'performance',
    url: 'analytics/performance?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform'
  },
  {
    name: 'errors',
    url: 'analytics/errors?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform'
  },
  {
    name: 'memory-stores',
    url: 'analytics/memory-stores?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform'
  },
  {
    name: 'speech-to-text',
    url: 'analytics/speech-to-text?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform'
  },
  {
    name: 'text-to-speech',
    url: 'analytics/text-to-speech?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform'
  },
  {
    name: 'http-service',
    url: 'analytics/http-service?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=HttpServiceMethod'
  },
  {
    name: 'messaging-service',
    url: 'analytics/messaging-service?annotation=Announcement&filter_DataStoreTypeV2=Standard'
  },
  {
    name: 'data-stores',
    url: 'data-stores?annotation=Announcement&filter_DataStoreTypeV2=Standard&breakdown=Platform&activeTab=Dashboard'
  },
  {
    name: 'feedback',
    url: 'feedback?annotation=Announcement&filter_DataStoreTypeV2=Standard'
  },
  {
    name: 'events',
    url: 'events?annotation=Announcement&filter_DataStoreTypeV2=Standard&activeTab=creations'
  },
  {
    name: 'recommendation-service',
    url: 'recommendation-service?annotation=Announcement&filter_DataStoreTypeV2=Standard'
  },
  {
    name: 'safety-overview',
    url: 'safety/overview?annotation=Announcement&filter_DataStoreTypeV2=Standard'
  },
  {
    name: 'safety-bans',
    url: 'safety/bans?annotation=Announcement&filter_DataStoreTypeV2=Standard'
  }
];

(async () => {

  const exportFolder = './roblox-exports';

  if (!fs.existsSync(exportFolder)) {
    fs.mkdirSync(exportFolder);
  }

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome'
  });

  const context = await browser.newContext({
    acceptDownloads: true
  });

  const page = await context.newPage();

  console.log('\nOpening Roblox login...');
  await page.goto('https://www.roblox.com/login');

  console.log('\nPlease log in to Roblox in the browser.');
  console.log('Press ENTER here once you are logged in.\n');

  await new Promise(resolve => process.stdin.once('data', resolve));

  async function exportPage(url, experienceId, pageName, category) {

    console.log('\nOpening:', url);

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForTimeout(10000);

    const buttons = await page.$$('button:has(svg[data-testid="DownloadIcon"])');

    console.log('Found', buttons.length, 'export buttons');

    for (let i = 0; i < buttons.length; i++) {

      console.log('Downloading CSV', i + 1);

      try {

        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 15000 }),
          buttons[i].click()
        ]);

        const filename =
          `${exportFolder}/experience-${experienceId}_${category}-${pageName}_chart-${i+1}.csv`;

        await download.saveAs(filename);

        console.log('Saved:', filename);

      } catch (err) {

        console.log('No download triggered — skipping.');

      }

      await page.waitForTimeout(2000);
    }
  }

  for (const experienceId of experienceIds) {

    console.log('\n============================');
    console.log('Experience:', experienceId);
    console.log('============================');

    console.log('\nAnalytics exports...');

    for (const type of analyticsPages) {

      const url =
        `https://create.roblox.com/dashboard/creations/experiences/${experienceId}/analytics/${type}?annotation=Announcement`;

      await exportPage(url, experienceId, type, 'analytics');
    }

    console.log('\nMonetization exports...');

    for (const type of monetizationPages) {

      const url =
        `https://create.roblox.com/dashboard/creations/experiences/${experienceId}/monetization/${type}?annotation=Announcement`;

      await exportPage(url, experienceId, type, 'monetization');
    }

    console.log('\nExtra dashboard exports...');

    for (const pageInfo of extraPages) {

      const url =
        `https://create.roblox.com/dashboard/creations/experiences/${experienceId}/${pageInfo.url}`;

      await exportPage(url, experienceId, pageInfo.name, 'extra');
    }
  }

  console.log('\nAll exports complete.');

})();
