FROM node:10.8.0-alpine

RUN mkdir -p /app
RUN mkdir -p /app/dist
RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python
RUN npm install --quiet node-gyp -g 

WORKDIR /app

ADD package*.json /app/

RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV=production

CMD ls -l && npm run start:prod

VOLUME [ "/app" ]