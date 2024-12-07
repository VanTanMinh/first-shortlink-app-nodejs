const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost', // Replace with your MySQL host
  user: 'server', // Replace with your MySQL user
  password: 'Tanminh2009@#', // Replace with your MySQL password
  database: 'server' // Replace with your database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');

  // Create the 'links' table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS links (
      id INT AUTO_INCREMENT PRIMARY KEY,
      short_code VARCHAR(255) UNIQUE NOT NULL,
      long_url TEXT NOT NULL
    )
  `;
  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    }
  });
});

app.post('/shorten', (req, res) => {
  const longUrl = req.body.longUrl;
  let shortCode = req.body.shortCode || shortid.generate();

  // Check if the custom short code already exists in the database
  const checkQuery = 'SELECT * FROM links WHERE short_code = ?';
  connection.query(checkQuery, [shortCode], (err, results) => {
    if (err) {
      console.error('Error checking short code:', err);
      return res.status(500).send('An error occurred.');
    }

    if (results.length > 0) {
      return res.status(400).send('Custom short URL already exists');
    }

    // Insert the new link into the database
    const insertQuery = 'INSERT INTO links (short_code, long_url) VALUES (?, ?)';
    connection.query(insertQuery, [shortCode, longUrl], (err) => {
      if (err) {
        console.error('Error inserting link:', err);
        return res.status(500).send('An error occurred.');
      }

      res.send({ shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}` });
    });
  });
});

app.get('/:shortCode', (req, res) => {
  const shortCode = req.params.shortCode;
  const selectQuery = 'SELECT long_url FROM links WHERE short_code = ?';
  connection.query(selectQuery, [shortCode], (err, results) => {
    if (err) {
      console.error('Error retrieving long URL:', err);
      return res.status(500).send('An error occurred.');
    }

    if (results.length === 0) {
      return res.status(404).send('Short URL not found');
    }

    const longUrl = results[0].long_url;
    res.redirect(longUrl);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});