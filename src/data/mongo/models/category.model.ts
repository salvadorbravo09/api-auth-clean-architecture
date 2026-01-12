import mongoose, { Schema } from "mongoose";

// Representa el esquema de usuario en la BASE DE DATOS MongoDB
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  available: {
    type: Boolean,
    default: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const CategoryModel = mongoose.model("Category", categorySchema);
