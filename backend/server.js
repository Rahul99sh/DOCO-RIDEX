const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require('express-session');

const cors = require("cors");
const db = require("./models");



const mongodbUrl = db.url;
mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    console.log("Connected to the database!");
})
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
});

const app = express();
app.use(
    session({
      key: "userId",
      secret: "subscribe",
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: 60 * 60 * 24 * 10,
      },
    })
  );



app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));






require("./models/users.routes")(app);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Mongo Server is running on port ${PORT}.`);
});