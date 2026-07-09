const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./config/mongoose-connection');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get('/', (req, res) => {
      res.send('hello');
})


app.listen(3000);