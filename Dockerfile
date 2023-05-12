FROM ghcr.io/puppeteer/puppeteer:19.8.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json /usr/src/app
RUN npm ci
COPY . /usr/src/app
CMD [ "cross-env", "NODE_ENV=production", "node", "dist/server/server.js" ]