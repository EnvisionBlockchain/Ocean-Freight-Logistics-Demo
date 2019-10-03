FROM node:10-alpine AS build

RUN apk add --update \
    bash \
    python \
    make \
    g++ \
    git \
    gnupg \
    rm -rf /var/cache/apk/*

WORKDIR /mnt

ADD frontend/package.json .

RUN npm install

FROM node:10-alpine

RUN apk add --update --no-cache bash nano tree
WORKDIR /mnt

COPY --from=build /mnt/package.json .
COPY --from=build /mnt/node_modules ./node_modules
ADD frontend/public ./mnt/public
ADD frontend/src/ ./mnt/src

CMD ["npm", "start"]
