// ======================= DEV-ONLY MOCK BACKEND =======================
// Lets you work on the UI without XAMPP/MySQL running.
//   Turn on:  http://localhost:8000/?mock=1   (stays on until turned off)
//   Turn off: http://localhost:8000/?mock=0
// While on, every "api/*.php" call is answered from localStorage instead of
// the PHP backend. Any email/password logs in.

const FLAG_KEY = "cnMock";
const DB_KEY = "cnMockDb";

const param = new URLSearchParams(window.location.search).get("mock");
if (param === "1") localStorage.setItem(FLAG_KEY, "1");
if (param === "0") {
  localStorage.removeItem(FLAG_KEY);
  localStorage.removeItem(DB_KEY);
}

const seedDb = () => ({
  loggedIn: false,
  nextId: 3,
  user: { firstName: "Juan", lastName: "Dela Cruz", govId: "MOCK-0001" },
  reservations: [
    {
      id: 1,
      transactionId: "RES-MOCK-0001",
      hotel: "Bagasbas Lighthouse Hotel Resort",
      roomType: "Deluxe",
      checkIn: "2026-12-20",
      checkOut: "2026-12-23",
      guests: 2,
      status: "Confirmed",
      bookedOn: "10/5/2026",
    },
  ],
  tripplans: [
    {
      id: 2,
      transactionId: "TRP-MOCK-0001",
      tripName: "Summer Barkada Getaway",
      startDate: "2026-12-20",
      endDate: "2026-12-23",
      travelers: 4,
      destination: "Daet",
      touristSpots: "",
      transportMode: "Private Vehicle",
      budget: "Mid-Range (₱3,000–₱7,000/day)",
      notes: "Day 1: Arrive in Daet, surf Bagasbas. Day 2: Boat to Calaguas.",
      status: "Saved",
      submittedOn: "10/5/2026",
    },
  ],
});

function loadDb() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY)) || seedDb();
  } catch {
    return seedDb();
  }
}

function saveDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function handle(file, body) {
  const db = loadDb();
  const needLogin = { success: false, message: "Please login first." };
  let out;

  switch (file) {
    case "check_session.php":
      out = { loggedIn: db.loggedIn, user: db.user };
      break;
    case "login.php":
      db.loggedIn = true;
      if (body && body.email) {
        db.user.email = body.email;
        if (!db.user.firstName || db.user.firstName === "Juan") {
          const namePart = body.email.split("@")[0];
          db.user.firstName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        }
      }
      saveDb(db);
      out = { success: true, user: db.user };
      break;
    case "register.php":
      db.loggedIn = true;
      db.user.firstName = (body && body.firstName) || db.user.firstName;
      db.user.lastName = (body && body.lastName) || db.user.lastName;
      db.user.email = (body && body.email) || db.user.email || "user@example.com";
      saveDb(db);
      out = { success: true, user: db.user };
      break;
    case "logout.php":
      db.loggedIn = false;
      saveDb(db);
      out = { success: true };
      break;
    case "get_bookings.php":
      if (!db.loggedIn) return { success: false, message: "Not logged in" };
      out = {
        success: true,
        reservations: db.reservations.map((r) => ({ ...r, ...db.user })),
        tripplans: db.tripplans.map((t) => ({
          ...t,
          name: db.user.firstName + " " + db.user.lastName,
        })),
      };
      break;
    case "reserve.php":
    case "plan_trip.php": {
      if (!db.loggedIn) return needLogin;
      const list = file === "reserve.php" ? db.reservations : db.tripplans;
      list.unshift({ ...body, id: db.nextId++, status: "Confirmed" });
      out = { success: true, id: body.transactionId };
      break;
    }
    case "update_entry.php": {
      if (!db.loggedIn) return needLogin;
      const list = body.target === "reservation" ? db.reservations : db.tripplans;
      const row = list.find((r) => r.id == body.id);
      if (!row) return { success: false, message: "Update failed." };
      const { id, target, transactionId, submittedOn, ...fields } = body;
      Object.assign(row, fields);
      out = { success: true };
      break;
    }
    case "delete_entry.php": {
      if (!db.loggedIn) return needLogin;
      const key = body.target === "reservation" ? "reservations" : "tripplans";
      db[key] = db[key].filter((r) => r.id != body.id);
      out = { success: true };
      break;
    }
    case "contact.php":
      out = { success: true };
      break;
    default:
      return null;
  }

  saveDb(db);
  return out;
}

if (localStorage.getItem(FLAG_KEY) === "1") {
  const realFetch = window.fetch.bind(window);

  window.fetch = (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    const match = url.match(/(?:^|\/)api\/([\w-]+\.php)/);
    if (!match) return realFetch(input, init);

    let body = {};
    try {
      body = init.body ? JSON.parse(init.body) : {};
    } catch {}

    const result = handle(match[1], body);
    if (result === null) return realFetch(input, init);

    return Promise.resolve(
      new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      }),
    );
  };

  console.warn("[mock] Mock backend is ON. Open ?mock=0 to turn it off.");
}
