const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const path = require("path");
const User = require("./models/user"); // Rename user to User (convention)
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Add this line
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Correct way to serve static files
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return res.status(500).send("Error generating salt");
    }
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        return res.status(500).send("Error hashing password");
      }
      try {
        const createUser = await User.create({
          username: name,
          email: email,
          password: hash,
        });
        const token = jwt.sign({ email }, process.env.JWT_SECRET || "keyyyyyy", { expiresIn: '1h' }); // Use env variable
        res.cookie("token", token, { httpOnly: true });
        return res.send(createUser);
      } catch (error) {
        return res.status(500).send("Error creating user");
      }
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).send("User not found");
    }
    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res.status(400).send("Invalid password");
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET || "keyyyyyy", { expiresIn: '1h' });
    res.cookie("token", token, { httpOnly: true });
    return res.send("Login successful");
  } catch (error) {
    return res.status(500).send("Login failed");
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) }); // Expire the cookie
  return res.send("Logout successful");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
