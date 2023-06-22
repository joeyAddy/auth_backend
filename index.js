require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
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
const { Dispatcher } = require("./models/dispatcher");

// database connection
connection();

// Initializing express app, server and io
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    // "https://k-track.netlify.app",
    methods: "GET,POST,PATCH,DELETE",
    // credentials: true,
  },
});

app.use(
  cors({
    origin: "*",
    // "https://k-track.netlify.app",
    methods: "GET,POST,PATCH,DELETE",
    // credentials: true,
  })
);

// Store dispatcher and order locations
const orderLocations = {};

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("joinOrder", (orderId) => {
    socket.join(orderId);
    console.log("user joined group ", orderId);
  });

  socket.on("updateLocation", (data) => {
    console.log("Updated", data);
    const { dispatcherId, location } = data;
    Dispatcher.updateOne(
      { _id: dispatcherId },
      { $set: { location: location } }
    )
      .exec()
      .then((result) => {
        if (result) {
          console.log("Location updated sucessfully with ", result);
        } else {
          console.log("Dispatcher with ID does not exist!");
        }
      })
      .catch((error) => {
        console.log("Internal Server Error", error.message);
      });

    // Store the location update
    orderLocations[dispatcherId] = location;

    // Emit the location update to the customers in the order room
    io.to(dispatcherId).emit("locationUpdate", location);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

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
server.listen(port, console.log(`Listening on port ${port}...`));
