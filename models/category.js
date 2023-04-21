const Joi = require("joi");
const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Categories = mongoose.model("Categories", categoriesSchema);

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
  });
  return schema.validate(data);
};

module.exports = { Categories, validate };
