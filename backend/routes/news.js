const express = require("express");
const router = express.Router();
const axios = require("axios");
const auth = require("../middleware/auth");

// Only logged-in user can call this:
router.get("/fetch", auth, async (req, res) => {
  const { country, category } = req.query;

  const url = `https://newsdata.io/api/1/latest?apikey=${process.env.NEWSDATA_API_KEY}&country=${country}&category=${category}&language=en`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.json({ message: "Error fetching news" });
  }
});

module.exports = router;
