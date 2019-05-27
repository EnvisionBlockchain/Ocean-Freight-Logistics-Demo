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
ADD frontend/public ./public
ADD frontend/src/ ./src

RUN npm install

FROM node:10-alpine

RUN apk add --update --no-cache bash nano
WORKDIR /mnt

COPY --from=build /mnt/package.json .
COPY --from=build /mnt/public ./public
COPY --from=build /mnt/node_modules ./node_modules
COPY --from=build /mnt/src/ ./src

CMD ["npm", "start"]
