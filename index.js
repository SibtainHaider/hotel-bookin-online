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
app.listen(port, () => {
  console.log(`Listening on port ${port} at http://localhost:${port}`);
});
