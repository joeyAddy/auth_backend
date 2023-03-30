const crypto = require("crypto");

const JWTPrivateKey = crypto.randomBytes(32).toString("hex");
console.log(JWTPrivateKey);
