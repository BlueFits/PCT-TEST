# PCT-Test

BMO Personalization framework test

## description

This is a containerized NextJS application with a custom server. It is running puppeteer for the backend and has a working Dockerfile configuration.

## Build container

docker build . -t pct_server_image

docker run -p 3000:3000 pct_server_image
