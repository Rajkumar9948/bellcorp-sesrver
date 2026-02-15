const db = require("./db");

const events = [
  {
    name: "React Conference 2026",
    organizer: "TechWorld",
    location: "Hyderabad",
    date: "2026-06-10",
    description: "Annual React developer meetup",
    capacity: 100,
    category: "Technology"
  },
  {
    name: "Music Fest",
    organizer: "Live Nation",
    location: "Bangalore",
    date: "2026-03-15",
    description: "Live music festival",
    capacity: 200,
    category: "Entertainment"
  },
  {
    name: "Startup Pitch Day",
    organizer: "Startup Hub",
    location: "Mumbai",
    date: "2025-12-20",
    description: "Pitch your startup idea",
    capacity: 50,
    category: "Business"
  }
];

// Insert multiple times for large dataset simulation
for (let i = 0; i < 7; i++) {
  events.forEach(event => {
    db.run(
      `INSERT INTO events (name, organizer, location, date, description, capacity, category)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        event.name + " " + i,
        event.organizer,
        event.location,
        event.date,
        event.description,
        event.capacity,
        event.category
      ]
    );
  });
}

console.log("Events seeded successfully");
