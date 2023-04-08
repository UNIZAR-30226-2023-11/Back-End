FROM node:18
RUN useradd -ms /bin/bash usuario
WORKDIR /home/usuario/app
COPY package*.json ./
RUN npm install
COPY . .
RUN chown -R usuario:usuario /home/usuario/app
USER usuario
CMD ["npm", "start"]