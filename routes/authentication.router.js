const express = require('express');
const userService = require('../services/user.service');

module.exports = routes;

function routes() {
  const authenticationRouter = express.Router();
  authenticationRouter
    .post("/user", (req, res) => {
      userService.addUser(req.body, (err, user) => {
        if (err) {
          return res.status(500).send("System Error");
        }
        return res.status(201).json(user);
      })
    })
    .post('/user/login', (req, res) => {
      var username = req.body.username;
      var password = req.body.password;
      userService.authenticate(username, password, (err, data) => {
        if (err) {
          if (err.code === '401') {
            return res.status(401).send("Invalid Credentials");
          } else {
            return res.status(500).send("System Error");
          }
        }
        return res.status(200).json(data);
      })
    })


  return authenticationRouter;
}