const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const { Shopper, validate } = require("../models/shopper");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  } else {
    const user = User.findOne({ id: req.body.user });
    if (user) {
      const category = new Shopper({
        id: new mongoose.Types.ObjectId(),
        user: req.body.user,
      });
      category
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).send({
            message: "Updated Shopper requirements successfully",
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
          });
        });
    }
  }
});

router.get("/", async (req, res) => {
  try {
    const shoppers = await Shopper.find();

    if (shoppers.length > 0) {
      res.status(200).send({
        status: 200,
        data: shoppers,
      });
    } else {
      res.status(200).json({ message: "No Shopper at the moment" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:shopperID", async (req, res) => {
  try {
    const shopper = await Shopper.findOne({ id: shopperID });

    if (shopper) {
      res.status(200).json({
        status: 200,
        data: shopper,
      });
    } else {
      res
        .status(404)
        .json({ message: "Shopper with ID does not exist found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
