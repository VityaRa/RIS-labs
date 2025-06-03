FROM elixir:1.14.3-alpine AS builder

RUN apk add --no-cache build-base git npm

RUN mix local.hex --force && \
    mix local.rebar --force

WORKDIR /app

COPY mix.exs mix.lock ./
COPY config config

RUN mix deps.get --only prod && \
    mix deps.compile

COPY . .

RUN mix compile

RUN mix release

FROM alpine:3.16.2

RUN apk add --no-cache openssl ncurses-libs libstdc++ bash

WORKDIR /app

COPY --from=builder /app/_build/prod/rel/task_manager_api ./

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

ENV MIX_ENV=prod
ENV PORT=4000
ENV HOST=0.0.0.0

EXPOSE 4000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["bin/task_manager_api", "start"]