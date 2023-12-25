import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables} from 'chart.js';

Chart.register(...registerables);

function MyChart({ data, datetimeColumns, numericalColumns, textColumns, primaryKey }) {
  // Assume the first datetime column is the one to be plotted
  const datetimeColumn = datetimeColumns[0];

  // Check if there are any text columns
  const hasTextColumns = textColumns.length > 0;

    const groupedData = data.reduce((groups, row) => {
      const key = row[textColumns[0]];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(row);
      return groups;
    }, {});

  // Prepare the data for the chart
  const chartData = {
    labels: data.map(row => new Date(row[datetimeColumn])), // labels should be date values
    datasets: hasTextColumns ?
      // If there are text columns, group the data by the first text column and create a separate dataset for each group
      Object.entries(groupedData).map(([key, rows], index) => ({
        label: key,
        data: rows.map(row => row[numericalColumns[1]]),
        fill: false,
        backgroundColor: `hsl(${index * (360 / Object.keys(groupedData).length)}, 100%, 75%)`,
        borderColor:  `hsl(${index * (360 / Object.keys(groupedData).length)}, 100%, 50%)`,
      })) :
      // If there are no text columns, create a separate dataset for each numerical column
      numericalColumns.map((column, index) => ({
        label: column,
        data: data.map(row => row[column]),
        fill: false,
        backgroundColor: `hsl(${index * (360 / numericalColumns.length)}, 100%, 75%)`,
        borderColor: `hsl(${index * (360 / numericalColumns.length)}, 100%, 50%)`,
      })),
  };

  return (
    <Line data={chartData} options={{scales: {xAxes: [{type: 'time'}]}}} /> 
    // specify that the x-axis should be a time scale
  );
}

export default MyChart;
