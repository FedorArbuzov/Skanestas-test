FROM node:lts-alpine

COPY . ./
RUN npm i
RUN npm i -g http-server

# собираем приложение для production с минификацией
RUN npm run build

CMD [ "http-server", "build" ]