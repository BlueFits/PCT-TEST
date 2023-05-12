FROM ghcr.io/puppeteer/puppeteer:19.8.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "cross-env", "NODE_ENV=production", "node", "dist/server/server.js" ]