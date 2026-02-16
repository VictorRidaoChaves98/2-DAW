FROM node:20-bullseye-slim

ENV NODE_ENV=production
WORKDIR /app

# Install minimal dependencies required by Chromium (puppeteer)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    libnss3 \
    libgconf-2-4 \
    libxss1 \
    libasound2 \
    libatk1.0-0 \
    libx11-xcb1 \
    libgtk-3-0 \
    libx11-6 \
    libxcomposite1 \
    libxrandr2 \
    libxtst6 \
    libxrender1 \
  libxdamage1 \
  libgbm1 \
  libcups2 \
  && rm -rf /var/lib/apt/lists/*

# Copy package files and install production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy app source
COPY . .

RUN mkdir -p outputs/pdf outputs/markdown outputs/uml src/temp

EXPOSE 3000

# Allow puppeteer to download Chromium during npm install if needed
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=0

CMD ["node", "index.js"]
