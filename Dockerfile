# Dockerfile (simple)
FROM node:20-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production

COPY . .

# ensure data dir exists
RUN mkdir -p /app/data && chown -R node:node /app/data

USER node
EXPOSE 3000
CMD ["npm", "run", "start"]
