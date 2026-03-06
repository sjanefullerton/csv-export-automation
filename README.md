# Roblox CSV Export Automation (Playwright)

Automates CSV downloads from Roblox analytics and monetization pages using your Chrome login.  
Supports multiple experiences.

---

## Prerequisites: Install Node.js

[https://nodejs.org](https://nodejs.org) → download **LTS version** → restart computer.

---

## Install Playwright

```bash
npm install playwright
npx playwright install chromium
````

---

## Create the Script File

```bash
nano roblox-export.js
```

Paste the script from:
[roblox-export.js](https://github.com/sjanefullerton/csv-export-automation/blob/main/roblox-export.js)

Save & exit:

```bash
Control + O → Enter
Control + X
```

---

## Configure Experience IDs

Edit the script (```bash
nano roblox-export.js
```):

```js
const experienceIds = [
  '1234567890', '9876543210'
];
```

Find your Experience ID in the URL:

```
https://create.roblox.com/dashboard/creations/experiences/<ExperienceID>/analytics
```

---

## Optional: Choose Pages to Export

Edit these arrays in the script. **Uncomment pages you want to export CSVs by deleting the // on each page line**

```js
const analyticsPages = [ ... ]
const monetizationPages = [ ... ]
```

## Run the Script

```bash
node roblox-export.js
```
If you want to end the script before it is finished
```bash
Control + Z
```


1. Chrome opens automatically
2. Log in to Roblox
3. Return to terminal & hit **Enter**
4. CSVs will download automatically into a folder next to the script

---

## Future Usage

Just run:

```bash
node roblox-export.js
```

---

## Future Improvements

1. Dynamically navigate and download breakdown CSVs for each custom event
2. Automate login using current Chrome session
3. Allow selecting which CSVs to download per page
