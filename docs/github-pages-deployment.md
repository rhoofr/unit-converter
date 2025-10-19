# GitHub Pages Deployment Guide

**Last Updated:** October 19, 2025  
**Maintainer:** @rhoofr  
**Version:** 1.0.0

## Overview

This guide provides step-by-step instructions for deploying the Unit Converter application to GitHub Pages. The application is built with Next.js 15 and uses static site generation (SSG) to create a fully static site that can be hosted on GitHub Pages.

## Prerequisites

- Git installed and configured
- Node.js and npm installed
- GitHub account
- Repository pushed to GitHub

## Configuration Files

### 1. `next.config.ts`

The Next.js configuration must be set up for static export with the correct base path:

```typescript
import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'unit-converter';

const nextConfig: NextConfig = {
  output: 'export', // Enable static HTML export
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  images: {
    unoptimized: true, // GitHub Pages doesn't support Next.js Image Optimization
  },
};

export default nextConfig;
```

**Important:** Replace `'unit-converter'` with your actual GitHub repository name if different.

**Configuration Explained:**

- `output: 'export'` - Tells Next.js to generate a static HTML export instead of a Node.js server
- `basePath` - Sets the base path for your app since it'll be hosted at `username.github.io/repository-name/`
- `assetPrefix` - Ensures all assets (CSS, JS, images) load from the correct path
- `images.unoptimized: true` - Disables Next.js Image Optimization API since GitHub Pages is static-only

### 2. `package.json`

Add the deployment scripts and `gh-pages` package:

```json
{
  "name": "unit-converter",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "predeploy": "npm run build && touch out/.nojekyll",
    "deploy": "gh-pages -d out -t"
  },
  "dependencies": {
    // ...existing dependencies
  },
  "devDependencies": {
    // ...existing devDependencies
    "gh-pages": "^6.3.0"
  }
}
```

**Scripts Explained:**

- `predeploy` - Automatically runs before `deploy`:
  - `npm run build` - Builds the static site to the `out` directory
  - `touch out/.nojekyll` - Creates an empty `.nojekyll` file (prevents GitHub Pages from processing files with Jekyll)
- `deploy` - Deploys the `out` directory to GitHub Pages:
  - `gh-pages -d out` - Specifies the directory to deploy
  - `-t` - Includes dotfiles (like `.nojekyll`)

**Note:** npm automatically runs `predeploy` before `deploy`, so you don't need to call it explicitly.

## Installation Steps

### 1. Install gh-pages Package

```bash
npm install --save-dev gh-pages
```

### 2. Verify Git Repository

Ensure your local repository is connected to GitHub:

```bash
git remote -v
```

You should see your GitHub repository URL. If not, add it:

```bash
git remote add origin https://github.com/YOUR-USERNAME/unit-converter.git
```

### 3. Commit Your Changes

Make sure all configuration changes are committed:

```bash
git add .
git commit -m "Configure for GitHub Pages deployment"
git push origin main
```

## Deployment Process

### Deploy to GitHub Pages

Run the deployment script:

```bash
npm run deploy
```

**What happens:**

1. `predeploy` script runs automatically:
   - Next.js builds your site with static export to the `out` folder
   - The `.nojekyll` file is created in the `out` folder
2. `deploy` script runs:
   - `gh-pages` package creates/updates a `gh-pages` branch
   - The contents of `out` folder are pushed to the `gh-pages` branch

**Expected Output:**

```
> unit-converter@0.1.0 predeploy
> npm run build && touch out/.nojekyll

> unit-converter@0.1.0 build
> next build

   ▲ Next.js 15.5.6
   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (5/5)
 ✓ Collecting build traces
 ✓ Exporting (2/2)
 ✓ Finalizing page optimization

> unit-converter@0.1.0 deploy
> gh-pages -d out -t

Published
```

## GitHub Repository Settings

### Configure GitHub Pages

1. Go to your repository on GitHub: `https://github.com/YOUR-USERNAME/unit-converter`
2. Click the **Settings** tab
3. In the left sidebar, click **Pages**
4. Under **Build and deployment** → **Source**, select:
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`
5. Click **Save**

GitHub will automatically deploy your site. You'll see a message:

> "Your site is live at `https://YOUR-USERNAME.github.io/unit-converter/`"

**Note:** Initial deployment may take a few minutes. Subsequent deployments are typically faster.

## Accessing Your Deployed Site

Your site will be available at:

```
https://YOUR-USERNAME.github.io/unit-converter/
```

Replace `YOUR-USERNAME` with your GitHub username.

## Updating Your Site

Whenever you make changes to your application:

```bash
# 1. Make your code changes

# 2. Commit to main branch
git add .
git commit -m "Description of changes"
git push origin main

# 3. Deploy updated site to GitHub Pages
npm run deploy
```

**Note:** You don't need to push to main before deploying, but it's a good practice to keep your main branch in sync with your deployed site.

## Troubleshooting

### Issue: Assets (CSS/JS) not loading

**Symptoms:** Site loads but appears unstyled or JavaScript doesn't work

**Solution:**

- Verify that `basePath` and `assetPrefix` in `next.config.ts` match your repository name exactly
- Check browser console for 404 errors on asset paths
- Ensure `isProd` check is working (set `NODE_ENV=production` during build)

### Issue: 404 Page Not Found

**Symptoms:** GitHub Pages shows 404 error

**Solution:**

- Verify GitHub Pages is enabled in repository settings
- Confirm `gh-pages` branch exists and has content
- Check that Source is set to `gh-pages` branch
- Wait a few minutes for GitHub's CDN to update

### Issue: Build Fails Locally

**Symptoms:** `npm run build` fails with errors

**Solution:**

- Run `npm run lint` to check for linting errors
- Check for TypeScript errors in your code
- Verify all dependencies are installed: `npm install`
- Check Next.js version compatibility

### Issue: Deployment Permission Errors

**Symptoms:** `gh-pages` fails with authentication errors

**Solution:**

- Ensure you're authenticated with GitHub
- Configure Git credentials:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```
- If using 2FA, you may need a Personal Access Token

### Issue: `.nojekyll` File Not Created

**Symptoms:** Some files with underscores not loading

**Solution:**

- Verify the `predeploy` script includes `touch out/.nojekyll`
- Check that the `.nojekyll` file exists in the `out` folder after build
- Ensure `-t` flag is present in `gh-pages` command

## Local Testing with Production Settings

To test the production build locally before deploying:

```bash
# Build for production
NODE_ENV=production npm run build

# Serve the out directory
npx serve out
```

Then visit `http://localhost:3000/unit-converter/` to test with the base path.

## GitHub Pages Limitations

When deploying to GitHub Pages, be aware of these limitations:

1. **Static Only**: No server-side rendering (SSR) or API routes

   - Our app uses `output: 'export'` for full static generation ✓

2. **No Image Optimization**: Next.js Image Optimization API requires a server

   - We use `images.unoptimized: true` to disable this ✓

3. **No Incremental Static Regeneration (ISR)**: All pages must be pre-built

   - Our app pre-builds all pages at build time ✓

4. **Custom Domain** (Optional): You can configure a custom domain in repository settings
   - See [GitHub's Custom Domain Documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## Environment-Specific Configuration (Advanced)

If you want to deploy to both GitHub Pages AND another hosting service (like Vercel), you can use environment variables:

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repoName = 'unit-converter';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd && isGitHubPages ? `/${repoName}` : '',
  assetPrefix: isProd && isGitHubPages ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

Then deploy with:

```bash
GITHUB_PAGES=true npm run deploy
```

## Continuous Deployment with GitHub Actions (Optional)

For automatic deployment on every push to main, you can set up GitHub Actions. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NODE_ENV: production

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
          cname: your-custom-domain.com # Optional: if using custom domain
```

**Note:** This is optional and requires additional setup. Manual deployment with `npm run deploy` is sufficient for most use cases.

## Additional Resources

- [Next.js Static Exports Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [gh-pages npm Package](https://www.npmjs.com/package/gh-pages)

## Summary

This deployment setup provides a simple, reliable way to deploy the Unit Converter to GitHub Pages. The key points:

1. **Static Export**: Next.js builds a fully static site
2. **Base Path**: Configured for GitHub Pages subdirectory structure
3. **Automated Deployment**: Single `npm run deploy` command
4. **No Server Required**: Pure static files hosted by GitHub

Your site is now live and accessible to anyone with the URL!
