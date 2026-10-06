# AutoParts Finder

Find the right car part for your vehicle — browse a catalog, decode a VIN, and walk through a full shopping flow. Live at **https://len-golani.github.io/CarPartsFinder/**

## What it does

- **Catalog** — browse and filter a parts catalog by category, price and availability
- **VIN decoder** — enter a 17-character VIN and get real vehicle data from the [NHTSA vPIC API](https://vpic.nhtsa.dot.gov/) (free, no key required)
- **Cart & checkout** — add parts to a cart, check out, and get an order confirmation
- **Accounts** — sign up / log in to keep your dashboard

## Tech stack

| Layer | Choice |
|---|---|
| Build | Vite 5 |
| UI | React 18 + TypeScript (strict) |
| Styling | Tailwind CSS + tailwindcss-animate |
| Routing | react-router-dom (HashRouter — correct for GitHub Pages) |
| Animation | framer-motion |
| Notifications | sonner |
| Icons | lucide-react |
| Runtime | Bun (install + build), Node-compatible |

## Run it locally

```bash
bun install        # or: npm install
bun run dev        # or: npm run dev
```

Production build:

```bash
bun run build      # outputs to dist/
bun run preview    # serve the build locally
```

## Demo notice (read this before using the auth)

The sign-up/login is a **front-end demo**: it accepts any valid email and any password of 4+ characters, and stores the "user" in your browser's localStorage. There is no backend, no database, and no real authentication. The checkout does not process payments. This project demonstrates front-end architecture and UI, not a production commerce stack.

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) builds with Bun on every push to `main` and deploys to GitHub Pages. The Vite `base` is set to `/CarPartsFinder/` to match the Pages URL.

## Repository note

This repo's git history contains a committed `node_modules/` directory from an early commit — kept deliberately (no history rewrite). `.gitignore` prevents it from being re-added. Cloning downloads it; if you just want the source, download the ZIP or use `git clone --depth 1` and delete the folder — everything needed to build is `package.json` + `bun.lock` + `src/`.

## License

[MIT](LICENSE)
