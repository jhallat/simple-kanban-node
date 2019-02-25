const express = require('express');
const userService = require('../services/user.service')();
const goalService = require('../services/goal.service')();

module.exports = routes;

function routes() {
  const goalRouter = express.Router();
  goalRouter.get('/goals', (req, res) => {
    userService.findUserByBearerToken(req.header).then(
      (userdata) => {
        goalService.findByUserId(userdata).then(
          (data) => {
            res.status(200).send(data);
          },
          (err) => {
            res.status(500).send("System Error");
          }
        )
      },
      (err) => {
        console.log(err);
        res.status(401).send("Invalid Token");
      }
    )
  })

  return goalRouter;
}