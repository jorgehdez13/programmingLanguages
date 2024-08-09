// visualizations.js

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
                           .innerRadius(radius / 2)
                           .outerRadius(radius / 2);

        // Append the pie chart to the SVG
        const arcs = svg.selectAll("path")
                        .data(pie(data))
                        .enter()
                        .append("path")
                        .attr("d", arc)
                        .attr("fill", d => color(d.data.language))
                        .attr("stroke", "#fff")
                        .attr("stroke-width", "1px");

        // Add labels to the pie chart
        svg.selectAll("text")
           .data(pie(data))
           .enter()
           .append("text")
           .attr("transform", d => `translate(${labelArc.centroid(d)})`)
           .attr("dy", "0.35em")
           .attr("text-anchor", "middle")
           .text(d => d.data.language)
           .style("font-size", "12px")
           .style("fill", "#000")
           .style("font-weight", "bold")
           .style("pointer-events", "none"); // Disable mouse events on labels

        // Add tooltip div for displaying job_openings
        const tooltip = d3.select("body").append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0)
                          .style("position", "absolute")
                          .style("background-color", "#fff")
                          .style("border", "1px solid #ccc")
                          .style("padding", "5px")
                          .style("border-radius", "3px");

        // Add mouseover and mouseout events
        arcs.on("mouseover", function(event, d) {
            d3.select(this).transition().duration(200).style("opacity", 0.7);
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`${d.data.language}: ${d.data.job_openings}`)
                   .style("left", `${event.pageX + 5}px`)
                   .style("top", `${event.pageY - 28}px`);
        }).on("mouseout", function(event, d) {
            d3.select(this).transition().duration(200).style("opacity", 1);
            tooltip.transition().duration(500).style("opacity", 0);
        });

    }).catch(error => console.error('Error loading the data:', error));
});
