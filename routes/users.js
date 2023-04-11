const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const hashPasswordConfirmation = await bcrypt.hash(
      req.body.passwordConfirmation,
      salt
    );

    await new User({
      ...req.body,
      password: hashPassword,
      passwordConfirmation: hashPasswordConfirmation,
    }).save();

    res.status(200).send({
      status: 200,
      message: "Registered successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    if (users.length > 0) {
      res.status(200).send({
        status: 200,
        data: users,
      });
    } else {
      res.status(200).json({ message: "No User at the moment" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
