const db = require("./db"); // Assuming db.js is configured for MySQL connection
const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
// app.get("/", (req, res) => {
//   res.send("Welcome to the CRUD API!");
// });
app.post("/register", (req, res) => {
  console.log("in register");

  console.log(req.body);

  const { role, password, ...details } = req.body;
  if (!role || !password) {
    return res.status(400).json({ error: "Role and password are required." });
  }

  console.log(details);

  const userId = details.email;

  const userSql = "INSERT INTO users (userId, role, password) VALUES (?, ?, ?)";
  db.query(userSql, [userId, role, password], (err, result) => {
    if (err) {
      console.error("Error inserting into users table:", err);
      return res.status(500).json({ error: "Error registering user." });
    }

    if (role === "student") {
      name = details.name;
      gender = details.gender;
      mob_No = details.mobile;
      Date_of_birth = details.dob;

      const studentSql =
        "INSERT INTO students (name, gender, mob_No, email, Date_of_birth) VALUES (?, ?, ?, ?, ?)";
      db.query(
        studentSql,
        [name, gender, mob_No, userId, Date_of_birth],
        (err, result) => {
          if (err) {
            console.error("Error inserting into students table:", err);
            return res
              .status(500)
              .json({ error: "Error registering student." });
          }
          res.status(201).json({ message: "Student registered successfully!" });
        }
      );
    } else if (role === "teacher") {
      const { name, subject, experience, salary, mob_no } = details;
      const teacherSql =
        "INSERT INTO teacher (name, subject, experience, salary, mob_no, email) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(
        teacherSql,
        [name, subject, experience, salary, mob_no, userId],
        (err, result) => {
          if (err) {
            console.error("Error inserting into teacher table:", err);
            return res
              .status(500)
              .json({ error: "Error registering teacher." });
          }
          res.status(201).json({ message: "Teacher registered successfully!" });
        }
      );
    } else if (role === "admin") {
      const { name, gender, mob_no, salary } = details;
      const adminSql =
        "INSERT INTO admin (name, gender, mob_no, email, salary) VALUES (?, ?, ?, ?, ?)";
      db.query(
        adminSql,
        [name, gender, mob_no, userId, salary],
        (err, result) => {
          if (err) {
            console.error("Error inserting into admin table:", err);
            return res.status(500).json({ error: "Error registering admin." });
          }
          res.status(201).json({ message: "Admin registered successfully!" });
        }
      );
    } else {
      return res.status(400).json({ error: "Invalid role specified." });
    }
  });
});

// POST /login: User login
app.post("/login", (req, res) => {
  const { userId, password } = req.body;

  db.query("SELECT * FROM users WHERE userId = ?", [userId], (err, results) => {
    if (err)
      return res.status(500).json({ message: "Error logging in", error: err });

    if (results.length > 0) {
      const user = results[0];

      // Direct comparison (assuming password is stored as plain text, not secure)
      if (password === user.password) {
        return res.status(200).json({ message: "Login successful", user });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

app.get("/profile", (req, res) => {
  const userEmail = req.query.email;

  // Validate the userId query parameter
  if (!userEmail) {
    return res.status(400).json({ error: "Missing email query parameter" });
  }
  db.query(
    "SELECT * FROM students WHERE email = ?",
    [userEmail],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ error: "Failed to fetch profile" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Profile not found" });
      }

      // Return the first matched result
      res.json(results[0]);
    }
  );
});

// app.put("/profile", (req, res) => {
//   const updatedProfile = req.body;

//   // Update in database (replace with actual DB query)
//   db.query(
//       "UPDATE users SET name = ?, mobile = ?, dob = ?, password = ?, gender = ? WHERE username = ?",
//       [updatedProfile.name, updatedProfile.mobile, updatedProfile.dob, updatedProfile.password, updatedProfile.gender, updatedProfile.username],
//       (err, results) => {
//           if (err) return res.status(500).json({ error: "Failed to update profile" });
//           res.json({ message: "Profile updated successfully" });
//       }
//   );
// });

app.listen(5000, () => {
  console.log(`Server running on http://localhost:${port}`);
});
