// server/db.js
const sqlite3 = require('sqlite3').verbose();
const dbFile = process.env.DB_FILE || 'leaderboard.db';
const db = new sqlite3.Database(dbFile);

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    name TEXT,
    xp INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0
)`);

module.exports = {
  recordGameResult: function(playerId, xpGained, coinsGained, won) {
    db.run(
      `INSERT INTO players(id, xp, coins, wins) 
       VALUES(?, ?, ?, ?) 
       ON CONFLICT(id) DO UPDATE 
       SET xp = xp + ?, coins = coins + ?, wins = wins + ?;`,
      [playerId, xpGained, coinsGained, won ? 1 : 0, xpGained, coinsGained, won ? 1 : 0]
    );
  },
  getTopPlayers: function(limit, callback) {
    db.all(`SELECT name, xp, wins FROM players ORDER BY xp DESC LIMIT ?`, [limit], (err, rows) => {
      callback(err, rows);
    });
  }
};
