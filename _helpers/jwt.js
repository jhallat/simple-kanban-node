const expressJwt = require('express-jwt');
const fs = require("fs");

module.exports = jwt;

function jwt() {
  var secret = fs.readFileSync("./public.key", "utf8");
  return expressJwt({ secret }).unless({
    path: [
      '/api/v1/user/login'
    ]
  })
}