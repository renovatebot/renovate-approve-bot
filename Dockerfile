FROM node:20-alpine@sha256:aa22e2c263d7242e7452d1efa40a031ac8ccf2305cc4d925c737486d339bd178

LABEL maintainer="Rhys Arkins <rhys@arkins.net>"

WORKDIR /opt/app/

ARG USER_UID=1001
ARG USER_GID=1001
ARG APP_DIR=/opt/app/

RUN addgroup -g ${USER_GID} renovate \
    && adduser -u ${USER_UID} -G renovate -s /bin/sh -D renovate \
    && mkdir -p ${APP_DIR} \
    && chown -R ${USER_UID}:${USER_GID} ${APP_DIR} \
    && apk add --no-cache python3 \
    && apk add --no-cache make 

USER renovate
COPY --chown=renovate:renovate package.json package-lock.json ${APP_DIR}

RUN npm install

COPY . ${APP_DIR}

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start"]
