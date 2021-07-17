require('dotenv').config({path: `${__dirname}/../.env`});
const {
  adjustForTimezone,
  timezoneOffset,
} = require('@abhijithvijayan/vaccine-notifier-utils');
const fetch = require('node-fetch');
const {app} = require('deta');

const {TELEGRAM_CHAT_ID = '', TELEGRAM_BOT_TOKEN = ''} = process.env;

// will send notification at 10:00am and 10:00pm
const notificationHour = 10;
// offset time to send notification between 10:00 - 10:05
const offsetMinutes = 5;

function getCurrentTimeInSeconds() {
  const today = adjustForTimezone(new Date(), timezoneOffset);
  const hour = today.getHours();
  const minutes = today.getMinutes();

  return hour * 60 * 60 + minutes * 60; // ignoring seconds here
}

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

async function trigger() {
  const notificationTimeInSeconds = notificationHour * 60 * 60;
  const offsetInSeconds = offsetMinutes * 60;
  const currentSeconds = getCurrentTimeInSeconds();

  if (
    currentSeconds >= notificationTimeInSeconds &&
    currentSeconds < notificationTimeInSeconds + offsetInSeconds
  ) {
    const data = {
      message: 'Take Medicine',
    };

    try {
      await sendTelegramMessage(data);
      console.log('[SUCCESS]: Notification sent.');
    } catch (err) {
      console.log('[ERROR]: Something went wrong', err);
    }
  } else {
    console.log({
      currentSeconds,
      notificationTimeInSeconds,
      max: notificationTimeInSeconds + offsetInSeconds,
    });
  }
}

function start(_event) {
  return trigger();
}

// https://docs.deta.sh/docs/micros/run#run-and-cron
app.lib.run(start);
app.lib.cron(start);

module.exports = app;
