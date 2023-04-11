const Joi = require("joi");
const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Categories",
    },
    parcels: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Parcel",
    },
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    category: Joi.string().required().label("Category"),
    parcels: Joi.array().label("Parcels"),
  });
  return schema.validate(data);
};

module.exports = { Shop, validate };
