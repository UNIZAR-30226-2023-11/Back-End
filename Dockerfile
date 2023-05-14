FROM node:18
# RUN useradd -ms /bin/bash usuario
WORKDIR /home/usuario/app
COPY package*.json ./
COPY ./app_server_websocket .
# RUN rm -rf ./node_modules
RUN npm install
WORKDIR /home/usuario/app/app_server_websocket
USER root
RUN npm install socket.io app_server_websocket/
# RUN ls -la
# RUN chown -R usuario:usuario /home/usuario/app
# USER usuario
# CMD ["tail", "-f", "/dev/null"]
CMD ["npm","start"]
