document.addEventListener('DOMContentLoaded', function() {
    d3.csv('data/data.csv').then(function(data) {
        data.forEach(d => {
            d.popularity = +d.popularity;
        });

        const margin = {top: 20, right: 30, bottom: 40, left: 90},
              width = 800 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

        const svg = d3.select("#areaChartContainer")
                      .append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
                    .domain(data.map(d => d.language))
                    .range([0, width])
                    .padding(1);

        const y = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.popularity)])
                    .nice()
                    .range([height, 0]);

        const area = d3.area()
                       .x(d => x(d.language))
                       .y0(height)
                       .y1(d => y(d.popularity));

        svg.append("g")
           .attr("transform", `translate(0,${height})`)
           .call(d3.axisBottom(x));

        svg.append("g")
           .call(d3.axisLeft(y));

        svg.append("path")
           .datum(data)
           .attr("fill", "#69b3a2")
           .attr("stroke", "#69b3a2")
           .attr("stroke-width", 1.5)
           .attr("d", area);

        // Tooltip
        const tooltip = d3.select("body").append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0);

        svg.selectAll("circle")
           .data(data)
           .enter()
           .append("circle")
           .attr("cx", d => x(d.language))
           .attr("cy", d => y(d.popularity))
           .attr("r", 5)
           .attr("fill", "#69b3a2")
           .on("mouseover", function(event, d) {
               tooltip.transition()
                      .duration(200)
                      .style("opacity", .9);
               tooltip.html(d.language + "<br/>" + d.popularity)
                      .style("left", (event.pageX) + "px")
                      .style("top", (event.pageY - 28) + "px");
           })
           .on("mouseout", function(d) {
               tooltip.transition()
                      .duration(500)
                      .style("opacity", 0);
           });
    }).catch(error => console.error('Error loading the data:', error));
});
