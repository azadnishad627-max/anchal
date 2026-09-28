# Anchal 🌹✨ — Live Web App & PWA (GitHub Pages Ready)

A modern, responsive music & memory progressive web app crafted for **Anchal** with Arijit Singh melodies, ambient floating butterflies & hearts, and an aesthetic Rose Pink & Sunlight Golden Yellow theme.

---

## 🌟 Key Highlights

- **Rose Pink & Sunlight Golden Yellow Palette**: Luxurious blush rose background with warm sunlight golden amber cards and glassmorphism.
- **Ambient Fluttering Butterflies & Hearts**: 60FPS CSS & Canvas animated butterflies with realistic wing flaps and rising hearts.
- **Interactive Touch Bursts**: Tapping/clicking anywhere erupts mini butterflies and golden star sparkles.
- **21 Superhit Arijit Singh Songs**: Direct high-speed streaming from Supabase public cloud storage.
- **Lock Screen Music Controls**: HTML5 Audio + MediaSession API with Anchal's album artwork and lockscreen playback controls.
- **Photo Gallery & Lightbox**: Interactive gallery with Anchal's 6 photos, captions, and full-screen zoomable lightbox.
- **Azad Ka Paigaam (Letter)**: Heartfelt dedication with wax seal design.
- **PWA (Progressive Web App)**: Can be added to Home Screen on Android & iOS without any APK!
- **Instant Live Updates**: Whenever you push code, songs, or photos to GitHub, it goes live immediately!

---

## 🚀 How to Host on GitHub Pages (Step-by-Step)

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name the repository `anchal` (or any name you like).
3. Set it to **Public**.
4. Click **Create repository**.

### Step 2: Push This Code from Terminal
Open PowerShell in this folder (`C:\Users\Azad\.gemini\antigravity\scratch\anchal`) or run:

```bash
git init
git add .
git commit -m "Initial commit for Anchal Web App 🌹"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/anchal.git
git push -u origin main
```

### Step 3: Turn on GitHub Pages (Takes 30 seconds!)
1. In your GitHub repository, click on **Settings** (top menu).
2. On the left sidebar, click **Pages**.
3. Under **Build and deployment > Source**, select **Deploy from a branch**.
4. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
5. Wait 1-2 minutes! Your live link will be ready:
   👉 `https://<YOUR_GITHUB_USERNAME>.github.io/anchal/`

---

## 📱 How Anchal Installs It on Her Phone (PWA)

1. Anchal opens the link `https://<YOUR_GITHUB_USERNAME>.github.io/anchal/` in Chrome (Android) or Safari (iPhone).
2. Tap the **3-dots menu** (or Share icon on iPhone).
3. Tap **"Add to Home screen"** or **"Install App"**.
4. An app icon with Anchal's photo and the name **"Anchal 🌹"** will be added to her home screen!
5. Opening it launches the app full-screen without any browser address bar!

---

## 🔄 How to Push Live Updates Anytime

Whenever you want to add new photos, songs, or messages:
1. Add new photos to `photos/` and reference them in `index.html` or `js/app.js`.
2. Add songs to `js/songs.js`.
3. In terminal, run:
```bash
git add .
git commit -m "Added new photos and songs ✨"
git push
```
Within 30 seconds, Anchal's app updates automatically when she opens it! Zero APK, zero manual installation!
