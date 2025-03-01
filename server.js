const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// In-memory storage (replace with a real database in production)
const users = new Map();
const userStats = new Map();

app.use(cors());
app.use(express.json());
app.use(express.static('dist')); // Serve the Vue app from the dist folder

// Initialize bot with your token
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Validate Telegram WebApp data
function validateInitData(initData) {
  try {
    const data = new URLSearchParams(initData);
    const hash = data.get('hash');
    data.delete('hash');
    data.sort();
    
    const secret = crypto
      .createHmac('sha256', 'WebAppData')
      .update(process.env.BOT_TOKEN)
      .digest();
      
    const checkString = Array.from(data.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
      
    const hmac = crypto
      .createHmac('sha256', secret)
      .update(checkString)
      .digest('hex');
      
    return hmac === hash;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

// API Routes
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  const userData = users.get(userId) || {
    tokens: 0,
    level: 1,
    experience: 0,
    stats: {
      battlesWon: 0,
      regionsExplored: 0,
      totalTokens: 0
    }
  };
  
  res.json({ success: true, userData });
});

app.post('/api/users/:userId/update', (req, res) => {
  const { userId } = req.params;
  const { initData, gameData } = req.body;
  
  if (!validateInitData(initData)) {
    return res.status(403).json({ error: 'Invalid init data' });
  }
  
  // Update user data
  const currentData = users.get(userId) || {};
  users.set(userId, {
    ...currentData,
    ...gameData,
    lastUpdated: Date.now()
  });
  
  // Update stats
  const stats = userStats.get(userId) || {};
  userStats.set(userId, {
    ...stats,
    ...gameData.stats
  });
  
  res.json({ success: true });
});

app.get('/api/leaderboard', (req, res) => {
  // Convert Map to array and sort by tokens
  const leaderboard = Array.from(users.entries())
    .map(([id, data]) => ({
      id,
      username: data.username || 'Anonymous',
      tokens: data.tokens,
      level: data.level
    }))
    .sort((a, b) => b.tokens - a.tokens)
    .slice(0, 100); // Top 100 players
    
  res.json({ success: true, leaderboard });
});

// Bot commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 
    "Welcome to Tokenheim! \n\n" +
    "Ready to explore dungeons and collect tokens? " +
    "Click the button below to start your adventure!", {
    reply_markup: {
      inline_keyboard: [[
        {
          text: "Enter Tokenheim ",
          web_app: { url: process.env.WEBAPP_URL }
        }
      ]]
    }
  });
});

// Save user data periodically
setInterval(() => {
  // In a real app, you would save to a database here
  console.log(`Saving data for ${users.size} users...`);
}, 300000); // Every 5 minutes

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
