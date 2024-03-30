// Load the CSV data
d3.csv("us_statewide_crime.csv").then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.Unemployed = +d.Unemployed;
    });

    // Sort data by unemployment rate
    data.sort((a, b) => b.Unemployed - a.Unemployed);

    // Define dimensions for the chart
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select('#chart-container').append('svg')
      .attr('width', width)
      .attr('height', height);

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.State))
      .range([margin.left, innerWidth + margin.left])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Unemployed)])
      .nice()
      .range([innerHeight + margin.top, margin.top]);

    // Add bars to the chart
    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.State))
      .attr('y', d => yScale(d.Unemployed))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight + margin.top - yScale(d.Unemployed))
      .on('click', function(d) {
          d3.select(this).attr('fill', 'red');
      });

    // Add x-axis
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight + margin.top})`)
      .call(d3.axisBottom(xScale));

    // Add y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));
});