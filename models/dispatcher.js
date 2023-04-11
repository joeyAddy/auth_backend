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

// {
//     "quantity":"1",
//     "user":"6424cfbc7e6ab7d779ffe49b",
//     "shop":"6434a0f9b2330a74996c6596",
//     "dispatcher":"6434a90e56f45b2090ea4e60",
//     "parcel":"6434a90e56f45b2090ea4e60"
// }

module.exports = { Dispatcher, validate };
