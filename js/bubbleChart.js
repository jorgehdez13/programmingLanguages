document.addEventListener('DOMContentLoaded', function() {
    d3.csv('data/data.csv').then(function(data) {
        data.forEach(d => {
            d.users = +d.users;
            d.average_salary = +d.average_salary;
        });

        const margin = {top: 20, right: 30, bottom: 40, left: 90},
              width = 800 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

        const svg = d3.select("#bubbleChartContainer")
                      .append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.users)])
                    .range([0, width]);

        const y = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.average_salary)])
                    .nice()
                    .range([height, 0]);

        const z = d3.scaleSqrt()
                    .domain([0, d3.max(data, d => d.average_salary)])
                    .range([4, 15]);

        svg.append("g")
           .attr("transform", `translate(0,${height})`)
           .call(d3.axisBottom(x))
           .selectAll("text")
           .attr("transform", "rotate(-30)")
           .style("text-anchor", "end");

        svg.append("g")
           .call(d3.axisLeft(y));

        // Tooltip
        const tooltip = d3.select("body").append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0);

        svg.append("g")
           .selectAll("dot")
           .data(data)
           .enter()
           .append("circle")
           .attr("cx", d => x(d.users))
           .attr("cy", d => y(d.average_salary))
           .attr("r", d => z(d.average_salary))
           .style("fill", "#69b3a2")
           .on("mouseover", function(event, d) {
               tooltip.transition()
                      .duration(200)
                      .style("opacity", .9);
               tooltip.html(d.language + "<br/>" + "Users: " + d.users + "<br/>" + "Avg Salary: " + d.average_salary)
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
