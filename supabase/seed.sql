-- Insert some initial players for testing
INSERT INTO players (id, username, tokens, level, exp_points)
VALUES 
    (1, 'TestPlayer1', 100, 1, 0),
    (2, 'TestPlayer2', 200, 2, 150),
    (3, 'TestPlayer3', 300, 3, 250);

-- Insert their stats
INSERT INTO player_stats (player_id, battles_won, regions_explored, total_tokens)
VALUES 
    (1, 5, 2, 100),
    (2, 10, 4, 200),
    (3, 15, 6, 300);

-- Insert some battle history
INSERT INTO battles (player_id, won, tokens_earned, region, enemy)
VALUES 
    (1, true, 20, 'Forest', 'Goblin'),
    (1, false, 0, 'Cave', 'Troll'),
    (2, true, 30, 'Mountain', 'Dragon'),
    (3, true, 40, 'Dungeon', 'Skeleton');
