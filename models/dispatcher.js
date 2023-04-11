const Joi = require("joi");
const mongoose = require("mongoose");

const dispatcherSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    vehicleType: { type: String, reqquired: true },
    vehicleDetails: { type: [Object], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ordersDelivered: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Order",
    },
    location: { type: [Object] },
  },
  { timestamps: true }
);

const Dispatcher = mongoose.model("Dispatcher", dispatcherSchema);

const validate = (data) => {
  const schema = Joi.object({
    vehicleType: Joi.string().required().label("VehicleType"),
    vehicleDetails: Joi.array().required().label("VehicleDetails"),
    ordersDelivered: Joi.array().label("Orders Delivered"),
    user: Joi.string().required().label("User"),
    location: Joi.array().label("location"),
  });
  return schema.validate(data);
};

module.exports = { Dispatcher, validate };
