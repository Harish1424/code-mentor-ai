const express = require("express");

const {
  reviewCode,
  explainCode,
  debugCode,
  improveCode,
} = require("../controllers/aiController");

const router = express.Router();

router.post("/review", reviewCode);

router.post("/explain", explainCode);

router.post("/debug", debugCode);

router.post("/improve", improveCode);

module.exports = router;