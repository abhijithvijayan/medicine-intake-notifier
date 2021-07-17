require('dotenv').config({path: `${__dirname}/../.env`});
const {
  adjustForTimezone,
  timezoneOffset,
} = require('@abhijithvijayan/vaccine-notifier-utils');
const fetch = require('node-fetch');

const {TELEGRAM_CHAT_ID = '', TELEGRAM_BOT_TOKEN = ''} = process.env;

function getPayload(data) {
  return `
          Timestamp: ${new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'full',
            timeStyle: 'long',
          }).format(
            adjustForTimezone(new Date(), timezoneOffset)
          )},\n\npayload:  ${JSON.stringify(data, null, 2)}`;
}

function sendTelegramMessage(data) {
  const telegramURL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  return fetch(telegramURL, {
    method: 'POST',
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: getPayload(data),
    }),
    headers: {'Content-Type': 'application/json'},
  });
}

const main = async () => {
  const data = {
    message: 'hello',
  };

  try {
    await sendTelegramMessage(data);
    console.log('[SUCCESS]: Notification sent.');
  } catch (err) {
    console.log('[ERROR]: Something went wrong', err);
  }
};

main();
