FROM oven/bun:1 AS base
WORKDIR /usr/src/app

RUN apt-get update -y && apt-get install -y openssl

FROM base AS install
RUN mkdir -p /tmp/dev
COPY package.json bun.lock /tmp/dev/
RUN cd /tmp/dev && bun install --frozen-lockfile

RUN mkdir -p /tmp/prod
COPY package.json bun.lock /tmp/prod/
RUN cd /tmp/prod && bun install --frozen-lockfile --production

FROM base AS prerelease
COPY --from=install /tmp/dev/node_modules node_modules
COPY . .

RUN bun run generate:tmdb
RUN bun run generate:prisma

RUN bun check

FROM base AS release
COPY --from=install /tmp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/src/generated ./src/generated
COPY . .

ENV NODE_ENV=production
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/app" ]
