FROM node:7.9.0-alpine
MAINTAINER Norbert Metz <mr.norbert.metz@googlemail.com>

WORKDIR /src

COPY package.json /src/package.json

RUN npm install

COPY . /src

RUN ln -s /src/log /var/log/achievements-service

EXPOSE 8888

ENTRYPOINT ["npm", "run"]

CMD ["start"]
