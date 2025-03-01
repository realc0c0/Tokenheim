import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Player data operations
export const playerService = {
  async getPlayer(playerId) {
    const { data, error } = await supabase
      .from('players')
      .select('id, username, tokens, level, exp_points')
      .eq('id', playerId)
      .single()
    
    if (error) throw error
    return data
  },

  async updatePlayer(playerId, playerData) {
    const { data, error } = await supabase
      .from('players')
      .upsert({
        id: playerId,
        updated_at: new Date().toISOString(),
        ...playerData
      })
      .select()
    
    if (error) throw error
    return data
  },

  async getLeaderboard() {
    const { data, error } = await supabase
      .from('players')
      .select('id, username, tokens, level, exp_points')
      .order('tokens', { ascending: false })
      .order('level', { ascending: false })
      .limit(10)
    
    if (error) throw error
    return data
  },

  async saveBattleResult(playerId, result) {
    const { data, error } = await supabase
      .from('battles')
      .insert({
        player_id: playerId,
        won: result.won,
        tokens_earned: result.tokensEarned,
        region: result.region,
        enemy: result.enemy,
        created_at: new Date().toISOString()
      })
    
    if (error) throw error
    return data
  },

  async getPlayerStats(playerId) {
    const { data, error } = await supabase
      .from('player_stats')
      .select('battles_won, regions_explored, total_tokens')
      .eq('player_id', playerId)
      .single()
    
    if (error) throw error
    return data
  },

  async updatePlayerStats(playerId, stats) {
    const { data, error } = await supabase
      .from('player_stats')
      .upsert({
        player_id: playerId,
        battles_won: stats.battlesWon,
        regions_explored: stats.regionsExplored,
        total_tokens: stats.totalTokens,
        updated_at: new Date().toISOString()
      })
      .select()
    
    if (error) throw error
    return data
  }
}
