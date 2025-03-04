FROM node:20

WORKDIR /app

COPY ./notifications-microservice/package*.json ./

RUN npm install

COPY ./notifications-microservice/src ./src
COPY ./notifications-microservice/tsconfig.json ./

COPY ./proto /proto

RUN npm run build

CMD ["node", "dist/main"]