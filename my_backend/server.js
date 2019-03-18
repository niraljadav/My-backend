const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const passport = require("passport");
const users = require("./routes/api/users");
const calendar = require("./routes/api/calendar");
const journal = require("./routes/api/journal");
const profile = require("./routes/api/profile");
const expense = require("./routes/api/expense");

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

//DB Config
const db = require("./config/keys").mongoURI;

//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

//use Routes
app.use("/api/users", users);
app.use("/api/calendar", calendar);
app.use("/api/journal", journal);
app.use("/api/profile", profile);
app.use("/api/expense", expense);

app.listen(3000, () => console.log("server is running"));
