FROM node:14.17-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --silent
COPY . .

EXPOSE 3101

CMD ["npm","start"]
