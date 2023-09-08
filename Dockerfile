FROM node:18

WORKDIR /app

COPY *.json ./

RUN npm install

RUN npm run build

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]