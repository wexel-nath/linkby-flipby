FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production=false

COPY . .

RUN npm run build

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8080"]
