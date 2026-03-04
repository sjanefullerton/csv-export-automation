# Roblox CSV Export Automation (Playwright)

This tool automatically downloads CSV analytics and monetization data from Roblox using your existing Chrome login.
Works for multiple experiences.

---

# Step 1: Install Node.js (one-time)

Go to:

[https://nodejs.org](https://nodejs.org)

Download and install the **LTS version**

Restart your computer after installing.

---

# Step 2: Open Terminal

## Mac

Press:

Command + Space

(or just use the search bar)

Type:

```
Terminal
```

Press Enter

---

## Windows

Press:

```
Windows Key + R
```

Type:

```
cmd
```

Press Enter

---

## Linux

Open Terminal normally.

---

# Step 3: Install Playwright

Copy paste:

```
npm install playwright
npx playwright install chromium
```

Wait until installation finishes.

---

# Step 4: Create the script file

Copy paste:

```
nano roblox-export.js
```

Press Enter

---

# Step 5: Copy paste this entire script (or find it under https://github.com/sjanefullerton/csv-export-automation/blob/main/roblox-export.js)

```
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
```

---

# Step 6: Save the file

Press: (

```
Control + O
```
(^ the letter O)

Press Enter

Then:

```
Control + X
```

---

# Step 7: Set your Experience ID(s)

Open the file:

```
nano roblox-export.js
```

Find this section:

```
const experienceIds = [
  '123456789' # PUT YOUR EXPERIENCE ID(s) HERE
];
```

Replace with your own experience ID(s).

Example:

```
const experienceIds = [
  '1234567890'
];
```

Multiple experiences example:

```
const experienceIds = [
  '1234567890',
  '9876543210',
  '5555555555'
];
```

When done, save it by typing 
```
:wq
```
and pressing enter/return

---

# How to find your Experience ID

Go to your Roblox dashboard.

Example URL:

```
https://create.roblox.com/dashboard/creations/experiences/123456789/analytics
```

The number:

```
123456789
```

is your Experience ID.

---

# Step 8: (Optional) Choose which pages export

You can edit these sections:

```
const analyticsPages = [ ... ]
```

and

```
const monetizationPages = [ ... ]
```

Remove or add pages as needed.

---

# Step 9: Close Chrome completely

IMPORTANT.

Close all Chrome windows.

Mac:

```
Command + Q
```

Windows/Linux:

Close Chrome fully.

---

# Step 10: Run the script

Copy paste:

```
node roblox-export.js
```

Chrome will open automatically.

CSV files will download automatically.

---

# Future usage

Just run:

```
node roblox-export.js
```

---

# What this automates

Exports CSVs from:

• Retention
• Engagement
• Acquisition
• Audience
• Economy
• Funnels
• Custom
• Monetization pages

For every Experience ID listed.

---

# Troubleshooting

If Roblox login appears:

Close Chrome and run again.

---

Not final version, still working on getting the login to be automated.

# Done

Your CSV exports are now fully automated.
