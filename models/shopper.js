const Joi = require("joi");
const mongoose = require("mongoose");

const shopperSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Shopper = mongoose.model("Shopper", shopperSchema);

const validate = (data) => {
  const schema = Joi.object({
    shop: Joi.string().label("Shop"),
    user: Joi.string().required().label("User"),
  });
  return schema.validate(data);
};

module.exports = { Shopper, validate };
