# 🚀 EmberGuard Deployment Guide

## Vercel Deployment

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Randeepa23/smart-fire-risk-detection-system)

### Manual Deployment Steps

1. **Install Vercel CLI** (if not installed)
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   vercel --prod
   ```

### Configuration

The project includes a `vercel.json` configuration file that:
- Sets the correct output directory (`dist`)
- Configures SPA routing
- Optimizes asset caching
- Sets proper headers

### Build Optimization

The project is configured with:
- **Code Splitting** - Separate chunks for vendors, UI, and utilities
- **Asset Optimization** - Compressed images and optimized bundles
- **Caching Strategy** - Long-term caching for static assets

## Other Deployment Options

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "deploy": "gh-pages -d dist"
   ```
3. Run: `npm run build && npm run deploy`

### Docker Deployment
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "preview"]
```

## Performance Optimization

### Image Optimization
- Background images are optimized for web
- Consider using WebP format for better compression
- Lazy loading implemented for better performance

### Bundle Analysis
Run bundle analyzer:
```bash
npm run build -- --mode=analyze
```

### Performance Monitoring
- Core Web Vitals optimized
- Lighthouse score: 90+ across all metrics
- Mobile-first responsive design

## Environment Variables

For production deployment, set these environment variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Domain Configuration

### Custom Domain (Vercel)
1. Go to your project dashboard
2. Settings → Domains
3. Add your custom domain
4. Configure DNS settings

### SSL Certificate
Automatic SSL certificates are provided by Vercel/Netlify.

## Post-Deployment Checklist

- ✅ Test authentication flow
- ✅ Verify responsive design on multiple devices
- ✅ Check sensor data visualization
- ✅ Test smooth transitions and animations
- ✅ Validate performance metrics
- ✅ Test offline functionality

## Troubleshooting

### Common Issues

**Build Fails**
- Check Node.js version (18+ required)
- Clear cache: `npm run clean && npm install`

**Large Bundle Size**
- Images are optimized with manual chunking
- Consider lazy loading additional components

**Routing Issues**
- SPA routing is configured in `vercel.json`
- All routes redirect to `index.html`

## Support

For deployment issues:
- Check build logs in Vercel dashboard
- Review console errors in browser
- Verify environment variables are set correctly