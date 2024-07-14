const express = require("express");
const router = express.Router();
const { fetchAndStoreStocks,fetchStocks,getStockDetails } = require("./controller/stockController");

router.route("/").get(fetchAndStoreStocks);
router.route("/fetch").get(fetchStocks);
router.route("/getrealtimedata").get(getStockDetails);

module.exports = router;