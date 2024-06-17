# base stage
FROM alpine:3.19 as base

RUN set -e; \
    apk --no-cache add \
        nodejs \
        yarn \
        python3 \
        perl \
        perl-file-slurp \
        perl-json \
        php-cli;

WORKDIR /app


# builder stage
FROM base as builder

WORKDIR /app

COPY src/ /app/src/
COPY tsconfig.json /app/
COPY eslint.config.js /app/
COPY package.json /app/

RUN set -e; \
    yarn install; \
    yarn build; \
    yarn install --production


# final stage
FROM base as final

ENV HOST='0.0.0.0'
ENV PORT=3000
ENV TMPDIR='.tmp'

WORKDIR /app

COPY --from=builder /app/package.json /app
COPY --from=builder /app/node_modules/ /app/node_modules/
COPY --from=builder /app/dist/ /app/dist/

EXPOSE 3000

ENTRYPOINT [ "yarn" ]
CMD [ "serve" ]
