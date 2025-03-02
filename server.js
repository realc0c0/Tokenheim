const express = require('express');
const { Telegraf } = require('telegraf');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize bot with your token
const bot = new Telegraf(process.env.BOT_TOKEN);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Bot commands
bot.command('start', (ctx) => {
  ctx.reply('Welcome to Tokenheim! \nClick the button below to start your adventure:', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: ' Play Tokenheim',
          web_app: { url: process.env.WEBAPP_URL }
        }
      ]]
    }
  });
});

bot.command('help', (ctx) => {
  ctx.reply(` Tokenheim Help:\n
/start - Start the game
/stats - View your stats
/help - Show this help message`);
});

// Express routes
app.post('/webhook', (req, res) => {
  const { message } = req.body;
  if (message) {
    bot.handleUpdate(req.body);
  }
  res.sendStatus(200);
});

// Serve the Vue app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start bot
bot.launch();

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
