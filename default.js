require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  botToken: process.env.BOT_TOKEN,
  adminTelegramId: process.env.ADMIN_TELEGRAM_ID,
  adminPassword: process.env.ADMIN_PASSWORD,
 webAppUrl: process.env.WEBAPP_URL
};