const db = require("../database/db");

// REGISTER
exports.registerForEvent = (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.params;



  if (!eventId) {
    return res.status(400).json({ message: "Event ID required" });
  }

  const eventIdNum = parseInt(eventId);

    if (!eventId || isNaN(eventIdNum) || eventIdNum <= 0) {
        return res.status(400).json({ message: "Invalid Event ID" });
    }

  // Check duplicate registration
  db.get(
    `SELECT * FROM registrations WHERE userId = ? AND eventId = ?`,
    [userId, eventId],
    (err, existing) => {
      if (existing) {
        return res.status(400).json({ message: "Already registered" });
      }

      // Check capacity
      db.get(
        `SELECT capacity FROM events WHERE id = ?`,
        [eventId],
        (err, event) => {
          if (!event) {
            return res.status(404).json({ message: "Event not found" });
          }

          db.get(
            `SELECT COUNT(*) as count FROM registrations WHERE eventId = ?`,
            [eventId],
            (err, result) => {
              if (result.count >= event.capacity) {
                return res.status(400).json({ message: "Event is full" });
              }

              db.run(
                `INSERT INTO registrations (userId, eventId) VALUES (?, ?)`,
                [userId, eventId],
                function (err) {
                  if (err) return res.status(500).json({ message: err.message });

                  res.json({ message: "Registered successfully" });
                }
              );
            }
          );
        }
      );
    }
  );
};



exports.cancelRegistration = (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.params;

  db.run(
    `DELETE FROM registrations WHERE userId = ? AND eventId = ?`,
    [userId, eventId],
    function (err) {
      if (this.changes === 0) {
        return res.status(400).json({ message: "Registration not found" });
      }

      res.json({ message: "Registration cancelled" });
    }
  );
};



exports.getUserEvents = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT e.*
    FROM events e
    JOIN registrations r ON e.id = r.eventId
    WHERE r.userId = ?
  `;

  db.all(query, [userId], (err, events) => {
    if (err) return res.status(500).json({ message: err.message });

    const today = new Date().toISOString().split("T")[0];

    const upcoming = events.filter(event => event.date >= today);
    const past = events.filter(event => event.date < today);

    res.json({ upcoming, past });
  });
};
