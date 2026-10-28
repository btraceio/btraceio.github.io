# btraceio.github.io

Landing page for the [btraceio](https://github.com/btraceio) GitHub organization,
served at https://btraceio.github.io/.

Plain static HTML. No build step, no Jekyll (`.nojekyll`).

| Path | Content |
| --- | --- |
| `index.html` | The page. Project cards carry static fallback values. |
| `assets/site.css` | Page styles (dark CRT variant of the Modernist design system). |
| `assets/modernist.css` | Modernist design-system tokens and base components. |
| `assets/org.js` | Fetches stars, latest release and 52-week commit activity from the GitHub API. Caches for 1 hour in `localStorage`. |
| `icon/` | BTrace 3.0.0 icon set (SVG + PNG sizes). |

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000/
```

## Add a project

1. Copy an `<article class="card-p">` block in `index.html`, set `data-repo` to the repo name and update the copy and fallback values.
2. Add the repo name to `REPOS` in `assets/org.js`.
3. Update `active projects: N` in the hero.

## Publish

Repository **Settings → Pages → Build and deployment**: source *Deploy from a branch*, branch `main`, folder `/ (root)`.
