document.addEventListener('DOMContentLoaded', function() {
    // Load the data from the CSV file
    d3.csv('data/data.csv').then(function(data) {
        // Convert numerical values to numbers
        data.forEach(d => {
            d.popularity = +d.popularity;
        });

        // Set the dimensions and margins of the graph
        const margin = {top: 20, right: 30, bottom: 40, left: 90},
              width = 800 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

        // Append the SVG object to the body of the page
        const svg = d3.select("#barChartContainer")
                      .append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", `translate(${margin.left},${margin.top})`);

        // X scale
        const x = d3.scaleBand()
                    .range([0, width])
                    .padding(0.1)
                    .domain(data.map(d => d.language));

        // Y scale
        const y = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.popularity)])
                    .nice()
                    .range([height, 0]);

        // Append X axis
        svg.append("g")
           .attr("class", "x-axis")
           .attr("transform", `translate(0,${height})`)
           .call(d3.axisBottom(x))
           .selectAll("text")
           .attr("transform", "rotate(-45)")
           .style("text-anchor", "end");

        // Append Y axis
        svg.append("g")
           .attr("class", "y-axis")
           .call(d3.axisLeft(y));

        // Append bars
        svg.selectAll(".bar")
           .data(data)
           .enter()
           .append("rect")
           .attr("class", "bar")
           .attr("x", d => x(d.language))
           .attr("y", d => y(d.popularity))
           .attr("width", x.bandwidth())
           .attr("height", d => height - y(d.popularity))
           .attr("fill", "#69b3a2");

        // Add labels to bars
        svg.selectAll(".text")
           .data(data)
           .enter()
           .append("text")
           .attr("class", "label")
           .attr("x", d => x(d.language) + x.bandwidth() / 2)
           .attr("y", d => y(d.popularity) - 5)
           .attr("text-anchor", "middle")
           .text(d => d.popularity);

    }).catch(error => console.error('Error loading the data:', error));
});
