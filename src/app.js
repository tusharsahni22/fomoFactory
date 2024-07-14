const express = require('express');
require('dotenv').config();
require("./database/connection")
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());



const PORT = process.env.PORT || 3000;
const routes = require("./routes");

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use("/api", routes);

