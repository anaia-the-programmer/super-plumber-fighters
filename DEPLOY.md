# How to Publish Your Game to the Internet (GitHub Pages)

Great news! I have already:
1. Created the Code Repository on your computer.
2. Created the **GitHub Repository** for you (`super-plumber-fighters`).
3. Linked them together.

## Step 1: Finish the Upload
I tried to upload the code, but I need your password to do it.

1. Open your **Terminal** app.
2. Go to your folder:
   ```bash
   cd /Users/upasnabhadhal/anaia/projects/game
   ```
3. Run this command to upload everything:
   ```bash
   git push -u origin main
   ```
   *If it asks for a username/password, use your GitHub login. If you use 2-factor authentication, you might need a Personal Access Token instead of a password.*

## Step 2: Turn on the Website
Once the code is uploaded (Step 1 is done):

1. Go to your repository page: [https://github.com/anaia-the-programmer/super-plumber-fighters](https://github.com/anaia-the-programmer/super-plumber-fighters)
2. Click on **Settings** (top menu bar).
3. On the left sidebar, click **Pages**.
4. Loop for **Build and deployment**. Under **Source**, select **Deploy from a branch**.
5. Under **Branch**, change "None" to **main** and keep the folder as `/(root)`.
6. Click **Save**.

Wait about 1-2 minutes. GitHub is building your site! Refresh the page, and you will see a text box at the top that says:
> **Your site is live at https://anaia-the-programmer.github.io/super-plumber-fighters/**

Click that link to play your game!

## How to Update the Game
When you make changes to the code later:

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
