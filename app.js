const express = require('express');
const mongoose = require('mongoose');
const Url = require('./models/urlModel');
const app = express();
const PORT = 7000;

// load env variables
require('dotenv').config();

const connectDB = async () => {
  try {
    // mongodb connection string
    await mongoose.connect(process.env.MONGO_URI);
    console.log('mongoDB connected.');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

connectDB();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  try {
    const urls = await Url.find();
    res.render('index', { urls });
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

app.post('/shorten', async (req, res) => {
  try {
    const url = new Url({ fullUrl: req.body.fullUrl });
    await url.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

app.get('/:shortUrl', async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl;
    const url = await Url.findOne({ shortUrl });
    if (!url) {
      return res.status(500).send('URL not found');
    }
    url.clicks++;
    url.save();
    res.redirect(url.fullUrl);
  } catch (error) {
    res.status(500).send('internal server error');
  }
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
