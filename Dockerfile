FROM amd64/node:14.17.0-alpine@sha256:b4cca2f95c701d632ffd39258f9ec9ee9fb13c8cc207f1da02eb990c98395ac1

LABEL maintainer="Rhys Arkins <rhys@arkins.net>"

WORKDIR /opt/app/

ARG USER_UID=1001
ARG USER_GID=1001
ARG APP_DIR=/opt/app/

RUN addgroup -g ${USER_GID} renovate \
    && adduser -u ${USER_UID} -G renovate -s /bin/sh -D renovate \
    && mkdir -p ${APP_DIR} \
    && chown -R ${USER_UID}:${USER_GID} ${APP_DIR} \
    && apk add --no-cache python \
    && apk add --no-cache make 

USER renovate
COPY --chown=renovate:renovate package.json package-lock.json ${APP_DIR}

RUN npm install

COPY . ${APP_DIR}

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start"]
