"use strict";
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const { MONGO_URI } = process.env;
console.log(MONGO_URI);
mongoose
    .connect("mongodb+srv://chardeevari:chardeevari%40mongo@cluster0.rfwfs.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log("Successfully connected to database");
})
    .catch((error) => {
    console.log("database connection failed. exiting now...");
    console.error(error);
    process.exit(1);
});
app.post('/', (req, res) => {
    res.send('Got a POST request');
});
app.listen(port, () => {
    console.log(` app listening at http://localhost:${port}`);
});
