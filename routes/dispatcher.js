const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const { Dispatcher, validate } = require("../models/dispatcher");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  } else {
    const user = await User.findOne({ _id: req.body.user });
    const dispatcher = await Dispatcher.findOne({ user: user._id });
    if (dispatcher) {
      res.status(409).json({
        message: "You already have a dispatcher profile",
        dispatcher: dispatcher,
      });
    }
    if (!dispatcher && user) {
      const dispacthcer = new Dispatcher({
        _id: new mongoose.Types.ObjectId(),
        user: req.body.user,
        vehicleType: req.body.vehicleType,
        mnaker: req.body.mnaker,
        model: req.body.model,
        color: req.body.color,
        plateNumber: req.body.plateNumber,
        location: req.body.location,
      });
      dispacthcer
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).send({
            message: "Updated Dispatcher requirements successfully",
            data: result,
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
  const dispatchers = await Dispatcher.find()
    .populate("user")
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          status: 200,
          data: result,
        });
      } else {
        res.status(404).json({
          message: "No Dispatchers at the moment please contact admin!",
        });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    });
});

router.get("/:dispatcherID", async (req, res) => {
  const dispacthcer = await Dispatcher.findById({
    _id: req.params.dispatcherID,
  })
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
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    });
});

router.get("/location/:dispatcherID", async (req, res) => {
  await Dispatcher.findById({
    _id: req.params.dispatcherID,
  })
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          status: 200,
          data: result.location,
        });
      } else {
        res.status(404).json({ message: "Dispatcher with ID does not exist!" });
      }
    })

    .catch((error) => {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    });
});

router.patch("/location/:dispatcherID", async (req, res) => {
  const id = req.params.dispatcherID;
  Dispatcher.updateOne({ _id: id }, { $set: { location: req.body.location } })
    .exec()
    .then((result) => {
      if (result) {
        const dispatcher = Dispatcher.findById({
          _id: req.params.dispatcherID,
        });
        res.status(200).json({
          status: 200,
          data: dispatcher.location,
          message: "Location updated sucessfully",
        });
      } else {
        res.status(404).json({ message: "Dispatcher with ID does not exist!" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    });
});

router.get("/user/:userID", async (req, res) => {
  const dispacthcer = await Dispatcher.findOne({
    user: req.params.userID,
  })
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
          .json({ message: "Dispatcher with User ID does not exist!" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    });
});

module.exports = router;
