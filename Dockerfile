FROM node:20-alpine@sha256:df02558528d3d3d0d621f112e232611aecfee7cbc654f6b375765f72bb262799

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
