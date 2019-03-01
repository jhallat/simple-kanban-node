const express = require('express');
const userService = require('../services/user.service');
const noteService = require('../services/note.service');

module.exports = routes;

function routes() {
  const noteRouter = express.Router();
  noteRouter.get('/notes', async (req, res) => {
    var userid = await userService.findUserByBearerToken(req.headers)
      .catch(err => {
        console.log(JSON.stringify(err));
        res.status(401).send("Invalid Token");
      });
    
    console.log(userid);  
    noteService.findNotesByUserId(userid).then(
      data => {
        res.status(200).send(data.Items);
      },
      err => {
        console.log(`[noteService] ${JSON.stringify(err)}`);
        res.status(500).send("System Error");
      });
    })

  return noteRouter;
}