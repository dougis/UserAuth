require('dotenv-safe').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");


const connectDB = require('./config/db');

const app = express();
// Middleware
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
app.use(bodyParser.json());
app.use(cors());
// Connect Database
connectDB();

app.get('/', (req, res) => res.send('Hello world!'));

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));