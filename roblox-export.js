const { chromium } = require('playwright');
const os = require('os');
const path = require('path');
const fs = require('fs');

const experienceIds = [
  '123456789' # PUT YOUR EXPERIENCE ID(s) HERE
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

function getChromeUserDataDir() {

  const home = os.homedir();
  const platform = os.platform();

  if (platform === 'darwin') {
    return path.join(home, 'Library/Application Support/Google/Chrome');
  }

  if (platform === 'win32') {
    return path.join(home, 'AppData/Local/Google/Chrome/User Data');
  }

  if (platform === 'linux') {
    return path.join(home, '.config/google-chrome');
  }

  throw new Error('Unsupported OS');
}

(async () => {

  const chromeDir = getChromeUserDataDir();

  console.log('Using Chrome profile:', chromeDir);

  if (!fs.existsSync(chromeDir)) {
    console.log('Chrome profile not found. Please open Chrome first.');
    return;
  }

  const browser = await chromium.launchPersistentContext(
    chromeDir,
    {
      headless: false,
      channel: 'chrome',
      args: ['--profile-directory=Default']
    }
  );

  const page = await browser.newPage();

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
