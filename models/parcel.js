const Joi = require("joi");
const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dispatcher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dispatcher",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: { type: String, required: true },
    weight: { type: Number, required: true },
    quantity: { type: Number, defualt: 1, required: true },
    from: { type: Object, required: true },
    to: { type: Object, required: true },
    status: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const Parcel = mongoose.model("Parcel", parcelSchema);

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    user: Joi.string().required().label("User"),
    dispatcher: Joi.string().required().label("Dispatcher"),
    category: Joi.string().required().label("Category"),
    description: Joi.string().required().label("Description"),
    weight: Joi.number().required().label("Weight"),
    quantity: Joi.number().required().label("Quantity"),
    from: Joi.string().required().label("From"),
    to: Joi.string().required().label("To"),
    status: Joi.string().required().label("Status"),
    price: Joi.number().required().label("Price"),
  });
  return schema.validate(data);
};

module.exports = { Parcel, validate };
