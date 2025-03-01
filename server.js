const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
)

// Middleware to verify Telegram WebApp data
const verifyTelegramWebAppData = (req, res, next) => {
  // Add your Telegram WebApp verification logic here
  next()
}

// API Routes
app.get('/api/users/:userId', verifyTelegramWebAppData, async (req, res) => {
  try {
    const { userId } = req.params
    const { data: player } = await supabase
      .from('players')
      .select('*')
      .eq('id', userId)
      .single()

    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' })
    }

    const { data: stats } = await supabase
      .from('player_stats')
      .select('*')
      .eq('player_id', userId)
      .single()

    res.json({
      success: true,
      userData: {
        ...player,
        stats: stats || {
          battlesWon: 0,
          regionsExplored: 0,
          totalTokens: 0
        }
      }
    })
  } catch (error) {
    console.error('Error fetching user data:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

app.post('/api/users/:userId/save', verifyTelegramWebAppData, async (req, res) => {
  try {
    const { userId } = req.params
    const { playerData, stats } = req.body

    // Update player data
    await supabase
      .from('players')
      .upsert({
        id: userId,
        ...playerData,
        updated_at: new Date().toISOString()
      })

    // Update player stats
    if (stats) {
      await supabase
        .from('player_stats')
        .upsert({
          player_id: userId,
          ...stats,
          updated_at: new Date().toISOString()
        })
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Error saving user data:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

app.get('/api/leaderboard', async (req, res) => {
  try {
    const { data: players } = await supabase
      .from('players')
      .select('*')
      .order('tokens', { ascending: false })
      .order('level', { ascending: false })
      .limit(10)

    res.json({ success: true, leaderboard: players })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

app.post('/api/battles', verifyTelegramWebAppData, async (req, res) => {
  try {
    const { playerId, battleData } = req.body

    await supabase
      .from('battles')
      .insert({
        player_id: playerId,
        ...battleData,
        created_at: new Date().toISOString()
      })

    res.json({ success: true })
  } catch (error) {
    console.error('Error saving battle data:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
