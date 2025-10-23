FROM node:24-alpine3.22

WORKDIR /client

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm" , "run" , "dev"]