FROM node:12-slim

WORKDIR /server

COPY ./package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm","run", "dev"]

