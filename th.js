curl "https://api.telegram.org/bot8030909532:AAG_7HiUBnra6TgP2jLYkH39cj9diUujh78/setWebhook?url=https://telegram-bot.vercel.app/api/webhook"
  const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

const BOT_TOKEN = "8030909532:AAG_7HiUBnra6TgP2jLYkH39cj9diUujh78";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
let userBalances = {}; // Store balances in memory

app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  const message = req.body.message || req.body.callback_query?.message;
  const chatId = message?.chat.id;

  if (!chatId) return res.sendStatus(200);

  // Handle /start command
  if (req.body.message?.text === "/start") {
    userBalances[chatId] = 0; // initialize balance

    await sendMessage(chatId, "Hello I am Chisom", {
      inline_keyboard: [
        [
          { text: "Task 1 ✅", callback_data: "task1" },
          { text: "Task 2 ✅", callback_data: "task2" },
        ],
        [
          { text: "Task 3 ✅", callback_data: "task3" },
          { text: "Task 4 ✅", callback_data: "task4" },
        ],
      ],
    });
  }

  // Handle button (callback_query)
  if (req.body.callback_query) {
    const data = req.body.callback_query.data;
    const from = req.body.callback_query.from;

    // Increase balance
    userBalances[chatId] = (userBalances[chatId] || 0) + 10;

    await sendMessage(chatId, `✅ ${data} completed. Your new balance: $${userBalances[chatId]}`);
  }

  res.sendStatus(200);
});

async function sendMessage(chatId, text, reply_markup = null) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_markup,
    }),
  });
}

app.get("/", (req, res) => res.send("Bot is running"));
app.listen(PORT, () => console.log(`Bot server listening on port ${PORT}`));

