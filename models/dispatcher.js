const Joi = require("joi");
const mongoose = require("mongoose");

const dispatcherSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    vehicleType: { type: String, reqquired: true },
    maker: { type: String, reqquired: true },
    model: { type: String, reqquired: true },
    plateNumber: { type: String, reqquired: true },
    color: { type: String, reqquired: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ordersDelivered: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Parcel",
    },
    location: { type: Object },
  },
  { timestamps: true }
);

const Dispatcher = mongoose.model("Dispatcher", dispatcherSchema);

const validate = (data) => {
  const schema = Joi.object({
    vehicleType: Joi.string().required().label("VehicleType"),
    maker: Joi.string().required().label("Maker"),
    model: Joi.string().required().label("Model"),
    color: Joi.string().required().label("Color"),
    plateNumber: Joi.string().required().label("Plate Number"),
    ordersDelivered: Joi.array().label("Orders Delivered"),
    user: Joi.string().required().label("User"),
    location: Joi.object().label("location"),
  });
  return schema.validate(data);
};

module.exports = { Dispatcher, validate };
