# Multi-stage build for WPOS11
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:20-alpine AS production

WORKDIR /app

# Copy built assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm ci --only=production --legacy-peer-deps

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "run", "preview"]
