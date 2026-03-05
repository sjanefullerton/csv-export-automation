const { chromium } = require('playwright');

const experienceIds = [
  '123456789' // PUT YOUR EXPERIENCE ID(s) HERE
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

(async () => {

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome'
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('\nOpening Roblox login...');

  await page.goto('https://www.roblox.com/login');

  console.log('\nPlease log in to Roblox in the browser.');
  console.log('Press ENTER here once you are logged in.\n');

  await new Promise(resolve => process.stdin.once('data', resolve));

  async function exportPage(url) {

    console.log('\nOpening:', url);

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForTimeout(6000);

    const buttons = await page.$$(
      '[data-testid="chart-export-button"], [aria-label="Export your data to a .CSV file"]'
    );

    console.log('Found', buttons.length, 'export buttons');

    for (let i = 0; i < buttons.length; i++) {

      console.log('Downloading CSV', i + 1);

      await buttons[i].click();

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

      await exportPage(url);
    }

    console.log('\nMonetization exports...');

    for (const type of monetizationPages) {

      const url =
        `https://create.roblox.com/dashboard/creations/experiences/${experienceId}/monetization/${type}?annotation=Announcement`;

      await exportPage(url);
    }

  }

  console.log('\nAll exports complete.');

})();
