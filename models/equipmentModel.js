import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    pricePerAcre: {
      type: Number,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    // owner: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
  },
  { timestamps: true }
);

const Equipment = mongoose.model("Equipment", equipmentSchema);
export default Equipment;
