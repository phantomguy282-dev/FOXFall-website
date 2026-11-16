# FOXFall-website

Official website for **FOXFall** — *Your videos. Your world.*

A static site (HTML + CSS + vanilla JavaScript) deployed to GitHub Pages.
No build step, no backend, no npm dependencies.

## Architecture

```
FOXFall-website/
├── index.html            single-page site (nav, hero, features, how, download, about, footer)
├── css/style.css         autumn identity (orange / black / cream), responsive, reduced-motion
├── js/app.js             GitHub Releases integration, falling leaves, nav, scroll reveal
├── assets/               fox logo PNGs (16 → 1024 px) generated from the app icon source
└── .github/workflows/deploy.yml   GitHub Pages deployment
```

### Download button integration

`js/app.js` fetches `https://api.github.com/repos/phantomguy282-dev/FOXFall/releases/latest`
and points the download buttons at the release's portable `.exe` asset.

- If a release exists with an `FOXFall*.exe` asset → buttons download that file.
- If a release exists without an attached build → buttons go to the release page
  and a notice is shown (no fake downloads).
- If no release exists at all → the download section shows **"Coming soon"**.

## Local development

No server required for basic layout, but the GitHub API call needs an HTTP origin
(the `file://` protocol is fine too — the fetch simply falls back to "Coming soon"):

```bash
python -m http.server 8000
# open http://localhost:8000
```

## GitHub Pages deployment

The workflow `.github/workflows/deploy.yml` publishes the repository root with the
official Pages actions (`configure-pages`, `upload-pages-artifact`, `deploy-pages`)
on every push to `main`.

**One-time manual activation required:**

1. Open <https://github.com/phantomguy282-dev/FOXFall-website/settings/pages>
2. Under **Build and deployment → Source**, choose **GitHub Actions**
   (not "Deploy from a branch").
3. Re-run the workflow (Actions → "Deploy FOXFall website to GitHub Pages" → Re-run)
   or push a commit.

The site will then be published at
`https://phantomguy282-dev.github.io/FOXFall-website/`.

## Design notes

- Palette: Fox Orange `#F28C28`, Deep Orange `#D96520`, Sunset Amber `#FFB347`,
  Cream White `#FFF1D6`, Black `#111111`, Charcoal `#1B1B1B`, Dark Brown `#291A13`.
- Animations respect `prefers-reduced-motion`.
- Responsive from 320 px phones to ultra-wide desktops; no horizontal overflow.
- The fox artwork is the same vector-derived mascot shipped with the application.