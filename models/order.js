const Joi = require("joi");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    parcel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parcel",
      required: true,
    },
    quantity: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dispatcher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dispatcher",
      required: true,
    },
    // shop: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Shop",
    //   required: true,
    // },
    status: { type: String, required: true, default: "processing" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

const validate = (data) => {
  const schema = Joi.object({
    parcel: Joi.string().required().label("Name"),
    quantity: Joi.number().required().label("Quantity"),
    user: Joi.string().required().label("User"),
    dispatcher: Joi.string().required().label("Dispatcher"),
    // shop: Joi.string().required().label("Shop"),
    status: Joi.string().label("Status"),
  });
  return schema.validate(data);
};

module.exports = { Order, validate };
