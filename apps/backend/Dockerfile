FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml* ./
COPY . .
RUN npm install
RUN npm run build --workspaces

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json

EXPOSE 3000
CMD ["node", "apps/backend/dist/server.js"]
