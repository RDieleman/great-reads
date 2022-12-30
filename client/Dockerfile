FROM node:alpine

ARG target=prod

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

ENV target=$target
RUN ["chmod","+x", "/app/scripts/run.sh"]
CMD /app/scripts/run.sh