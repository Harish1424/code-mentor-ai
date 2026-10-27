const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    result: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("History", historySchema);