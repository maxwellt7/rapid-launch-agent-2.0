# Backend Dockerfile for Railway deployment
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install build dependencies for better-sqlite3 in one layer
RUN apk add --no-cache python3 make g++ sqlite

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (use npm install for faster builds, Railway handles production)
RUN npm install --production --no-audit --no-fund

# Copy server code
COPY server ./server

# Create data directory for SQLite
RUN mkdir -p /app/data

# Expose port (Railway will use PORT env var)
EXPOSE 5000

# Health check (simplified, Railway has its own healthcheck)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-5000}/api/health || exit 1

# Start server
CMD ["node", "server/index.js"]

