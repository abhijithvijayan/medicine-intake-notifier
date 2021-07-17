# medicine-intake-notifier

A simple notifier

## Docs

### Set up deta.sh

> <https://docs.deta.sh/docs/cli/install>

### Deploy to Deta

```shell
deta new --node medicine-intake-notifier
yarn install
yarn deploy
yarn set:cron # sets for 5 minutes interval
```

#### Note: For subsequent deployment run only

```shell
yarn deploy
```

### Creating Telegram Bot

> <https://core.telegram.org/bots#6-botfather>

### Getting Telegram User Id for account

> Search for `@getidsbot` in telegram
> Click Start
> Use the `id` field returned
