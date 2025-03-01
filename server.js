const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize bot with your token
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Validate Telegram WebApp data
function validateInitData(initData) {
    // In production, implement proper validation
    return true;
}

// Handle game state updates
app.post('/api/update', (req, res) => {
    const { initData, action, data } = req.body;
    
    if (!validateInitData(initData)) {
        return res.status(403).json({ error: 'Invalid init data' });
    }

    // Handle different game actions
    switch (action) {
        case 'saveProgress':
            // Save player progress
            res.json({ success: true });
            break;
            
        case 'enterDungeon':
            // Handle dungeon entry
            res.json({ 
                dungeonData: {
                    name: "Frostbyte Vault",
                    difficulty: "Medium",
                    rewards: ["Ice Token", "Frozen Shard"]
                }
            });
            break;
            
        default:
            res.status(400).json({ error: 'Invalid action' });
    }
});

// Bot commands
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 
        "Welcome to Tokenheim! 🏰\n\n" +
        "Ready to explore dungeons and collect tokens? " +
        "Click the button below to start your adventure!", {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: "Enter Tokenheim 🎮",
                    web_app: { url: process.env.WEBAPP_URL }
                }
            ]]
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
