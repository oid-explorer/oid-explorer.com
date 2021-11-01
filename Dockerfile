# Install dependencies only when needed
FROM node:latest AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:latest AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
# bugfix, see https://github.com/webpack/webpack/issues/14532#issuecomment-947012063
ENV NODE_OPTIONS --openssl-legacy-provider
RUN npm run build

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "run", "start"]