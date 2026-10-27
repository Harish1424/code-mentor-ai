const History = require("../models/History");

// Save history
const saveHistory = async (req, res) => {
  try {
    const { userId, type, code, result } = req.body;

    if (!userId || !type || !code || !result) {
      return res.status(400).json({
        success: false,
        message: "All history fields are required.",
      });
    }

    const history = await History.create({
      userId,
      type,
      code,
      result,
    });

    res.status(201).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Save History Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save history.",
      error: error.message,
    });
  }
};

// Get history
const getHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await History.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Get History Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch history.",
      error: error.message,
    });
  }
};

module.exports = {
  saveHistory,
  getHistory,
};