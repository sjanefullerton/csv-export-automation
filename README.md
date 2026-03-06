---

# Roblox CSV Export Automation (Playwright)

Automates CSV downloads from Roblox analytics and monetization pages.
Supports multiple experiences.

---

## Features

* Automatically downloads Roblox analytics CSVs
* Supports multiple experience IDs
* Uses Playwright browser automation
* Saves CSV files locally in organized folders
* Works with your Roblox login

---

## Example Output

The script creates folders containing downloaded CSV files for each experience.

Example structure:

```
roblox-exports/

├── 1234567890/
│   ├── retention.csv
│   ├── engagement.csv
│   ├── acquisition.csv
│   ├── audience.csv
│   ├── economy.csv
│   └── funnels.csv
│
├── 9876543210/
│   ├── retention.csv
│   ├── engagement.csv
│   └── monetization.csv
```

CSV files are saved in a folder created **next to the script**.

---

## Requirements

* Node.js
* Playwright
* Chrome browser
* Roblox account with access to the experience analytics

---

## Install Node.js

Download the **LTS version** from:

[https://nodejs.org](https://nodejs.org)

Restart your computer after installation.

---

## Open Terminal

The entire process will be run in **Terminal**.

On Mac, you can open it by using Spotlight search or navigating to:

Applications → Utilities → Terminal

---

## Install Playwright

In Terminal, type and run the following commands:

```bash
npm install playwright
npx playwright install chromium
```

---

## Create the Script File

Create the script file:

```bash
nano roblox-export.js
```

Paste the script from:
[https://github.com/sjanefullerton/csv-export-automation/blob/main/roblox-export.js](https://github.com/sjanefullerton/csv-export-automation/blob/main/roblox-export.js)

Save and exit:

```
Control O
Enter
Control X
```

---

## Configure Experience IDs

Edit the script:

```bash
nano roblox-export.js
```

Insert the experience ID(s) you wish to pull CSVs from:

```js
const experienceIds = [
  '1234567890', '9876543210'
];
```

---

## Choose Pages to Export

Edit these arrays in the script. Uncomment pages you want to export by removing the `//` before each page.

```js
const analyticsPages = [ ... ]
const monetizationPages = [ ... ]
const extraPages = [ ... ]
```

---

## Run the Script

```bash
node roblox-export.js
```

Steps:

1. Chrome opens automatically
2. Log in to Roblox
3. Return to terminal and hit **Enter**
4. CSVs download automatically into a folder next to the script

To stop the script early:

```bash
Control Z
```

---

## Future Improvements

1. Dynamically navigate and download breakdown CSVs for each custom event
2. Automate login using the current Chrome session
3. Allow selecting which CSVs to download per page

