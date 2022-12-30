FROM node:alpine

ARG target=production

ENV target=$target
ENV NODE_ENV=$target

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

RUN ["chmod","+x", "/app/scripts/run.sh"]
CMD /app/scripts/run.sh