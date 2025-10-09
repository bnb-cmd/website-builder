# Railway Deployment Configuration
# This file helps Railway understand how to deploy your backend

# The issue you're seeing is that Railway is trying to build from the root directory
# and running the root package.json build script which includes frontend

# Solution: Tell Railway to work from the backend directory

# In Railway dashboard, set these build settings:
# Build Command: cd backend && npm run build
# Start Command: cd backend && npm start
# Root Directory: backend

# Or use the Railway CLI:
# railway variables --set "RAILWAY_BUILD_COMMAND=cd backend && npm run build"
# railway variables --set "RAILWAY_START_COMMAND=cd backend && npm start"
