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
async function authenticate(req, res, next) {
  let token = req.cookies.HBO;
  if (!token) {
    return next();
  }
  if (req.cookies.HBO) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.username = user.username;
      return next();
    } catch (err) {
      res.clearCookie("HBO");
      res.send({ path: "/" });
    }
  }
}

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

app.get("/", authenticate, async (req, res) => {
  res.render("index");
});
app.get("/login", authenticate, async (req, res) => {
  res.render("login");
});
app.get("/register", authenticate, async (req, res) => {
  res.render("register");
});
app.get("/form:id", authenticate, async (req, res) => {
  res.render("form");
});
app.get("/bookme:location", authenticate, async (req, res) => {
  res.render("bookme");
});
app.post("/booking", authenticate, async (req, res) => {
  const { id } = req.body;
  if (res.locals.username) {
    const { rows: user_detail } = await pool.query(
      `SELECT * FROM customer WHERE username = '${res.locals.username}'`
    );
    const { rows: hotel_detail } = await pool.query(
      `SELECT * FROM hotel WHERE hotel_id = '${id}'`
    );
    res.send({ status: "200", user: user_detail[0], hotel: hotel_detail[0] });
  } else {
    res.send({ status: "300" });
  }
});
app.post("/", authenticate, async (req, res) => {
  try {
    const { rows: hotel } = await pool.query(`SELECT * FROM hotel`);
    const { rows: hotel_location } = await pool.query(
      `SELECT DISTINCT city FROM hotel`
    );
    let id;
    let price_array = [];
    for (let i = 0; i < hotel.length; i++) {
      id = hotel[i].hotel_id;
      const {
        rows: [price],
      } = await pool.query(
        `SELECT price FROM room_type WHERE hotel_id = '${id}'`
      );
      price_array.push(price);
    }
    if (hotel && price_array) {
      res.send({
        hotel: hotel,
        prices: price_array,
        status: "200",
        location: hotel_location,
      });
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/search", authenticate, async (req, res) => {
  const { location } = req.body;
  try {
    res.send({
      path: `/bookme:${location}`,
      status: "200",
    });
  } catch (err) {
    console.log(err);
  }
});
app.post("/bookme", authenticate, async (req, res) => {
  const { location } = req.body;
  try {
    const { rows: hotel } = await pool.query(
      `SELECT * FROM hotel WHERE city = '${location}'`
    );
    res.send({
      hotel: hotel,
      status: "200",
    });
  } catch (err) {
    console.log(err);
  }
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows: user } = await pool.query(
      `SELECT * FROM customer WHERE username = '${username}'`
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
app.post("/logout", authenticate, async (req, res) => {
  if (res.locals.username) {
    res.clearCookie("HBO");
    res.send({ path: "/" });
  }
});
app.post("/register", authenticate, async (req, res) => {
  if (req.body.password == req.body.confirm_password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    data = [
      req.body.firstname,
      req.body.lastname,
      req.body.email,
      req.body.username,
      hashedPassword,
    ];
    console.log(data);
    try {
      await pool.query(
        `INSERT INTO customer (f_name,l_name,email,username,password) VALUES ($1,$2,$3,$4,$5)`,
        data
      );

      res.send({ status: "200" });

      // return res.status(200).alert('Successfully logged in!')
    } catch (err) {
      console.log(err);
    }
  }
});

app.post("/form", authenticate, async (req, res) => {
  // data = [
  //   req.body.firstname,
  //   req.body.lastname,
  //   req.body.email,
  //   req.body.phone,
  //   req.body.location,
  //   req.body.hotelname,
  //   req.body.roomtype,
  //   req.body.no_person,
  //   req.body.cin,
  //   req.body.cout
  // ]
  // console.log(req.body);
  try {
    const { rows: customer_id } = await pool.query(
      `SELECT customer_id from customer WHERE username='${res.locals.username}'`
    );

    await pool.query(
      `INSERT INTO bookings (customer_id, hotel_id, no_person, cin_date, cout_date) VALUES ($1,$2,$3,$4,$5)`,
      [
        customer_id[0].customer_id,
        req.body.hotel_id,
        req.body.no_person,
        req.body.cin,
        req.body.cout,
      ]
    );

    res.send({ status: "200" });

    // return res.status(200).alert('Successfully logged in!')
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port} at http://localhost:${port}`);
});
