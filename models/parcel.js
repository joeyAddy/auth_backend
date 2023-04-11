const Joi = require("joi");
const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  { timestamps: true }
);

const Parcel = mongoose.model("Parcel", parcelSchema);

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    price: Joi.number().required().label("Price"),
    shop: Joi.string().required().label("Shop ID"),
  });
  return schema.validate(data);
};

module.exports = { Parcel, validate };
