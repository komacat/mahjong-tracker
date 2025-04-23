FROM node:alpine AS builder
RUN apk add --no-cache openssl

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY src/lib/server/drizzle src/lib/server/drizzle/
COPY drizzle.config.ts .
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "npm", "run", "prod" ]
