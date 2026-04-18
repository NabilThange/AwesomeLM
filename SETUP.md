# Setup Guide for Unified AwesomeLM Application

## Quick Start

### 1. Install pnpm (if not already installed)

**Windows (PowerShell):**
```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

**Or using npm:**
```bash
npm install -g pnpm
```

### 2. Install Dependencies

Navigate to the unified-app directory and run:
```bash
cd unified-app
pnpm install
```

### 3. Environment Variables (Optional)

The Landing page newsletter functionality requires Upstash Redis. If you want to use this feature:

1. Create a `.env.local` file in the `unified-app` directory
2. Add your Upstash Redis credentials:
   ```
   KV_REST_API_URL=your_upstash_redis_url
   KV_REST_API_TOKEN=your_upstash_redis_token
   ```

**Note:** The app will work without these variables, but the newsletter subscription will show a "Missing required setup" error.

### 4. Run Development Server

```bash
pnpm dev 
```

The application will start at:
- **Landing Page**: http://localhost:3000
- **Treasure Gallery**: http://localhost:3000/treasure

### 5. Build for Production

```bash
pnpm build
pnpm start
```

## Verification Checklist

After setup, verify both pages work correctly:

### Landing Page (/)
- [ ] Video background loads
- [ ] Newsletter form appears
- [ ] "Manifesto" button opens modal
- [ ] "Treasure" button is visible
- [ ] Fonts load correctly (Geist Sans, Geist Mono, Instrument Serif)

### Treasure Page (/treasure)
- [ ] Image carousel displays
- [ ] Simple Mode toggle works
- [ ] Arrow keys navigate images
- [ ] Clicking images opens detail popover
- [ ] Copy buttons work in popover

## Troubleshooting

### Issue: pnpm not found
**Solution:** Restart your terminal after installing pnpm, or add it to your PATH manually.

### Issue: Module not found errors
**Solution:** Delete `node_modules` and `.next` folders, then run `pnpm install` again.

### Issue: Port 3000 already in use
**Solution:** Either stop the other process or run on a different port:
```bash
pnpm dev -- -p 3001
```

### Issue: Tailwind styles not loading
**Solution:** Make sure you're using Tailwind CSS v4. Check that `postcss.config.mjs` uses `@tailwindcss/postcss`.

### Issue: Newsletter subscription fails
**Solution:** Check that your `.env.local` file has the correct Upstash Redis credentials.

## Project Structure Overview

```
unified-app/
├── app/
│   ├── page.tsx              # Landing page (/)
│   └── treasure/page.tsx     # Treasure gallery (/treasure)
├── components/
│   ├── landing/              # Landing components
│   ├── treasure/             # Treasure components
│   └── ui/                   # Shared UI components (57 files)
├── lib/                      # Utilities and server actions
├── hooks/                    # React hooks
└── public/                   # Static assets
```

## Next Steps

1. Customize the Landing page content in `app/page.tsx`
2. Add or modify images in the Treasure gallery at `components/treasure/time-machine.tsx`
3. Update metadata in `app/layout.tsx`
4. Configure environment variables for production deployment

## Deployment

This app is ready to deploy to Vercel:

```bash
vercel
```

Or any other Next.js hosting platform that supports Next.js 16+.
