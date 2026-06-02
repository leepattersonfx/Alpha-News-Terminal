# Alpha News Terminal — Deploy Guide

## What this is
A live financial news terminal for traders. Users open the URL and it just works — no sign-up, no API keys, nothing.

---

## Step 1 — Get your free RSS2JSON API key (30 seconds)
1. Go to https://rss2json.com
2. Click **Sign Up Free**
3. Verify your email
4. Copy your API key from the dashboard

---

## Step 2 — Put the project on GitHub (2 minutes)
1. Go to https://github.com/new
2. Name it `alpha-news-terminal`, set to **Private**, click **Create**
3. On your computer, open a terminal in this folder and run:

```bash
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/YOUR_USERNAME/alpha-news-terminal.git
git push -u origin main
```

---

## Step 3 — Deploy to Vercel (2 minutes)
1. Go to https://vercel.com → sign up free with your GitHub account
2. Click **Add New Project**
3. Import your `alpha-news-terminal` repo
4. Click **Deploy** (default settings are fine)

---

## Step 4 — Add your API key (1 minute)
In Vercel dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `RSS2JSON_KEY`
   - **Value:** (paste your RSS2JSON API key)
3. Click **Save**
4. Go to **Deployments** → click the 3 dots on your latest deploy → **Redeploy**

---

## Done!
Your terminal is live at: `https://alpha-news-terminal.vercel.app`

Share that URL with anyone — it just works, no setup needed on their end.

---

## Updating the app
Any time you push to GitHub, Vercel auto-deploys the new version.

```bash
git add .
git commit -m "update"
git push
```
