FROM node:14 AS dev

WORKDIR /carlos/src/app

COPY package.json ./

RUN npm install

RUN npm run build

EXPOSE 4000

FROM node:14 as prod

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

WORKDIR /carlos/src/app

COPY --from=dev /carlos/src/app .

EXPOSE 8080

CMD ["node", "dist/main"]