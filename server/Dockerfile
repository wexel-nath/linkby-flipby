FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

COPY . .

RUN npm run build

# Remove devDependencies to reduce image size
RUN npm prune --production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app
USER nodejs

CMD ["npm", "start"]
