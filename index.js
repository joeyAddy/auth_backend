require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const parcelRoutes = require("./routes/parcel");
const orderRoutes = require("./routes/order");
const shopRoutes = require("./routes/shop");
const shopperRoutes = require("./routes/shopper");
const dispatcherRoutes = require("./routes/dispatcher");
const categoryRoutes = require("./routes/category");
const passport = require("passport");
const googleAuthRoute = require("./routes/google-auth");
const cookieSession = require("cookie-session");
const passportStrategy = require("./utilities/passport");

// database connection
connection();

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: ["K-Track"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    // credentials: true,
  })
);

// routes
app.use("/api/users", userRoutes);
// app.use("/google/auth", googleAuthRoute);
app.use("/api/auth", authRoutes);
app.use("/api/parcel", parcelRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/shopper", shopperRoutes);
app.use("/api/dispatcher", dispatcherRoutes);
app.use("/api/order", orderRoutes);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
