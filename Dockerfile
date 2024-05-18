# Using a specific node version that supports pnpm
FROM node:20-alpine AS base

# Enable pnpm using corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Base stage setup
WORKDIR /app
COPY pnpm-lock.yaml ./

# Builder stage
FROM base AS builder

# Add OS packages required for build
RUN apk add --no-cache libc6-compat

# Copy only necessary files for dependencies installation
COPY .npmrc ./
COPY pnpm-workspace.yaml ./
COPY apps apps
COPY packages packages

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile --filter @your-workspace-name/...

# Build the application
COPY tsconfig.json ./
COPY packages packages
COPY apps apps
RUN pnpm run build --filter @your-workspace-name/...

# Remove development dependencies
RUN pnpm prune --prod

# Runner stage
FROM base AS runner

# Create a non-root user and group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

# Copy built artifacts and node modules from the builder stage
COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

# Switch to non-root user
USER hono
EXPOSE 3000

# Command to run the application
CMD ["node", "/app/dist/index.js"]
