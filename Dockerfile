FROM node:20-bookworm-slim

ENV NODE_ENV=production
ENV PUPPETEER_SKIP_DOWNLOAD=false

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    libreoffice-writer \
    chromium \
    fonts-liberation \
    fonts-noto-core \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .
RUN mkdir -p /tmp/multitool && chmod 1777 /tmp/multitool

EXPOSE 3000
CMD ["npm", "start"]
