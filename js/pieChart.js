

document.addEventListener('DOMContentLoaded', function() {
    // Load the data from the CSV file
    d3.csv('data/data.csv').then(function(data) {
        // Convert job_openings to number
        data.forEach(d => {
            d.job_openings = +d.job_openings;
        });

        // Set the dimensions and margins of the graph
        const width = 500;
        const height = 500;
        const radius = Math.min(width, height) / 2;

        // Append the SVG object to the body of the page
        const svg = d3.select("#pieChartContainer")
                      .append("svg")
                      .attr("width", width)
                      .attr("height", height)
                      .append("g")
                      .attr("transform", `translate(${width / 2},${height / 2})`);

        // Create a color scale
        const color = d3.scaleOrdinal()
                        .domain(data.map(d => d.language))
                        .range(d3.schemeSet3);

        // Create a pie chart
        const pie = d3.pie()
                      .value(d => d.job_openings)
                      .sort(null);

        // Create an arc generator
        const arc = d3.arc()
                      .innerRadius(0)
                      .outerRadius(radius);

        // Create a label arc generator
        const labelArc = d3.arc()
                           .innerRadius(radius - 40)
                           .outerRadius(radius - 40);

        // Append the pie chart to the SVG
        svg.selectAll("path")
           .data(pie(data))
           .enter()
           .append("path")
           .attr("d", arc)
           .attr("fill", d => color(d.data.language))
           .attr("stroke", "#fff")
           .attr("stroke-width", "1px");

        // Add labels
        svg.selectAll("text")
           .data(pie(data))
           .enter()
           .append("text")
           .attr("transform", d => `translate(${labelArc.centroid(d)})`)
           .attr("dy", "0.35em")
           .attr("text-anchor", "middle")
           .text(d => `${d.data.language} (${d.data.job_openings})`)
           .style("font-size", "12px")
           .style("fill", "#000");

    }).catch(error => console.error('Error loading the data:', error));
});
