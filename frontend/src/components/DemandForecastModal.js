import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, ButtonGroup, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import '../styles/DemandForecastModal.css';
import * as d3 from 'd3';
import { instance } from '../App';

const useStyles = makeStyles((theme) => ({
  chartContainer: {
    width: '800px',
    height: '200px',
    margin: '20px',
    position: 'relative',
  },
  productButtons: {
    marginTop: '10px',
  },
}));

const ForecastDialog = ({ open, onClose, selectedRows }) => {
  const classes = useStyles();
  const [chartData, setChartData] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(selectedRows[0]); // Default to first selected product
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.post('/products/forecast', { product_ids: selectedRows }, {
          headers: {
            Authorization: `Bearer ${token}` // Include token in Authorization header
          }
        });
        const fetchedData = await response.data;
        setChartData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [selectedRows]);

  useEffect(() => {
    if (chartData.length > 0) {
      const svg = d3.select('.chart-container').append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('position', 'absolute');

      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = +svg.attr('width') - margin.left - margin.right;
      const height = +svg.attr('height') - margin.top - margin.bottom;

      const x = d3.scaleLinear().range([0, width]);
      const y = d3.scaleLinear().range([height, 0]);

      const line = d3.line()
        .x((d, i) => x(i))
        .y((d) => d); // Use demand directly

      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const currentProductData = chartData.find((product) => product.product_id === selectedProductId);

      if (currentProductData) {
        const demandData = currentProductData.forecasts.map((forecast) => forecast.demand);
        const sellingPriceData = currentProductData.forecasts.map((forecast) => forecast.selling_price); // Assuming you have 'selling_price' in your data

        x.domain([0, demandData.length - 1]);
        y.domain([0, Math.max(...demandData, ...sellingPriceData)]);

        g.append('path')
          .datum(demandData)
          .attr('fill', 'none')
          .attr('stroke', 'blue')
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('stroke-width', 2)
          .attr('d', line);

        g.append('path')
          .datum(sellingPriceData)
          .attr('fill', 'none')
          .attr('stroke', 'red')
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('stroke-width', 2)
          .attr('d', line);

        // Add legend
        const legend = g.append('g')
          .attr('font-size', 10)
          .attr('transform', `translate(${width - 100}, ${height - 20})`);

        legend.append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', 10)
          .attr('height', 10)
          .style('fill', 'blue');

        legend.append('text')
          .attr('x', 15)
          .attr('y', 9)
          .attr('dy', '.35em')
          .text('Demand');

        legend.append('rect')
          .attr('x', 0)
          .attr('y', 20)
          .attr('width', 10)
          .attr('height', 10)
          .style('fill', 'red');

        legend.append('text')
          .attr('x', 15)
          .attr('y', 29)
          .attr('dy', '.35em')
          .text('Selling Price');
      }

      g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(chartData[0].forecasts.length).tickFormat((i) => ""));

      g.append('g')
        .call(d3.axisLeft(y));
    }
  }, [chartData, selectedProductId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Forecast</DialogTitle>
      <DialogContent>
        <div className={classes.chartContainer}>
          {/* Empty div for positioning */}
        </div>
        <ButtonGroup className={classes.productButtons} variant="contained" aria-label="outlined primary button group">
          {chartData.map((product) => (
            <Button key={product.product_id} onClick={() => setSelectedProductId(product.product_id)}>
              Product {product.product_id}
            </Button>
          ))}
        </ButtonGroup>
      </DialogContent>
    </Dialog>
  );
};

export default ForecastDialog;