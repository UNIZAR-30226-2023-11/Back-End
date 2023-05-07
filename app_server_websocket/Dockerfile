FROM node:18

WORKDIR /app_server_websocket

COPY package.json .
COPY package-lock.json .

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "servidor.js"]