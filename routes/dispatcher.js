const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const { Dispatcher, validate } = require("../models/dispatcher");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  } else {
    const user = User.findOne({ id: req.body.user });
    if (user) {
      const dispacthcer = new Dispatcher({
        id: new mongoose.Types.ObjectId(),
        user: req.body.user,
        vehicleType: req.body.vehicleType,
        VehicleDetails: req.body.VehicleDetails,
        location: req.body.location,
      });
      dispacthcer
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
    const dispatchers = await Dispatcher.find();

    if (dispatchers.length > 0) {
      res.status(200).send({
        status: 200,
        data: dispatchers,
      });
    } else {
      res.status(200).json({ message: "No Dispatcher at the moment" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:dsipatcherID", async (req, res) => {
  const shopper = await Dispatcher.findOne({ id: dsipatcherID })
    .populate("user")
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          status: 200,
          data: result,
        });
      } else {
        res
          .status(404)
          .json({ message: "Dispatcher with ID does not exist found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

module.exports = router;
