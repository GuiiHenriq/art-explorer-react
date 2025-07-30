# Art Explorer - Backend

### Setup Instructions

1. **Build Command**: `npm run build`
2. **Start Command**: `npm start`
4. **Node Version**: 18

### Environment Variables
```bash
NODE_ENV=production
PORT=10000
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
MET_API_BASE_URL=https://collectionapi.metmuseum.org/public/collection/v1
API_TIMEOUT=10000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🛠️ Local Development

1. Clone this repository
2. Access folder "backend"
2. Install packages: `npm install`
3. Copy the `.env.example` file to `.env`
4. Run in development mode: `npm run dev`

## 📊 Health Check

The `/health` endpoint is available to check if the application is working.

## 📝 Available Scripts

- `npm run dev` - Runs in development mode
- `npm run build` - Builds the TypeScript code
- `npm start` - Starts the built server
- `npm run lint` - Checks code style
- `npm run lint:fix` - Fixes code style problems automatically
