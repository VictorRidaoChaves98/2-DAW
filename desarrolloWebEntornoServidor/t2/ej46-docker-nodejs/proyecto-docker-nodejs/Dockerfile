FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --production

COPY src ./src

EXPOSE 3000

USER node

CMD ["node", "src/index.js"]
