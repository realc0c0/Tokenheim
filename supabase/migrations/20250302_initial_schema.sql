-- Create players table
CREATE TABLE players (
    id bigint PRIMARY KEY,
    username text NOT NULL,
    tokens integer DEFAULT 0,
    level integer DEFAULT 1,
    exp_points integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create player_stats table
CREATE TABLE player_stats (
    player_id bigint PRIMARY KEY REFERENCES players(id),
    battles_won integer DEFAULT 0,
    regions_explored integer DEFAULT 0,
    total_tokens integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create battles table
CREATE TABLE battles (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    player_id bigint REFERENCES players(id),
    won boolean NOT NULL,
    tokens_earned integer NOT NULL,
    region text,
    enemy text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_players_tokens_level ON players(tokens DESC, level DESC);
CREATE INDEX idx_battles_player_id ON battles(player_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_stats_updated_at
    BEFORE UPDATE ON player_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
