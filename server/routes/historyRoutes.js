const express = require("express");

const {
  saveHistory,
  getHistory,
} = require("../controllers/historyController");

const router = express.Router();

router.post("/", saveHistory);

router.get("/:userId", getHistory);

module.exports = router;