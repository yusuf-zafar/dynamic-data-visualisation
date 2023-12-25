# Dynamic Data Visualisation Web Application

This application is a full-stack web application that enables flexible and dynamic data visualisation. It connects to a MySQL database, fetches data based on a user-provided SQL query, and displays the data in a chart. The frontend is built with React and uses the Chart.js library to display data. The backend is built with Express.js and connects to a MySQL database to fetch data.

## Project Description

The application provides the following core functions:

1. **Database Connectivity**: A front-end interface via which users can enter access data to a database. It supports different database types and structures.

2. **Data Retrieval and Processing**: A query interface for reading database tables. It automatically recognises and handles different table structures, particularly the localisation of numerical values.

3. **Backend Logic**: A server backend that establishes the database connection and executes the request. It retransmits the queried data to the front end.

4. **Data Visualisation**: Integration of a graph library (Chart.js) to visualise the data in diagram form. It provides adaptable visualisation that supports various data structures.

The application is not bound to a specific table structure and can work with any table schema. Applicants should create their own tables (e.g., simulated log data from a thermometer) for test purposes.

## Setup

### Backend Setup

Navigate to the backend directory and install the necessary dependencies by running:

`npm install`

This will install Express.js, body-parser, cors, and mysql.

### Frontend Setup

Navigate to the frontend directory and install the necessary dependencies by running:

`npm install`

This will install React, react-chartjs-2, chart.js, react-bootstrap, and other necessary packages.

### Database Setup

You need to have a MySQL server running. The application expects a database with specific tables and columns. The exact structure will depend on the query you're going to execute.

## Usage

### Start the Backend Server

In the backend directory, start the server by running:

`node index.js`

The server will start on port 3001 or the port specified in your environment variables.

### Start the Frontend Server

In the frontend directory, start the server by running:

`npm start`

The server will start on port 3000 or the port specified in your environment variables.

### Access the Application

Open a web browser and navigate to `http://localhost:3000`. You should see a form where you can enter your MySQL database credentials and a SQL query.

### Fetch and Display Data

Enter your MySQL database credentials and a SQL query, then click the "Connect" button. The application will execute the query on your database, fetch the data, and display it in a chart.

The SQL query should be a `SELECT` statement that fetches data from a single table. The application will identify datetime, numerical, and text columns in the table and use this information to generate the chart. The chart's x-axis will be the first datetime column in the table, and the y-axis will be the numerical columns. If there are text columns, the data will be grouped by the first text column.

If there's an error (for example, incorrect database credentials or an invalid SQL query), an error message will be displayed above the form.

Remember to replace the `localhost:3001` in the `fetch` call in the `DatabaseForm` component with the actual address of your backend server if it's not running on `localhost:3001`.