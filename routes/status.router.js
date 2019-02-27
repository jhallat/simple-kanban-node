const express = require('express');
const statusService = require('../services/status.service');

module.exports = routes;

function routes() {
  const statusRouter = express.Router();

  statusRouter
    .get("/statuses", (req, res) => {
      var category = req.query.category;
      statusService.findStatusByCategory(category).then(
        data => {
          return res.status(200).json(data.Items);
        },
        err => {
          console.log(JSON.stringify(err));
          return res.status(500).send("System Error");
        }
      )
    })

  return statusRouter;

}