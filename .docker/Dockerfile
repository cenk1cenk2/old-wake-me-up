FROM node:14-alpine as node

FROM golang:alpine

# Package Start Command for the API
ENV S6_VERSION 1.21.8.0

# Install bash
RUN apk add --no-cache --no-progress bash git

# Install s6 overlay
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_VERSION}/s6-overlay-amd64.tar.gz /tmp/
RUN tar xzf /tmp/s6-overlay-amd64.tar.gz -C / && \
  mkdir -p /etc/services.d /etc/cont-init.d /etc/cont-finish.d /etc/fix-attrs.d

# Workdir for package
WORKDIR /data/app

# Move s6 supervisor files inside the container
COPY ./services.d /etc/services.d

ENV GO111MODULE=on

RUN go get github.com/codegangsta/gin

# Copy Node
RUN apk add --no-cache --no-progress \
  libstdc++ gcc musl-dev

COPY --from=node /usr/local /usr/local
COPY --from=node /opt /opt

# smoke test
RUN node --version && \
  npm --version && \
  yarn --version

# s6 behaviour, https://github.com/just-containers/s6-overlay
ENV S6_KEEP_ENV 1
ENV S6_BEHAVIOUR_IF_STAGE2_FAILS 2
ENV S6_FIX_ATTRS_HIDDEN 1
ENV S6_SERVICES_GRACETIME 1000

ENTRYPOINT ["/init"]