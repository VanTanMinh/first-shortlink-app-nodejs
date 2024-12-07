const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Load links from JSON file or initialize an empty object
let links = {};
try {
  const data = fs.readFileSync('links.json');
  links = JSON.parse(data);
} catch (err) {
  console.error("Failed to load links.json:", err);
}

app.post('/shorten', (req, res) => {
  const longUrl = req.body.longUrl;
  let shortCode = req.body.shortCode || shortid.generate(); // Use custom code if provided

  // Check if the custom short code already exists
  if (links[shortCode]) {
    return res.status(400).send('Custom short URL already exists');
  }

  links[shortCode] = longUrl;

  // Save links to JSON file
  fs.writeFileSync('links.json', JSON.stringify(links));

  res.send({ shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}` });
});

app.get('/:shortCode', (req, res) => {
  const shortCode = req.params.shortCode;
  const longUrl = links[shortCode];
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send('Short URL not found');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

