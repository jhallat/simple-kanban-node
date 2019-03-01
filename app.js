const express = require('express');
const bodyParser = require('body-parser');
const authenticationRouter = require('./routes/authentication.router')();
const statusRouter = require('./routes/status.router')();
const noteRouter = require('./routes/note.router')();
const jwt = require('./_helpers/jwt');
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:4200'
}

const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(jwt());
app.use('/api/v1', authenticationRouter);
app.use('/api/v1', statusRouter);
app.use('/api/v1', noteRouter);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});