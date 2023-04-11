const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const { Order, validate } = require("../models/order");
const { User } = require("../models/user");
const { Shopper } = require("../models/shopper");
const { Shop } = require("../models/shop");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  } else {
    const user = User.findOne({ id: req.body.user });
    const shop = Shop.findOne({ id: req.body.shop });

    const shopper = () => {
      if (shop) {
        Shopper.findOne({ id: shop.id });
      }
    };

    if (user) {
      const order = new Order({
        id: new mongoose.Types.ObjectId(),
        user: req.body.user,
        shop: req.body.shop,
        parcel: req.body.parcel,
        quantity: req.body.quantity,
        dispatcher: req.body.dispatcher,
        status: req.body.status,
        location: shopper.location,
      });
      order
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).send({
            message: "Created order successfully",
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
  const orders = await Order.find()
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          status: 200,
          data: result,
        });
      } else {
        res.status(404).json({ message: "No orders at the moment!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.get("/:orderID", async (req, res) => {
  const order = await Order.findById({ _id: req.params.orderID })
    .populate([{ path: "parcel", populate: "shop" }, "user"])
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
          .json({ message: "Order with ID does not exist found!" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    });
});

module.exports = router;
