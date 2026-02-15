const db = require("../database/db");

// CREATE EVENT
exports.createEvent = (req, res) => {
  const { name, organizer, location, date, description, capacity, category } = req.body;

  if (!name || !date || !capacity) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const query = `
    INSERT INTO events (name, organizer, location, date, description, capacity, category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [name, organizer, location, date, description, capacity, category],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });

      res.status(201).json({
        message: "Event created successfully",
        eventId: this.lastID
      });
    }
  );
};


exports.getEvents = (req, res) => {
  const { search, category, location, date, page = 1, limit = 5 } = req.query;

  let query = `SELECT * FROM events WHERE 1=1`;
  let params = [];

  if (search) {
    query += ` AND name LIKE ?`;
    params.push(`%${search}%`);
  }

  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }

  if (location) {
    query += ` AND location = ?`;
    params.push(location);
  }

  if (date) {
    query += ` AND date = ?`;
    params.push(date);
  }

  const offset = (page - 1) * limit;

  query += ` LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));

  db.all(query, params, (err, events) => {
    if (err) return res.status(500).json({ message: err.message });

    res.json(events);
  });
};
