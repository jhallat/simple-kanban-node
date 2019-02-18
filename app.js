const express = require('express');
const bodyParser = require('body-parser');
const authenticationRouter = require('./routes/authentication.router')();
const jwt = require('./_helpers/jwt');
const jwtToken = require("jsonwebtoken");
const fs = require("fs");

const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(jwt());
app.use("/api/v1", authenticationRouter);
app.get("/api/v1/hello", (req, res) => {
  var tokenArray = req.headers.authorization.split(' ');
  var publicKey = fs.readFileSync("./public.key", "utf8");
 jwtToken.verify(tokenArray[1], publicKey, (err, data) => {
  if (err) {
    res.status(500).send("System Error"); 
  } else {
    res.status(200).send(`hello ${data.sub}`);
  }
 })
 
})

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});