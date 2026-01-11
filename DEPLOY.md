# How to Publish Your Game to the Internet (GitHub Pages)

This guide will show you exactly how to put your "Super Plumber Fighters" game on the internet so your friends can play it. We will use a free service called **GitHub Pages**.

## Phase 1: Create a GitHub Account (If you don't have one)
1. Go to [github.com](https://github.com).
2. Click **Sign up**.
3. Follow the steps to create your free account.

## Phase 2: Create a New Repository
A "repository" (or "repo") is like a folder in the cloud where your code lives.

1. Log in to GitHub.
2. Click the **+** icon in the top-right corner and select **New repository**.
3. **Repository name**: Type `super-plumber-fighters` (or anything you like).
4. **Public/Private**: Make sure **Public** is selected (this is required for free hosting).
5. Click **Create repository** at the bottom.

## Phase 3: Upload Your Code
Now we need to send the code from your computer to GitHub.

1. Open your computer's **Terminal** app.
2. Navigate to your project folder by typing this and hitting Enter:
   ```bash
   cd /Users/upasnabhadhal/anaia/projects/game
   ```
3. Initialize the git repository (one-time setup):
   ```bash
   git init
   ```
4. Add all your files to the "staging area" (getting them ready):
   ```bash
   git add .
   ```
5. Commit your files (saving a snapshot):
   ```bash
   git commit -m "Initial launch of Super Plumber Fighters"
   ```
6. Link your computer to the GitHub repository you just made:
   *Go back to your GitHub page in the browser. You will see a section called "…or push an existing repository from the command line". Copy those lines. They look like this (but with your username):*
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/super-plumber-fighters.git
   git branch -M main
   git push -u origin main
   ```
   *Paste those commands into your Terminal and hit Enter.*

## Phase 4: Turn on the Website
1. Go to your repository page on GitHub.
2. Click on **Settings** (top menu bar).
3. On the left sidebar, click **Pages**.
4. Loop for **Build and deployment**. Under **Source**, select **Deploy from a branch**.
5. Under **Branch**, change "None" to **main** and keep the folder as `/(root)`.
6. Click **Save**.

Wait about 1-2 minutes. GitHub is building your site! Refresh the page, and you will see a text box at the top that says:
> **Your site is live at https://YOUR_USERNAME.github.io/super-plumber-fighters/**

Click that link to play your game!

## Phase 5: Updating the Game
When you make changes to the code (like adding a new character or fixing a bug), follow these steps to update the website:

1. Open Terminal and go to your folder.
2. Save your changes:
   ```bash
   git add .
   git commit -m "Added new cool features"
   ```
3. Send it to the internet:
   ```bash
   git push
   ```

Wait 1 minute, and your website will update automatically!

---

## (Advanced) Using Your Own Domain Name
If you buy a domain like `superplumberfighters.com` from a site like GoDaddy or Namecheap:

1. Go to your domain provider's settings (DNS Management).
2. Create a **CNAME Record**:
   - **Host** (or Name): `www`
   - **Value** (or Points to): `YOUR_USERNAME.github.io`
3. Back in your GitHub Repository > **Settings** > **Pages**.
4. In the **Custom domain** box, type your domain (e.g., `www.superplumberfighters.com`).
5. Click **Save**. GitHub will automatically create a `CNAME` file in your code.
