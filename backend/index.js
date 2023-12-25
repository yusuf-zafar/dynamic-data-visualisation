const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
const mysql = require('mysql');
const path = require('path');

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../build')))
app.use('/static', express.static(path.join(__dirname, '../build/static')))

// Anything that doesn't match the above, send back the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '../build/index.html'))
})

app.post('/api/connect', (req, res) => {
  const { host, username, password, database, query } = req.body;
  console.log(req.body)

 const db = mysql.createConnection({
      host: host,
      user: username,
      password: password,
      database: database,
  });

  db.connect((err) => {
    if (err) {
      console.error('Error:', err);
      if (err.code === 'ER_ACCESS_DENIED_ERROR' || err.code === 'ER_DBACCESS_DENIED_ERROR') {
          res.json({ status: 'error', message: 'Access Denied' });
      } else {
          res.json({ status: 'error', message:"Database not found" });
      }
      } else {
          console.log(`connected to database: ${database}`)
          // Extract table name from the query
          const tableName = query.split(/from/i)[1].trim().split(/\s|\n/)[0];
          // Fetch the table schema
          db.query(`SHOW COLUMNS FROM ${tableName}`, (err, results) => {
              if (err) {
                  console.error('Error:', err);
                  res.json({ status: 'error' });
              } else {
                  // Process results to identify datetime, numerical, and text columns
                  const datetimeColumns = results.filter(column => column.Type.includes('date') || column.Type.includes('time')).map(column => column.Field);
                  const numericalColumns = results.filter(column => column.Type.includes('int') || column.Type.includes('decimal') || column.Type.includes('float')).map(column => column.Field);
                  const textColumns = results.filter(column => column.Type.includes('char') || column.Type.includes('text')).map(column => column.Field);
                  console.log('Datetime Columns:', datetimeColumns);
                  console.log('Numerical Columns:', numericalColumns);
                  console.log('Text Columns:', textColumns);
                  // Fetch the primary key
                  db.query(`SHOW KEYS FROM ${tableName} WHERE Key_name = 'PRIMARY'`, (err, results) => {
                      if (err) {
                          console.error('Error:', err);
                          res.json({ status: 'error' });
                      } else {
                          const primaryKey = results[0].Column_name;
                          console.log('Primary Key:', primaryKey);
                          // Fetch data from these columns and send it to the frontend
                          db.query(query, (err, results) => {
                              if (err) {
                                  console.error('Error:', err);
                                  res.json({ status: 'error' });
                              } else {
                                  console.log("yes results are displayed.....")
                                  res.json({ 
                                    status: 'success', 
                                    data: results, 
                                    datetimeColumns: datetimeColumns, 
                                    numericalColumns: numericalColumns, 
                                    textColumns: textColumns,
                                    primaryKey: primaryKey 
                                });
                              }
                          });
                      }
                  });
              }
          });
      }
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server is running on port ${port}`));