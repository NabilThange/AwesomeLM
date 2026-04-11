# Installation Instructions

## Important: Clean Install Required

The project has been updated to use Tailwind CSS v3 (matching the Landing project). You need to reinstall dependencies.

## Steps:

1. **Remove old dependencies:**
   ```bash
   rm -rf node_modules
   rm pnpm-lock.yaml
   ```

2. **Install fresh dependencies:**
   ```bash
   pnpm install
   ```

3. **Run the dev server:**
   ```bash
   pnpm dev
   ```

## What Changed:

- Downgraded from Tailwind v4 to v3.4.17
- Removed `@tailwindcss/postcss` and `tw-animate-css`
- Updated to use standard PostCSS config
- CSS now matches Landing project exactly
- Removed eslint config from next.config.mjs

## Expected Result:

- Landing page at `/` should have white background with dark text (light mode)
- Dark mode activates based on system preference
- All custom utilities (spacing, shadows, animations) work correctly
