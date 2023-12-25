
import { Chart } from 'chart.js';
import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import MyChart from './MyChart';

function DatabaseForm() {
  const [credentials, setCredentials] = useState({
    host: '',
    username: '',
    database: '',
    password: '',
    query: '',
  });
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);


  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("credentials",credentials)
    fetch('http://localhost:3001/api/connect',
    // fetch('http://65827040.dorsy.net:3001/api/connect',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        setError(null);
        setChartData(data);
      } else {
        setError(data.message);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <Container>
    <Form onSubmit={handleSubmit}>
    {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      <fieldset >
        <legend>MySQL Data :</legend>
      <Form.Group controlId="formHost">
        <Form.Label>Host:</Form.Label>
        <Form.Control required type="text" name="host" onChange={handleChange} />
      </Form.Group>

      <Form.Group controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control required type="text" name="username" onChange={handleChange} />
      </Form.Group>

      <Form.Group controlId="formDatabase">
        <Form.Label>Database Name:</Form.Label>
        <Form.Control required type="text" name="database" onChange={handleChange} />
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control required type="password" name="password" onChange={handleChange} />
      </Form.Group>
      </fieldset>
      <fieldset >
        <legend>Query :</legend>
      <Form.Group controlId="formQuery">

        <Form.Control as="textarea" rows={3} name="query" onChange={handleChange} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Connect
      </Button>
      </fieldset>

    </Form>
    {chartData && <MyChart data={chartData.data} datetimeColumns={chartData.datetimeColumns} numericalColumns={chartData.numericalColumns} primaryKey={chartData.primaryKey} textColumns={chartData.textColumns}/>}
    </Container>
  );
}

export default DatabaseForm;