require("dotenv").config();
const path = require("path");
const { pool } = require("./db");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// const stripe = require("stripe")(`${process.env.STRIPE}`);
// const gClient = new OAuth2Client(`${process.env.GOOGLE_CLIENTID}`);
const { Pool } = require("pg");
const util = require("util");
const ejs = require("ejs");
const app = express();

const port = process.env.PORT || 8800;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/images")));
app.use(express.static(path.join(__dirname, "/public/stylesheets")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
  res.render("index");
});
app.get("/login", async (req, res) => {
  res.render("login");
});
app.get("/register", async (req, res) => {
  res.render("register");
});
app.get("/form", async (req, res) => {
  res.render("form");
});
app.get("/bookme", async (req, res) => {
  res.render("bookme");
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows: user } = await pool.query(
      `SELECT * FROM customer WHERE username = ${username}`
    );
    if (user[0]) {
      const passwordValid = await bcrypt.compare(password, user[0].password);
      if (passwordValid) {
        const token = jwt.sign(
          { id: user[0].customer_id, username: user[0].username },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.cookie("HBO", token, {
          sameSite: "None",
          secure: true,
          httpOnly: true,
        });
        res.locals.username = user[0].username;
        res.send({ path: "/", status: "200" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});
app.listen(port, () => {
  console.log(`Listening on port ${port} at http://localhost:${port}`);
});
