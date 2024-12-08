FROM node:20.10-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
# Add more if we want to deploy different applications
RUN pnpm deploy --filter=@checkbox/api-server --prod /prod/api-server

# Add more if we have different applications
FROM base AS api-server
COPY --from=build /prod/api-server /prod/api-server
WORKDIR /prod/api-server
EXPOSE 4000
CMD [ "pnpm", "start" ]
