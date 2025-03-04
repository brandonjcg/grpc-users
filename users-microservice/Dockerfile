FROM node:20

WORKDIR /app

COPY ./users-microservice/package*.json ./

RUN npm install

COPY ./users-microservice/src ./src
COPY ./users-microservice/tsconfig.json ./

COPY ./proto /proto

RUN npm run build

CMD ["node", "dist/main"]