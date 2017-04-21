FROM node:7.9.0-alpine
MAINTAINER Norbert Metz <mr.norbert.metz@googlemail.com>

WORKDIR /src

COPY package.json /src/package.json

RUN npm install

COPY . /src

EXPOSE 8888

ENTRYPOINT ["npm", "run"]

CMD ["start"]
