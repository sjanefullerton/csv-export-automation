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

# Step 5: Copy paste the script from https://github.com/sjanefullerton/csv-export-automation/blob/main/roblox-export.js
** comment or uncomment the pages you want to download .csv's from! (comment with // & uncomment by deleting the //)

---

# Step 6: Save the file

Press: 

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
# Step 11: Login to Roblox
Then return to terminal and hit enter/return.
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
