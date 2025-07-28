# 🚀 Vercel Deployment Guide

## ✅ Fixed Deployment Issues

### **🔧 What Was Fixed:**

1. **GL Package Issue:**
   - `brain.js` → `gpu.js` → `gl` package was causing build failures
   - Added package overrides to exclude problematic dependencies
   - Created simple predictor without GPU dependencies

2. **Build Configuration:**
   - Added `vercel.json` with proper build settings
   - Added `.npmrc` for legacy peer deps
   - Added `.vercelignore` to exclude unnecessary files

3. **Dependencies:**
   - Used `--ignore-scripts` to skip problematic native builds
   - Used `--legacy-peer-deps` for compatibility

## 📋 Deployment Steps

### 1. Environment Variables
Set these in your Vercel dashboard:
```
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_key
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 3. Alternative: GitHub Integration
1. Push to GitHub
2. Connect repository to Vercel
3. Vercel will auto-deploy

## 🔧 Configuration Files

### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install --legacy-peer-deps --ignore-scripts",
  "framework": "nextjs"
}
```

### `package.json` Overrides
```json
"overrides": {
  "gpu.js": {
    "gl": "npm:noop@1.0.0"
  }
}
```

## 🎯 What's Different in Production

- **Simple Predictor:** Uses basic algorithms instead of brain.js
- **No GPU Dependencies:** Avoids deployment issues
- **Same UI:** All features work the same
- **API Keys:** Must be set in Vercel environment variables

## 🚨 Important Notes

- **API Keys:** Must be set in Vercel dashboard
- **Environment:** Production uses simple predictor
- **Development:** Still uses brain.js locally
- **Performance:** Simple predictor is faster but less sophisticated

## 🔍 Troubleshooting

**Build Fails:**
- Check `vercel.json` is in root
- Ensure `.npmrc` exists
- Verify package.json overrides

**API Not Working:**
- Check environment variables in Vercel
- Verify API keys are valid
- Check console for errors 