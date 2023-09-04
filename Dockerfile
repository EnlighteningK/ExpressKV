FROM node:16.15.1
COPY . /dockerapp
WORKDIR /dockerapp

RUN npm install
EXPOSE 3001
CMD ["node", "kvServer1.js"]
