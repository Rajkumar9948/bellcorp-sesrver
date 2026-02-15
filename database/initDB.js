const db = require("./db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      organizer TEXT,
      location TEXT,
      date TEXT,
      description TEXT,
      capacity INTEGER,
      category TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      eventId INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (eventId) REFERENCES events(id)
    )
  `);

  console.log("Tables created successfully");
});


db.run(`CREATE INDEX IF NOT EXISTS idx_events_name ON events(name)`);
db.run(`CREATE INDEX IF NOT EXISTS idx_events_category ON events(category)`);
db.run(`CREATE INDEX IF NOT EXISTS idx_events_location ON events(location)`);
db.run(`CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations(userId)`);
db.run(`CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(eventId)`);

