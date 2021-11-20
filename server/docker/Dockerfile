FROM node:16.8-alpine AS base
# install node modules for server
WORKDIR /src
COPY ./package.json ./yarn.lock /
## For keytool
RUN apk add openjdk11
EXPOSE 4000

FROM node:16.8-alpine AS appsource
WORKDIR /app/src
COPY ./appSource .
RUN tar czvf ../appSource.tar.gz .

FROM base as dev
WORKDIR /src/
ENV NODE_ENV=development
RUN yarn global add nodemon expo-cli && yarn install   

COPY . .
COPY --from=appsource /app/appSource.tar.gz /appSource.tar.gz

CMD ["nodemon", "index.js"]
