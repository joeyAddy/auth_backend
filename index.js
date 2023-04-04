require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const passport = require("passport");
const googleAuthRoute = require("./routes/google-auth");
const cookieSession = require("cookie-session");
const passportStrategy = require("./utilities/passport");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(
	cookieSession({
		name: "session",
		keys: ["K-Track"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

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

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
