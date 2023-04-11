const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const { Shop, validate } = require("../models/shop");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  } else {
    const name = req.body.name;
    const check = Shop.findOne({ name: name });
    if (check) {
      const shop = new Shop({
        id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        category: req.body.category,
        parcels: req.body.parcels,
      });
      shop
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).send({
            message: "Created shop successfully",
            createdShop: result,
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
    const shops = await Shop.find();

    if (shops.length > 0) {
      res.status(200).send({
        status: 200,
        data: shops,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:shopID", async (req, res) => {
  const shop = await Shop.findById({ _id: req.params.shopID })
    .populate({ path: "category" })
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          status: 200,
          data: result,
        });
      } else {
        res.status(404).json({ message: "Shop with ID does not exist found!" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    });
});

router.get("/:shopName", async (req, res) => {
  try {
    const shop = await Shop.findOne({ name: shopName });

    if (shop) {
      res.status(200).json({
        status: 200,
        data: shop,
      });
    } else {
      res.status(404).json({ message: "Shop with ID does not exist found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
