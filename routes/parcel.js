const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const { Parcel, validate } = require("../models/parcel");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  } else {
    const parcel = new Parcel({
      name: req.body.name,
      price: req.body.price,
      shop: req.body.shop,
      id: new mongoose.Types.ObjectId(),
    });
    parcel
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).send({
          message: "Created product successfully",
          createdProduct: result,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Internal Server Error",
          error: error.message,
        });
      });
  }
});

router.get("/", async (req, res) => {
  try {
    const parcels = await Parcel.find();

    if (parcels.length > 0) {
      res.status(200).send({
        status: 200,
        data: parcels,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:parcelID", async (req, res) => {
  try {
    const parcel = await Parcel.findOne({ _id: parcelID });

    if (parcel) {
      res.status(200).json({
        status: 200,
        data: parcel,
      });
    } else {
      res.status(404).json({ message: "Parcel not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
