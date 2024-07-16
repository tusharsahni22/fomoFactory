// const {addToStorage,getStorage} = require("../database/globelStorage/storage");
const StockSchema = require("../database/schema/stock")
const axios = require('axios');

let stockUpdateQueue = [{
    // stock schema object
    name:"",
    symbol:"",
    rank:"",
    timestamp: {
        data: [{
            timestamp: "",
            rate: "",
            volume: "",
            cap: ""
        }]
    }
}];

const options = {
    method: 'POST',
    url: 'https://api.livecoinwatch.com/coins/list',
    headers: {
      'content-type': 'application/json',
        'x-api-key': '83a2a25b-93ba-4964-a97b-1356454ebc06'
    },
    data: {
            "currency": "USD",
            "sort": "rank",
            "order": "ascending",
            "offset": 0,
            "limit": 50,
            "meta": true
    }

  };


const fetchAndStoreStocks = async (req, res) => {
 
    axios
      .request(options)
      .then(function (response) {

        const stocks = response.data;
        stocks.forEach(async (stock) => {
            try {
                await StockSchema.findOneAndUpdate(
                  { name: stock.name }, // Filter document by stock name
                  {
                    $push: { // Push a new entry to the data array
                      'timestamp.data': {
                        timestamp: new Date(),
                        rate: stock.rate,
                        volume: stock.volume,
                        cap: stock.cap,
                      }
                    },
                    $setOnInsert: { // Set these fields only on insert (new document creation)
                      name: stock.name,
                      symbol: stock.symbol,
                      rank: stock.rank,
                    }
                  },
                  {
                    upsert: true, // Insert a new document if one doesn't exist
                    new: true // Return the modified document
                  }
                );
              } catch (error) {
                console.error('Error updating or inserting stock data:', error);
              }
        });
        console.log("Fetching stocks in every 5 seconds successfully");
      })
      .catch(function (error) {
        console.error('Error fetching data:', error);
      });
}

const fetchStocks = async (req, res) => {
    setInterval(fetchAndStoreStocks, 5000);
    res.send(" Started Fetching stocks in every 5 seconds");
}

  // get last 20 records of each stock timestamp  
  const getStockDetails = async (req, res) => {
    const stocks = await StockSchema.find(); // Fetch all records
    // reverse the array to get the latest records first
    const reversedStocks = stocks.map(stock => {
        stock.timestamp.data = stock.timestamp.data.reverse().slice(0, 20);
        return stock;
    });
    // code to get the last 20 records of each stock timestamp
    const response = reversedStocks.map(stock => {
        return {
            name: stock.name,
            symbol: stock.symbol,
            rank: stock.rank,
            timestamp: stock.timestamp.data.slice(0, 20)
        }
    })
    res.send(response);
};


module.exports = {fetchAndStoreStocks,fetchStocks,getStockDetails};