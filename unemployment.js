// Define data
const crime = d3.csv("us_statewide_crime.csv");

crime.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.Unemployed = +d.Unemployed;
    });

    // Sort data by unemployment rate
    data.sort((a, b) => b.Unemployed - a.Unemployed);

    // Extract state names and unemployment rates
    const states = data.map(d => d.State);
    const unemploymentRates = data.map(d => d.Unemployed);

    // Define the chart specification using D3
    const svgWidth = 600;
    const svgHeight = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const svg = d3.select("#plot")
                  .attr("width", svgWidth)
                  .attr("height", svgHeight);

    const xScale = d3.scaleLinear()
                     .domain([0, d3.max(unemploymentRates)])
                     .range([margin.left, svgWidth - margin.right]);

    const yScale = d3.scaleBand()
                     .domain(states)
                     .range([margin.top, svgHeight - margin.bottom])
                     .padding(0.1);

    const colorScale = d3.scaleOrdinal()
                         .domain(states)
                         .range(d3.schemeCategory10);

    svg.selectAll("rect")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", margin.left)
       .attr("y", d => yScale(d.State))
       .attr("width", d => xScale(d.Unemployed) - margin.left)
       .attr("height", yScale.bandwidth())
       .attr("fill", "steelblue")
       .on("click", function(d) {
           d3.select(this).attr("fill", "red");
       });

    svg.append("g")
       .attr("transform", `translate(${margin.left},0)`)
       .call(d3.axisLeft(yScale));

    svg.append("g")
       .attr("transform", `translate(0,${svgHeight - margin.bottom})`)
       .call(d3.axisBottom(xScale));

    svg.append("text")
       .attr("x", svgWidth / 2)
       .attr("y", svgHeight - 10)
       .style("text-anchor", "middle")
       .text("Unemployed");

    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("x", 0 - svgHeight / 2)
       .attr("y", 10)
       .style("text-anchor", "middle")
       .text("State");
});
