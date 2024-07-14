const mongoose = require("mongoose");

const stockSchema = mongoose.Schema({

            name:{
                type: String,
            },
            symbol:{
                type: String,
            },
            rank:{
                type: Number,
            },
           
            timestamp:{
                data: [{
                    timestamp: {
                      type: Date,
                      default: Date.now
                    },
                    rate: Number,
                    volume: Number,
                    cap: Number,
                    }]
                }
       
    });

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;