const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const { Categories, validate } = require("../models/category");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  } else {
    const category = new Categories({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
    });
    category
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).send({
          message: "Created category successfully",
          createdCategory: {
            name: result.name,
          },
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
    const categories = await Categories.find();

    if (categories.length > 0) {
      res.status(200).send({
        status: 200,
        data: categories,
      });
    } else {
      res.status(200).json({ message: "No Categories at the moment" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:categoryID", async (req, res) => {
  try {
    const category = await Categories.findOne({ id: req.params.categoryID });

    if (category) {
      res.status(200).json({
        status: 200,
        data: category,
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
