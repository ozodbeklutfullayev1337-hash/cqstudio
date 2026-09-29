const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '8784291097:AAH-RSugR8-aa4nM0QICt-AGpBnI2U_TL9I';
const bot = new TelegramBot(TOKEN, { polling: true });

const WEBAPP_URL = 'https://uncooked-squander-turkey.ngrok-free.dev';

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const name = msg.from.first_name || "Mijoz";

    const welcomeMessage = `✨ <b>Assalomu alaykum, ${name}!</b>\n\n` +
                           `CQ Studio raqamli xizmatlar studiyasiga xush kelibsiz. G'oyalaringizni yuqori darajada amalga oshiramiz.\n\n` +
                           `Quyidagi tugma orqali ilovani oching:`;

    bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    { 
                        text: "✨ Ilovani ochish", 
                        web_app: { url: WEBAPP_URL } 
                    }
                ],
                [
                    { 
                        text: "📞 Aloqa", 
                        url: "https://t.me/cqdizaynstudio" 
                    }
                ]
            ]
        }
    });
});

console.log("Telegram Bot muvaffaqiyatli ishga tushdi va xabarlarni qabul qilmoqda...");

module.exports = bot;